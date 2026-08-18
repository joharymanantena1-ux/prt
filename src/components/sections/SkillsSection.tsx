import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Marquee from "@/components/motion/Marquee";
import CodeRain from "@/components/motion/CodeRain";
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

/* Composition typographique des soft skills : les graisses, corps et styles
   alternent selon un motif fixe — pas une suite uniforme de mots. */
const SOFT_STYLE = [
  "font-display text-lg sm:text-xl font-medium text-foreground",
  "text-sm text-muted-foreground",
  "font-display italic text-base text-foreground/90",
  "text-sm font-semibold text-foreground",
  "text-base text-muted-foreground",
  "font-display text-lg font-medium text-foreground",
  "text-sm text-muted-foreground",
  "font-display italic text-base text-foreground/90",
];

// NOTE : la certification (IA générative — Google Cloud Skill Boost) est
// volontairement masquée de la grille pour le moment ; les chaînes i18n
// skills.certTitle / skills.certName restent disponibles pour la réafficher.

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

/* Compteur : monte de 0 à la valeur à la première entrée dans le viewport. */
const CountUp = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return <span ref={ref} className="tabular-nums">{n}</span>;
};

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
 * Compétences — bento : vitrine du stack signature, tuile compteur royale
 * (plan de couleur), fenêtre terminal animée, familles à largeur dérivée du
 * volume, soft skills en composition typographique. Chaque famille de tuile
 * réagit différemment au survol, la grille reste une composition d'ensemble.
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
          {/* ── Tuile vitrine : stack signature (les glyphes s'élèvent un à un) ── */}
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

          {/* ── Tuile compteur — plan royal, la valeur monte à l'entrée ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className="group col-span-1 md:col-span-2 lg:col-span-2 rounded-lg bg-brand text-brand-foreground p-5 sm:p-6 flex flex-col justify-between gap-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-elevated motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <p className="font-display font-semibold leading-none text-[clamp(2.4rem,4vw,3.4rem)] transition-transform duration-300 group-hover:scale-[1.04] origin-left motion-reduce:transform-none">
              <CountUp value={TECH_COUNT} />
            </p>
            <p className="text-sm text-brand-foreground/85 leading-snug">{t("skills.countLabel")}</p>
          </motion.div>

          {/* ── Fenêtre terminal — fragments de code qui remontent (Canvas) ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className="col-span-1 md:col-span-2 lg:col-span-2 rounded-lg border border-border overflow-hidden flex flex-col bg-[hsl(221,36%,8%)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-success/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-2" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[10px] tracking-[0.08em] text-white/35 select-none">~/dev</span>
            </div>
            <CodeRain className="w-full flex-1 min-h-[7rem]" />
          </motion.div>

          {/* ── Familles — largeur dérivée du volume d'items ── */}
          {FAMILIES.map((family) => (
            <motion.div
              key={tx(family.title, lang)}
              custom={nextIndex()}
              variants={tileVariants}
              className={`${TILE} group col-span-2 md:col-span-2 ${
                family.skills.length >= 6 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <p className="kicker mb-4 transition-colors duration-300 group-hover:text-primary">
                {tx(family.title, lang)}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2.5 text-foreground/90">
                {family.skills.map((skill) => (
                  <TechItem key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* ── Soft skills — composition typographique, mots révélés un à un ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-2 md:col-span-2 lg:col-span-2`}
          >
            <p className="kicker mb-4">{t("skills.soft")}</p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 leading-snug">
              {softSkills.map((label, i) => (
                <motion.span
                  key={tx(label, lang)}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.3 + i * 0.06, ease: EASE }}
                  className={`${SOFT_STYLE[i % SOFT_STYLE.length]} transition-colors duration-300 hover:text-primary cursor-default`}
                >
                  {tx(label, lang)}
                </motion.span>
              ))}
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
