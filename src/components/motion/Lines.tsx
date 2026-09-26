import type { CSSProperties, ReactNode } from "react";

/**
 * Titre composé ligne par ligne, comme celui du hero : chaque ligne monte de
 * derrière son propre masque quand le `Reveal` parent s'ouvre. Déclenché par
 * l'IntersectionObserver du Reveal, donc visible dans tous les navigateurs.
 * L'espace final garde un nom accessible lisible (« Des idées. Du concret. »).
 */
export default function Lines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span
          className="title-line"
          key={index}
          style={{ "--line": index } as CSSProperties}
        >
          <span>
            {line}
            {index < lines.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}
