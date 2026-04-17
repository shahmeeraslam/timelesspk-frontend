import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const animations = {
  initial: { 
    opacity: 0,
    scale: 0.98, // Very subtle scale-in uses less power than y-axis movement
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4, // Shorter duration feels more responsive
      ease: [0.33, 1, 0.68, 1] // "Ease Out Quart" - Very smooth, low load
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.02, // Subtle scale-out
    transition: {
      duration: 0.3,
      ease: [0.32, 0, 0.67, 0] // "Ease In Quart" - Quick exit
    }
  },
};

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top prevents "stutter" during transition
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      // "will-change" tells the browser to use the GPU for this element
      style={{ willChange: "opacity, transform" }}
      className="w-full min-h-screen bg-[var(--brand-alt)]"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;