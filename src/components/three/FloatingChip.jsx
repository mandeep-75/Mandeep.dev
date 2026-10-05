import { motion, useSpring, useTransform } from 'framer-motion';

import { pointerX, pointerY } from '../../lib/pointer';
import { useReducedMotion } from '../../lib/motion';

const PARALLAX_SPRING = { stiffness: 70, damping: 18, mass: 0.7 };

const SHAPES = {
  square: 'border border-[#c25a3e]/45 rotate-45',
  circle: 'rounded-full bg-[#4a6a7a]/40',
  ring: 'rounded-full border border-[#4a6a7a]/45',
  bar: 'bg-[#d4895b]/45',
  barAlt: 'bg-[#5a7a8a]/45',
};

/**
 * A geometric motif floating at a real depth in the hero's perspective.
 *
 * Two nested elements, deliberately: the outer one is owned by framer-motion
 * and carries the pointer parallax and the translateZ, the inner one is owned
 * by a CSS keyframe and carries the idle drift. A single element cannot do
 * both — framer writes `transform` inline and would overwrite the keyframe.
 *
 * Decorative only: aria-hidden, and the shape never intercepts a pointer.
 */
export default function FloatingChip({
  shape = 'square',
  depth = -140,
  drift = 14,
  reverse = false,
  className = '',
}) {
  const reducedMotion = useReducedMotion();
  const springX = useSpring(pointerX, PARALLAX_SPRING);
  const springY = useSpring(pointerY, PARALLAX_SPRING);

  const x = useTransform(springX, [-0.5, 0.5], [-drift, drift]);
  const y = useTransform(springY, [-0.5, 0.5], [-drift, drift]);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ x, y, z: reducedMotion ? 0 : depth }}
    >
      <div
        className={`h-full w-full ${
          reverse ? 'animate-float-reverse' : 'animate-float'
        } motion-reduce:animate-none ${SHAPES[shape]}`}
      />
    </motion.div>
  );
}
