import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Two-digit index, e.g. "01". */
  index: string;
  /** Mono kicker label, e.g. "À propos". */
  label: string;
  /** Section title (clip-revealed on scroll). */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Swiss-tech section header: numbered mono kicker + clip-revealed title.
 * The title slides up from behind a mask when it enters the viewport.
 */
const SectionHeading = ({
  index,
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) => {
  const reduce = useReducedMotion();
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center mx-auto" : ""} ${className}`}>
      <motion.span
        initial={reduce ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reduce ? { duration: 0 } : { duration: 0.4 }}
        className={`kicker !text-primary inline-flex items-center gap-2 ${centered ? "justify-center" : ""}`}
      >
        {/* Séquence : numéro → ligne qui s'étend → label légèrement après */}
        <span>{index}</span>
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15, ease: EASE }}
          className="h-px w-6 bg-primary/50 origin-left"
        />
        <motion.span
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, delay: 0.3 }}
        >
          {label}
        </motion.span>
      </motion.span>

      <div className="overflow-hidden mt-2 pb-1">
        <motion.h2
          initial={reduce ? false : { y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-[1.05] [text-wrap:balance]"
        >
          {title}
        </motion.h2>
      </div>

      {description && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15 }}
          className={`text-base text-muted-foreground mt-3 max-w-xl ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
