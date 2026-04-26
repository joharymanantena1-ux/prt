import { motion } from "framer-motion";
import { Briefcase, GraduationCap, ExternalLink, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const experiences = [
  {
    title: "Développeur – Freelance On-site",
    company: "Regard Beauty",
    period: "Avr 2026 – Présent",
    current: true,
    description:
      "Mission freelance à temps plein en présentiel : développement et maintenance d'applications internes, collaboration directe avec les équipes métier.",
  },
  {
    title: "Projet SaaS – Gestion des Écoles",
    company: "Levitation",
    companyUrl: "https://levitation.mg",
    period: "Jan 2026 – Présent",
    current: true,
    description:
      "Conception et développement d'une plateforme SaaS scolaire complète : gestion des notes et bulletins, facturation, automatisation des workflows (emails/SMS via n8n), gestion multi-établissements.",
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    result: "Plateforme en production – edu.levitation.mg",
  },
  {
    title: "Développeur Web Freelance",
    company: "Loca & Deco",
    period: "Nov 2025 – Fév 2026",
    current: false,
    description:
      "Développement d'un site de location événementielle avec back-office de gestion des stocks, catalogue produits et optimisation de l'expérience utilisateur.",
    technologies: ["Spring Boot", "ReactJS", "MySQL"],
    result: "Livré avec réduction du temps de gestion stock de 60%",
  },
  {
    title: "Application Logistique & Transport",
    company: "Konecta Madagascar",
    period: "Sep – Déc 2025",
    current: false,
    description:
      "Digitalisation du transport du personnel : suivi des livraisons en temps réel, optimisation des trajets (OSRM), tableaux de bord multi-profils (admin, chauffeur, RH).",
    technologies: ["React Native", "ReactJS", "Node.js", "Firebase", "MySQL"],
    result: "Réduction de 30% des temps d'attente",
  },
];

const education = [
  {
    title: "Licence en Informatique",
    school: "IT-University",
    period: "2022 – 2025",
    description:
      "Formation complète en algorithmique, bases de données, programmation orientée objet, développement web et mobile. Projets académiques variés sur toute la durée du cursus.",
    highlight: "Diplômé",
  },
  {
    title: "Gen AI Skills Certification",
    school: "Google Cloud Skill Boost",
    period: "Fév 2025",
    description:
      "Certification en Intelligence Artificielle Générative — prompting, modèles de langage, intégration d'IA dans des applications métier.",
    highlight: "Certifié Google Cloud",
  },
  {
    title: "Baccalauréat Série D",
    school: "Lycée Manjary Soa",
    period: "2022",
    description:
      "Baccalauréat scientifique option Sciences de la Vie et de la Terre (série D).",
    highlight: "Mention obtenue",
  },
];

interface ExpItem {
  title: string;
  company?: string;
  school?: string;
  companyUrl?: string;
  period: string;
  current?: boolean;
  description: string;
  technologies?: string[];
  result?: string;
  highlight?: string;
}

const TimelineEntry = ({
  item,
  type,
  index,
}: {
  item: ExpItem;
  type: "exp" | "edu";
  index: number;
  isLast: boolean;
}) => {
  const isPrimary = type === "exp";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="relative pl-12 pb-8 last:pb-0"
    >
      {/* Vertical line (hidden on last item via last:pb-0) */}
      <div className={`absolute left-[13px] top-9 bottom-0 w-px ${
        isPrimary
          ? "bg-gradient-to-b from-primary/40 via-border to-transparent"
          : "bg-gradient-to-b from-accent/40 via-border to-transparent"
      }`} />

      {/* Timeline dot */}
      <div className={`absolute left-0 top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 ${
        item.current
          ? "bg-primary border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
          : isPrimary
          ? "bg-background border-primary/60"
          : "bg-background border-accent/60"
      }`}>
        {type === "exp" ? (
          <Briefcase className={`w-3 h-3 ${item.current ? "text-primary-foreground" : "text-primary"}`} />
        ) : (
          <GraduationCap className={`w-3 h-3 ${isPrimary ? "text-primary" : "text-accent"}`} />
        )}
      </div>

      {/* Content card */}
      <div className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:shadow-elevated group ${
        item.current
          ? "border-primary/25 bg-primary/5 dark:bg-primary/8"
          : "border-border/60 bg-card/60 hover:border-border"
      }`}>
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isPrimary ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
          }`}>
            {item.period}
          </span>
          {item.current && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              En cours
            </span>
          )}
          {item.highlight && (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Award className="w-3 h-3" />
              {item.highlight}
            </span>
          )}
        </div>

        {/* Title & company */}
        <h3 className="text-base sm:text-lg font-display font-semibold mb-1 leading-snug">
          {item.title}
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
              className="text-primary hover:text-primary/70 transition-colors"
              title={`Visiter ${item.company}`}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Result badge */}
        {item.result && (
          <p className="text-xs font-medium text-primary/80 bg-primary/8 border border-primary/15 rounded-lg px-3 py-1.5 mb-3 inline-block">
            ✓ {item.result}
          </p>
        )}

        {/* Tech tags */}
        {item.technologies && (
          <div className="flex flex-wrap gap-1.5">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium border border-border/50"
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
  return (
    <section className="section-container">
      <div className="section-content max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Parcours
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
            Expériences & Formation
          </h2>
        </motion.div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-10 h-11 rounded-xl">
            <TabsTrigger value="experience" className="flex items-center gap-2 text-sm rounded-lg">
              <Briefcase className="w-3.5 h-3.5" />
              Expériences
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-sm rounded-lg">
              <GraduationCap className="w-3.5 h-3.5" />
              Formation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            <div className="relative">
              {experiences.map((exp, index) => (
                <TimelineEntry
                  key={exp.title}
                  item={exp}
                  index={index}
                  type="exp"
                  isLast={index === experiences.length - 1}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="relative">
              {education.map((edu, index) => (
                <TimelineEntry
                  key={edu.title}
                  item={edu}
                  index={index}
                  type="edu"
                  isLast={index === education.length - 1}
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
