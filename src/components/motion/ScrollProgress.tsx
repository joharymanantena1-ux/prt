import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin top progress bar that fills with page scroll.
 * Transform-only (scaleX) → GPU-cheap. Decorative, so aria-hidden.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-primary to-accent z-[60]"
    />
  );
};

export default ScrollProgress;
