import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Petit label sans-serif au-dessus du titre, ex. "À propos". */
  label?: string;
  /** Titre de section (révélé par masque au scroll). */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * En-tête de section éditorial : label discret + grand titre sérif
 * révélé par masque quand il entre dans le viewport.
 */
const SectionHeading = ({
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
      {label && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.4 }}
          className="kicker !text-primary mb-2"
        >
          {label}
        </motion.p>
      )}

      <div className="overflow-hidden pb-1">
        <motion.h2
          initial={reduce ? false : { y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          className="font-display font-semibold text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.06] [text-wrap:balance]"
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
          className={`text-base sm:text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
