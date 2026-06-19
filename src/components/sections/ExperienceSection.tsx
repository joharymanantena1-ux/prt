import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap, ExternalLink, Award, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi, type Lang } from "@/i18n";

interface ExpItem {
  title: Bi;
  company?: string;
  school?: string;
  companyUrl?: string;
  period: Bi;
  current?: boolean;
  description: Bi;
  technologies?: string[];
  result?: Bi;
  highlight?: Bi;
}

const experiences: ExpItem[] = [
  {
    title: { fr: "Développeur – Freelance On-site", en: "Developer – On-site Freelance" },
    company: "Regard Beauty",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    description: {
      fr: "Mission freelance à temps plein en présentiel : développement et maintenance d'applications internes, collaboration directe avec les équipes métier.",
      en: "Full-time on-site freelance mission: building and maintaining internal applications, working directly with the business teams.",
    },
  },
  {
    title: { fr: "Projet SaaS – Gestion des Écoles", en: "SaaS Project – School Management" },
    company: "Levitation",
    period: { fr: "Jan 2026 – Mai 2026", en: "Jan 2026 – May 2026" },
    current: false,
    description: {
      fr: "Conception et développement d'une plateforme SaaS scolaire complète : gestion des notes et bulletins, facturation, automatisation des workflows (emails/SMS via n8n), gestion multi-établissements.",
      en: "Design and development of a complete school SaaS platform: grades and report cards, billing, workflow automation (emails/SMS via n8n), multi-school management.",
    },
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    result: { fr: "Plateforme livrée en production – edu.levitation.mg", en: "Platform shipped to production – edu.levitation.mg" },
  },
  {
    title: { fr: "Application Logistique & Transport", en: "Logistics & Transport App" },
    company: "Konecta Madagascar",
    period: { fr: "Sep – Déc 2025", en: "Sep – Dec 2025" },
    current: false,
    description: {
      fr: "Digitalisation du transport du personnel : suivi des livraisons en temps réel, optimisation des trajets (OSRM), tableaux de bord multi-profils (admin, chauffeur, RH).",
      en: "Digitalising staff transport: real-time delivery tracking, route optimisation (OSRM), multi-role dashboards (admin, driver, HR).",
    },
    technologies: ["React Native", "ReactJS", "Node.js", "Firebase", "MySQL"],
    result: { fr: "Réduction de 30% des temps d'attente", en: "30% reduction in waiting times" },
  },
];

const education: ExpItem[] = [
  {
    title: { fr: "Licence en Informatique", en: "Bachelor's in Computer Science" },
    school: "IT-University",
    period: "2022 – 2025",
    description: {
      fr: "Formation complète en algorithmique, bases de données, programmation orientée objet, développement web et mobile. Projets académiques variés sur toute la durée du cursus.",
      en: "Comprehensive training in algorithms, databases, object-oriented programming, web and mobile development. Varied academic projects throughout the curriculum.",
    },
    highlight: { fr: "Diplômé", en: "Graduated" },
  },
  {
    title: { fr: "Parcours IA Générative", en: "Generative AI Track" },
    school: "Google Cloud Skill Boost",
    period: { fr: "En cours", en: "Ongoing" },
    current: true,
    description: {
      fr: "Formation en Intelligence Artificielle Générative — prompting, modèles de langage, intégration d'IA dans des applications métier.",
      en: "Generative AI training — prompting, language models, integrating AI into business applications.",
    },
    highlight: { fr: "Google Cloud", en: "Google Cloud" },
  },
  {
    title: { fr: "Baccalauréat Série D", en: "High-School Diploma (Sciences)" },
    school: "Lycée Manjary Soa",
    period: "2022",
    description: {
      fr: "Baccalauréat scientifique option Sciences de la Vie et de la Terre (série D).",
      en: "Scientific high-school diploma, Life & Earth Sciences track (série D).",
    },
    highlight: { fr: "Mention obtenue", en: "With honours" },
  },
];

const TimelineEntry = ({
  item,
  type,
  index,
  lang,
}: {
  item: ExpItem;
  type: "exp" | "edu";
  index: number;
  lang: Lang;
}) => {
  const reduce = useReducedMotion();
  const { t } = useT();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.45, delay: index * 0.1 }}
      className="relative pl-12 pb-8 last:pb-0"
    >
      <div className="absolute left-[13px] top-9 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />

      <div className={`absolute left-0 top-4 w-7 h-7 rounded-md flex items-center justify-center border-2 z-10 ${
        item.current
          ? "bg-primary border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
          : "bg-background border-primary/60"
      }`}>
        {type === "exp" ? (
          <Briefcase className={`w-3 h-3 ${item.current ? "text-primary-foreground" : "text-primary"}`} />
        ) : (
          <GraduationCap className="w-3 h-3 text-primary" />
        )}
      </div>

      <div className={`rounded-md border p-4 sm:p-5 transition-colors duration-300 group ${
        item.current
          ? "border-primary/30 bg-primary/5 dark:bg-primary/8"
          : "border-border bg-card hover:border-primary/40"
      }`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">
            {tx(item.period, lang)}
          </span>
          {item.current && (
            <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
              {t("experience.current")}
            </span>
          )}
          {item.highlight && (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Award className="w-3 h-3" />
              {tx(item.highlight, lang)}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-display font-semibold mb-1 leading-snug">
          {tx(item.title, lang)}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm text-muted-foreground font-medium">
            {item.company || item.school}
          </span>
          {item.companyUrl && (
            <a
              href={item.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 -m-1 rounded-md text-primary hover:text-primary/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`${item.company} (${lang === "fr" ? "nouvel onglet" : "new tab"})`}
              title={item.company}
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {tx(item.description, lang)}
        </p>

        {item.result && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-lg px-3 py-1.5 mb-3 w-fit">
            <Check className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {tx(item.result, lang)}
          </p>
        )}

        {item.technologies && (
          <div className="flex flex-wrap gap-1.5">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-secondary border border-border/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const { t, lang } = useT();
  return (
    <section className="section-container">
      <div className="section-content max-w-3xl">
        <SectionHeading
          index="02"
          label={t("experience.label")}
          title={t("experience.title")}
          description={t("experience.desc")}
          className="mb-10 md:mb-14"
        />

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-10 h-11 rounded-md">
            <TabsTrigger value="experience" className="flex items-center gap-2 text-sm rounded-sm">
              <Briefcase className="w-3.5 h-3.5" />
              {t("experience.tabExp")}
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-sm rounded-sm">
              <GraduationCap className="w-3.5 h-3.5" />
              {t("experience.tabEdu")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            <div className="relative">
              {experiences.map((exp, index) => (
                <TimelineEntry key={tx(exp.title, lang)} item={exp} index={index} type="exp" lang={lang} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="relative">
              {education.map((edu, index) => (
                <TimelineEntry key={tx(edu.title, lang)} item={edu} index={index} type="edu" lang={lang} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ExperienceSection;
