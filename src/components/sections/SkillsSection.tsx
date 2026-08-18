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
  /** Key into techIcons (simple-icons path); null → rendu typographique. */
  slug: string | null;
}

interface Family {
  title: Bi;
  skills: Skill[];
}

/* ── Données — nombre variable de familles et d'items : la grille s'adapte
   (span dérivé du volume, flow dense pour combler les creux). ───────────── */

const CORE_STACK: Skill[] = [
  { name: "React / Next.js", slug: "siReact" },
  { name: "TypeScript",      slug: "siTypescript" },
  { name: "Node.js",         slug: "siNodedotjs" },
  { name: "React Native",    slug: "siReact" },
  { name: "PHP / Laravel",   slug: "siLaravel" },
  { name: "Java / Spring",   slug: "siSpring" },
];

const FAMILIES: Family[] = [
  {
    title: "Frontend",
    skills: [
      { name: "JavaScript",   slug: "siJavascript" },
      { name: "Angular",      slug: "siAngular" },
      { name: "Vue.js",       slug: "siVuedotjs" },
      { name: "Tailwind CSS", slug: "siTailwindcss" },
      { name: "Bootstrap",    slug: "siBootstrap" },
      { name: "Flutter",      slug: "siFlutter" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Symfony",      slug: "siSymfony" },
      { name: "CodeIgniter",  slug: "siCodeigniter" },
      { name: "Django",       slug: "siDjango" },
      { name: "Python",       slug: "siPython" },
      { name: "C",            slug: "siC" },
      { name: "C# / ASP.NET", slug: null },
      { name: "C++",          slug: "siCplusplus" },
    ],
  },
  {
    title: { fr: "Bases de données", en: "Databases" },
    skills: [
      { name: "MySQL",      slug: "siMysql" },
      { name: "PostgreSQL", slug: "siPostgresql" },
      { name: "Oracle",     slug: null },
      { name: "Firebase",   slug: "siFirebase" },
      { name: "PostGIS",    slug: null },
    ],
  },
  {
    title: { fr: "DevOps & Outils", en: "DevOps & Tools" },
    skills: [
      { name: "Git / GitHub", slug: "siGit" },
      { name: "Docker",       slug: "siDocker" },
      { name: "Linux",        slug: "siLinux" },
      { name: "API REST",     slug: null },
      { name: "n8n",          slug: "siN8n" },
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

const TECH_COUNT = CORE_STACK.length + FAMILIES.reduce((n, f) => n + f.skills.length, 0);

// Brand glyph (simple-icons path) — keeps the official brand colour. Near-black
// marks fall back to currentColor so they stay visible in dark mode.
const TechIcon = ({ slug, className = "w-5 h-5" }: { slug: string; className?: string }) => {
  const icon = techIcons[slug];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} flex-shrink-0`}
      fill={icon.adaptive ? "currentColor" : `#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
};

/* ── Bento ─────────────────────────────────────────────────────────────────
   Tuile de base : surface card sur la bande teintée, lift discret au survol
   (recherche bento 2025 : ~2% de scale/lift max, ombre qui s'adoucit). */
const TILE =
  "rounded-lg border border-border bg-card p-5 sm:p-6 " +
  "transition-[transform,box-shadow,border-color] duration-300 " +
  "hover:-translate-y-1 hover:shadow-elevated hover:border-primary/40 " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const EASE = [0.22, 1, 0.36, 1] as const;

const tileVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE },
  }),
};

/* Item technologie : petit glyphe de marque + nom ; typographie seule quand
   aucun logo fiable n'existe (pas d'icône générique inventée). */
const TechItem = ({ skill }: { skill: Skill }) => (
  <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-none">
    {skill.slug && <TechIcon slug={skill.slug} className="w-4 h-4 opacity-90" />}
    {skill.name}
  </span>
);

/**
 * Compétences — bento grid dynamique : la vitrine du stack signature occupe
 * la grande case, les familles prennent une largeur dérivée de leur volume
 * (dense flow), ponctuées d'une tuile compteur et d'une tuile certification.
 */
const SkillsSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();
  let tileIndex = 0;
  const nextIndex = () => (reduce ? 0 : tileIndex++);

  return (
    <section className="section-container bg-muted/60">
      <div className="section-content max-w-6xl">
        <SectionHeading
          label={t("skills.label")}
          title={t("skills.title")}
          description={t("skills.desc")}
          className="mb-10 md:mb-14"
        />

        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:grid-flow-dense"
        >
          {/* ── Tuile vitrine : stack signature ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-2 md:col-span-4 lg:col-span-4 lg:row-span-2 flex flex-col`}
          >
            <p className="kicker mb-5">{t("skills.coreTitle")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 sm:gap-y-8 my-auto">
              {CORE_STACK.map((skill) => (
                <div key={skill.name} className="group/core flex flex-col gap-2.5">
                  <span className="transition-transform duration-300 group-hover/core:-translate-y-0.5 motion-reduce:transform-none">
                    {skill.slug && <TechIcon slug={skill.slug} className="w-7 h-7" />}
                  </span>
                  <span className="font-semibold text-[0.95rem] leading-tight">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Tuile compteur — calculée depuis les données ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between gap-3`}
          >
            <p className="font-display font-semibold leading-none text-[clamp(2.4rem,4vw,3.4rem)]">
              {TECH_COUNT}
            </p>
            <p className="text-sm text-muted-foreground leading-snug">{t("skills.countLabel")}</p>
          </motion.div>

          {/* ── Tuile certification (donnée réelle du parcours) ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between gap-3`}
          >
            <p className="kicker">{t("skills.certTitle")}</p>
            <div>
              <p className="font-display font-semibold text-lg sm:text-xl leading-snug">
                {t("skills.certName")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Google Cloud Skill Boost</p>
            </div>
          </motion.div>

          {/* ── Familles — largeur dérivée du volume d'items ── */}
          {FAMILIES.map((family) => (
            <motion.div
              key={tx(family.title, lang)}
              custom={nextIndex()}
              variants={tileVariants}
              className={`${TILE} col-span-2 md:col-span-2 ${
                family.skills.length >= 6 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <p className="kicker mb-4">{tx(family.title, lang)}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2.5 text-foreground/90">
                {family.skills.map((skill) => (
                  <TechItem key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* ── Soft skills ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-2 md:col-span-2 lg:col-span-2`}
          >
            <p className="kicker mb-4">{t("skills.soft")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {softSkills.map((label) => tx(label, lang)).join(" · ")}
            </p>
          </motion.div>
        </motion.div>

        {/* Tech ticker — seamless scrolling strip */}
        <Marquee items={MARQUEE_TECH} speed={34} className="mt-10 md:mt-12 py-4 border-y border-border/60" />
      </div>
    </section>
  );
};

export default SkillsSection;
