import { motion } from "framer-motion";

export default function Button({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="
        bg-blue-500 
        hover:bg-blue-600 
        focus:bg-blue-700
        text-white 
        font-semibold
        px-4 py-2
        md:px-6 md:py-3
        rounded-full
        shadow-md
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400 
        transition
        active:scale-95
        text-base
        md:text-lg
        tracking-wide
      "
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04, boxShadow: "0px 4px 18px #3b82f655" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
