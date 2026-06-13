import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cycles through a list of roles/words, morphing between them with a vertical
 * slide + fade. Sits well next to a name or title.
 *
 * Perf/UX:
 *  - Only the active word is mounted; transform/opacity only → GPU-cheap.
 *  - A single interval (cleared on unmount) drives the cycle.
 *  - Under `prefers-reduced-motion`, shows the first word statically (no cycling).
 *
 * Usage:  <MorphingRoles items={["Full-Stack", "React", "Node.js"]} />
 */
export const MorphingRoles = ({
  items,
  interval = 2200,
  className = "",
}: {
  items: string[];
  interval?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || items.length <= 1) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, items.length, interval]);

  if (reduce) {
    return <span className={className}>{items[0]}</span>;
  }

  return (
    // inline-grid so successive words stack in the same cell (no layout jump)
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default MorphingRoles;
