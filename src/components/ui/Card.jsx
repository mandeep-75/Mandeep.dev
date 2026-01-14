import { motion } from "framer-motion";

export default function Card({ title, description, className = "", children }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-lg
        border border-white/10
        rounded-2xl p-6
        hover:border-blue-500/30
        transition-colors duration-300
        ${className}
      `}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        {title && (
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                {title}
            </h3>
        )}
        
        {description && (
            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                {description}
            </p>
        )}

        {children}
    </motion.div>
  );
}
