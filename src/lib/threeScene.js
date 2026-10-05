import {
  Box3,
  Color,
  Group,
  HemisphereLight,
  MathUtils,
  NoColorSpace,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
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
     sideways. 0.11 is a turn every ~57s: slow enough to read as atmosphere
     rather than as a spinning object, and it never stops moving, so the page
     never feels frozen even while the reader does not scroll. */
  spin: 0.11,

  /* Wide, because the camera is *inside* the dome rather than looking at it from
     a fitted distance. Anything near a normal ~40° reads as a keyhole when the
     near geometry is a hand's width from the lens. */
  fov: 82,
  fovPortrait: 92,

  /* Anisotropic filtering cap. The model is mostly seen at grazing angles, which
     is the exact case where mip selection without it smears the floor plane. */
  maxAnisotropy: 8,

  /* The model's own two point lights are authored in 3ds Max photometric units
     and land at several hundred candela, which blows the whole scene out. They
     are dimmed to a level that reads as daylight fill rather than as two lamps,
     and a hemisphere light underneath guarantees the scene is never lit by
     those two bulbs alone. */
  lightScale: 0.0016,
  hemisphere: 1.15,

  /* The camera's one and only position, set once at construction and never touched
     again. Scroll moves the model instead, so the framing of the backdrop is
     identical at the top and bottom of the page.

     Pulled back and lifted off dead centre: level and central puts the horizon
     across the middle of the frame, which flattens the location into a wall.
     Negative Z is the view direction, so "back" is +Z. */
  rest: { x: 0, y: 0.2, z: 0.34 },

  /* How far the model rises past the lens across the whole document, in world
     units against a unit-radius dome. Vertical only: scrolling is a vertical
     gesture, so the model should answer on that axis alone. */
  lift: 0.42,

  /* Critically-damped follow rate for the scroll. The camera must never snap to
     the scroll position: this is a fixed canvas, so a hard-coupled camera turns
     a flick of the wheel into a jump cut. */
  follow: 2.6,
};

/**
 * Normalise a model of any authored scale into the unit dome.
 *
 * Returns the scaling factor, so light intensities can be compensated for it.
 *
 * A bounding sphere's *radius* is what matters here, not its extents: the camera
 * ends up at the model's centre, so every surface is at some distance up to that
 * radius. Normalising by the largest extent instead would let a long, low scene
 * keep a 10-unit radius and sit almost entirely outside the near plane.
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

  // A soft sky/ground fill. The model's two point lights are dimmed to
  // daylight, and on their own they would leave everything outside their small
  // radius black — which on a warm paper page reads as a broken canvas.
  scene.add(new HemisphereLight(new Color(0xdfe6ec), new Color(0x6b5f4e), BACKDROP.hemisphere));

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
        pivot.rotation.set(0, 0, 0);
        applyScrollOffset(0);
      }
      render();
    }
  }

  function update({ scroll = 0, time = 0, dt = 0.016 } = {}) {
    lastUpdateTime = time;
    if (!pivot) return;

    /* The turntable. X only — Y and Z are pinned to zero so the horizon cannot
       wander and tilt the whole location. Independent of the scroll, so the
       backdrop is never still. */
    pivot.rotation.x = reducedMotion ? 0 : time * BACKDROP.spin;
    pivot.rotation.y = 0;
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