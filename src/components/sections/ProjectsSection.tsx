import { lazy, Suspense, useState, type CSSProperties } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { useT, tx } from "@/i18n";
import { caseStudies, caseStudyProject } from "@/data/caseStudies";
import { clientMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/motion/Reveal";
import MissionList from "@/components/MissionList";
import Lines from "@/components/motion/Lines";
/* Hors du chemin critique : le portrait du hero (l'élément LCP) attend que le
   bundle principal soit exécuté — illustrations et modales n'ont rien à y faire.
   Les illustrations sont sous la ligne de flottaison ; les modales se chargent
   à la demande (préchargées au survol du bouton). */
const ShowcaseArt = lazy(() => import("@/components/ShowcaseArt"));
const loadCaseModal = () => import("@/components/CaseStudyModal");
const CaseStudyModal = lazy(loadCaseModal);
/* Les 31 projets de formation ne sont chargés qu'à l'ouverture de la modale. */
const AcademicModal = lazy(() => import("@/components/AcademicModal"));

export default function ProjectsSection() {
  const { lang } = useT();
  /* `null` tant que la modale n'a jamais été ouverte : le module reste hors du
     premier chargement. */
  const [archiveOpen, setArchiveOpen] = useState<boolean | null>(null);
  const [caseOpen, setCaseOpen] = useState<number | null>(null);
  /* Monté une fois ouvert, puis gardé : la modale se referme sans se démonter. */
  const [caseEverOpened, setCaseEverOpened] = useState(false);
  if (caseOpen !== null && !caseEverOpened) setCaseEverOpened(true);

  return (
    <section
      id="projets"
      className="work-section section-space"
      aria-labelledby="work-title"
    >
      <div className="shell">
        <Reveal className="section-heading" at={15}>
          <div>
            <p className="eyebrow section-kicker">
              01 / {lang === "fr" ? "Réalisations choisies" : "Selected work"}
            </p>
            <h2 id="work-title">
              <Lines
                lines={
                  lang === "fr"
                    ? ["Des idées.", "Du concret."]
                    : ["Ideas.", "Made real."]
                }
              />
            </h2>
          </div>
          <p>
            {lang === "fr"
              ? "Trois contextes, une même exigence : comprendre le besoin et construire la bonne solution."
              : "Three contexts, one standard: understand the need and build the right solution."}
          </p>
        </Reveal>

        {/* Vitrine : un panneau par étude de cas, peu de texte, l'image d'abord.
            Le récit détaillé vit dans la modale. Sur grand écran les panneaux
            s'empilent au défilement (sticky), voir index.css. */}
        <ol
          className="showcase"
          style={{ "--n": caseStudies.length } as CSSProperties}
        >
          {caseStudies.map((item, index) => {
            const project = caseStudyProject(item);
            return (
              <li
                key={item.key}
                className="showcase-item"
                style={{ "--i": index } as CSSProperties}
              >
                <article
                  className={`showcase-panel theme-${item.key}`}
                  aria-labelledby={`case-${item.key}`}
                >
                  <div className="showcase-info">
                    <p className="showcase-meta eyebrow">
                      <span>0{index + 1}</span>
                      <span>{tx(item.category, lang)}</span>
                    </p>
                    <div className="showcase-title">
                      <h3 id={`case-${item.key}`}>{item.name}</h3>
                      <p className="showcase-headline">
                        {tx(item.headline, lang)}
                      </p>
                    </div>
                    <div className="showcase-foot">
                      {project && (
                        <ul className="showcase-tags">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <li key={tech}>{tech}</li>
                          ))}
                        </ul>
                      )}
                      {/* Un seul élément interactif par panneau : son ::after
                          couvre tout le panneau, le clic n'importe où ouvre. */}
                      <button
                        type="button"
                        className="showcase-open"
                        onClick={() => setCaseOpen(index)}
                        onPointerEnter={loadCaseModal}
                        onFocus={loadCaseModal}
                      >
                        {lang === "fr"
                          ? "Voir l’étude de cas"
                          : "View case study"}
                        <span className="sr-only"> — {item.name}</span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="showcase-media">
                    {/* Même proportion que le SVG : aucun décalage à l'arrivée. */}
                    <Suspense
                      fallback={
                        <div className="showcase-svg" aria-hidden="true" />
                      }
                    >
                      <ShowcaseArt kind={item.key} />
                    </Suspense>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="project-index">
          <p className="eyebrow">
            {lang === "fr"
              ? "Également dans mon parcours"
              : "Also along the way"}
          </p>
          <div className="client-names">
            {clientMarks.map((client) => (
              <BrandMark
                key={client.name}
                src={client.src}
                name={client.name}
              />
            ))}
          </div>
        </div>
        <MissionList />
        {/* La formation quitte le flux de la page : un bouton, puis une modale. */}
        <div className="academic-cta">
          <p>
            {lang === "fr"
              ? "31 projets de formation — Licence Informatique, IT-University."
              : "31 coursework projects — Computer Science degree, IT-University."}
          </p>
          <button
            type="button"
            className="academic-open"
            onClick={() => setArchiveOpen(true)}
          >
            <GraduationCap size={18} aria-hidden="true" />
            {lang === "fr"
              ? "Voir mes projets académiques"
              : "View my academic projects"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </div>
        {archiveOpen !== null && (
          <Suspense fallback={null}>
            <AcademicModal
              open={archiveOpen}
              onClose={() => setArchiveOpen(false)}
            />
          </Suspense>
        )}
      </div>
      {caseEverOpened && (
        <Suspense fallback={null}>
          <CaseStudyModal
            index={caseOpen}
            onClose={() => setCaseOpen(null)}
            onNavigate={setCaseOpen}
          />
        </Suspense>
      )}
    </section>
  );
}
