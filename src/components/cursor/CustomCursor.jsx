import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [hidden, setHidden] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the glow
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Hide cursor glow when leaving window
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    document.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY]);

  // Don't render on mobile
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return null;
  }

  return (
    <motion.div
      className={`pointer-events-none fixed left-0 top-0 z-0 inset-0 overflow-hidden ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute bg-blue-500/30 rounded-full blur-[80px]"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 400,
          height: 400,
        }}
      />
    </motion.div>
  );
}
