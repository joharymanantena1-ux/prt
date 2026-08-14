import { motion, useReducedMotion } from "framer-motion";
import { Monitor, Server, Database, Terminal, Target, Layers, Users, Zap, Rocket, RefreshCw, MessageSquare, CheckCircle2 } from "lucide-react";
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
  Icon: React.ComponentType<{ className?: string }>;
  skills: Skill[];
}

const categories: Category[] = [
  {
    title: "Frontend",
    Icon: Monitor,
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
    Icon: Server,
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
    Icon: Database,
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
    Icon: Terminal,
    skills: [
      { name: "Git / GitHub",    slug: "siGit" },
      { name: "Docker",          slug: "siDocker" },
      { name: "Linux",           slug: "siLinux" },
      { name: "API REST",        slug: null, fallback: "REST" },
      { name: "n8n",             slug: "siN8n" },
    ],
  },
];

const softSkills: { label: Bi; Icon: typeof Target }[] = [
  { label: { fr: "Analyse des besoins", en: "Requirements analysis" }, Icon: Target },
  { label: { fr: "Architecture logicielle", en: "Software architecture" }, Icon: Layers },
  { label: { fr: "Travail en équipe", en: "Teamwork" }, Icon: Users },
  { label: { fr: "Résolution de problèmes", en: "Problem solving" }, Icon: Zap },
  { label: { fr: "Autonomie", en: "Autonomy" }, Icon: Rocket },
  { label: { fr: "Adaptabilité", en: "Adaptability" }, Icon: RefreshCw },
  { label: "Communication", Icon: MessageSquare },
  { label: { fr: "Rigueur", en: "Rigour" }, Icon: CheckCircle2 },
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

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const reduce = useReducedMotion();
  const { lang } = useT();
  const { Icon } = category;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, delay: index * 0.08 }}
      className="card-swiss p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold leading-none mb-1">{tx(category.title, lang)}</h3>
          <div className="h-0.5 w-6 bg-primary" />
        </div>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{String(category.skills.length).padStart(2, "0")}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <TechChip key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
};

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

        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mb-10 md:mb-12">
          {categories.map((category, index) => (
            <CategoryCard key={tx(category.title, lang)} category={category} index={index} />
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.25 }}
        >
          <div className="text-center mb-5">
            <h3 className="text-lg font-display font-semibold">{t("skills.soft")}</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {softSkills.map(({ label, Icon }, index) => (
              <motion.div
                key={tx(label, lang)}
                initial={reduce ? false : { opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.28, delay: 0.3 + index * 0.04 }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary/60 border border-border/50 text-sm font-medium cursor-default hover:bg-secondary hover:border-primary/40 transition-colors duration-200"
              >
                <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                {tx(label, lang)}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech ticker — seamless scrolling strip */}
        <Marquee items={MARQUEE_TECH} speed={34} className="mt-10 md:mt-12 py-4 border-y border-border/50" />
      </div>
    </section>
  );
};

export default SkillsSection;
