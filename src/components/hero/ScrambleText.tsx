import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useIntroDone";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·";

/**
 * Un libellé mono qui se décode une fois, de gauche à droite (~0,7 s) : les
 * caractères pas encore résolus tirent un glyphe au hasard. Réservé aux
 * libellés en police mono — la largeur ne bouge pas pendant le décodage.
 * Le texte final est lu par les lecteurs d'écran, jamais le brouillage.
 */
export default function ScrambleText({
  text,
  start,
  delay = 0,
}: {
  text: string;
  start: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = text;
    if (!start || prefersReducedMotion()) return;
    const duration = 700;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now + delay;
      const p = Math.max(0, (now - t0) / duration);
      el.textContent = [...text]
        .map((ch, i) => {
          if (ch === " " || p >= 1) return ch;
          return p > (i / text.length) * 0.85 + 0.15
            ? ch
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        })
        .join("");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, start, delay]);
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
