import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [hidden, setHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation with different configs
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    // Track hover state on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('group');
      
      setIsHovering(!!isInteractive);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY]);

  // Don't render on mobile
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        aria-hidden="true"
        style={{ x: x, y: y, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="w-2 h-2 bg-[#00f5d4] rounded-full"
          animate={{
            scale: isHovering ? 2 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Outer glow ring */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[9998] ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        aria-hidden="true"
        style={{ x: x, y: y, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className={`rounded-full border-2 transition-colors duration-300 ${
            isHovering 
              ? 'border-[#ff006e] shadow-[0_0_20px_rgba(255,0,110,0.5)]' 
              : 'border-[#00f5d4]/30 shadow-[0_0_15px_rgba(0,245,212,0.2)]'
          }`}
          animate={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Large ambient glow */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[9997] ${hidden ? 'opacity-0' : 'opacity-60'} transition-opacity duration-300`}
        aria-hidden="true"
        style={{ x: x, y: y, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#00f5d4]/10 to-[#8338ec]/10 rounded-full blur-[60px]"
          animate={{
            width: isHovering ? 300 : 200,
            height: isHovering ? 300 : 200,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  );
}
