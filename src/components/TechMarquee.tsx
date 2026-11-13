import { useEffect, useRef, type CSSProperties } from "react";
import { useT } from "@/i18n";
import { techStack } from "@/data/techStack";
import sprite from "@/assets/tech/tech-logos.svg";

/* Vitesse de défilement, en pixels par seconde : lente, pour qu'on lise les
   noms au passage. */
const SPEED = 38;

/** Une suite de logos. La seconde, identique, ne sert qu'à boucler sans
 *  saut : elle est masquée aux lecteurs d'écran. */
function Logos({ copy = false }: { copy?: boolean }) {
  return (
    <ul className="marquee-list" aria-hidden={copy || undefined}>
      {techStack.map((tech) => (
        <li
          key={tech.key}
          className={`marquee-item${tech.wordmark ? " is-wordmark" : ""}`}
          style={{ "--size": tech.size } as CSSProperties}
        >
          {/* Le nom est donné par le texte à côté (ou, pour un mot-symbole,
              par le texte masqué) : le logo lui-même est décoratif. */}
          <svg
            className="marquee-logo"
            viewBox={`0 0 ${tech.ratio * 100} 100`}
            aria-hidden="true"
            focusable="false"
          >
            <use href={`${sprite}#${tech.symbol}`} width="100%" height="100%" />
          </svg>
          <span className={tech.wordmark ? "sr-only" : "marquee-name"}>
            {tech.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Les technologies employées dans les projets, en bandeau qui défile en
 * boucle (CSS seul : `transform` sur le compositeur). Pause au survol, quand
 * le bandeau sort de l'écran et quand l'onglet est caché ; en mouvement
 * réduit, la liste est statique, sans copie.
 */
export default function TechMarquee() {
  const { lang } = useT();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const list = el?.querySelector<HTMLElement>(".marquee-list");
    if (!el || !list) return;
    // Durée selon la longueur réelle de la suite : vitesse constante, quelle
    // que soit la largeur d'écran ou la taille des logos.
    const sizer = new ResizeObserver(() => {
      el.style.setProperty(
        "--marquee-duration",
        `${(list.offsetWidth / SPEED).toFixed(1)}s`,
      );
    });
    sizer.observe(list);
    // Pause hors écran et onglet caché : rien ne tourne pour rien.
    let visible = true;
    const sync = () =>
      el.toggleAttribute("data-paused", !visible || document.hidden);
    // Plusieurs états peuvent arriver d'un coup (montage hors écran, puis
    // défilement) : seul le dernier compte.
    const seen = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    });
    seen.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      sizer.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={root}
      className="marquee"
      role="region"
      aria-label={
        lang === "fr"
          ? "Technologies utilisées dans mes projets"
          : "Technologies used in my projects"
      }
    >
      <div className="marquee-track">
        <Logos />
        <Logos copy />
      </div>
    </div>
  );
}
