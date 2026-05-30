import { useReducedMotion } from "framer-motion";

/**
 * Shared, reduced-motion-aware Framer Motion presets.
 *
 * When the user has `prefers-reduced-motion: reduce`, every preset collapses to
 * an instant opacity-only state (no transform, zero duration), satisfying WCAG 2.3.3.
 * Pairs with the global CSS catch-all in `index.css`.
 *
 * Usage:
 *   const { reduce, fadeUp, enter, pop } = useMotionPreset();
 *   <motion.div {...fadeUp}>…</motion.div>
 *   <motion.div {...enter(-40, 0, 0.2)}>…</motion.div>   // slide-in from x:-40, delay 0.2s
 */
export const useMotionPreset = () => {
  const reduce = useReducedMotion();

  // Simple fade-up entrance (whileInView)
  const fadeUp = reduce
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.5, ease: "easeOut" },
      };

  // Parameterised directional entrance
  const enter = (x = 0, y = 0, delay = 0) =>
    reduce
      ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, x, y },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.55, ease: "easeOut", delay },
        };

  // Pop (success card) — no scale when reduced
  const pop = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  return { reduce, fadeUp, enter, pop };
};
