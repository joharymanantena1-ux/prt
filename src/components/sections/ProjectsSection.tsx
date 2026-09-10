import { lazy, Suspense, useState } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { useT, tx } from "@/i18n";
import { caseStudies, caseStudyProject } from "@/data/caseStudies";
import { brandMarks, clientMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/motion/Reveal";
const ProjectArchive = lazy(() => import("@/components/ProjectArchive"));

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
          {/* La marque réelle en petit : le fichier source (240 px) ne tient pas
              un affichage plein cadre, mais reste net à cette échelle. */}
          <BrandMark
            src={brandMarks["BeautyBay – Web & Mobile"]}
            name="BeautyBay"
            className="visual-mark"
            decorative
          />
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
  const [archiveOpen, setArchiveOpen] = useState(false);
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
            return (
              <Reveal
                key={item.key}
                className={`case-item ${index === 0 ? "case-featured" : ""}`}
              >
                <article>
                  <ProjectVisual kind={item.key} />
                  <div className="case-content">
                    <div className="case-meta eyebrow">
                      <span>
                        0{index + 1} — {tx(item.category, lang)}
                      </span>
                      <span>{item.name}</span>
                    </div>
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
                        <dt>{lang === "fr" ? "Le résultat" : "The result"}</dt>
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
          <button
            className="archive-toggle"
            aria-expanded={archiveOpen}
            aria-controls="project-archive"
            onClick={() => setArchiveOpen(!archiveOpen)}
          >
            <span>
              {lang === "fr"
                ? "Missions professionnelles et projets académiques"
                : "Professional work and academic projects"}
            </span>
            {archiveOpen ? <ArrowDown size={20} /> : <Plus size={20} />}
          </button>
          <div id="project-archive">
            {archiveOpen && (
              <Suspense
                fallback={
                  <p role="status">
                    {lang === "fr"
                      ? "Chargement des projets…"
                      : "Loading projects…"}
                  </p>
                }
              >
                <ProjectArchive />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
