import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [clicks, setClicks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const clickInProgress = useRef(false);

  // Smooth spring physics
  const springConfig = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Transform for orb pulsing
  const pulseScale = useTransform(
    springX,
    [0, typeof window !== "undefined" ? window.innerWidth : 1920],
    [0.95, 1.05]
  );

  // Follow mouse
  useEffect(() => {
    let rafId;
    const move = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      });
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY]);

  // Handle cursor visibility
  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Click ripple effect
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (clickInProgress.current) return;
      clickInProgress.current = true;

      const id = Date.now();
      setClicks((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
        },
      ]);

      // Auto-cleanup
      setTimeout(() => {
        setClicks((prev) => prev.filter((click) => click.id !== id));
      }, 800); // Shorter duration for smaller ripple
    };

    const handleMouseUp = () => {
      clickInProgress.current = false;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Hide default cursor
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * { 
        cursor: none !important; 
      }
      @media (pointer: coarse) {
        * {
          cursor: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Consistent orb gradient (no color change)
  const orbGradient =
    "radial-gradient(circle at 30% 30%, #22d3ee 0%, #3b82f6 40%, #9333ea 80%, #ec4899 100%)";

  return (
    <>
      {/* Main Cursor Orb - Consistent Color */}
      <motion.div
        className="fixed z-[9999] pointer-events-none rounded-full 
                   -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          x: springX,
          y: springY,
          scale: pulseScale,
          width: 16, // Consistent size
          height: 16, // Consistent size
          background: orbGradient,
          boxShadow:
            "0 0 25px 8px rgba(59,130,246,0.6), inset 0 0 8px rgba(255,255,255,0.2)",
          opacity: isVisible ? 1 : 0,
          filter: "brightness(1.1) contrast(1.2)",
        }}
        animate={{
          scale: [1, 1.15, 1], // Consistent gentle pulse
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Smaller Ripple Effects */}
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          className="fixed z-[9998] pointer-events-none rounded-full 
                     -translate-x-1/2 -translate-y-1/2"
          initial={{
            scale: 0,
            opacity: 0.8,
            x: click.x,
            y: click.y,
          }}
          animate={{
            scale: 3, // Smaller scale (was 8)
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6, // Shorter duration
            ease: "easeOut",
          }}
          style={{
            width: 60, // Smaller initial size
            height: 60, // Smaller initial size
            background: `
              radial-gradient(
                circle at center,
                rgba(34, 211, 238, 0.5) 0%,
                rgba(59, 130, 246, 0.4) 25%,
                rgba(147, 51, 234, 0.3) 50%,
                rgba(236, 72, 153, 0.2) 75%,
                transparent 90%
              )
            `,
            backdropFilter: "blur(4px) saturate(180%)", // Less blur
            WebkitBackdropFilter: "blur(4px) saturate(180%)",
            mixBlendMode: "screen",
          }}
        />
      ))}
    </>
  );
}
