import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import FloatingChip from '../three/FloatingChip';
import {
  DURATION,
  EASE_OUT,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from '../../lib/motion';

export default function Hero() {
  const heroRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // The signature beat. The hero is not a section that scrolls away, it is a
  // panel that turns away from you: it tips back on its X axis and retreats
  // down Z as the next section pushes it out, so the page reads as one
  // continuous space rather than a stack of blocks.
  const panelRotateX = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const panelZ = useTransform(scrollYProgress, [0, 1], [0, -340]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="depth-context relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16"
    >
      {/* Motifs parked at four different depths. Because the section owns a
          perspective, the nearer ones render larger and drift further — the
          parallax difference is what sells the space. */}
      <FloatingChip shape="square" depth={-210} drift={9} className="top-20 left-[10%] h-4 w-4 hidden sm:block" />
      <FloatingChip shape="circle" depth={-95} drift={15} className="top-32 right-[15%] h-3 w-3 hidden sm:block" />
      <FloatingChip shape="bar" depth={-150} drift={8} className="bottom-40 left-[20%] h-2 w-2 hidden md:block" />
      <FloatingChip
        shape="ring"
        depth={-45}
        drift={19}
        reverse
        className="bottom-32 right-[10%] h-5 w-5 hidden sm:block"
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl space-y-8"
        style={
          reducedMotion
            ? undefined
            : { rotateX: panelRotateX, z: panelZ, y: panelY }
        }
      >
        <div className="space-y-8 text-center">
          <motion.div
            variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#c25a3e]" />
            <span className="font-mono text-sm uppercase tracking-widest text-[#c25a3e]">
              {'// Hi, I’m Mandeep'}
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#c25a3e]" />
          </motion.div>

          {/* The headline reveals as ONE rigid unit rather than word by word.

              Per-word 3D was the wrong tool here. `.word3d` pivots each word
              around a point 140px behind itself, so a word starting at z: -260
              under perspective projects to roughly 0.81 scale and swings
              sideways — two adjacent words converge *into* each other, and the
              stagger leaves them at different phases of that swing, which reads
              as jumbled overlap. The gradient made it worse: background-clip
              paints on this element while its transformed children are
              composited separately, so the fill drifts off the glyphs.

              One transform on one untransformed element removes every one of
              those failure modes by construction — the words cannot separate,
              because they are not individually transformed. It also means the
              line only ever animates opacity and y, both of which are
              compositor-only and cannot trigger layout, so the eyebrow, the
              paragraph and the buttons below never get pushed around. */}
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            <span className="block text-[#2d2a24]">I Build</span>
            <motion.span
              className="gradient-text block py-3"
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.3 }}
            >
              Digital Experiences
            </motion.span>
          </h1>

          <motion.p
            className="mx-auto max-w-xl text-lg text-[#6b6560] md:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.6 }}
          >
            Full-stack developer building scalable web applications and intelligent
            automation solutions.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col items-center justify-center gap-3 pb-16 sm:flex-row sm:gap-4 md:pb-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.72 }}
        >
          <Button onClick={scrollToContact} variant="primary" className="w-full min-w-[180px] sm:w-auto">
            Start a Project
          </Button>
          <Button onClick={scrollToProjects} variant="outline" className="w-full min-w-[180px] sm:w-auto">
            View Work
          </Button>
        </motion.div>
      </motion.div>

      {/* Sits outside the tilting panel so it stays put while the hero
          recedes — a fixed point of reference for the scroll.

          `x` is handed to framer rather than left as a Tailwind
          `-translate-x-1/2` class: framer writes its own `transform` onto this
          element for the `y` keyframes, which silently discards the class's
          transform and knocked the indicator off-centre. Both values now
          compose in one transform, and the loop is gated so a reduced-motion
          visitor gets a static marker instead of a permanently moving one. */}
      <motion.div
        className="absolute bottom-6 left-1/2 flex flex-col items-center gap-2 md:bottom-10 md:gap-3"
        style={{ x: '-50%' }}
        animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="hidden font-mono text-xs uppercase tracking-widest text-[#9c958d] md:block">
          Scroll
        </span>
        <div className="flex h-8 w-5 justify-center rounded-full border border-[#9c958d] p-1">
          <motion.div
            className="h-2 w-1 rounded-full bg-[#c25a3e]"
            animate={reducedMotion ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
