import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import {
  DURATION,
  EASE_OUT,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from '../../lib/motion';
import { scrollToSection } from '../../lib/smoothScroll';

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

  // Both buttons ride the shared scroll engine, so a jump to another section
  // carries the same weight as a wheel flick instead of the browser's own
  // smooth scroll (and is instant under prefers-reduced-motion).
  const scrollToContact = () => {
    scrollToSection('contact');
  };

  const scrollToProjects = () => {
    scrollToSection('projects');
  };

  return (
    /* No `items-center` on this flex column on purpose: the panel pins to the
       left track at lg with `lg:ml-0 lg:mr-auto`, and auto margins are only
       reliably the centreing mechanism when they are not competing with
       `align-items`. Below lg, `mx-auto` centres the panel exactly as before. */
    <section
      ref={heroRef}
      className="depth-context relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-16 sm:px-8 lg:px-10 xl:px-16"
    >
      {/* The floating background motifs (FloatingChip) were removed here: the
          WebGL model is the backdrop now, and they read as debris beside it. */}
      {/* The hero introduces the page's side-alignment language: it sits on
          the left track — the same 36% measure every other block uses, so the
          centre band rule holds here too. One thing cannot obey it: the
          display line "Digital Experiences" is ~506px at text-8xl and the
          track is 472px at 1440, so that one line runs ~34px past the band
          edge. Nothing clips it — the section's `overflow-hidden` only bites
          at the viewport edge, far to the right — and shrinking it would mean
          changing a type size, which is out of scope. */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-2xl space-y-8 lg:ml-0 lg:mr-auto lg:w-[36%] lg:max-w-[36rem]"
        style={
          reducedMotion
            ? undefined
            : { rotateX: panelRotateX, z: panelZ, y: panelY }
        }
      >
        <div className="space-y-8 text-left">
          <motion.div
            variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 flex items-center justify-start gap-3"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ffd166]" />
            <span className="font-mono text-sm uppercase tracking-widest text-[#ffd166]">
              {'// Hi, I’m Mandeep'}
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ffd166]" />
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

              One transform on one element removes every one of those failure
              modes by construction — the words cannot separate, because they
              are not individually transformed. The transform lives on the h1
              itself, so "I Build" is part of the reveal instead of sitting at
              full strength on frame one while its sibling staggers in. The
              gradient span carries no transform of its own, so the
              background-clip fill stays glued to the glyphs. Opacity and y are
              both compositor-only, so the eyebrow, the paragraph and the
              buttons below never get pushed around. */}
          <motion.h1
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.3 }}
          >
            <span className="block text-[#fdf1e8]">I Build</span>
            <span className="gradient-text block py-3">
              Digital Experiences
            </span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-lg text-[#f3d9cf] md:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.6 }}
          >
            Full-stack developer building scalable web applications and intelligent
            automation solutions.
          </motion.p>
        </div>

        {/* `flex-wrap` because two min-w-[180px] buttons plus a gap is 376px
            and the track is 340px at 1024 — without it the row would spill
            into the centre band instead of stacking. */}
        <motion.div
          className="flex flex-col flex-wrap items-start justify-start gap-3 pb-16 sm:flex-row sm:gap-4 md:pb-0"
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
    </section>
  );
}
