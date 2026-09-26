import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useT, tx } from "@/i18n";
import type { Project } from "@/data/projects";
import {
  academicProjects,
  academicThemes,
  type AcademicTheme,
} from "@/data/academicProjects";
import Modal from "@/components/Modal";

const matches = (project: Project, query: string) =>
  `${project.title} ${project.category} ${project.technologies.join(" ")}`
    .toLocaleLowerCase()
    .includes(query);

/**
 * Les 31 projets de formation, hors du flux de la page : filtre par famille,
 * recherche libre, et chaque famille garde son objectif pédagogique et son
 * acquis — c'est le contexte qui rend la liste lisible.
 */
export default function AcademicModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useT();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<AcademicTheme | "all">("all");
  const needle = query.toLocaleLowerCase().trim();

  const groups = useMemo(
    () =>
      academicThemes
        .filter((t) => theme === "all" || t.key === theme)
        .map((t) => ({
          theme: t,
          projects: academicProjects.filter(
            (p) => p.theme === t.key && matches(p, needle),
          ),
        }))
        .filter((group) => group.projects.length > 0),
    [needle, theme],
  );
  const shown = groups.reduce((n, g) => n + g.projects.length, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="modal-academic"
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
      <div className="academic-filters">
        <label className="mission-search">
          <span className="sr-only">
            {lang === "fr"
              ? "Rechercher un projet ou une technologie"
              : "Search projects or technologies"}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              lang === "fr"
                ? "Rechercher : Java, Python…"
                : "Search: Java, Python…"
            }
          />
        </label>
        <div
          className="filter-chips"
          role="group"
          aria-label={lang === "fr" ? "Filtrer par famille" : "Filter by theme"}
        >
          <button
            type="button"
            aria-pressed={theme === "all"}
            onClick={() => setTheme("all")}
          >
            {lang === "fr" ? "Toutes" : "All"}
          </button>
          {academicThemes.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={theme === t.key}
              onClick={() => setTheme(t.key)}
            >
              {tx(t.short, lang)}
            </button>
          ))}
        </div>
        <p className="eyebrow archive-count" role="status">
          {shown} {lang === "fr" ? "projets" : "projects"}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="archive-empty">
          {lang === "fr" ? "Aucun résultat." : "No results."}
        </p>
      ) : (
        groups.map(({ theme: t, projects }) => (
          <article className="theme-block" key={t.key}>
            <h4>
              {tx(t.label, lang)}
              <span className="eyebrow">
                {projects.length} {lang === "fr" ? "projets" : "projects"}
              </span>
            </h4>
            <p className="theme-goal">{tx(t.goal, lang)}</p>
            <p className="theme-learned">{tx(t.learned, lang)}</p>
            <div className="theme-projects">
              {projects.map((project) => (
                <details className="archive-row" key={project.title}>
                  <summary>
                    <span className="archive-row-title">{project.title}</span>
                    <span className="eyebrow">{project.category}</span>
                  </summary>
                  <p>{tx(project.description, lang)}</p>
                  <p className="eyebrow">{project.technologies.join(" · ")}</p>
                  {project.githubUrl && (
                    <a
                      className="text-link"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                      <ArrowUpRight size={16} />
                      <span className="sr-only"> — {project.title}</span>
                    </a>
                  )}
                </details>
              ))}
            </div>
          </article>
        ))
      )}
    </Modal>
  );
}
