import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-[10%] w-4 h-4 border border-[#00f5d4] rotate-45 opacity-40 animate-float hidden sm:block" />
      <div className="absolute top-32 right-[15%] w-3 h-3 bg-[#ff006e] rounded-full opacity-30 animate-float-reverse hidden sm:block" />
      <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-[#ffd60a] rounded-full opacity-50 animate-float hidden md:block" />
      <div className="absolute bottom-32 right-[10%] w-5 h-5 border border-[#8338ec] opacity-30 rotate-12 animate-float-reverse hidden sm:block" />

      <div className="text-center max-w-4xl mx-auto space-y-8">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.p 
                className="text-[#00f5d4] font-mono text-sm tracking-widest mb-6 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                // Hi, I'm Mandeep
            </motion.p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
                <motion.span 
                    className="block text-[#f8f8f2]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    I Build
                </motion.span>
                <motion.span 
                    className="block gradient-text py-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}

                >
                    Digital Experiences
                </motion.span>
            </h1>
            
            <motion.p 
                className="text-[#a0a0b0] text-lg md:text-xl max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
              Full-stack developer building scalable web applications and intelligent automation solutions.
            </motion.p>
        </motion.div>

        <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pb-16 md:pb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
        >
            <Button onClick={scrollToContact} variant="primary" className="w-full sm:w-auto min-w-[180px]">
                Start a Project
            </Button>
            <Button onClick={scrollToProjects} variant="outline" className="w-full sm:w-auto min-w-[180px]">
                View Work
            </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-[#606070] font-mono uppercase tracking-widest hidden md:block">Scroll</span>
        <div className="w-5 h-8 border border-[#606070] rounded-full flex justify-center p-1">
            <motion.div 
                className="w-1 h-2 bg-[#00f5d4] rounded-full"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </div>
      </motion.div>
    </section>
  );
}
