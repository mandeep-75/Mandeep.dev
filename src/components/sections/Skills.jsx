import { motion } from "framer-motion";

const skills = [
  { name: "React", category: "Frontend", level: 90 },
  { name: "JavaScript", category: "Frontend", level: 85 },
  { name: "Tailwind CSS", category: "Frontend", level: 95 },
  { name: "Python", category: "Backend", level: 80 },
  { name: "Node.js", category: "Backend", level: 75 },
  { name: "AI/ML", category: "Data", level: 70 },
  { name: "Git", category: "Tools", level: 85 },
  { name: "Docker", category: "Tools", level: 65 },
];

export default function Skills() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Technical <span className="text-blue-500">Skills</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A collection of technologies and tools I work with to build robust applications.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -5, borderColor: "#3b82f6" }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-colors group"
          >
            <div className="text-lg font-semibold text-gray-200 mb-2 group-hover:text-white">{skill.name}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">{skill.category}</div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
