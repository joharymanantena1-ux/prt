import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionHeadingProps {
  /** Petit label sans-serif au-dessus du titre, ex. "À propos". */
  label?: string;
  /** Titre de section — string : révélation mot à mot ; sinon rendu tel quel. */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const wordVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: EASE },
  }),
};

/* Ponctuation expressive : « & » en italique royal, « ? » / « ! » en royal —
   la signature typographique des titres, sans toucher au contenu. */
const StyledWord = ({ word }: { word: string }) => {
  if (word === "&") return <span className="font-medium italic text-primary">&amp;</span>;
  if (word === "?" || word === "!") return <span className="text-primary">{word}</span>;
  const m = word.match(/^(.*?)([?!])$/);
  if (m) {
    return (
      <>
        {m[1]}
        <span className="text-primary">{m[2]}</span>
      </>
    );
  }
  return <>{word}</>;
};

/**
 * En-tête de section éditorial : label discret + grand titre sérif dont les
 * mots se révèlent l'un après l'autre derrière un masque.
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

  const words = typeof title === "string" ? title.split(" ") : null;

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

      <motion.h2
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="font-display font-semibold text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.08] [text-wrap:balance]"
      >
        {words
          ? words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
                  <motion.span custom={i} variants={wordVariants} className="inline-block">
                    <StyledWord word={word} />
                  </motion.span>
                </span>
                {i < words.length - 1 && " "}
              </Fragment>
            ))
          : title}
      </motion.h2>

      {description && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.25 }}
          className={`text-base sm:text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
