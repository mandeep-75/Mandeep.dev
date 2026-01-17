import { motion } from "framer-motion";
import { useState } from "react";

const skills = [
  { name: "React", category: "Frontend", level: 90 },
  { name: "Linux", category: "System", level: 95 },
  { name: "JavaScript", category: "Frontend", level: 85 },
  { name: "Tailwind CSS", category: "Frontend", level: 95 },
  { name: "HTML", category: "Frontend", level: 90 },
  { name: "CSS", category: "Frontend", level: 88 },
  { name: "Git", category: "Tools", level: 85 },
  { name: "GitHub", category: "Tools", level: 85 },
  { name: "Docker", category: "Tools", level: 65 },
  { name: "npm", category: "Tools", level: 80 },
  { name: "Node.js", category: "Backend", level: 80 },
  { name: "Python", category: "Backend", level: 80 },

]

export default function Skills() {
  const [isExpanded, setIsExpanded] = useState(false);

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

      <div className={`flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 ${isExpanded ? 'gap-6' : 'gap-0'} transition-all duration-300`}>
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -5, borderColor: "#3b82f6" }}
            className={`
              bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center 
              hover:bg-gray-800/50 transition-all duration-300 group
              ${!isExpanded && index !== 0 ? '-mt-24 md:mt-0' : ''}
              ${!isExpanded ? 'active:scale-105 active:z-10' : ''}
            `}
            style={{ zIndex: index }}
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

      <div className="mt-8 text-center md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-2 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors border border-gray-700"
        >
          {isExpanded ? 'Show Less' : 'Show All Skills'}
        </button>
      </div>
    </section>
  );
}
