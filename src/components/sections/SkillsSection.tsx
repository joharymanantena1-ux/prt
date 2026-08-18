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

/* ── Hiérarchie : le stack signature (pratiqué en production, mis en avant
   avec les glyphes de marque), puis le reste des technologies par famille,
   en texte courant scannable. Toutes les technologies d'origine sont là. ── */

const CORE_STACK: { name: string; slug: string }[] = [
  { name: "React / Next.js", slug: "siReact" },
  { name: "TypeScript",      slug: "siTypescript" },
  { name: "Node.js",         slug: "siNodedotjs" },
  { name: "React Native",    slug: "siReact" },
  { name: "PHP / Laravel",   slug: "siLaravel" },
  { name: "Java / Spring",   slug: "siSpring" },
];

const FAMILIES: { title: Bi; items: string[] }[] = [
  {
    title: "Frontend",
    items: ["JavaScript", "Angular", "Vue.js", "Tailwind CSS", "Bootstrap", "Flutter"],
  },
  {
    title: "Backend",
    items: ["Symfony", "CodeIgniter", "Django", "Python", "C", "C# / ASP.NET", "C++"],
  },
  {
    title: { fr: "Bases de données", en: "Databases" },
    items: ["MySQL", "PostgreSQL", "Oracle", "Firebase", "PostGIS"],
  },
  {
    title: { fr: "DevOps & Outils", en: "DevOps & Tools" },
    items: ["Git / GitHub", "Docker", "Linux", "API REST", "n8n"],
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

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Compétences — deux niveaux de lecture : le stack signature en vitrine
 * (glyphes + noms), puis les familles de technologies en lignes de texte
 * scannables. Soft skills en liste inline ; ticker en clôture de section.
 */
const SkillsSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();
  return (
    <section className="section-container bg-muted/60">
      <div className="section-content max-w-6xl">
        <SectionHeading
          label={t("skills.label")}
          title={t("skills.title")}
          description={t("skills.desc")}
          className="mb-10 md:mb-14"
        />

        {/* Stack signature — vitrine à six entrées */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 mb-12 md:mb-16">
          {CORE_STACK.map(({ name, slug }, index) => (
            <motion.div
              key={name}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: index * 0.05, ease: EASE }}
              className="group flex flex-col gap-3"
            >
              <span className="text-foreground/80 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                <TechIcon slug={slug} className="w-7 h-7" />
              </span>
              <span className="font-semibold text-[0.95rem] leading-tight">{name}</span>
            </motion.div>
          ))}
        </div>

        {/* Familles — lignes de texte : label à gauche, technologies à droite */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="border-t border-border pt-8 space-y-5 mb-12 md:mb-14"
        >
          {FAMILIES.map(({ title, items }) => (
            <div key={tx(title, lang)} className="grid gap-y-1 sm:grid-cols-[11rem_1fr] sm:gap-x-8">
              <h3 className="font-semibold text-[0.95rem] leading-relaxed">{tx(title, lang)}</h3>
              <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                {items.join(" · ")}
              </p>
            </div>
          ))}

          {/* Soft skills — même grille de lecture */}
          <div className="grid gap-y-1 sm:grid-cols-[11rem_1fr] sm:gap-x-8">
            <h3 className="font-semibold text-[0.95rem] leading-relaxed">{t("skills.soft")}</h3>
            <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
              {softSkills.map((label) => tx(label, lang)).join(" · ")}
            </p>
          </div>
        </motion.div>

        {/* Tech ticker — seamless scrolling strip */}
        <Marquee items={MARQUEE_TECH} speed={34} className="py-4 border-y border-border/60" />
      </div>
    </section>
  );
};

export default SkillsSection;
