import { lazy, Suspense, useState, type CSSProperties } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { useT, tx } from "@/i18n";
import { caseStudies, caseStudyProject } from "@/data/caseStudies";
import { clientMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/motion/Reveal";
import MissionList from "@/components/MissionList";
import ShowcaseArt from "@/components/ShowcaseArt";
import CaseStudyModal from "@/components/CaseStudyModal";
/* Les 31 projets de formation ne sont chargés qu'à l'ouverture de la modale. */
const AcademicModal = lazy(() => import("@/components/AcademicModal"));

export default function ProjectsSection() {
  const { lang } = useT();
  /* `null` tant que la modale n'a jamais été ouverte : le module reste hors du
     premier chargement. */
  const [archiveOpen, setArchiveOpen] = useState<boolean | null>(null);
  const [caseOpen, setCaseOpen] = useState<number | null>(null);

  return (
    <section
      id="projets"
      className="work-section section-space"
      aria-labelledby="work-title"
    >
      <div className="shell">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow section-kicker">
              01 / {lang === "fr" ? "Réalisations choisies" : "Selected work"}
            </p>
            <h2 id="work-title">
              {lang === "fr" ? (
                <>
                  Des idées.
                  <br />
                  Du concret.
                </>
              ) : (
                <>
                  Ideas.
                  <br />
                  Made real.
                </>
              )}
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
                    <ShowcaseArt kind={item.key} />
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
      <CaseStudyModal
        index={caseOpen}
        onClose={() => setCaseOpen(null)}
        onNavigate={setCaseOpen}
      />
    </section>
  );
}
