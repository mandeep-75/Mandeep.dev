import { motion } from "framer-motion";

export default function Button({ children, onClick, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
    outline: "bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10"
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-semibold tracking-wide
        transition-all duration-300
        cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
    </motion.button>
  );
}
