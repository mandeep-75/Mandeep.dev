import { motion } from "framer-motion";
import Card from "../ui/Card";
import Word3D from "../ui/Word3D";
import {
  DURATION,
  EASE_OUT,
  WORD_PERSPECTIVE,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from "../../lib/motion";

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
    <section id="about" className="px-4 py-32 max-w-5xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#c25a3e] to-transparent" />
          <span className="font-mono text-sm uppercase tracking-wider text-[#c25a3e]">
            About Me
          </span>
        </motion.div>

        <h2 className="mb-6 text-4xl font-bold leading-tight text-[#2d2a24] md:text-5xl">
          <Word3D
            as="span"
            text="Turning Ideas into"
            style={WORD_PERSPECTIVE}
            className="text-[#2d2a24]"
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
          className="mb-12 space-y-4 text-lg text-[#6b6560]"
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
          className="depth-context mx-auto grid max-w-md grid-cols-2 gap-4"
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
          <motion.div
            variants={reducedMotion ? CARD_REVEAL_FLAT : CARD_REVEAL}
            className="depth-context h-full"
          >
            <Card className="p-6 text-center bg-white border-[rgba(45,42,36,0.06)] h-full">
              <h3 className="gradient-text mb-1 text-3xl font-bold md:text-4xl">2+</h3>
              <p className="text-sm text-[#9c958d]">Years Building &amp; Learning</p>
            </Card>
          </motion.div>

          <motion.div
            variants={reducedMotion ? CARD_REVEAL_FLAT : CARD_REVEAL}
            className="depth-context h-full"
          >
            <Card className="p-6 text-center bg-white border-[rgba(45,42,36,0.06)] h-full">
              <h3 className="gradient-text-slate mb-1 text-3xl font-bold md:text-4xl">6+</h3>
              <p className="text-sm text-[#9c958d]">Projects Completed</p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
