import { lazy, Suspense, useState } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { useT, tx } from "@/i18n";
import { caseStudies, caseStudyProject } from "@/data/caseStudies";
import { brandMarks, clientMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/motion/Reveal";
import MissionList from "@/components/MissionList";
/* Les 31 projets de formation ne sont chargés qu'à l'ouverture de la modale. */
const AcademicModal = lazy(() => import("@/components/AcademicModal"));

function ProjectVisual({ kind }: { kind: string }) {
  return (
    <div className={`project-visual visual-${kind}`} aria-hidden="true">
      <span className="visual-label eyebrow">
        {kind === "beauty"
          ? "Digital commerce"
          : kind === "edu"
            ? "Connected education"
            : "People in motion"}
      </span>
      {kind === "beauty" ? (
        <>
          <div className="beauty-word">
            BEAUTY
            <br />
            <span>BAY</span>
            <span className="beauty-asterisk">✳</span>
          </div>
          <div className="visual-platforms">
            <span>Web</span>
            <span className="platform-line" />
            <span>API</span>
            <span className="platform-line" />
            <span>Mobile</span>
          </div>
        </>
      ) : kind === "edu" ? (
        <>
          <div className="edu-symbol">
            <span />
            <span />
            <span />
          </div>
          <span className="visual-word">
            levitation<span>edu.</span>
          </span>
        </>
      ) : (
        <>
          <svg className="route-art" viewBox="0 0 600 310" fill="none">
            <path
              className="route-grid"
              d="M0 60H600M0 150H600M0 240H600M90 0V310M230 0V310M370 0V310M510 0V310"
            />
            <path
              className="route-path"
              d="M80 230H205Q230 230 230 205V90Q230 65 255 65H470Q510 65 510 105V150"
            />
            <circle cx="80" cy="230" r="9" />
            <circle cx="510" cy="150" r="9" />
            <circle cx="230" cy="150" r="6" />
          </svg>
          <span className="visual-word visual-word-mark">
            <BrandMark
              src={brandMarks["Transport Interne Konecta"]}
              name="Konecta"
              decorative
            />
            <span>→</span>
          </span>
        </>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const { lang } = useT();
  /* `null` tant que la modale n'a jamais été ouverte : le module reste hors du
     premier chargement. */
  const [archiveOpen, setArchiveOpen] = useState<boolean | null>(null);
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
        <div className="case-grid">
          {caseStudies.map((item, index) => {
            const project = caseStudyProject(item);
            const mark = brandMarks[item.projectTitle];
            return (
              <Reveal key={item.key} className="case-item">
                <article>
                  {/* Rail de tête : l'index donne l'ancrage géométrique, la
                      catégorie le contexte, la marque l'identité du client. */}
                  <header className="case-head">
                    <span className="case-index" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="eyebrow case-category">
                      {tx(item.category, lang)}
                    </span>
                    {mark ? (
                      <BrandMark
                        src={mark}
                        name={item.name}
                        className="case-mark"
                      />
                    ) : (
                      <span className="eyebrow">{item.name}</span>
                    )}
                  </header>
                  <div className="case-body">
                    <figure className="case-figure">
                      <ProjectVisual kind={item.key} />
                    </figure>
                    <div className="case-content">
                      <h3>{tx(item.headline, lang)}</h3>
                      <dl className="case-story">
                        <div>
                          <dt>{lang === "fr" ? "L’enjeu" : "The challenge"}</dt>
                          <dd>{tx(item.problem, lang)}</dd>
                        </div>
                        <div>
                          <dt>
                            {lang === "fr"
                              ? "Ma contribution"
                              : "My contribution"}
                          </dt>
                          <dd>{tx(item.solution, lang)}</dd>
                        </div>
                        <div>
                          <dt>
                            {lang === "fr" ? "Le résultat" : "The result"}
                          </dt>
                          <dd>{tx(item.result, lang)}</dd>
                        </div>
                      </dl>
                      {project && (
                        <p className="case-stack eyebrow">
                          {project.technologies.join(" / ")}
                        </p>
                      )}
                      {project?.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link"
                        >
                          {lang === "fr" ? "Voir le site" : "Visit website"}
                          <ArrowUpRight size={17} />
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
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
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
    </section>
  );
}
