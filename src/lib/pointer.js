import { motionValue } from 'framer-motion';

/**
 * One pointer, shared by every depth layer on the page.
 *
 * These are module-scope MotionValues rather than hook results so the fixed
 * background stage and the scrolling DOM content can both read the same
 * pointer without prop drilling or React context. Nothing re-renders: layers
 * subscribe to the value and write transforms straight to the compositor.
 *
 * Range is -0.5 .. 0.5 around the viewport centre.
 */
export const pointerX = motionValue(0);
export const pointerY = motionValue(0);

/**
 * Attach the single document-level mousemove listener.
 *
 * Deliberately one listener for the whole site — a listener per tilt target
 * would multiply layout reads on every frame.
 *
 * @returns {() => void} cleanup
 */
export function trackPointer() {
  // Coarse pointers never fire mousemove; skip the work entirely.
  if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) {
    return () => {};
  }

  const onMove = (event) => {
    pointerX.set(event.clientX / window.innerWidth - 0.5);
    pointerY.set(event.clientY / window.innerHeight - 0.5);
  };

  window.addEventListener('mousemove', onMove, { passive: true });

  return () => window.removeEventListener('mousemove', onMove);
}
