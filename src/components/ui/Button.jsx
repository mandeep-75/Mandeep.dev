import { motion } from "framer-motion";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg"
};

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  className = "", 
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: `
      bg-gradient-to-r from-[#c25a3e] to-[#d4895b]
      text-white
      font-semibold
      shadow-[0_4px_16px_rgba(194,90,62,0.25)]
      hover:shadow-[0_6px_24px_rgba(194,90,62,0.35)]
      border border-transparent
    `,
    secondary: `
      bg-[#f5f3ef]
      text-[#2d2a24]
      border border-[rgba(45,42,36,0.1)]
      hover:border-[rgba(45,42,36,0.2)]
      hover:bg-[#f0ede8]
    `,
    outline: `
      bg-transparent
      text-[#c25a3e]
      border border-[rgba(194,90,62,0.4)]
      hover:bg-[rgba(194,90,62,0.06)]
      hover:border-[#c25a3e]
    `,
    ghost: `
      bg-transparent
      text-[#6b6560]
      border border-transparent
      hover:text-[#2d2a24]
      hover:bg-[#f5f3ef]
    `
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        rounded-xl
        font-medium tracking-wide
        transition-all duration-300
        cursor-pointer
        select-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
      
      {/* Shine effect on hover */}
      {!disabled && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}
