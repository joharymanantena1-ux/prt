import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { useT, tx } from "@/i18n";
import type { Project } from "@/data/projects";
import { otherProfessionalProjects } from "@/data/caseStudies";
import { brandMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/motion/Reveal";

const matches = (project: Project, query: string) =>
  `${project.title} ${project.category} ${project.technologies.join(" ")}`
    .toLocaleLowerCase()
    .includes(query);

/* Monogramme de repli pour une mission sans marque : « EduContent Mobile
   App » → « EC ». */
const initials = (title: string) =>
  title
    .split(/[\s–-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

const pad = (n: number) => String(n).padStart(2, "0");

/** La marque du client, ou son monogramme quand elle manque. */
function Mark({ project }: { project: Project }) {
  const mark = brandMarks[project.title];
  return mark ? (
    <BrandMark src={mark} name={project.title} decorative />
  ) : (
    <span className="mission-initials" aria-hidden="true">
      {initials(project.title)}
    </span>
  );
}

/**
 * Index des missions qui ne sont pas racontées en étude de cas : un titre par
 * ligne, numéroté, en typographie d'affichage. Au survol (souris), le titre
 * roule vers sa copie à l'accent, les autres lignes s'estompent et un aperçu
 * — la marque du client sur une plaque sombre — suit le curseur. Le détail
 * reste au clic, dans un <details> natif : clavier et lecteurs d'écran
 * fonctionnent sans code en plus.
 */
export default function MissionList() {
  const { lang } = useT();
  const [query, setQuery] = useState("");
  const needle = query.toLocaleLowerCase().trim();
  const missions = useMemo(
    () => otherProfessionalProjects.filter((p) => matches(p, needle)),
    [needle],
  );
  /* Numéro d'origine : il ne change pas quand la recherche filtre. */
  const order = useMemo(
    () => new Map(otherProfessionalProjects.map((p, i) => [p.title, i + 1])),
    [],
  );

  /* L'aperçu suit le curseur avec un léger retard et s'incline selon la
     vitesse. Une seule plaque bouge (celle de la ligne survolée) ; la boucle
     s'arrête dès qu'elle a rejoint le curseur. Souris seulement. */
  const rows = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = rows.current;
    if (
      !list ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let active: HTMLElement | null = null;
    let raf = 0;
    /* Boîte de la liste et taille de l'aperçu lues une fois (à l'entrée, au
       défilement, au redimensionnement), jamais à chaque mouvement : une
       lecture de mise en page par événement forçait un recalcul complet. */
    let box: DOMRect | null = null;
    let size: { w: number; h: number } | null = null;
    const measure = () => {
      box = list.getBoundingClientRect();
    };

    const place = () => {
      if (!active) return;
      const tilt = Math.max(-6, Math.min(6, (target.x - pos.x) * 0.05));
      active.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg)`;
    };
    const tick = () => {
      raf = 0;
      const k = reduce ? 1 : 0.16;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      place();
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.4)
        raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const row = (e.target as Element).closest(".mission-row");
      const preview =
        row && !row.hasAttribute("open")
          ? row.querySelector<HTMLElement>(".mission-preview")
          : null;
      if (!box) measure();
      if (preview) {
        if (!size) size = { w: preview.offsetWidth, h: preview.offsetHeight };
        // À droite du curseur, sans jamais sortir de la liste.
        target.x = Math.min(e.clientX - box.left + 32, box.width - size.w);
        target.y = e.clientY - box.top - size.h / 2;
      }
      if (preview !== active) {
        if (!active) {
          pos.x = target.x;
          pos.y = target.y;
        }
        active?.classList.remove("is-on");
        active = preview;
        active?.classList.add("is-on");
        place();
      }
      if (active && !raf) raf = requestAnimationFrame(tick);
    };
    const forget = () => {
      box = null;
    };
    const onLeave = () => {
      active?.classList.remove("is-on");
      active = null;
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    list.addEventListener("pointerenter", forget);
    window.addEventListener("scroll", forget, { passive: true });
    window.addEventListener("resize", forget);
    // Un détail qui s'ouvre sous le curseur range son aperçu.
    list.addEventListener("toggle", onLeave, true);
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      list.removeEventListener("pointerenter", forget);
      window.removeEventListener("scroll", forget);
      window.removeEventListener("resize", forget);
      list.removeEventListener("toggle", onLeave, true);
    };
  }, []);

  return (
    <section className="mission-list" aria-labelledby="mission-list-title">
      <div className="mission-head">
        <h3 id="mission-list-title">
          {lang === "fr"
            ? "Autres missions professionnelles"
            : "Other professional work"}
        </h3>
        <label className="mission-search">
          <span className="sr-only">
            {lang === "fr"
              ? "Rechercher une mission ou une technologie"
              : "Search missions or technologies"}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              lang === "fr"
                ? "Rechercher : Shopify, Python…"
                : "Search: Shopify, Python…"
            }
          />
        </label>
        <p className="eyebrow mission-count" role="status">
          {missions.length} {lang === "fr" ? "missions" : "missions"}
        </p>
      </div>

      {missions.length === 0 ? (
        <p className="archive-empty">
          {lang === "fr" ? "Aucun résultat." : "No results."}
        </p>
      ) : (
        <Reveal className="mission-reveal" at={10}>
          <div className="mission-rows" ref={rows}>
            {missions.map((project, index) => {
              const link = project.liveUrl || project.githubUrl;
              const n = pad(order.get(project.title) ?? index + 1);
              return (
                <details
                  className="mission-row"
                  key={project.title}
                  style={{ "--i": index } as CSSProperties}
                >
                  <summary>
                    <span className="eyebrow mission-num">{n}</span>
                    {/* Masque : le titre y monte à l'entrée, puis roule vers
                        sa copie à l'accent au survol. */}
                    <span className="mission-title">
                      <span className="mission-title-in">
                        <span className="mission-roll">
                          <span>{project.title}</span>
                          <span aria-hidden="true">{project.title}</span>
                        </span>
                      </span>
                    </span>
                    <span className="eyebrow mission-category">
                      {project.category}
                    </span>
                    {/* Aperçu au survol, hors du flux (souris seulement). */}
                    <span className="mission-preview" aria-hidden="true">
                      <span className="eyebrow mission-preview-num">{n}</span>
                      <span className="mission-mark">
                        <Mark project={project} />
                      </span>
                      <span className="eyebrow mission-preview-meta">
                        {project.technologies.slice(0, 3).join(" · ")}
                      </span>
                    </span>
                  </summary>
                  <div className="mission-detail">
                    <span className="mission-detail-mark" aria-hidden="true">
                      <Mark project={project} />
                    </span>
                    <div>
                      <p>{tx(project.description, lang)}</p>
                      <p className="eyebrow">
                        {project.technologies.join(" · ")}
                      </p>
                      {link && (
                        <a
                          className="text-link"
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.liveUrl
                            ? lang === "fr"
                              ? "Voir le site"
                              : "View website"
                            : "GitHub"}
                          <ArrowUpRight size={16} />
                          <span className="sr-only"> — {project.title}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </Reveal>
      )}
    </section>
  );
}
