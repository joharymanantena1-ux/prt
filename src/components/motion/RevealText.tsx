import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals a string word-by-word: each word rises from behind a clip mask in a
 * staggered cascade when it scrolls into view.
 *
 * Perf/UX:
 *  - transform-only (translateY) inside `overflow-hidden` masks → no reflow.
 *  - One `whileInView` per word, `once: true` → fires a single time, then idle.
 *  - Under `prefers-reduced-motion` the text renders instantly, no transforms.
 *
 * Usage:
 *   <RevealText text="Développeur Full-Stack" as="h1" className="text-5xl" />
 */
export const RevealText = ({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.06,
  trigger = "inView",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  // "inView" → reveal on scroll-in (default). "mount" → reveal immediately
  // (use for above-the-fold content like the hero, already visible at load).
  trigger?: "inView" | "mount";
}) => {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const reveal =
    trigger === "mount"
      ? { animate: { y: 0 } }
      : { whileInView: { y: 0 }, viewport: { once: true, margin: "-40px" } };

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            {...reveal}
            transition={{ duration: 0.55, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      )) as ReactNode}
    </Tag>
  );
};

export default RevealText;
