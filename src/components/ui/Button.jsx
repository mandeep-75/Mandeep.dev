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
      bg-gradient-to-r from-[#00f5d4] to-[#00d4aa] 
      text-[#0a0a0f] 
      font-semibold 
      shadow-[0_0_20px_rgba(0,245,212,0.3)]
      hover:shadow-[0_0_30px_rgba(0,245,212,0.5)]
      border border-transparent
    `,
    secondary: `
      bg-[#1a1a24] 
      text-[#f8f8f2] 
      border border-[rgba(255,255,255,0.1)]
      hover:border-[rgba(255,255,255,0.2)]
      hover:bg-[#22222e]
    `,
    outline: `
      bg-transparent 
      text-[#00f5d4] 
      border border-[#00f5d4]/50
      hover:bg-[#00f5d4]/10
      hover:border-[#00f5d4]
    `,
    ghost: `
      bg-transparent 
      text-[#a0a0b0] 
      border border-transparent
      hover:text-[#f8f8f2]
      hover:bg-[#1a1a24]
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
