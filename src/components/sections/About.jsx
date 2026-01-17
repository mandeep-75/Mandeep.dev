import { motion } from "framer-motion";
import auth from "../../assets/auth.jpeg";
import Card from "../ui/Card";

export default function About() {
  return (
    <section id="about" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left: Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              About <span className="text-blue-500">Me</span>
            </h2>
            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p>
                I’m a passionate developer who enjoys building intuitive and dynamic user experiences. Driven by curiosity, I love understanding how things work and creating solutions that truly matter. </p>
              <p>
                I specialize in React and Python, using modern tools to bridge complex backend logic with clean, user-friendly frontend design. I also leverage AI tools to improve productivity and workflows.</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="text-center p-4">
              <h3 className="text-3xl font-bold text-white mb-1">1+ Years</h3>
              <p className="text-sm text-gray-400">Building & Learning</p>
            </Card>

            <Card className="text-center p-4">
              <h3 className="text-3xl font-bold text-white mb-1">3+</h3>
              <p className="text-sm text-gray-400">Projects Completed</p>
            </Card>
          </motion.div>
        </div>

        {/* Right: Image */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-blue-500 rounded-3xl rotate-6 opacity-20 blur-lg animate-pulse"></div>
            <img
              src={auth}
              alt="Mandeep Profile"
              className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-gray-700/50"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
