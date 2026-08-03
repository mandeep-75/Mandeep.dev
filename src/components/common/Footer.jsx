import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[rgba(45,42,36,0.06)] bg-[#faf9f6] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          
          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[#9c958d] hover:text-[#c25a3e] transition-colors"
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
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[rgba(45,42,36,0.1)] to-transparent" />

          {/* Copyright */}
          <p className="text-[#9c958d] text-sm">
            © {new Date().getFullYear()} <span className="text-[#6b6560]">Mandeep Singh</span>. All rights reserved.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center gap-2 text-[#9c958d] text-xs font-mono">
            <span className="text-[#c25a3e]">&lt;</span>
            <span>Built with</span>
            <span className="text-[#4a6a7a]">React</span>
            <span className="text-[#d4895b]">&</span>
            <span className="text-[#5a7a8a]">Vite</span>
            <span className="text-[#c25a3e]">&gt;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
