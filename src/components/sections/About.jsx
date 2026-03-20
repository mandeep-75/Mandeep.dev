import { motion } from "framer-motion";
import auth from "../../assets/auth.jpeg";
import Card from "../ui/Card";

export default function About() {
  return (
    <section id="about" className="py-32 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Image with geometric frame */}
        <motion.div
          className="relative flex justify-center order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Geometric frame decorations */}
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[#00f5d4] rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-[#ff006e] rounded-tr-lg" />
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-[#8338ec] rounded-bl-lg" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[#ffd60a] rounded-br-lg" />
            
            {/* Glow effect */}
            <div className="absolute inset-4 bg-gradient-to-br from-[rgba(0,245,212,0.1)] to-[rgba(255,0,110,0.1)] rounded-2xl blur-xl" />
            
            {/* Image container */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)]">
              <img
                src={auth}
                alt="Mandeep Profile"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 to-transparent" />
            </div>
          </div>
          
          {/* Floating badge */}
          <motion.div 
            className="absolute -bottom-4 -right-4 lg:right-auto lg:-left-4 bg-[#12121a] border border-[#00f5d4]/30 rounded-xl px-4 py-3 shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-xs text-[#606070] uppercase tracking-wider mb-1">Based in</p>
            <p className="text-[#f8f8f2] font-semibold">Remote / Worldwide</p>
          </motion.div>
        </motion.div>

        {/* Right: Content */}
        <div className="space-y-8 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#00f5d4] to-transparent" />
              <span className="text-[#00f5d4] font-mono text-sm uppercase tracking-wider">
                About Me
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Turning Ideas into{' '}
              <span className="gradient-text">Reality</span>
            </h2>
            
            <div className="space-y-4 text-[#a0a0b0] text-lg">
              <p>
                Full-stack developer specializing in React and Python with a passion for automation. I build clean, scalable solutions that streamline workflows and transform complex processes into efficient automated systems.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="text-center p-6 bg-[#12121a]/50 border-[rgba(255,255,255,0.05)]">
              <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-1">1+</h3>
              <p className="text-sm text-[#606070]">Years Building & Learning</p>
            </Card>

            <Card className="text-center p-6 bg-[#12121a]/50 border-[rgba(255,255,255,0.05)]">
              <h3 className="text-3xl md:text-4xl font-bold gradient-text-magenta mb-1">5+</h3>
              <p className="text-sm text-[#606070]">Projects Completed</p>
            </Card>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
