import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useT, tx } from "@/i18n";
import { caseStudies, caseStudyProject } from "@/data/caseStudies";
import Modal from "@/components/Modal";
import ShowcaseArt from "@/components/ShowcaseArt";

/**
 * La vue détaillée d'une étude de cas : tout ce que la vitrine n'affiche plus —
 * le récit enjeu → contribution → résultat, la stack complète, le lien. On passe
 * d'un projet à l'autre sans refermer, pour inviter à explorer la suite.
 */
export default function CaseStudyModal({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const { lang } = useT();
  const item = index === null ? null : caseStudies[index];
  const project = item ? caseStudyProject(item) : undefined;
  const count = caseStudies.length;
  const root = useRef<HTMLElement>(null);

  /* D'un projet à l'autre : on repart du haut du contenu. Les boutons de
     navigation ne sont pas remontés, le focus clavier reste donc en place. */
  useEffect(() => {
    root.current?.closest(".modal-body")?.scrollTo({ top: 0 });
  }, [index]);
  const previous = index === null ? 0 : (index - 1 + count) % count;
  const next = index === null ? 0 : (index + 1) % count;

  return (
    <Modal
      open={item !== null}
      onClose={onClose}
      className="modal-case"
      title={item ? item.name : ""}
      subtitle={
        item ? `0${(index ?? 0) + 1} · ${tx(item.category, lang)}` : undefined
      }
      closeLabel={
        lang === "fr" ? "Fermer l’étude de cas" : "Close the case study"
      }
    >
      {item && (
        <article className="case-detail" ref={root}>
          {/* Annonce le projet affiché quand on navigue sans refermer. */}
          <p className="sr-only" aria-live="polite">
            {item.name} — {(index ?? 0) + 1} / {count}
          </p>
          {/* Le logo du client est déjà dans la maquette : pas de doublon. */}
          <div className={`case-detail-art theme-${item.key}`} key={item.key}>
            <ShowcaseArt kind={item.key} />
          </div>

          <div className="case-detail-body">
            <p className="case-detail-headline">{tx(item.headline, lang)}</p>
            <dl className="case-story">
              <div>
                <dt>{lang === "fr" ? "L’enjeu" : "The challenge"}</dt>
                <dd>{tx(item.problem, lang)}</dd>
              </div>
              <div>
                <dt>{lang === "fr" ? "Ma contribution" : "My contribution"}</dt>
                <dd>{tx(item.solution, lang)}</dd>
              </div>
              <div>
                <dt>{lang === "fr" ? "Le résultat" : "The result"}</dt>
                <dd>{tx(item.result, lang)}</dd>
              </div>
            </dl>
            {project && (
              <ul
                className="showcase-tags case-detail-stack"
                aria-label={lang === "fr" ? "Technologies" : "Technologies"}
              >
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            )}
            {project?.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="case-detail-link"
              >
                {lang === "fr" ? "Voir le site" : "Visit website"}
                <ArrowUpRight size={18} />
                <span className="sr-only"> — {item.name}</span>
              </a>
            ) : (
              <p className="private-project eyebrow">
                {lang === "fr"
                  ? "Outil interne · Présentation sur demande"
                  : "Internal tool · Walkthrough on request"}
              </p>
            )}
          </div>

          <nav
            className="case-detail-nav"
            aria-label={
              lang === "fr" ? "Autres études de cas" : "Other case studies"
            }
          >
            <button type="button" onClick={() => onNavigate(previous)}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>
                <span className="eyebrow">
                  {lang === "fr" ? "Précédent" : "Previous"}
                </span>
                {caseStudies[previous].name}
              </span>
            </button>
            <button type="button" onClick={() => onNavigate(next)}>
              <span>
                <span className="eyebrow">
                  {lang === "fr" ? "Suivant" : "Next"}
                </span>
                {caseStudies[next].name}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </article>
      )}
    </Modal>
  );
}
