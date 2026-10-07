import { motion } from 'framer-motion';
import SideColumn from '../ui/SideColumn';
import Word3D from '../ui/Word3D';
import {
  DURATION,
  EASE_OUT,
  WORD_PERSPECTIVE,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from '../../lib/motion';

/* Cards rise out of depth as they arrive. Both objects live at module scope so
   the reference is stable across renders — a fresh variants object every render
   makes framer re-resolve the animation on each pass. */
const CARD_REVEAL = {
  hidden: { opacity: 0, y: 40, z: -180, rotateX: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: DURATION.scene, ease: EASE_OUT },
  },
};

const CARD_REVEAL_FLAT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function About() {
  const reducedMotion = useReducedMotion();

  return (
    /* Block 2 of the zigzag: after the hero's left track, About moves to the
       right track and starts 96px lower, so the eye crosses the centre band
       on the way down instead of reading two parallel columns. */
    <section id="about" className="py-32">
      <SideColumn side="right" stagger>
        <motion.div
          variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#ffd166] to-transparent" />
          <span className="font-mono text-sm uppercase tracking-wider text-[#ffd166]">
            About Me
          </span>
        </motion.div>

        <h2 className="mb-6 text-4xl font-bold leading-tight text-[#fdf1e8] md:text-5xl">
          <Word3D
            as="span"
            text="Turning Ideas into"
            style={WORD_PERSPECTIVE}
            className="text-[#fdf1e8]"
            delay={0.05}
          />{" "}
          <Word3D
            as="span"
            text="Reality"
            style={WORD_PERSPECTIVE}
            className="gradient-text"
            delay={0.26}
            depth={260}
          />
        </h2>

        <motion.div
          className="mb-12 space-y-4 text-lg text-[#f3d9cf]"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.2 }}
        >
          <p>
            Full-stack developer specializing in React and Python with a passion for
            automation. I build clean, scalable solutions that streamline workflows and
            transform complex processes into efficient automated systems.
          </p>
        </motion.div>

        {/* `depth-context` sits here rather than on the section: perspective only
            reaches direct children, and these cards are two levels down. */}
        <motion.div
          className="depth-context grid max-w-md grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: reducedMotion ? 0 : 0.15,
              },
            },
          }}
        >
          {/* No card surface: the stats sit straight on the page like the hero
              does — the amber-cream gradient carries the number and the cream
              label carries the caption, against 7:1 blood red. */}
          <motion.div
            variants={reducedMotion ? CARD_REVEAL_FLAT : CARD_REVEAL}
            className="depth-context h-full"
          >
            <div className="h-full p-6 text-center">
              <h3 className="gradient-text mb-1 text-3xl font-bold md:text-4xl">2+</h3>
              <p className="text-sm text-[#f3d9cf]">Years Building &amp; Learning</p>
            </div>
          </motion.div>

          <motion.div
            variants={reducedMotion ? CARD_REVEAL_FLAT : CARD_REVEAL}
            className="depth-context h-full"
          >
            <div className="h-full p-6 text-center">
              <h3 className="gradient-text mb-1 text-3xl font-bold md:text-4xl">6+</h3>
              <p className="text-sm text-[#f3d9cf]">Projects Completed</p>
            </div>
          </motion.div>
        </motion.div>
      </SideColumn>
    </section>
  );
}
