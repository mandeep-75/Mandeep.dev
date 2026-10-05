import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import { pointerX, pointerY } from '../../lib/pointer';
import { useReducedMotion } from '../../lib/motion';

const PARALLAX_SPRING = { stiffness: 60, damping: 20, mass: 0.8 };

/**
 * One background plane parked at a depth in the shared perspective.
 *
 * Depth is read three ways at once: translateZ shrinks it, parallax makes it
 * travel further than the planes behind it, and the ordering stacks it behind
 * the page. The pointer offset is normalised to -0.5..0.5 and remapped per
 * plane, so nearer layers move more — that difference is the whole cue.
 */
function Plane({ z = 0, drift = 0, className = '', children }) {
  const reducedMotion = useReducedMotion();
  const springX = useSpring(pointerX, PARALLAX_SPRING);
  const springY = useSpring(pointerY, PARALLAX_SPRING);

  const x = useTransform(springX, [-0.5, 0.5], [-drift, drift]);
  const y = useTransform(springY, [-0.5, 0.5], [-drift, drift]);

  return (
    <motion.div
      aria-hidden="true"
      className={`depth-plane ${className}`}
      style={{ x, y, z: reducedMotion ? 0 : z }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The fixed backdrop the whole page sits inside.
 *
 * Everything here is aria-hidden and pointer-events-none: it carries no
 * information, so it stays out of the accessibility tree and never intercepts
 * a click. The page above it remains fully readable and functional if this
 * layer fails to paint for any reason.
 *
 * It renders behind the content rather than replacing it, so with JS disabled
 * or WebGL unavailable the site degrades to exactly the flat editorial layout
 * it always was.
 */
export default function DepthStage() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // 60px is one grid cell, so the travel is seamless. The projection steepens
  // sharply toward the viewer, so a single cell of local travel is already a
  // large amount of screen movement — do not scale this up.
  const floorTravel = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div aria-hidden="true" className="depth-stage">
      {/* Farthest: the wall grid, barely moving. */}
      <Plane z={-340} drift={6} className="inset-[-25%] grid-bg opacity-[0.5]" />

      {/* The receding ground plane — the strongest single "this is a space" cue. */}
      <div className="depth-floor">
        <div className="depth-floor-rotate">
          <motion.div
            className="depth-floor-pan grid-bg"
            style={{ y: reducedMotion ? 0 : floorTravel }}
          />
        </div>
      </div>

      <Plane
        z={-190}
        drift={16}
        className="top-[-7%] left-[-9%] h-[500px] w-[500px] rounded-full bg-[rgba(194,90,62,0.05)] blur-[150px]"
      />

      <Plane
        z={-110}
        drift={22}
        className="right-[-11%] bottom-[-9%] h-[600px] w-[600px] rounded-full bg-[rgba(74,106,122,0.05)] blur-[180px]"
      />

      {/* Nearest: the amber wash drifts furthest and sits in front of the rest.
          Centred with margins, not -translate-x-1/2 — framer-motion owns this
          element's transform and would overwrite a Tailwind translate. */}
      <Plane
        z={40}
        drift={28}
        className="top-1/2 left-1/2 -ml-[400px] -mt-[400px] h-[800px] w-[800px] rounded-full bg-[rgba(212,137,91,0.035)] blur-[200px]"
      />
    </div>
  );
}
