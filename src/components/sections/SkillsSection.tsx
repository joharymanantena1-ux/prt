import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Marquee from "@/components/motion/Marquee";
import { useT, tx, type Bi } from "@/i18n";
import { techIcons } from "@/data/techIcons";

// Flat tech list for the scrolling ticker at the bottom of the section.
const MARQUEE_TECH = [
  "React", "TypeScript", "Node.js", "React Native", "Laravel", "Spring Boot",
  "Python", "Vue.js", "Angular", "Symfony", "Django", "Flutter",
  "MySQL", "PostgreSQL", "Docker", "GraphQL", "Tailwind CSS", "AWS",
];

interface Skill {
  name: string;
  /** Key into techIcons (simple-icons path), or null to use `fallback`. */
  slug: string | null;
  fallback?: string;
}

interface Category {
  title: Bi;
  skills: Skill[];
}

const categories: Category[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React / Next.js", slug: "siReact" },
      { name: "TypeScript",      slug: "siTypescript" },
      { name: "JavaScript",      slug: "siJavascript" },
      { name: "Angular",         slug: "siAngular" },
      { name: "Vue.js",          slug: "siVuedotjs" },
      { name: "Tailwind CSS",    slug: "siTailwindcss" },
      { name: "Bootstrap",       slug: "siBootstrap" },
      { name: "React Native",    slug: "siReact" },
      { name: "Flutter",         slug: "siFlutter" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "PHP / Laravel",   slug: "siLaravel" },
      { name: "Symfony",         slug: "siSymfony" },
      { name: "CodeIgniter",     slug: "siCodeigniter" },
      { name: "Django",          slug: "siDjango" },
      { name: "Java / Spring",   slug: "siSpring" },
      { name: "Node.js",         slug: "siNodedotjs" },
      { name: "Python",          slug: "siPython" },
      { name: "C",               slug: "siC" },
      { name: "C# / ASP.NET",    slug: null, fallback: "C#" },
      { name: "C++",             slug: "siCplusplus" },
    ],
  },
  {
    title: { fr: "Bases de données", en: "Databases" },
    skills: [
      { name: "MySQL",           slug: "siMysql" },
      { name: "PostgreSQL",      slug: "siPostgresql" },
      { name: "Oracle",          slug: null, fallback: "Ora" },
      { name: "Firebase",        slug: "siFirebase" },
      { name: "PostGIS",         slug: null, fallback: "GIS" },
    ],
  },
  {
    title: { fr: "DevOps & Outils", en: "DevOps & Tools" },
    skills: [
      { name: "Git / GitHub",    slug: "siGit" },
      { name: "Docker",          slug: "siDocker" },
      { name: "Linux",           slug: "siLinux" },
      { name: "API REST",        slug: null, fallback: "REST" },
      { name: "n8n",             slug: "siN8n" },
    ],
  },
];

const softSkills: Bi[] = [
  { fr: "Analyse des besoins", en: "Requirements analysis" },
  { fr: "Architecture logicielle", en: "Software architecture" },
  { fr: "Travail en équipe", en: "Teamwork" },
  { fr: "Résolution de problèmes", en: "Problem solving" },
  { fr: "Autonomie", en: "Autonomy" },
  { fr: "Adaptabilité", en: "Adaptability" },
  "Communication",
  { fr: "Rigueur", en: "Rigour" },
];

// Brand glyph (simple-icons path) — keeps the official brand colour. Near-black
// marks (Angular, Symfony…) fall back to currentColor so they stay visible in dark mode.
const TechIcon = ({ slug }: { slug: string }) => {
  const icon = techIcons[slug];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 flex-shrink-0"
      fill={icon.adaptive ? "currentColor" : `#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
};

const TechChip = ({ skill }: { skill: Skill }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 border border-border/40 hover:border-primary/40 hover:bg-secondary transition-colors duration-200 group cursor-default">
    {skill.slug && techIcons[skill.slug] ? (
      <span className="text-foreground/70 group-hover:text-primary transition-colors">
        <TechIcon slug={skill.slug} />
      </span>
    ) : (
      <span
        aria-hidden="true"
        className="w-6 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground bg-muted rounded flex-shrink-0"
      >
        {skill.fallback?.slice(0, 4)}
      </span>
    )}
    <span className="text-sm font-medium leading-none">{skill.name}</span>
  </div>
);

const EASE = [0.22, 1, 0.36, 1] as const;

/* Rangée de la table : intitulé + index à gauche, chips à droite. */
const CategoryRow = ({ category, index }: { category: Category; index: number }) => {
  const reduce = useReducedMotion();
  const { lang } = useT();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay: index * 0.05, ease: EASE }}
      className="group grid gap-y-4 lg:grid-cols-12 lg:gap-x-10 border-t border-border py-7 lg:py-9 transition-colors duration-300 hover:border-primary/50"
    >
      <div className="lg:col-span-3 flex lg:flex-col items-baseline lg:items-start justify-between lg:justify-start gap-2">
        <h3 className="font-display font-semibold text-lg lg:text-xl tracking-tight leading-tight">
          {tx(category.title, lang)}
        </h3>
        <span className="font-mono text-[11px] text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary">
          {String(index + 1).padStart(2, "0")} · {String(category.skills.length).padStart(2, "0")}
        </span>
      </div>

      <div className="lg:col-span-9 flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <TechChip key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Compétences — table suisse : chaque catégorie est une rangée pleine largeur
 * sur filet hairline (intitulé à gauche, technologies à droite). Les soft
 * skills ferment la table en liste inline ponctuée — pas de nuage de badges.
 */
const SkillsSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();
  return (
    <section className="section-container">
      <div className="section-content">
        <SectionHeading
          index="03"
          label={t("skills.label")}
          title={t("skills.title")}
          description={t("skills.desc")}
          className="mb-10 md:mb-14"
        />

        <div>
          {categories.map((category, index) => (
            <CategoryRow key={tx(category.title, lang)} category={category} index={index} />
          ))}

          {/* Soft skills — dernière rangée de la même table */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.2, ease: EASE }}
            className="grid gap-y-4 lg:grid-cols-12 lg:gap-x-10 border-y border-border py-7 lg:py-9"
          >
            <div className="lg:col-span-3">
              <h3 className="font-display font-semibold text-lg lg:text-xl tracking-tight leading-tight">
                {t("skills.soft")}
              </h3>
            </div>
            <ul className="lg:col-span-9 flex flex-wrap items-baseline gap-y-2.5 text-[0.95rem] font-medium leading-snug">
              {softSkills.map((label, index) => (
                <li key={tx(label, lang)} className="flex items-baseline">
                  {index > 0 && (
                    <span aria-hidden="true" className="mx-3 text-muted-foreground/50 select-none">·</span>
                  )}
                  {tx(label, lang)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Tech ticker — seamless scrolling strip */}
        <Marquee items={MARQUEE_TECH} speed={34} className="mt-12 md:mt-16 py-4 border-y border-border/50" />
      </div>
    </section>
  );
};

export default SkillsSection;
