import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useT, tx } from "@/i18n";
import type { Project } from "@/data/projects";
import { otherProfessionalProjects } from "@/data/caseStudies";
import { brandMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";

const matches = (project: Project, query: string) =>
  `${project.title} ${project.category} ${project.technologies.join(" ")}`
    .toLocaleLowerCase()
    .includes(query);

/**
 * Liste compacte des missions qui ne sont pas racontées en étude de cas :
 * une ligne par mission, le détail au clic. Le <details> natif porte
 * l'interaction — clavier et lecteurs d'écran fonctionnent sans code en plus.
 */
export default function MissionList() {
  const { lang } = useT();
  const [query, setQuery] = useState("");
  const needle = query.toLocaleLowerCase().trim();
  const missions = useMemo(
    () => otherProfessionalProjects.filter((p) => matches(p, needle)),
    [needle],
  );

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
        <div className="mission-rows">
          {missions.map((project) => {
            const mark = brandMarks[project.title];
            const link = project.liveUrl || project.githubUrl;
            return (
              <details className="mission-row" key={project.title}>
                <summary>
                  {/* Gouttière toujours rendue : les titres restent alignés
                      même quand la mission n'a pas de marque. */}
                  <span className="mission-mark">
                    {mark && (
                      <BrandMark src={mark} name={project.title} decorative />
                    )}
                  </span>
                  <span className="mission-title">{project.title}</span>
                  <span className="eyebrow mission-category">
                    {project.category}
                  </span>
                </summary>
                <div className="mission-detail">
                  <p>{tx(project.description, lang)}</p>
                  <p className="eyebrow">{project.technologies.join(" · ")}</p>
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
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}
