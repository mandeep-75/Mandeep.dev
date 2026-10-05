import { motion } from "framer-motion";
import { DURATION, EASE_OUT, useReducedMotion } from "../../lib/motion";

export default function Footer() {
  const reducedMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="depth-context border-t border-[rgba(45,42,36,0.06)] bg-[#faf9f6] py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Turns up out of depth as the page lands, so the end of the scroll
            resolves rather than simply stopping. */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 44, rotateX: reducedMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.scene, ease: EASE_OUT }}
        >
          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[#9c958d] transition-colors hover:text-[#c25a3e]"
            whileHover={reducedMotion ? undefined : { y: -3 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          >
            <span className="font-mono text-sm uppercase tracking-wider">
              Back to top
            </span>
            <motion.svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
          </motion.button>

          {/* Divider */}
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[rgba(45,42,36,0.1)] to-transparent" />

          {/* Copyright */}
          <p className="text-sm text-[#9c958d]">
            © {new Date().getFullYear()} <span className="text-[#6b6560]">Mandeep Singh</span>. All rights reserved.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#9c958d]">
            <span className="text-[#c25a3e]">&lt;</span>
            <span>Built with</span>
            <span className="text-[#4a6a7a]">React</span>
            <span className="text-[#d4895b]">&amp;</span>
            <span className="text-[#5a7a8a]">Vite</span>
            <span className="text-[#c25a3e]">&gt;</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
