import { Fragment } from 'react';
import { motion } from 'framer-motion';

import { DURATION, EASE_OUT, splitWords, useReducedMotion } from '../../lib/motion';

/**
 * Display type that arrives from deep in negative Z and flattens into place.
 *
 * The trick is `transform-origin: 50% 50% -140px` (see `.word3d`): each word
 * pivots around a point 140px behind itself, so it swings through real space
 * on an arc instead of sliding in flat. The illusion only reads if the parent
 * establishes a perspective — without one, a rotateX is just a squash.
 *
 * Under reduced motion the words render as plain static spans with no
 * initial state, so the heading is fully present in the first frame. Content
 * must never depend on an animation to exist.
 *
 * @param {object} props
 * @param {string} props.text        String to break into words.
 * @param {import('react').ElementType} [props.as]
 * @param {number} [props.depth]     Starting translateZ, in px.
 * @param {number} [props.stagger]   Delay between words, in seconds.
 * @param {React.CSSProperties} [props.style] Applied to the wrapper. This is
 *   where the perspective goes — it must sit on the words' direct parent.
 * @param {import('framer-motion').Variants['viewport']} [props.viewport]
 */
export default function Word3D({
  text,
  as: Tag = 'span',
  className = '',
  style,
  wordClassName = '',
  depth = 220,
  stagger = 0.06,
  delay = 0,
  viewport = { once: true, amount: 0.5 },
}) {
  const reducedMotion = useReducedMotion();
  const words = splitWords(text);

  if (reducedMotion) {
    return (
      <Tag className={className} style={style}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={`word3d ${wordClassName}`}>
            {word}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={style}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <motion.span
            className={`word3d ${wordClassName}`}
            initial={{ opacity: 0, y: depth * 0.18, z: -depth, rotateX: -38, rotateY: 16 }}
            whileInView={{ opacity: 1, y: 0, z: 0, rotateX: 0, rotateY: 0 }}
            viewport={viewport}
            transition={{
              duration: DURATION.scene,
              ease: EASE_OUT,
              delay: delay + index * stagger,
            }}
          >
            {word}
          </motion.span>
        </Fragment>
      ))}
    </Tag>
  );
}
