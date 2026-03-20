import { motion } from "framer-motion";

export default function Card({ title, description, className = "", children }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-[#12121a]/50
        border border-[rgba(255,255,255,0.06]
        rounded-2xl p-6
        hover:border-[rgba(255,255,255,0.12)]
        hover:bg-[#12121a]/80
        transition-all duration-300
        ${className}
      `}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        {/* Gradient accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f5d4]/5 rounded-full blur-2xl pointer-events-none" />
        
        {title && (
            <h3 className="text-xl font-semibold text-[#f8f8f2] mb-2 relative z-10">
                {title}
            </h3>
        )}
        
        {description && (
            <p className="text-[#a0a0b0] text-sm leading-relaxed relative z-10">
                {description}
            </p>
        )}

        {children}
    </motion.div>
  );
}
