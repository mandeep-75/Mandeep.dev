import { useCallback, useSyncExternalStore } from 'react';

/* ==========================================================================
   MOTION VOCABULARY
   Every animation on this site uses one of these two curves and one of these
   durations. Consistency is what makes a scroll read as a single film rather
   than a pile of effects.
   ========================================================================== */

/** Entrances and reveals. Fast out of the gate, long settle. */
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const DURATION = {
  micro: 0.25,
  reveal: 0.55,
  scene: 0.9,
  hero: 1.2,
};

/**
 * The perspective every Word3D instance needs on its own wrapper.
 *
 * It has to sit on the words' *direct* parent, not on a grandparent:
 * perspective does not propagate through an intermediate element unless that
 * element sets `transform-style: preserve-3d`, which would flatten any clip or
 * overflow on the way down. Passing this per instance keeps the primitive
 * immune to wherever it gets mounted.
 */
export const WORD_PERSPECTIVE = { perspective: 1100 };

/* ==========================================================================
   MEDIA QUERIES
   useSyncExternalStore keeps these synchronous on first render, so a reduced-
   motion visitor never gets a frame of the moving version before it settles.
   ========================================================================== */

function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True only for real mice/trackpads — the precondition for pointer tilt. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/** Honour the OS setting. Motion is a layer, never a precondition for content. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/* ==========================================================================
   TEXT
   ========================================================================== */

/** Split a string into display words. Drops the empty strings from <br />. */
export function splitWords(text) {
  return text.split(/\s+/).filter(Boolean);
}

/* ==========================================================================
   SHARED VARIANTS
   ========================================================================== */

/**
 * The site's eyebrow: a short rule plus a mono label.
 *
 * Deliberately a plain x-slide with no rotation. A rotateY here would need a
 * perspective on whatever ancestor the label happens to land in, and this
 * variant is shared by four sections in four different DOM positions — a
 * primitive that breaks depending on where you put it isn't a primitive.
 */
export const eyebrowVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.reveal, ease: EASE_OUT },
  },
};

/** Reduced-motion counterpart: fade only. Content still arrives, nothing travels. */
export const eyebrowFlatVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
