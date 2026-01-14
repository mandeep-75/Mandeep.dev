import { motion } from "framer-motion";

const socials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/", color: "hover:text-blue-500" },
  { name: "GitHub", url: "https://github.com/", color: "hover:text-gray-100" },
  { name: "Twitter", url: "https://twitter.com/", color: "hover:text-sky-400" },
];

export default function Socials() {
  return (
    <section className="py-12 flex justify-center">
      <div className="flex gap-8 bg-gray-900/80 backdrop-blur-md px-10 py-6 rounded-full border border-gray-800 shadow-2xl">
        {socials.map((social) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 text-lg font-medium transition-colors ${social.color}`}
            whileHover={{ scale: 1.2, y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            {social.name}
          </motion.a>
        ))}
      </div>
    </section>
  );
}
