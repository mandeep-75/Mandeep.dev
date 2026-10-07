import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { useFinePointer, useReducedMotion } from '../../lib/motion';

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg"
};

const TILT_SPRING = { stiffness: 220, damping: 20, mass: 0.5 };

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const variants = {
    // The primary is a cream slab with red type: on a red page a red-on-red
    // button would vanish.
    primary: `
      bg-[#fdf1e8]
      text-[#a50f18]
      font-semibold
      shadow-[0_4px_16px_rgba(0,0,0,0.22)]
      hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)]
      border border-transparent
    `,
    secondary: `
      bg-[#f5f3ef]
      text-[#2d2a24]
      border border-[rgba(45,42,36,0.1)]
      hover:border-[rgba(45,42,36,0.2)]
      hover:bg-[#f0ede8]
    `,
    outline: `
      bg-transparent
      text-[#fdf1e8]
      border border-[rgba(253,241,232,0.5)]
      hover:bg-[rgba(253,241,232,0.1)]
      hover:border-[#fdf1e8]
    `,
    ghost: `
      bg-transparent
      text-[#f3d9cf]
      border border-transparent
      hover:text-[#fdf1e8]
      hover:bg-[rgba(253,241,232,0.1)]
    `
  };

  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const nodeRef = useRef(null);
  const rectRef = useRef(null);

  // Pointer position within the button, 0..1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, TILT_SPRING);
  const springY = useSpring(py, TILT_SPRING);

  const interactive = finePointer && !reducedMotion && !disabled;

  const rotateY = useTransform(springX, [0, 1], [-4.5, 4.5]);
  const rotateX = useTransform(springY, [0, 1], [4.5, -4.5]);

  const measure = useCallback(() => {
    if (nodeRef.current) rectRef.current = nodeRef.current.getBoundingClientRect();
  }, []);

  // Cache the rect rather than reading layout on every pointer move. Buttons
  // sit inside cards that move on hover, so the rect has to be refreshed when
  // the page scrolls or resizes too.
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

  // Recentre on leave so the button springs flat from wherever it was, not
  // from a stale value.
  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const hoverProps = disabled || reducedMotion
    ? {}
    : { scale: 1.02, y: -2 };

  /* One className, one style, one set of pointer handlers — the two render
     paths differ only in their tag. With an href the control is navigation
     and renders a real anchor: the browser handles the target itself (which
     `window.open` calls do not reliably do), and middle-click, right-click
     "copy link" and keyboard activation keep their native meaning. */
  const shared = {
    ref: nodeRef,
    className: `
        relative overflow-hidden
        rounded-xl
        font-medium tracking-wide
        transition-[border-color,box-shadow,background-color] duration-300
        cursor-pointer
        select-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled && !href ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `,
    style: {
      transformPerspective: 480,
      rotateX: interactive ? rotateX : 0,
      rotateY: interactive ? rotateY : 0,
    },
    onPointerEnter: interactive ? handlePointerEnter : undefined,
    onPointerMove: interactive ? track : undefined,
    onPointerLeave: interactive ? handlePointerLeave : undefined,
    whileHover: hoverProps,
    whileTap: disabled || reducedMotion ? undefined : { scale: 0.98 },
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>

      {/* Shine effect on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} {...shared} {...props}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      {...shared}
      {...props}
    >
      {content}
    </motion.button>
  );
}
