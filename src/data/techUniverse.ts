import type { Bi } from "@/i18n";
import { professionalProjects } from "./projects";
import { academicProjects } from "./academicProjects";
import { experiences } from "./experience";

/**
 * Données de la constellation « My Tech Universe », calculées à partir des
 * projets et expériences réels du site — rien n'est saisi à la main ici, sauf
 * le rangement des technologies par famille et la fusion des libellés qui
 * désignent la même chose (« ReactJS », « React.js » → React).
 *
 * Une technologie compte une fois par travail qui l'utilise. Les expériences
 * qui racontent un projet déjà listé (Regard Beauty → BeautyBay, Levitation,
 * Konecta) sont fusionnées avec lui : sinon le même travail compterait double.
 * Module importé seulement par la constellation (chargée à la demande).
 */

export type CategoryKey =
  | "languages"
  | "frontend"
  | "mobile"
  | "backend"
  | "databases"
  | "data"
  | "devops"
  | "commerce";

export const categories: {
  key: CategoryKey;
  label: Bi;
  /** Libellé court, pour les filtres. */
  short: Bi;
  color: string;
}[] = [
  {
    key: "frontend",
    label: { fr: "Frontend", en: "Frontend" },
    short: { fr: "Frontend", en: "Frontend" },
    color: "#d2f663",
  },
  {
    key: "backend",
    label: { fr: "Backend & API", en: "Backend & APIs" },
    short: { fr: "Backend", en: "Backend" },
    color: "#8fb6ff",
  },
  {
    key: "languages",
    label: { fr: "Langages", en: "Languages" },
    short: { fr: "Langages", en: "Languages" },
    color: "#efefec",
  },
  {
    key: "mobile",
    label: { fr: "Mobile & desktop", en: "Mobile & desktop" },
    short: { fr: "Mobile", en: "Mobile" },
    color: "#7fd3e6",
  },
  {
    key: "databases",
    label: { fr: "Bases de données", en: "Databases" },
    short: { fr: "BDD", en: "Databases" },
    color: "#f2c46d",
  },
  {
    key: "data",
    label: { fr: "Data & géo", en: "Data & geo" },
    short: { fr: "Data", en: "Data" },
    color: "#e7a3d0",
  },
  {
    key: "devops",
    label: { fr: "DevOps & infra", en: "DevOps & infra" },
    short: { fr: "DevOps", en: "DevOps" },
    color: "#8fe0b3",
  },
  {
    key: "commerce",
    label: { fr: "E-commerce & automatisation", en: "E-commerce & automation" },
    short: { fr: "Commerce", en: "Commerce" },
    color: "#f29e8a",
  },
];

/* Libellés différents pour une même technologie. */
const ALIASES: Record<string, string> = {
  ReactJS: "React",
  "React.js": "React",
  Postgres: "PostgreSQL",
  "API REST": "REST API",
  "HTML/CSS": "HTML & CSS",
  CSS: "HTML & CSS",
  "Java Swing": "Swing",
};

/* Étiquettes génériques portées par certains projets, pas des technologies. */
const IGNORED = new Set(["Cloud", "Algorithmique"]);

const FAMILY: Record<string, CategoryKey> = {
  JavaScript: "languages",
  TypeScript: "languages",
  Python: "languages",
  Java: "languages",
  PHP: "languages",
  "C#": "languages",
  "C++": "languages",
  Dart: "languages",
  Perl: "languages",
  Bash: "languages",
  React: "frontend",
  "Next.js": "frontend",
  "Vue.js": "frontend",
  Angular: "frontend",
  "HTML & CSS": "frontend",
  "Tailwind CSS": "frontend",
  Bootstrap: "frontend",
  Vite: "frontend",
  Karma: "frontend",
  "React Native": "mobile",
  Expo: "mobile",
  Flutter: "mobile",
  Swing: "mobile",
  WinForms: "mobile",
  Tkinter: "mobile",
  "Node.js": "backend",
  "Spring Boot": "backend",
  Laravel: "backend",
  Symfony: "backend",
  Django: "backend",
  CodeIgniter: "backend",
  JavaEE: "backend",
  Servlet: "backend",
  EJB: "backend",
  ASP: "backend",
  "ASP.NET": "backend",
  GraphQL: "backend",
  "REST API": "backend",
  MySQL: "databases",
  PostgreSQL: "databases",
  Oracle: "databases",
  Firebase: "databases",
  PostGIS: "databases",
  Numpy: "data",
  Matplotlib: "data",
  SIG: "data",
  OSRM: "data",
  CSV: "data",
  XML: "data",
  XLSX: "data",
  WAV: "data",
  AWS: "devops",
  Docker: "devops",
  Linux: "devops",
  HAProxy: "devops",
  FTP: "devops",
  Clustering: "devops",
  Réseaux: "devops",
  Shopify: "commerce",
  "Shopify API": "commerce",
  Liquid: "commerce",
  WordPress: "commerce",
  Elementor: "commerce",
  Odoo: "commerce",
  Frappe: "commerce",
  n8n: "commerce",
};

/** Un travail : projet professionnel (éventuellement fusionné avec
 *  l'expérience qui le raconte) ou projet de formation. */
export interface Work {
  title: string;
  kind: "pro" | "academic";
  /** L'expérience fusionnée, quand il y en a une (ex. « Regard Beauty »). */
  via?: string;
  category: string;
}

export interface Tech {
  name: string;
  category: CategoryKey;
  works: Work[];
}

/* Expérience → projet qui raconte le même travail. */
const SAME_WORK: Record<string, string> = {
  "Regard Beauty": "BeautyBay – Web & Mobile",
  Levitation: "Edu Levitation SaaS",
  "Konecta Madagascar": "Transport Interne Konecta",
};

const normalise = (raw: string) => ALIASES[raw] ?? raw;

function build() {
  const byWork = new Map<string, { work: Work; techs: Set<string> }>();
  const add = (work: Work, techs: string[]) => {
    const entry = byWork.get(work.title) ?? { work, techs: new Set<string>() };
    for (const raw of techs) {
      if (IGNORED.has(raw)) continue;
      entry.techs.add(normalise(raw));
    }
    byWork.set(work.title, entry);
  };
  for (const p of professionalProjects)
    add({ title: p.title, kind: "pro", category: p.category }, p.technologies);
  for (const p of academicProjects)
    add(
      { title: p.title, kind: "academic", category: p.category },
      p.technologies,
    );
  for (const e of experiences) {
    const title = SAME_WORK[e.company ?? ""];
    const entry = title ? byWork.get(title) : undefined;
    if (!entry || !e.technologies) continue;
    entry.work.via = e.company;
    for (const raw of e.technologies) entry.techs.add(normalise(raw));
  }

  const techs = new Map<string, Tech>();
  for (const { work, techs: used } of byWork.values()) {
    for (const name of used) {
      const category = FAMILY[name];
      if (!category) continue; // tout nouveau libellé doit être rangé ci-dessus
      const tech = techs.get(name) ?? { name, category, works: [] };
      tech.works.push(work);
      techs.set(name, tech);
    }
  }

  /* Liens : deux technologies utilisées dans un même travail. */
  const links = new Map<string, number>();
  for (const { techs: used } of byWork.values()) {
    const list = [...used].filter((n) => techs.has(n)).sort();
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const key = `${list[i]}|${list[j]}`;
        links.set(key, (links.get(key) ?? 0) + 1);
      }
  }

  return {
    techs: [...techs.values()].sort(
      (a, b) => b.works.length - a.works.length || a.name.localeCompare(b.name),
    ),
    links: [...links.entries()].map(([key, weight]) => {
      const [a, b] = key.split("|");
      return { a, b, weight };
    }),
    works: byWork.size,
  };
}

export const universe = build();
