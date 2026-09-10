import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useT, tx, type Lang } from "@/i18n";
import type { Project } from "@/data/projects";
import { otherProfessionalProjects } from "@/data/caseStudies";
import { academicProjects, academicThemes } from "@/data/academicProjects";
import { brandMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";

const matches = (project: Project, query: string) =>
  `${project.title} ${project.category} ${project.technologies.join(" ")}`
    .toLocaleLowerCase()
    .includes(query);

function ProjectRow({
  project,
  lang,
  withMark = false,
}: {
  project: Project;
  lang: Lang;
  withMark?: boolean;
}) {
  const link = project.liveUrl || project.githubUrl;
  const mark = brandMarks[project.title];
  return (
    <details className="archive-row">
      <summary>
        <span className="archive-row-title">
          {/* Gouttière toujours présente : les titres restent alignés même
              quand la mission n'a pas de marque. */}
          {withMark && (
            <span className="archive-row-mark">
              {mark && <BrandMark src={mark} name={project.title} decorative />}
            </span>
          )}
          {project.title}
        </span>
        <span className="eyebrow">{project.category}</span>
      </summary>
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
    </details>
  );
}

export default function ProjectArchive() {
  const { lang } = useT();
  const [query, setQuery] = useState("");
  const needle = query.toLocaleLowerCase().trim();

  const pro = useMemo(
    () => otherProfessionalProjects.filter((p) => matches(p, needle)),
    [needle],
  );
  const groups = useMemo(
    () =>
      academicThemes
        .map((theme) => ({
          theme,
          projects: academicProjects.filter(
            (p) => p.theme === theme.key && matches(p, needle),
          ),
        }))
        .filter((group) => group.projects.length > 0),
    [needle],
  );
  const academicCount = groups.reduce((n, g) => n + g.projects.length, 0);

  return (
    <div className="archive-content">
      <label className="archive-search">
        {lang === "fr"
          ? "Rechercher un projet ou une technologie"
          : "Search projects or technologies"}
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="React, Python, Shopify…"
        />
      </label>
      <p className="eyebrow archive-count" role="status">
        {pro.length + academicCount} {lang === "fr" ? "projets" : "projects"}
      </p>

      {/* Deux ensembles clairement séparés : le contexte change la lecture. */}
      <section className="archive-group">
        <h3>
          {lang === "fr"
            ? "Autres missions professionnelles"
            : "Other professional work"}
          <span className="eyebrow">
            {pro.length}{" "}
            {lang === "fr"
              ? "projets · hors études de cas ci-dessus"
              : "projects · beyond the case studies above"}
          </span>
        </h3>
        {pro.length === 0 ? (
          <p className="archive-empty">
            {lang === "fr" ? "Aucun résultat." : "No results."}
          </p>
        ) : (
          pro.map((project) => (
            <ProjectRow
              key={project.title}
              project={project}
              lang={lang}
              withMark
            />
          ))
        )}
      </section>

      <section className="archive-group archive-academic">
        <h3>
          {lang === "fr" ? "Projets académiques" : "Academic projects"}
          <span className="eyebrow">
            {academicCount}{" "}
            {lang === "fr"
              ? "projets · Licence Informatique, IT-University"
              : "projects · Computer Science degree, IT-University"}
          </span>
        </h3>
        {groups.length === 0 ? (
          <p className="archive-empty">
            {lang === "fr" ? "Aucun résultat." : "No results."}
          </p>
        ) : (
          groups.map(({ theme, projects }) => (
            <article className="theme-block" key={theme.key}>
              <h4>
                {tx(theme.label, lang)}
                <span className="eyebrow">
                  {projects.length} {lang === "fr" ? "projets" : "projects"}
                </span>
              </h4>
              <p className="theme-goal">{tx(theme.goal, lang)}</p>
              <p className="theme-learned">{tx(theme.learned, lang)}</p>
              <div className="theme-projects">
                {projects.map((project) => (
                  <ProjectRow
                    key={project.title}
                    project={project}
                    lang={lang}
                  />
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
