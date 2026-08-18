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
  "font-display text-xl sm:text-2xl font-medium text-foreground",
  "text-sm sm:text-base text-muted-foreground",
  "font-display italic text-lg sm:text-xl text-foreground/90",
  "text-sm sm:text-base font-semibold text-foreground",
  "text-base sm:text-lg text-muted-foreground",
  "font-display text-lg sm:text-xl font-medium text-foreground",
  "text-sm sm:text-base text-muted-foreground",
  "font-display italic text-lg sm:text-xl text-foreground/90",
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

/* Mots des soft skills — apparition décalée après la tuile qui les porte. */
const softVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.45 + i * 0.06, ease: EASE },
  }),
};

/* Item technologie : glyphe de marque + nom, alignés en colonnes. Les entrées
   sans logo fiable réservent la même gouttière pour rester alignées (pas
   d'icône générique inventée). */
const TechItem = ({ skill }: { skill: Skill }) => (
  <span className="group/tech flex items-center gap-2.5 text-sm font-medium leading-tight">
    <span className="w-6 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover/tech:-translate-y-0.5 motion-reduce:transform-none">
      {skill.slug && <TechIcon slug={skill.slug} className="w-[22px] h-[22px]" />}
    </span>
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
            <p className="kicker mb-6">{t("skills.coreTitle")}</p>
            {/* Les rangées se répartissent la hauteur de la tuile (elle couvre
                deux lignes de grille) : aucune poche de vide résiduelle. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 flex-1 content-evenly">
              {CORE_STACK.map((skill) => (
                <div key={skill.name} className="group/core flex flex-col gap-3">
                  <span className="transition-transform duration-300 group-hover/core:-translate-y-1 motion-reduce:transform-none">
                    {skill.slug && <TechIcon slug={skill.slug} className="w-10 h-10 sm:w-11 sm:h-11" />}
                  </span>
                  <span className="font-semibold text-[0.95rem] sm:text-base leading-tight">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Fenêtre terminal — pleine hauteur en regard de la vitrine ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className="col-span-2 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-lg border border-border overflow-hidden flex flex-col bg-[hsl(221,36%,8%)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-success/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-2" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[10px] tracking-[0.08em] text-white/35 select-none">~/dev</span>
            </div>
            <CodeRain className="w-full flex-1 min-h-[8rem]" />
          </motion.div>

          {/* ── Familles — largeur dérivée du volume d'items, items en colonnes ── */}
          {FAMILIES.map((family) => {
            const wide = family.skills.length >= 6;
            return (
              <motion.div
                key={tx(family.title, lang)}
                custom={nextIndex()}
                variants={tileVariants}
                className={`${TILE} group flex flex-col col-span-2 md:col-span-2 ${
                  wide ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <p className="kicker mb-5 transition-colors duration-300 group-hover:text-primary">
                  {tx(family.title, lang)}
                </p>
                {/* Grille interne : colonnes alignées et hauteur remplie, au lieu
                    d'un wrap qui laisse un item orphelin en dernière ligne. */}
                {/* La 3e colonne interne attend xl : en dessous, la tuile large
                    est trop étroite et les noms composés se cassent en deux
                    lignes. `content-evenly` répartit le vide sans distendre. */}
                <div
                  className={`grid grid-cols-2 gap-x-5 gap-y-4 flex-1 content-evenly text-foreground/90 ${
                    wide ? "xl:grid-cols-3" : ""
                  }`}
                >
                  {family.skills.map((skill) => (
                    <TechItem key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* ── Tuile compteur — plan royal, la valeur monte à l'entrée ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className="group col-span-2 md:col-span-2 lg:col-span-2 rounded-lg bg-brand text-brand-foreground p-5 sm:p-6 flex flex-col justify-between gap-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-elevated motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <p className="font-display font-semibold leading-none text-[clamp(2.4rem,4vw,3.4rem)] transition-transform duration-300 group-hover:scale-[1.04] origin-left motion-reduce:transform-none">
              <CountUp value={TECH_COUNT} />
            </p>
            <p className="text-sm text-brand-foreground/85 leading-snug">{t("skills.countLabel")}</p>
          </motion.div>

          {/* ── Soft skills — bande typographique de clôture, pleine largeur ── */}
          <motion.div
            custom={nextIndex()}
            variants={tileVariants}
            className={`${TILE} col-span-2 md:col-span-4 lg:col-span-6`}
          >
            <p className="kicker mb-4">{t("skills.soft")}</p>
            {/* Les mots sont animés par la propagation de variants de la grille
                (un `whileInView` local serait écrasé par cette propagation). */}
            <p className="flex flex-wrap items-baseline gap-x-5 sm:gap-x-7 gap-y-2 leading-snug">
              {softSkills.map((label, i) => (
                <motion.span
                  key={tx(label, lang)}
                  custom={i}
                  variants={softVariants}
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
