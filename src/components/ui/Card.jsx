import { motion } from "framer-motion";

export default function Card({ title, description, className = "", children }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white
        border border-[rgba(45,42,36,0.06)]
        rounded-2xl p-6
        hover:border-[rgba(45,42,36,0.12)]
        hover:shadow-[0_4px_24px_rgba(45,42,36,0.06)]
        transition-all duration-300
        ${className}
      `}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(194,90,62,0.03)] rounded-full blur-2xl pointer-events-none" />
        
        {title && (
            <h3 className="text-xl font-semibold text-[#2d2a24] mb-2 relative z-10">
                {title}
            </h3>
        )}
        
        {description && (
            <p className="text-[#6b6560] text-sm leading-relaxed relative z-10">
                {description}
            </p>
        )}

        {children}
    </motion.div>
  );
}
