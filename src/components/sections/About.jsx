import { motion } from "framer-motion";
import auth from "../../assets/auth.jpeg"; // Placeholder image path
export default function About() {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Side Image */}
      <div className="flex justify-center">
        <motion.img
          src={auth}
          alt="Profile"
          className="w-56 h-56 rounded-4xl object-cover shadow-xl"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      {/* Side Description */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">About Me</h2>
        <p className="text-gray-400 leading-relaxed">
          I am a technology enthusiast with expertise in QA automation, Python,
          AI/ML, and mobile development.
        </p>
      </motion.div>
    </section>
  );
}
