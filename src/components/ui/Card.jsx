import { motion } from "framer-motion";

export default function CoolCard({ title, description }) {
  return (
    <motion.div
      className="
        border border-gray-700 
        bg-gradient-to-br from-gray-800 to-gray-900
        rounded-2xl
        p-6 sm:p-8
        shadow-xl
        m-2
        hover:shadow-2xl
        transition
        max-w-md 
        w-full 
        sm:max-w-lg
        flex flex-col
      "
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.035, boxShadow: "0px 8px 24px #2563eb33" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 23 }}
    >
      <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-blue-400 drop-shadow-sm">
        {title}
      </h3>
      <p className="text-gray-300 sm:text-lg tracking-normal">{description}</p>
    </motion.div>
  );
}
