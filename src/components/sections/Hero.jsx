import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <h2 className="text-blue-400 font-medium tracking-wider mb-4 uppercase text-sm md:text-base">
                Welcome to my portfolio
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                I Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital Experiences</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Transforming ideas into exceptional web and mobile applications with modern technologies and pixel-perfect design.
            </p>
        </motion.div>

        <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
        >
            <Button onClick={scrollToContact} variant="primary" className="w-full sm:w-auto">
                Start a Project
            </Button>
            <Button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} variant="secondary" className="w-full sm:w-auto">
                View Work
            </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-gray-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
