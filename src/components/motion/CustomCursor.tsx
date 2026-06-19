import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Custom cursor: a small dot that tracks the pointer 1:1 plus a spring-lagged
 * ring that grows when hovering interactive elements (a, button, [role=button],
 * inputs). Signature desktop flourish.
 *
 * Perf/UX:
 *  - Fixed, pointer-events-none overlay; transform-only via MotionValues → no reflow.
 *  - Mounts ONLY on devices with a fine pointer (mouse) AND no reduced-motion
 *    preference. Touch users and reduced-motion users get the native cursor.
 *  - One pointermove listener (passive) + delegated hover detection.
 */
const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, .cursor-pointer";

export const CustomCursor = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    // Only on real mouse pointers.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    // Hide the native cursor site-wide while the custom one is active.
    document.documentElement.classList.add("custom-cursor-active");

    // `pointermove` fires dozens of times per second. Moving the dot is free
    // (MotionValue → GPU, no React render), but calling setHovering on every
    // event would re-render the component each frame — even when the value is
    // unchanged. Track the last value and only setState when it actually flips.
    let lastHover = false;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      const next = !!t?.closest(INTERACTIVE);
      if (next !== lastHover) {
        lastHover = next;
        setHovering(next);
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("custom-cursor-active");
    };
    // x and y are stable MotionValues — only `reduce` should re-run this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {/* core dot — tracks 1:1 */}
      <motion.div
        style={{ x, y }}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary"
      />
      {/* lagging ring — grows on hover */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-primary/70"
      />
    </div>
  );
};

export default CustomCursor;
