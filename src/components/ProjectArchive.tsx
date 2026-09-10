import { useMemo, useState } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { useT, tx, type Lang } from "@/i18n";
import type { Project } from "@/data/projects";
import { otherProfessionalProjects } from "@/data/caseStudies";
import { academicProjects, academicThemes } from "@/data/academicProjects";
import { brandMarks } from "@/data/brandMarks";
import BrandMark from "@/components/BrandMark";
import Modal from "@/components/Modal";

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
  const [academicQuery, setAcademicQuery] = useState("");
  const [academicOpen, setAcademicOpen] = useState(false);
  const needle = query.toLocaleLowerCase().trim();
  const academicNeedle = academicQuery.toLocaleLowerCase().trim();

  const pro = useMemo(
    () => otherProfessionalProjects.filter((p) => matches(p, needle)),
    [needle],
  );
  /* Aperçu : un thème par ligne, compté sur l'ensemble — c'est un résumé, il ne
     suit pas la recherche des missions. */
  const preview = useMemo(
    () =>
      academicThemes.map((theme) => ({
        theme,
        count: academicProjects.filter((p) => p.theme === theme.key).length,
      })),
    [],
  );
  const groups = useMemo(
    () =>
      academicThemes
        .map((theme) => ({
          theme,
          projects: academicProjects.filter(
            (p) => p.theme === theme.key && matches(p, academicNeedle),
          ),
        }))
        .filter((group) => group.projects.length > 0),
    [academicNeedle],
  );
  const academicShown = groups.reduce((n, g) => n + g.projects.length, 0);

  return (
    <div className="archive-content">
      <section className="archive-group">
        <h3>
          {lang === "fr"
            ? "Autres missions professionnelles"
            : "Other professional work"}
          <span className="eyebrow">
            {otherProfessionalProjects.length}{" "}
            {lang === "fr"
              ? "projets · hors études de cas ci-dessus"
              : "projects · beyond the case studies above"}
          </span>
        </h3>
        <label className="archive-search">
          {lang === "fr"
            ? "Rechercher une mission ou une technologie"
            : "Search missions or technologies"}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Shopify, Python, AWS…"
          />
        </label>
        <p className="eyebrow archive-count" role="status">
          {pro.length} {lang === "fr" ? "missions" : "missions"}
        </p>
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

      {/* Formation : un aperçu par familles, le détail dans une modale — 31
          lignes de titres n'ont pas à peser sur la lecture de la page. */}
      <section className="archive-group archive-academic">
        <h3>
          {lang === "fr" ? "Projets académiques" : "Academic projects"}
          <span className="eyebrow">
            {academicProjects.length}{" "}
            {lang === "fr"
              ? "projets · Licence Informatique, IT-University"
              : "projects · Computer Science degree, IT-University"}
          </span>
        </h3>
        <ul className="academic-preview">
          {preview.map(({ theme, count }) => (
            <li key={theme.key}>
              <span>{tx(theme.label, lang)}</span>
              <span className="eyebrow">
                {count} {lang === "fr" ? "projets" : "projects"}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="academic-open"
          onClick={() => setAcademicOpen(true)}
        >
          <GraduationCap size={18} aria-hidden="true" />
          {lang === "fr"
            ? "Voir les projets académiques"
            : "View the academic projects"}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </section>

      <Modal
        open={academicOpen}
        onClose={() => setAcademicOpen(false)}
        title={lang === "fr" ? "Projets académiques" : "Academic projects"}
        subtitle={
          lang === "fr"
            ? `${academicProjects.length} projets · Licence Informatique, IT-University`
            : `${academicProjects.length} projects · Computer Science degree, IT-University`
        }
        closeLabel={
          lang === "fr"
            ? "Fermer les projets académiques"
            : "Close the academic projects"
        }
      >
        <label className="archive-search">
          {lang === "fr"
            ? "Rechercher un projet ou une technologie"
            : "Search projects or technologies"}
          <input
            type="search"
            value={academicQuery}
            onChange={(event) => setAcademicQuery(event.target.value)}
            placeholder="Java, Python, Flutter…"
          />
        </label>
        <p className="eyebrow archive-count" role="status">
          {academicShown} {lang === "fr" ? "projets" : "projects"}
        </p>
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
      </Modal>
    </div>
  );
}
