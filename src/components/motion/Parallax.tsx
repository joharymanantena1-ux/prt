import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * Subtle scroll parallax: translates its children on the Y axis as the element
 * moves through the viewport, creating depth.
 *
 * Perf/UX:
 *  - transform-only (translateY via a spring-smoothed MotionValue) → no reflow.
 *  - `useScroll` with an element target reads scroll progress passively.
 *  - Disabled under `prefers-reduced-motion` (renders a static wrapper).
 *
 * Usage:  <Parallax speed={40}><img … /></Parallax>
 *   speed = max px of drift across the element's full scroll pass (signed).
 */
export const Parallax = ({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const y = useSpring(yRaw, { stiffness: 80, damping: 20, mass: 0.3 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default Parallax;
