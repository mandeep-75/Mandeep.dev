import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { useFinePointer, useReducedMotion } from '../../lib/motion';

const TILT_SPRING = { stiffness: 180, damping: 20, mass: 0.5 };

export default function Card({ title, description, className = "", children }) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const nodeRef = useRef(null);
  const rectRef = useRef(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, TILT_SPRING);
  const springY = useSpring(py, TILT_SPRING);

  const interactive = finePointer && !reducedMotion;

  const rotateY = useTransform(springX, [0, 1], [-5, 5]);
  const rotateX = useTransform(springY, [0, 1], [5, -5]);

  const measure = useCallback(() => {
    if (nodeRef.current) rectRef.current = nodeRef.current.getBoundingClientRect();
  }, []);

  useEffect(() => {
    if (!interactive) return undefined;

    measure();
    window.addEventListener('scroll', measure, { passive: true, capture: true });
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('scroll', measure, { capture: true });
      window.removeEventListener('resize', measure);
    };
  }, [interactive, measure]);

  const track = (event) => {
    const rect = rectRef.current;
    if (!rect || !rect.width || !rect.height) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handlePointerEnter = (event) => {
    measure();
    track(event);
  };

  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`
        relative overflow-hidden
        bg-white
        border border-[rgba(45,42,36,0.06)]
        rounded-2xl p-6
        hover:border-[rgba(45,42,36,0.12)]
        hover:shadow-[0_18px_44px_rgba(45,42,36,0.09)]
        transition-[border-color,box-shadow] duration-300
        ${className}
      `}
      style={{
        transformPerspective: 820,
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
      }}
      onPointerEnter={interactive ? handlePointerEnter : undefined}
      onPointerMove={interactive ? track : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
    >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(194,90,62,0.03)] rounded-full blur-2xl pointer-events-none" />

        {title && (
            <h3 className="text-xl font-semibold text-[#2d2a24] mb-2 relative z-10">
                {title}
            </h3>
        )}

        {description && (
            <p className="text-[#6b6560] text-sm leading-relaxed relative z-10">
                {description}
            </p>
        )}

        {children}
    </motion.div>
  );
}
