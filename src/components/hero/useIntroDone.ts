import { useEffect, useState } from "react";

/**
 * Vrai quand l'écran d'accueil (index.html) est parti — ou s'il ne joue pas.
 * Les effets du hero attendent ce moment : lancés dessous, ils joueraient
 * cachés. L'écran retire la classe `intro-active` de <html> en partant.
 */
export function useIntroDone() {
  const root = document.documentElement;
  const [done, setDone] = useState(
    () => !root.classList.contains("intro-active"),
  );
  useEffect(() => {
    if (done) return;
    const observer = new MutationObserver(() => {
      if (!root.classList.contains("intro-active")) setDone(true);
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [done, root]);
  return done;
}

/** Mouvement réduit : aucun effet, la page reste dans son état final. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
