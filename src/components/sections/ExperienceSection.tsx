import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap, ExternalLink, Award, CheckCircle2, Calendar } from "lucide-react";
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
  type?: string;
  description: Bi;
  technologies?: string[];
  result?: Bi;
  highlight?: Bi;
}

const experiences: ExpItem[] = [
  {
    title: { fr: "Développeur Full-Stack & Mobile", en: "Full-Stack & Mobile Developer" },
    company: "BeautyBay",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    type: "Freelance",
    description: {
      fr: "Développement full-stack de l'écosystème e-commerce BeautyBay (web et mobile) : évolution des interfaces clientes ReactJS et de l'API GraphQL, synchronisation en direct des flux produits et commandes, application mobile React Native et architecture cloud AWS (S3, automatisations).",
      en: "Full-stack development of the BeautyBay e-commerce ecosystem across web and mobile: evolving customer interfaces (ReactJS) and GraphQL API, real-time inventory and order sync, React Native mobile app, and AWS cloud storage architecture.",
    },
    technologies: ["ReactJS", "React Native", "Node.js", "GraphQL", "TypeScript", "AWS"],
    result: {
      fr: "Système unifié web/mobile en production et accélération des flux de commandes",
      en: "Unified web/mobile production platform with optimized order processing",
    },
  },
  {
    title: { fr: "Développeur – Freelance On-site", en: "Developer – On-site Freelance" },
    company: "Regard Beauty",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    type: "On-site",
    description: {
      fr: "Mission freelance à temps plein en présentiel : conception, déploiement et maintenance d'applications internes de gestion, en étroite synergie avec les équipes opérationnelles.",
      en: "Full-time on-site freelance mission: designing, deploying, and maintaining internal enterprise apps in direct collaboration with business teams.",
    },
    technologies: ["React", "Node.js", "TypeScript", "SQL"],
  },
  {
    title: { fr: "Lead Développeur SaaS – Gestion Scolaire", en: "Lead SaaS Developer – School Platform" },
    company: "Levitation",
    period: { fr: "Jan 2026 – Mai 2026", en: "Jan 2026 – May 2026" },
    current: false,
    type: "SaaS",
    description: {
      fr: "Architecture et développement d'une plateforme SaaS scolaire complète : gestion des notes et bulletins automatisés, facturation multi-écoles, et workflows d'alertes SMS/emails via n8n.",
      en: "Architected and delivered an end-to-end multi-school SaaS platform: automated report cards and grading, tuition billing, and n8n SMS/email workflows.",
    },
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "REST APIs"],
    result: {
      fr: "Plateforme livrée en production et adoptée – edu.levitation.mg",
      en: "Platform delivered to production – edu.levitation.mg",
    },
  },
  {
    title: { fr: "Ingénieur Application Logistique & Transport", en: "Logistics & Fleet Software Engineer" },
    company: "Konecta Madagascar",
    period: { fr: "Sep – Déc 2025", en: "Sep – Dec 2025" },
    current: false,
    type: "Enterprise",
    description: {
      fr: "Digitalisation du transport du personnel : application mobile chauffeur, géolocalisation de navettes en direct, optimisation d'itinéraires (OSRM) et dashboards d'analyse pour les RH.",
      en: "Digitalising corporate staff transit: driver mobile application, live GPS fleet tracking, OSRM routing optimization, and HR monitoring dashboards.",
    },
    technologies: ["React Native", "ReactJS", "Node.js", "Firebase", "MySQL", "OSRM"],
    result: {
      fr: "Réduction mesurée de 30% des temps d'attente",
      en: "30% reduction in employee waiting times",
    },
  },
];

const education: ExpItem[] = [
  {
    title: { fr: "Licence en Informatique", en: "Bachelor's in Computer Science" },
    school: "IT-University",
    period: "2022 – 2025",
    description: {
      fr: "Formation approfondie en algorithmique, structures de données, bases relationnelles et orientées objet, génie logiciel, développement web & mobile multi-plateforme.",
      en: "Comprehensive curriculum in algorithms, data structures, relational and OOP database design, software engineering, and full-stack web & mobile development.",
    },
    highlight: { fr: "Diplômé avec succès", en: "Graduated" },
  },
  {
    title: { fr: "Certification IA Générative", en: "Generative AI Engineering Track" },
    school: "Google Cloud Skill Boost",
    period: { fr: "En cours", en: "Ongoing" },
    current: true,
    description: {
      fr: "Parcours officiel Google Cloud : prompting avancé, intégration d'APIs LLMs, modèles génératifs et automatisation intelligente dans des applications métier.",
      en: "Official Google Cloud curriculum: advanced prompt engineering, LLM API integration, generative models, and intelligent business workflows.",
    },
    highlight: { fr: "Google Cloud", en: "Google Cloud" },
  },
  {
    title: { fr: "Baccalauréat Scientifique (Série D)", en: "High-School Diploma (Sciences)" },
    school: "Lycée Manjary Soa",
    period: "2022",
    description: {
      fr: "Formation scientifique exigeante en mathématiques, sciences physiques et sciences naturelles.",
      en: "Rigorous scientific track focused on mathematics, physical sciences, and biological analytics.",
    },
    highlight: { fr: "Mention obtenue", en: "With Honours" },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const TimelineNode = ({
  item,
  index,
  lang,
}: {
  item: ExpItem;
  index: number;
  lang: Lang;
}) => {
  const reduce = useReducedMotion();
  const { t } = useT();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="relative pl-8 sm:pl-10 pb-12 last:pb-2 group"
    >
      {/* Connected Architectural Vertical Rail */}
      <div
        aria-hidden="true"
        className="absolute left-[11px] top-3 bottom-0 w-px bg-border group-last:bg-gradient-to-b group-last:from-border group-last:to-transparent"
      />

      {/* Glowing Node Point */}
      <div
        aria-hidden="true"
        className={`absolute left-0 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          item.current
            ? "border-primary bg-background shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
            : "border-border/80 bg-background group-hover:border-primary/60 group-hover:scale-110"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            item.current ? "bg-primary animate-pulse" : "bg-muted-foreground/40 group-hover:bg-primary"
          }`}
        />
      </div>

      {/* Timeline Card */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
        
        {/* Header: Title, Company & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              {tx(item.title, lang)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary font-medium text-sm sm:text-base">
                {item.company || item.school}
              </span>
              {item.companyUrl && (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={item.company}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Period & Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              {tx(item.period, lang)}
            </span>

            {item.current && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("experience.current")}
              </span>
            )}

            {item.highlight && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                {tx(item.highlight, lang)}
              </span>
            )}
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
          {tx(item.description, lang)}
        </p>

        {/* Measurable Deliverable / Result */}
        {item.result && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{tx(item.result, lang)}</span>
          </div>
        )}

        {/* Technology Pills */}
        {item.technologies && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-secondary/80 text-secondary-foreground"
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

export const ExperienceSection = () => {
  const { t, lang } = useT();

  return (
    <section className="section-container relative overflow-hidden py-24 sm:py-32">
      <div className="section-content max-w-4xl mx-auto">
        
        {/* Section Heading */}
        <SectionHeading
          label={t("experience.label")}
          title={lang === "fr" ? "Parcours & Réalisations." : "Experience & Education."}
          description={t("experience.desc")}
          className="mb-12 sm:mb-16"
        />

        {/* Tabs switcher */}
        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-10 h-12 rounded-xl bg-card border border-border/80 p-1">
            <TabsTrigger
              value="experience"
              className="flex items-center gap-2 text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t("experience.tabExp")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="flex items-center gap-2 text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t("experience.tabEdu")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="focus-visible:outline-none">
            <div className="pt-2">
              {experiences.map((exp, index) => (
                <TimelineNode
                  key={tx(exp.title, lang)}
                  item={exp}
                  index={index}
                  lang={lang}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="focus-visible:outline-none">
            <div className="pt-2">
              {education.map((edu, index) => (
                <TimelineNode
                  key={tx(edu.title, lang)}
                  item={edu}
                  index={index}
                  lang={lang}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ExperienceSection;
