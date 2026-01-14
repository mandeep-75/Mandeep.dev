import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseOver = (e) => {
      const tagName = e.target.tagName.toLowerCase();
      // Check if target is interactive
      if (
        tagName === "button" ||
        tagName === "a" ||
        tagName === "input" ||
        tagName === "textarea" ||
        e.target.closest("button") ||
        e.target.closest("a") || 
        e.target.style.cursor === "pointer"
      ) {
        setLinkHovered(true);
      } else {
        setLinkHovered(false);
      }
    };

    const onMouseOut = () => {
      setLinkHovered(false);
    };
    
    // Hide cursor when leaving window
    document.body.addEventListener("mouseleave", () => setHidden(true));
    document.body.addEventListener("mouseenter", () => setHidden(false));

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid #3b82f6",
      opacity: 1,
    },
    hovered: {
      x: position.x - 24,
      y: position.y - 24,
      height: 48,
      width: 48,
      border: "2px solid #60a5fa",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
    clicked: {
      height: 24,
      width: 24,
      x: position.x - 12,
      y: position.y - 12,
      backgroundColor: "#3b82f6",
    }
  };

  const dotVariants = {
    default: {
      x: position.x - 4,
      y: position.y - 4,
      opacity: 1,
    },
    hovered: {
      x: position.x - 4,
      y: position.y - 4,
      opacity: 0, 
    }
  }

  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return null; // Don't render on mobile
  }

  return (
    <div className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
      <motion.div
        className="rounded-full absolute"
        variants={cursorVariants}
        animate={clicked ? "clicked" : linkHovered ? "hovered" : "default"}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />
      <motion.div 
        className="fixed w-2 h-2 bg-blue-400 rounded-full pointer-events-none z-[9999]"
        variants={dotVariants}
        animate={linkHovered ? "hovered" : "default"}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
