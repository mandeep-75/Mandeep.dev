import { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

import { useFinePointer, useReducedMotion } from '../../lib/motion';

const ROTATE_SPRING = { stiffness: 160, damping: 20, mass: 0.6 };
const GLARE_SPRING = { stiffness: 200, damping: 26 };

/**
 * Keeps a node's bounding rect current without reading layout on every
 * pointer move.
 *
 * getBoundingClientRect() inside a pointermove handler forces a synchronous
 * layout, and a page full of tilt targets would do that on every frame of
 * every mouse move. Measuring on enter plus whenever the page scrolls or
 * resizes gives the same answer for a fraction of the cost.
 *
 * @param {import('react').RefObject<HTMLElement>} nodeRef
 * @param {boolean} enabled
 * @returns {() => void} measure — call on pointer enter
 */
function useLiveRect(nodeRef, enabled) {
  const rectRef = useRef(null);

  const measure = useCallback(() => {
    if (nodeRef.current) rectRef.current = nodeRef.current.getBoundingClientRect();
  }, [nodeRef]);

  useEffect(() => {
    if (!enabled) return undefined;

    measure();
    // capture: true catches scrolls in any nested scroll container, not just the page.
    window.addEventListener('scroll', measure, { passive: true, capture: true });
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('scroll', measure, { capture: true });
      window.removeEventListener('resize', measure);
    };
  }, [enabled, measure]);

  return useCallback(() => {
    if (nodeRef.current) rectRef.current = nodeRef.current.getBoundingClientRect();
    return rectRef.current;
  }, [nodeRef]);
}

/**
 * Pointer-tracked 3D tilt.
 *
 * Rotates the surface around X and Y toward the cursor, springs toward the
 * resting pose on leave, and lifts the surface toward the viewer while it is
 * hovered or focused. Everything runs on MotionValues — React never
 * re-renders during the interaction.
 *
 * Hover is an enhancement, never the only path: `:focus-within` produces the
 * same lift for keyboard users, so the effect is reachable without a mouse.
 *
 * @param {object} props
 * @param {number} [props.max]        Peak rotation in degrees.
 * @param {number} [props.perspective] Distance of the virtual eye, in px.
 * @param {number} [props.lift]       translateZ toward the viewer while active.
 * @param {boolean} [props.glare]     Render a highlight that tracks the cursor.
 * @param {(active: boolean) => void} [props.onActiveChange]
 */
export default function Tilt({
  children,
  className = '',
  max = 5,
  perspective = 900,
  lift = 34,
  glare = false,
  onActiveChange,
}) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const nodeRef = useRef(null);
  const readRect = useLiveRect(nodeRef, finePointer);

  // 0..1 across the surface.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const liftTarget = useMotionValue(0);
  const glareTarget = useMotionValue(0);

  const springX = useSpring(px, ROTATE_SPRING);
  const springY = useSpring(py, ROTATE_SPRING);
  const springLift = useSpring(liftTarget, ROTATE_SPRING);
  const springGlare = useSpring(glareTarget, GLARE_SPRING);

  // Flip X: moving the cursor up should tip the top of the surface away.
  const rotateY = useTransform(springX, [0, 1], [-max, max]);
  const rotateX = useTransform(springY, [0, 1], [max, -max]);

  const interactive = finePointer && !reducedMotion;

  const setActive = useCallback(
    (active) => {
      liftTarget.set(active ? lift : 0);
      glareTarget.set(active ? 1 : 0);
      onActiveChange?.(active);
    },
    [lift, liftTarget, glareTarget, onActiveChange],
  );

  const handlePointerMove = (event) => {
    const rect = readRect();
    if (!rect || !rect.width || !rect.height) return;

    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  // Recentre on enter so re-entering never springs in from the last position.
  const handlePointerEnter = (event) => {
    const rect = readRect();
    if (rect && rect.width && rect.height) {
      px.set((event.clientX - rect.left) / rect.width);
      py.set((event.clientY - rect.top) / rect.height);
    }
    setActive(true);
  };

  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    setActive(false);
  };

  // Non-hover path: focus-within gets the lift, blur drops it.
  const handleFocus = () => setActive(true);
  const handleBlur = () => setActive(false);

  const glareX = useTransform(springX, (value) => `${(value * 100).toFixed(2)}%`);
  const glareY = useTransform(springY, (value) => `${(value * 100).toFixed(2)}%`);
  // Warm sheen rather than a white highlight — on a #ffffff surface a white
  // glare renders as nothing at all. Multiply blending (see `.depth-glare`)
  // keeps it reading as light catching the surface.
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(194, 90, 62, 0.14), transparent 68%)`;

  return (
    <motion.div
      ref={nodeRef}
      className={className}
      style={{
        // transformPerspective is emitted first in framer's transform order,
        // which is exactly where perspective() has to sit.
        transformPerspective: perspective,
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        z: springLift,
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerEnter={interactive ? handlePointerEnter : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {children}

      {glare && (
        <motion.div
          aria-hidden="true"
          className="depth-glare pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBackground, opacity: springGlare }}
        />
      )}
    </motion.div>
  );
}
