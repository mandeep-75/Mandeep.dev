import { motion } from "framer-motion";
import { DURATION, EASE_OUT, useReducedMotion } from "../../lib/motion";
import { scrollToY } from "../../lib/smoothScroll";

export default function Footer() {
  const reducedMotion = useReducedMotion();

  // The engine decides the speed (instant under reduced motion), so this
  // doesn't need its own behaviour branch.
  const scrollToTop = () => {
    scrollToY(0);
  };

  return (
    <footer className="depth-context border-t border-[rgba(253,241,232,0.16)] bg-[#8a0c13] py-12">
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
            className="group flex items-center gap-2 text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
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
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[rgba(253,241,232,0.25)] to-transparent" />

          {/* Socials — moved here from their own section, so the page ends
              with every way to reach me in one place. The SVG paths are the
              ones the old Social section already shipped; only their
              treatment changed. Links open in a new tab and carry visible
              labels, so the icon is never the only thing naming the
              destination. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a
              href="https://www.linkedin.com/in/mandeep-singh-3433a231a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/mandeep-75"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://x.com/Dev1309Singh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter</span>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[rgba(253,241,232,0.85)]">
            © {new Date().getFullYear()} <span className="text-[#f3d9cf]">Mandeep Singh</span>. All rights reserved.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center gap-2 font-mono text-xs text-[rgba(253,241,232,0.85)]">
            <span className="text-[#ffd166]">&lt;</span>
            <span>Built with</span>
            <span className="text-[#9fc3d4]">React</span>
            <span className="text-[#ffd166]">&amp;</span>
            <span className="text-[#f3d9cf]">Vite</span>
            <span className="text-[#ffd166]">&gt;</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
