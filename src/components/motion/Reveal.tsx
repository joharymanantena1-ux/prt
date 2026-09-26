import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * One reveal per block — opacity + translate only, driven by CSS transitions and
 * a single IntersectionObserver (no animation library on the critical path).
 * Reduced motion (or a browser without IO) shows the content immediately.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  at = 6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Déclenche quand le bloc dépasse `at` % du bas de l'écran. 6 % : dès
   *  qu'il entre. Plus haut (25–30 %) pour une séquence qu'il faut voir se
   *  jouer — sinon elle se déroule au ras du bord inférieur, sans témoin. */
  at?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-revealed", "true");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: `0px 0px -${at}% 0px`, threshold: 0.02 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [at]);
  return (
    <div
      ref={ref}
      data-revealed="false"
      className={`reveal ${className}`.trim()}
      style={
        delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
