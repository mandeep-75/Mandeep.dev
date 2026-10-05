import { useCallback, useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';

import DepthStage from '../three/DepthStage';
import WebGLBoundary from './WebGLBoundary';

import { pointerX, pointerY } from '../../lib/pointer';
import { useReducedMotion } from '../../lib/motion';
import { createDepthScene } from '../../lib/threeScene';
import { isWebGLAvailable } from '../../lib/webglSupport';

/**
 * The canvas, and the only place a render loop exists.
 *
 * All input is read straight off the shared framer-motion MotionValues inside
 * the frame callback. Nothing here calls `setState` per frame and no MotionValue
 * is bound to a `style` prop, so the DOM content above never re-renders because
 * the camera moved.
 */
function WebGLStage({ onFailure }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  // The live scene and its loop reconciler, published by the mount effect so
  // the reduced-motion effect below can reach them without remounting. Without
  // these, honouring a mid-session reduced-motion toggle would mean tearing down
  // and rebuilding a GPU context.
  const sceneRef = useRef(null);
  const syncRef = useRef(null);

  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let cancelled = false;
    let teardown = () => {};

    /**
     * Everything that needs the three.js module, deferred behind the import.
     * Returns its own cleanup so the effect can tear down either a scene that
     * started or an import that was still in flight.
     */
    function startScene(createDepthScene) {
      let scene;
      try {
        // The backdrop model is fetched from disk over the network. If that
        // request fails, the CSS depth stage is a far better outcome than an
        // empty canvas, so a load error is routed to the same failure path as a
        // dead WebGL context.
        scene = createDepthScene(canvas, { onError: onFailure });
      } catch (error) {
        console.error('WebGL scene could not be created:', error);
        onFailure();
        return () => {};
      }

      scene.resize();
      scene.setReducedMotion(reducedRef.current);
      sceneRef.current = scene;

      let frame = 0;
      let running = false;
      let last = 0;

      const drawStatic = () => {
        // Reduced motion still gets a composed scene: the floor grid, the colour
        // washes and the shards are all present and opaque. What is withheld is
        // the motion, not the depth. Held at scroll zero, so the pose is the
        // rest pose rather than whatever the camera happened to be doing.
        scene.update({ scroll: 0, pointerX: 0, pointerY: 0, time: 0, dt: 0.016 });
        scene.render();
      };

      const tick = (now) => {
        frame = requestAnimationFrame(tick);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        scene.update({
          scroll: scrollYProgress.get(),
          pointerX: pointerX.get(),
          pointerY: pointerY.get(),
          time: now / 1000,
          dt,
        });
        scene.render();
      };

      const startLoop = () => {
        if (running || reducedRef.current || document.hidden) return;
        running = true;
        // Reset the clock so the first frame after a long pause gets a sane dt
        // rather than one spanning the entire time the tab was backgrounded.
        last = performance.now();
        frame = requestAnimationFrame(tick);
      };

      const stopLoop = () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(frame);
      };

      /** Reconcile the loop against the desired mode. One entry point, called on
       *  mount, on a reduced-motion change, and when the tab becomes visible. */
      const sync = () => {
        if (reducedRef.current) {
          stopLoop();
          drawStatic();
        } else {
          startLoop();
        }
      };

      const onVisibilityChange = () => {
        // A fixed full-viewport canvas is always on screen, so tab visibility is
        // the only signal worth listening to here. Stopping outright rather than
        // idling the callback is what actually hands the battery back.
        if (document.hidden) {
          stopLoop();
        } else {
          sync();
        }
      };

      const onContextLost = (event) => {
        // preventDefault is mandatory: without it the context is never restored,
        // and the canvas stays dead even after the GPU comes back.
        event.preventDefault();
        stopLoop();
        onFailure();
      };

      const resizeObserver = new ResizeObserver(() => {
        scene.resize();
        // In the static (reduced-motion) branch nothing else will ever ask for a
        // frame, so a resize has to request the redraw itself.
        if (!running) drawStatic();
      });

      document.addEventListener('visibilitychange', onVisibilityChange);
      canvas.addEventListener('webglcontextlost', onContextLost);
      resizeObserver.observe(stage);
      syncRef.current = sync;

      sync();

      return () => {
        stopLoop();
        syncRef.current = null;
        sceneRef.current = null;
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        scene.dispose();
      };
    }

    // three.js is ~150 KB gzipped and it decorates the page rather than carrying
    // it, so it is code-split off the critical path: the shell and all the real
    // content paint immediately and the backdrop arrives a moment later. Until
    // then the canvas is transparent, which is just the flat warm page — so
    // there is no pop-in to hide behind a loader.
    import('../../lib/threeScene')
      .then(({ createDepthScene }) => {
        if (cancelled) return;
        teardown = startScene(createDepthScene);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('WebGL backdrop module failed to load:', error);
        onFailure();
      });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [scrollYProgress, onFailure]);

  // The OS reduced-motion setting can change while the page is open.
  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion);
    syncRef.current?.();
  }, [reducedMotion]);

  return (
    <div ref={stageRef} aria-hidden="true" className="webgl-stage">
      <canvas ref={canvasRef} className="webgl-canvas" />
    </div>
  );
}

/**
 * The page backdrop: real 3D where the browser can do it, the CSS depth stage
 * where it cannot.
 *
 * The fallback is not a degraded mode bolted on afterwards — it is the exact
 * backdrop this site shipped with before, so a visitor without WebGL, a visitor
 * whose context is lost mid-session, and a visitor with JavaScript switched off
 * all end up looking at a composed, warm, editorial page. Only the geometry
 * differs.
 *
 * `useState` with a lazy initialiser so the capability probe runs once per mount
 * rather than on every render.
 */
export default function WebGLBackdrop() {
  const [supported] = useState(() => isWebGLAvailable());
  const [failed, setFailed] = useState(false);

  // Stable identity. The mount effect lists `onFailure` as a dependency, and an
  // inline arrow would rebuild the entire scene on every parent render.
  const handleFailure = useCallback(() => setFailed(true), []);

  if (!supported || failed) {
    return <DepthStage />;
  }

  return (
    <WebGLBoundary fallback={<DepthStage />}>
      <WebGLStage onFailure={handleFailure} />
    </WebGLBoundary>
  );
}
