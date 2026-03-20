import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0f] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          
          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[#606070] hover:text-[#00f5d4] transition-colors"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-mono uppercase tracking-wider">
              Back to top
            </span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
          </motion.button>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

          {/* Copyright */}
          <p className="text-[#606070] text-sm">
            © {new Date().getFullYear()} <span className="text-[#a0a0b0]">Mandeep Singh</span>. All rights reserved.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center gap-2 text-[#606070] text-xs font-mono">
            <span className="text-[#00f5d4]">&lt;</span>
            <span>Built with</span>
            <span className="text-[#ff006e]">React</span>
            <span className="text-[#ffd60a]">&</span>
            <span className="text-[#8338ec]">Vite</span>
            <span className="text-[#00f5d4]">&gt;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
