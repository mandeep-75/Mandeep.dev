import { motion } from "framer-motion";
import Card from "../ui/Card";

export default function About() {
  return (
    <section id="about" className="py-32 px-4 max-w-5xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#c25a3e] to-transparent" />
            <span className="text-[#c25a3e] font-mono text-sm uppercase tracking-wider">
              About Me
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#2d2a24]">
            Turning Ideas into{' '}
            <span className="gradient-text">Reality</span>
          </h2>
          
          <div className="space-y-4 text-[#6b6560] text-lg mb-12">
            <p>
              Full-stack developer specializing in React and Python with a passion for automation. I build clean, scalable solutions that streamline workflows and transform complex processes into efficient automated systems.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card className="text-center p-6 bg-white border-[rgba(45,42,36,0.06)]">
            <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-1">2+</h3>
            <p className="text-sm text-[#9c958d]">Years Building & Learning</p>
          </Card>

          <Card className="text-center p-6 bg-white border-[rgba(45,42,36,0.06)]">
            <h3 className="text-3xl md:text-4xl font-bold gradient-text-slate mb-1">6+</h3>
            <p className="text-sm text-[#9c958d]">Projects Completed</p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
