import {
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  LessEqualDepth,
  MathUtils,
  Mesh,
  NoColorSpace,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Sphere,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* From `public/`, so Vite copies it verbatim and serves it as a static asset
   rather than inlining ~29 MB of base64 into the JS chunk.

   `import.meta.env.BASE_URL` is required rather than a hardcoded path: the site
   is deployed under `/Mandeep.dev/`, and BASE_URL is the one thing that knows
   that at build time. GLTFLoader resolves the file against this URL, so it also
   keeps any future relative references inside the model working. */
const LOCATION_URL = `${import.meta.env.BASE_URL}models/location.glb`;

/* ==========================================================================
   THE WEBGL BACKDROP

   The page's fixed background layer: a real place rather than an abstraction.

   The previous backdrop was procedural — a receding floor grid, tinted washes, a
   shard burst. That geometry is gone. This is the actual location model, loaded
   from disk, sitting in front of a camera that never moves: the camera sits at
   the exact centre of the scene looking straight out along -Z, and the model
   turns about its Y axis. That is the whole animation.

   Everything here is imperative and framework-free on purpose. The React layer
   (`components/webgl/WebGLBackdrop.jsx`) owns the single rAF loop and calls
   `update` / `render` / `resize` / `dispose`; no React state is involved per
   frame, and the DOM content above never re-renders because of anything here.

   The renderer is transparent, so the warm paper colour and the noise grain live
   in CSS underneath. How strongly the model asserts itself is therefore a CSS
   decision (see `.webgl-canvas` in index.css), not a per-material one — which
   keeps the imported materials exactly as the artist authored them.
   ========================================================================== */

const BACKDROP = {
  /* Radians per second about X — the model tumbles forward and back, not
     sideways. Held at 0: the turntable is off, so the backdrop's only motion is
     the model's own clip. Set to 0.11 for a turn every ~57s. */
  spin: 0,

  /* Degrees the model is turned to the left about its own vertical axis,
     applied on top of everything else (spin included). -90 faces the model to
     the left; +90 turns it to the right; 0 faces the camera. */
  yaw: -90,

  /* Wide, because the camera is *inside* the dome rather than looking at it from
     a fitted distance. Anything near a normal ~40° reads as a keyhole when the
     near geometry is a hand's width from the lens. */
  fov: 82,
  fovPortrait: 92,

  /* Anisotropic filtering cap. The model is mostly seen at grazing angles, which
     is the exact case where mip selection without it smears the floor plane. */
  maxAnisotropy: 8,

  /* Scale applied to any light the model itself ships. This one ships none —
     the current export dropped them — so prepareLights() is a no-op today; the
     knob stays so a future re-export with photometric Max lights cannot blow
     the scene out on import. */
  lightScale: 0.0016,

  /* Sky/ground fill under everything: the original neutral rig, unchanged —
     cool sky above, warm-neutral ground below — so the model keeps its
     authored look. The only red on it is the faint emissive in
     prepareMaterials() below. */
  hemisphere: 1.15,
  hemisphereSky: 0xdfe6ec,
  hemisphereGround: 0x6b5f4e,

  /* The original three-point rig: cream key, slate fill, terracotta rim.
     Steady — no flicker, no colour shifts. Added to the scene, never the
     pivot: these are directional lights, so only their direction matters, and
     parenting them to the pivot would swing them around with the model's yaw. */
  key: { color: 0xfff1e0, intensity: 1.5, position: [1.6, 2, 2.2] },
  fill: { color: 0xdfe6ec, intensity: 0.5, position: [-2.2, 0.3, 1.4] },
  rim: { color: 0xd9895e, intensity: 1, position: [-0.8, 1.6, -2.4] },

  /* The fire wash: a full-screen shader quad drawn behind the model (see
     createFireWash). It *tints* the CSS page colour rather than replacing it,
     so `fireAlpha` is the whole knob for how far the fire goes — at 0.4 the
     bottom edge glows and the #a50f18 background still reads as the page's
     own colour everywhere else.

     The ember fog lives in this same quad (see `fogAlpha`), NOT in scene.fog:
     scene.fog grades the model's own surfaces, which puts the haze *on* the
     model. As part of the quad it passes the same far-plane depth test, so it
     renders strictly behind the model — the fog is the air in the room, the
     model sits in front of it. */
  fireAlpha: 0.4,
  fireSpeed: 0.3,

  /* Strength of that back-layer fog: #8c1a12 mist drifting under and around
     the flames, thick at the bottom of the viewport and gone before the top.
     It never touches the model's materials at all. */
  fogAlpha: 0.25,

  /* The camera's one and only position, set once at construction and never touched
     again. Scroll moves the model instead, so the framing of the backdrop is
     identical at the top and bottom of the page.

     Inside the dome, pulled three-quarters of the way toward its near edge
     (z: 0.75 of a unit radius): the model sits in front of the lens rather
     than around it, without leaving the near plane's reach. */
  rest: { x: 0, y: 0, z: 0.75 },

  /* How far the model rises past the lens across the whole document, in world
     units against a unit-radius dome. Held at 0: the model stays put vertically
     and only the clip scrubs with the scroll. */
  lift: 0,

  /* Critically-damped follow rate for the scroll. The camera must never snap to
     the scroll position: this is a fixed canvas, so a hard-coupled camera turns
     a flick of the wheel into a jump cut. */
  follow: 2.6,

  /* Playback rate with the page still: 0.25x means the 9.46s clip takes ~38s
     per cycle at rest. Scrolling adds to it (baseRate + |progress per second|
     * scrollBoost, capped at maxRate) — the floor is baseRate, so it never
     stops, just plays slow. */
  baseRate: 0.25,
  scrollBoost: 4,
  maxRate: 5,
};

/* Degrees to radians, once. */
const YAW = (BACKDROP.yaw * Math.PI) / 180;

/**
 * Normalise a model of any authored scale into the unit dome.
 *
 * Returns the scaling factor, so light intensities can be compensated for it.
 *
 * A bounding sphere's *radius* is what matters here, not its extents: the
 * camera sits inside that sphere (unit radius pinned by this function), so
 * every surface is at some distance up to that radius and the near plane can
 * be trusted. Normalising by the largest extent instead would let a long, low
 * scene keep a 10-unit radius and sit almost entirely outside the near plane.
 */
function normalizeToUnitDome(root, pivot) {
  const box = new Box3().setFromObject(pivot);
  const center = box.getCenter(new Vector3());
  const sphere = box.getBoundingSphere(new Sphere());

  const radius = sphere.radius;
  const scale = radius > 0 ? 1 / radius : 1;

  /* Order matters, and this is the subtle part.

     The pivot's world transform is `position + scale * child`, so shifting the
     pivot by -center is only correct while the scale is still 1. Once the scale
     is 0.03, the same shift leaves the geometry's centre at `center * (scale-1)`
     — an 11-unit offset that parks the whole model outside the frustum, which
     renders as a valid scene containing nothing at all.

     Scaling the offset by the same factor puts the centre on the origin:
     `-scale * center + scale * center == 0`. */
  pivot.position.copy(center).multiplyScalar(-scale);
  pivot.scale.setScalar(scale);

  /* Stashed because scroll moves the model by adjusting position.y, and that
     has to be added to the normalisation offset rather than replace it. */
  pivot.userData.baseY = pivot.position.y;

  return scale;
}

/**
 * Put every texture in its authored colour space and enable filtering.
 *
 * GLTFLoader already does the colour-space part for a well-formed glTF, but it
 * is the one piece of texture state that silently ruins a PBR scene if it is
 * wrong — an sRGB-tagged normal map or a linear-tagged base colour both look
 * merely "a bit off" rather than obviously broken, and the fix is invisible until
 * you know to look for it. Setting it explicitly is cheap and cannot drift.
 */
function prepareMaterials(root, maxAnisotropy) {
  const srgbMaps = ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap'];
  const dataMaps = [
    'normalMap',
    'metalnessMap',
    'roughnessMap',
    'aoMap',
    'bumpMap',
    'displacementMap',
    'alphaMap',
    'lightMap',
  ];

  root.traverse((child) => {
    if (!child.isMesh) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    for (const material of materials) {
      for (const key of srgbMaps) {
        if (material[key]) material[key].colorSpace = SRGBColorSpace;
      }
      for (const key of dataMaps) {
        if (material[key]) material[key].colorSpace = NoColorSpace;
      }
      for (const key of srgbMaps.concat(dataMaps)) {
        if (material[key]) material[key].anisotropy = maxAnisotropy;
      }

      /* A whisper of red — "just light red, not too much": enough that the
         black material (Material.009) doesn't read as a hole punched through
         the backdrop, not enough to tint the lit surfaces. Nothing in this
         file ships an emissive map, so this can only lift the blacks — it
         cannot wash out a texture. */
      if (material.emissive) {
        material.emissive.set(0x2e0705);
        material.emissiveIntensity = 0.2;
      }
    }
  });
}

/**
 * Rescale the model's own point lights to match the normalisation.
 *
 * The geometry is scaled to a fixed size, which scales every light's position and
 * therefore its distance to the surfaces it lights. Point-light intensity falls
 * off with the square of distance, so the intensity has to be scaled by the
 * square of the geometry scale to preserve the lighting the artist saw. Skipping
 * this is why a rescaled glTF scene is usually either black or blown out.
 */
function prepareLights(root, scale) {
  const intensityScale = scale * scale;
  root.traverse((child) => {
    if (child.isLight) child.intensity *= intensityScale * BACKDROP.lightScale;
  });
}

/**
 * The fire wash: a full-screen quad that burns behind the model.
 *
 * Two rules govern it, both from the backdrop contract:
 *
 *  1. It must not replace the page colour. The renderer is transparent and the
 *     CSS background shows through wherever the fragment alpha is 0, so the
 *     shader paints warm colour at a *low* alpha and the #f9dfdc wash stays
 *     visibly the page's own colour — the fire reads as light falling on it.
 *  2. It must not fight the text. The flame field and the fog both ease off
 *     with height — thinning through the upper half and gone by the very top
 *     — so the top of the viewport always stays flat page colour even while
 *     the fire is climbing through the middle of it.
 *
 * The quad lives in clip space (gl_Position ignores the camera entirely), so
 * it covers the viewport at any aspect ratio, any FOV, any DPR, and never
 * needs re-framing on resize.
 *
 * Sitting at the BACK layer is the subtle part. The quad is transparent, and
 * three.js draws the whole transparent pass *after* the opaque model — so a
 * renderOrder of -1 alone does not put it behind anything: without a depth
 * test the flames paint straight over the model. The quad therefore writes
 * NDC z = 1.0 (the far plane) and depth-tests with LESS_EQUAL: it passes
 * against the cleared depth buffer (1.0 <= 1.0) and fails everywhere the
 * model has already written a nearer depth. depthWrite stays off so the quad
 * cannot occlude the model's own transparent surfaces (the glass), and
 * renderOrder stays -1 so it is still drawn first among the transparents —
 * the glass then blends over the fire rather than under it.
 *
 * Reduced motion freezes `uTime`, which leaves a static flame field: the fire
 * is still *there*, it simply never moves — same contract as everything else.
 */
function createFireWash() {
  const uniforms = {
    uTime: { value: 0 },
    uAlpha: { value: BACKDROP.fireAlpha },
    uFog: { value: BACKDROP.fogAlpha },
  };

  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    depthFunc: LessEqualDepth,
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        // Clip space: the plane spans -1..1 across the whole viewport, with z
        // pinned to the far plane so the depth test rejects it wherever the
        // model is nearer. The camera never touches this.
        gl_Position = vec4(position.xy, 1.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;

      uniform float uTime;
      uniform float uAlpha;
      uniform float uFog;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.03 + vec2(17.3, 9.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // uv.y is 0 at the bottom edge: flames rise from the floor of the
        // screen and thin out toward the middle.
        float h = vUv.y;

        // Vertical drift carries the tongues upward; the domain-warp pass
        // bends them so they lick rather than stripe.
        vec2 p = vec2(vUv.x * 3.0, h * 2.2 - uTime * ${BACKDROP.fireSpeed});
        float warp = fbm(p * 1.6 + uTime * 0.1);
        float n = fbm(p + warp * 0.85);

        // Heat: still strongest at the bottom edge, but the height decay is
        // gentle enough that tongues reach well past mid-screen before
        // smoothstep fades them out — the fire climbs the viewport instead of
        // hugging the floor.
        float heat = n * (1.0 - h * 0.55) + (1.0 - h) * 0.55 - 0.35;
        float m = smoothstep(0.12, 0.7, heat);

        // Ember red -> orange -> amber tongue.
        vec3 c1 = vec3(0.55, 0.10, 0.07);
        vec3 c2 = vec3(1.0, 0.40, 0.10);
        vec3 c3 = vec3(1.0, 0.72, 0.30);
        vec3 col = mix(c1, c2, smoothstep(0.0, 0.55, m));
        col = mix(col, c3, smoothstep(0.55, 0.95, m));

        // Height fade raised to match: the flames are allowed up to ~95% of
        // the viewport, easing off only near the very top.
        float a = m * uAlpha * (1.0 - smoothstep(0.55, 0.95, h));

        // Ember fog: a slow mist drifting through the same back layer. It is
        // thicker at the bottom and thins out by the top of the viewport, so
        // it pools under the fire like smoke — and because it is part of this
        // depth-tested quad, it can only ever appear BEHIND the model. The
        // drift is driven by uTime, which is frozen at 0 under reduced
        // motion: static haze, same contract as the flame.
        vec2 fp = vec2(vUv.x * 1.6 - uTime * 0.015, h * 1.3 - uTime * 0.04);
        float mist = fbm(fp + fbm(fp * 0.9) * 0.6);
        float fogGrad = 0.3 + 0.7 * (1.0 - h);
        float fogA = smoothstep(0.3, 0.9, mist)
          * fogGrad
          * uFog
          * (1.0 - smoothstep(0.7, 1.0, h));
        vec3 fogCol = vec3(0.549, 0.102, 0.071); // #8c1a12, the fire's ember

        // Composite flame over fog inside the one fragment (Porter-Duff
        // "over"); the depth test then places the whole result behind the
        // model, so the fog is the air in the room, not a veil on the model.
        vec3 outCol = (fogCol * fogA + col * a) / max(fogA + a, 1e-4);
        float outA = fogA + a - fogA * a;
        gl_FragColor = vec4(outCol, outA);
      }
    `,
  });

  const mesh = new Mesh(new PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return { mesh, uniforms };
}


export function createDepthScene(canvas, { onError } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  // The paper colour belongs to CSS. Clearing to transparent is what lets the
  // warm background, the noise grain and the text all stay exactly as designed
  // while this layer sits on top of them.
  renderer.setClearAlpha(0);
  renderer.toneMapping = NoToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();

  /* Camera inside the dome, pointing straight out along -Z with no pitch, so the
     horizon stays level and only the model's tumble changes the framing.

     Both clip planes follow from being inside: `near` must be tight enough that
     geometry within arm's reach is not sliced open, and `far` must clear the
     dome radius, which `normalizeToUnitDome` pins to exactly 1 world unit. */
  const camera = new PerspectiveCamera(BACKDROP.fov, 1, 0.02, 12);
  camera.position.set(BACKDROP.rest.x, BACKDROP.rest.y, BACKDROP.rest.z);
  camera.rotation.set(0, 0, 0);

  // The neutral fill: cool sky above, warm-neutral ground below, so unlit
  // faces get some light instead of reading as a black cut-out.
  scene.add(new HemisphereLight(
    new Color(BACKDROP.hemisphereSky),
    new Color(BACKDROP.hemisphereGround),
    BACKDROP.hemisphere,
  ));

  /* The three-point rig. Directional lights, so `position` is only a
     direction: unlike point lights, their intensity does not care about the
     model's unit radius and never needs re-tuning after a normalisation. */
  const keyLight = new DirectionalLight(BACKDROP.key.color, BACKDROP.key.intensity);
  keyLight.position.set(...BACKDROP.key.position);

  const fillLight = new DirectionalLight(BACKDROP.fill.color, BACKDROP.fill.intensity);
  fillLight.position.set(...BACKDROP.fill.position);

  const rimLight = new DirectionalLight(BACKDROP.rim.color, BACKDROP.rim.intensity);
  rimLight.position.set(...BACKDROP.rim.position);

  scene.add(keyLight, fillLight, rimLight);

  /* The fire wash, behind everything including the model. Added before the
     loader runs so the backdrop has its fire from the very first frame — the
     model takes seconds to arrive, the shader is there instantly. */
  const fire = createFireWash();
  scene.add(fire.mesh);

  const maxAnisotropy = Math.min(
    BACKDROP.maxAnisotropy,
    renderer.capabilities.getMaxAnisotropy(),
  );

  /* The turntable lives on a pivot rather than on the model itself. The imported
     root keeps whatever transform the FBX authored; the pivot supplies an
     identity frame that this file is free to centre, scale and spin, so none of
     those transforms can fight each other.
     `null` until the model arrives — everything that touches it is guarded. */
  let pivot = null;
  let loaded = false;

  /* The model's own clip, on a mixer rooted at the imported scene (not the
     pivot — the pivot's transforms belong to the turntable, and the clip must
     not fight it for them). It plays continuously; the scroll only changes how
     fast, never whether. Null until the model arrives. */
  let mixer = null;

  /* The previous frame's damped scroll progress, so the scroll's speed (its
     derivative, per second) can be read off in update(). */
  let prevEase = 0;

  /* A mutable flag rather than a constructor argument. The OS reduced-motion
     setting can change while the page is open, and rebuilding the scene to
     honour it would throw away a live GPU context for nothing. */
  let reducedMotion = false;

  /* The `time` of the most recent update, in seconds. Exposed so the
     verification pass can prove the reduced-motion branch really is static:
     a running loop keeps advancing this, a held frame leaves it at 0. */
let lastUpdateTime = 0;

  /* Eased scroll position, 0..1. The camera reads this rather than the raw
     scroll progress. Held at 0 under reduced motion. */
  let scrollEase = 0;

  /** Frame-rate independent exponential follow. */
  const follow = (current, target, dt, rate) =>
    current + (target - current) * (1 - Math.exp(-rate * dt));

  const loader = new GLTFLoader();

  loader.load(
    LOCATION_URL,
    (gltf) => {
      pivot = new Group();
      pivot.add(gltf.scene);
      scene.add(pivot);

      /* Scale the whole location so its bounding sphere has radius 1 and its
         centre sits on the origin — which is exactly where the camera is.

         The box is measured through the pivot while it is still identity, so the
         centre is a world-space offset that can be applied to the pivot's own
         position. Centring the imported root instead would be wrong whenever the
         FBX put a transform on that root: its world centre is not its local
         position. */
      const scale = normalizeToUnitDome(gltf.scene, pivot);

      prepareMaterials(pivot, maxAnisotropy);
      prepareLights(pivot, scale);

      /* Wire the clip the file ships with: 9.46s on a 17-node armature that
         never touches the root, so the bounding-sphere normalisation above
         stays valid at every point on the timeline. .play() starts it on the
         mixer's own clock — looping, at baseRate until the scroll speeds it up. */
      if (gltf.animations.length > 0) {
        mixer = new AnimationMixer(gltf.scene);
        mixer.clipAction(gltf.animations[0]).play();
      }

      loaded = true;

      /* Reduced motion holds a single frame and never runs a loop, so there is
         no rAF left to pick this up. Without this the model would load and then
         simply never appear for exactly the visitors least able to wait for it. */
      if (reducedMotion) render();
    },
    undefined,
    (error) => {
      console.error('Backdrop model failed to load:', error);
      // Swaps in the CSS depth stage, so the page still has a composed backdrop.
      onError?.();
    },
  );

  function setReducedMotion(next) {
    reducedMotion = next;

    if (next) {
      // Snap back to the composed rest pose rather than freezing wherever the
      // model happened to be — a reduced-motion visitor should see the opening
      // frame, not a random mid-scroll one. The camera never moves at all, so
      // there is nothing to reset on it.
      scrollEase = 0;
      if (pivot) {
        pivot.rotation.set(0, YAW, 0);
        applyScrollOffset(0);
      }
      // Snap the clip back to frame 0 so the held frame is the opening frame
      // rather than wherever playback had reached.
      mixer?.setTime(0);
      render();
    }
  }

  function update({ scroll = 0, time = 0, dt = 0.016 } = {}) {
    lastUpdateTime = time;

    /* The fire wash runs before the pivot guard: the model takes seconds to
       arrive (and may never arrive — the load error path exists), and the
       shader should not wait on either. Frozen at t=0 under reduced motion,
       which renders one static flame field. */
    fire.uniforms.uTime.value = reducedMotion ? 0 : time;

    if (!pivot) return;

    /* The turntable. X only — Y and Z are pinned so the horizon cannot wander
       and tilt the whole location: Y holds the authored yaw, Z stays at zero.
       Independent of the scroll, so the backdrop is never still. */
    pivot.rotation.x = reducedMotion ? 0 : time * BACKDROP.spin;
    pivot.rotation.y = YAW;
    pivot.rotation.z = 0;

    /* Scroll moves the *model*, not the camera. The camera is nailed to its rest
       pose for the life of the page, so the backdrop's framing is constant and
       the fixed canvas never shifts under the text sitting on it.

       Eased on a critically-damped follow so the model lags the page and settles
       into place rather than being welded to the scrollbar.

       `dt` is clamped because this is also the first frame after a backgrounded
       tab returns, where the real dt can be seconds wide — enough to jump the
       model a long way in a single frame. */
    const step = Math.min(dt, 0.05);
    scrollEase = reducedMotion ? 0 : follow(scrollEase, scroll, step, BACKDROP.follow);

    /* Playback rate, not playback position. The clip always runs on the
       mixer's own clock at no less than baseRate (0.25x — a slow, always-on
       idle); the reader's scroll speed adds to it from there:

         rate = baseRate + |progress per second| * scrollBoost,
         clamped to maxRate

       So a still page means the slow loop — never a pause — and a hard flick
       makes the clip whip through its cycle. The velocity is the
       derivative of the *damped* progress, which inherits the settle instead
       of spiking on a wheel notch, and a zero dt (the first static frame)
       reads as a still page rather than dividing by zero.

       Reduced motion never advances the clip: frame 0, held — a loop that
       never stops is exactly the motion that setting exists to stop. */
    const velocity = step > 0 ? (scrollEase - prevEase) / step : 0;
    prevEase = scrollEase;

    if (mixer && !reducedMotion) {
      const rate = Math.min(
        BACKDROP.baseRate + Math.abs(velocity) * BACKDROP.scrollBoost,
        BACKDROP.maxRate
      );
      mixer.update(step * rate);
    }

    applyScrollOffset(scrollEase);
  }

  /** Raise the model past the lens as the page is read downward. */
  function applyScrollOffset(progress) {
    // Additive to the normalisation offset, not a replacement for it: that
    // offset is what put the model's centre on the origin and the camera inside
    // it. Overwriting position here would shove the dome off-centre and undo the
    // framing entirely.
    pivot.position.y = pivot.userData.baseY + progress * BACKDROP.lift;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    // Narrow viewports would crop the FOV into a letterbox. Pull it out on
    // portrait so the location still reads as a place rather than as a sliver.
    camera.fov = height > width ? BACKDROP.fovPortrait : BACKDROP.fov;
    camera.updateProjectionMatrix();

    // No re-framing on resize: the camera is fixed at the dome's centre and the
    // dome is unit-radius by construction, so there is no distance to refit. The
    // FOV is the only thing that has to answer to the aspect ratio.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
  }

  function dispose() {
    // Loader.dispose() aborts an in-flight request. Without it a model that
    // resolves after the canvas is gone re-adds itself to a dead scene and
    // leaks every geometry and texture it just decoded.
    loader.abort?.();
    mixer?.stopAllAction();
    mixer = null;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        for (const material of materials) {
          if (!material) continue;
          // Textures are shared across materials and were never owned by them,
          // so they are collected and disposed once rather than per material.
          for (const value of Object.values(material)) {
            if (value?.isTexture) value.dispose();
          }
          material.dispose();
        }
      }
    });

    scene.clear();
    renderer.dispose();
    // Frees the GPU context immediately instead of waiting for GC. Matters on
    // mobile, where a leaked context is enough to get a tab killed.
    renderer.forceContextLoss();
  }

  /** For the draw-call audit and the reduced-motion check in verification. */
  function stats() {
    return {
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      lines: renderer.info.render.lines,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      programs: renderer.info.programs?.length ?? 0,
      lastUpdateTime: +lastUpdateTime.toFixed(2),
      reducedMotion,
      modelLoaded: loaded,
      /* The dome radius is exactly 1 by construction, so this is the near/far
         clipping sanity check: anything far outside ~1 means the model was not
         normalised onto the origin and the camera is not actually inside it. */
      domeRadius: pivot
        ? +new Box3().setFromObject(pivot)
            .getBoundingSphere(new Sphere())
            .radius.toFixed(3)
        : null,
      pivotOffset: pivot
        ? [
            +pivot.position.x.toFixed(3),
            +pivot.position.y.toFixed(3),
            +pivot.position.z.toFixed(3),
          ]
        : null,
    };
  }

  return { update, render, resize, dispose, stats, setReducedMotion };
}
