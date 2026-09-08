import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Code2, Server, Database, Cloud, Terminal, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Marquee from "@/components/motion/Marquee";
import { useT, tx, type Bi } from "@/i18n";
import { techIcons } from "@/data/techIcons";

const MARQUEE_TECH = [
  "React", "TypeScript", "Node.js", "React Native", "Laravel", "Spring Boot",
  "Python", "PostgreSQL", "Docker", "GraphQL", "Tailwind CSS", "AWS",
  "MySQL", "Vue.js", "Django", "Symfony", "n8n", "Linux",
];

interface SkillItem {
  name: string;
  slug: string | null;
  level: "Core" | "Advanced" | "Production";
  desc?: string;
}

interface DomainGroup {
  id: string;
  icon: any;
  title: Bi;
  subtitle: Bi;
  skills: SkillItem[];
}

const DOMAINS: DomainGroup[] = [
  {
    id: "frontend",
    icon: Code2,
    title: "Frontend & Mobile",
    subtitle: {
      fr: "Interfaces réactives, Web apps & Apps mobiles natives",
      en: "Reactive web interfaces & cross-platform mobile apps",
    },
    skills: [
      { name: "React / Next.js", slug: "siReact", level: "Core", desc: "SSR, Hydration, Architecture composants" },
      { name: "TypeScript", slug: "siTypescript", level: "Core", desc: "Typage strict, interfaces complexes" },
      { name: "React Native", slug: "siReact", level: "Core", desc: "Apps iOS/Android, intégration mobile" },
      { name: "Tailwind CSS", slug: "siTailwindcss", level: "Core", desc: "Design systems, tokens, responsive" },
      { name: "Vue.js", slug: "siVuedotjs", level: "Advanced", desc: "Composables, Vuex/Pinia" },
      { name: "Angular", slug: "siAngular", level: "Advanced", desc: "Architecture modulaire enterprise" },
      { name: "Flutter", slug: "siFlutter", level: "Advanced", desc: "Dart, UI multi-plateforme" },
    ],
  },
  {
    id: "backend",
    icon: Server,
    title: "Backend & Distributed Systems",
    subtitle: {
      fr: "APIs haute performance, microservices & logique métier",
      en: "High-performance APIs, microservices & business logic",
    },
    skills: [
      { name: "Node.js / Express", slug: "siNodedotjs", level: "Core", desc: "Async I/O, REST APIs, GraphQL" },
      { name: "Java / Spring Boot", slug: "siSpring", level: "Core", desc: "Enterprise architecture, Spring Security, JPA" },
      { name: "PHP / Laravel", slug: "siLaravel", level: "Core", desc: "Eloquent, jobs queues, APIs SaaS" },
      { name: "Python / Django", slug: "siPython", level: "Advanced", desc: "Scripts d'automatisation, API REST" },
      { name: "Symfony", slug: "siSymfony", level: "Advanced", desc: "Architecture MVC, Doctrine ORM" },
      { name: "C / C++ / C#", slug: "siCplusplus", level: "Advanced", desc: "Programmation système, WinForms, ASP.NET" },
    ],
  },
  {
    id: "data-cloud",
    icon: Database,
    title: { fr: "Bases de Données & Cloud", en: "Databases & Cloud" },
    subtitle: {
      fr: "Modélisation, persistance & infrastructure résiliente",
      en: "Data modeling, persistence & scalable infrastructure",
    },
    skills: [
      { name: "PostgreSQL", slug: "siPostgresql", level: "Core", desc: "Indexation, relations complexes, PostGIS" },
      { name: "MySQL", slug: "siMysql", level: "Core", desc: "Optimisation de requêtes, réplication" },
      { name: "Docker", slug: "siDocker", level: "Core", desc: "Conteneurisation, Docker Compose" },
      { name: "AWS", slug: null, level: "Advanced", desc: "S3, EC2, services cloud, IAM" },
      { name: "Firebase", slug: "siFirebase", level: "Advanced", desc: "Firestore, realtime DB, Auth" },
      { name: "n8n Automation", slug: "siN8n", level: "Advanced", desc: "Workflows automatisés, webhooks" },
      { name: "Linux / Git", slug: "siLinux", level: "Core", desc: "Serveurs Debian/Ubuntu, CI/CD" },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const TechIcon = ({ slug, className = "w-6 h-6" }: { slug: string; className?: string }) => {
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

export const SkillsSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredDomains = activeTab === "all"
    ? DOMAINS
    : DOMAINS.filter((d) => d.id === activeTab);

  return (
    <section className="section-container relative overflow-hidden py-24 sm:py-32 bg-secondary/20 dark:bg-card/20">
      <div className="section-content max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <SectionHeading
          label={t("skills.label")}
          title={lang === "fr" ? "Stack technique & écosystème." : "Technical Stack & Ecosystem."}
          description={lang === "fr" 
            ? "Un socle technologique maîtrisé de bout en bout, de l'infrastructure de données aux interfaces réactives."
            : "An end-to-end engineered technology stack, from data architecture to reactive interfaces."
          }
          className="mb-12"
        />

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            {lang === "fr" ? "Vue complète" : "All Ecosystems"}
          </button>

          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeTab === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setActiveTab(domain.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tx(domain.title, lang)}</span>
              </button>
            );
          })}
        </div>

        {/* ── Domains & Skills Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="wait">
            {filteredDomains.map((domain, domainIdx) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={domain.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: domainIdx * 0.08, ease: EASE }}
                  className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8 shadow-sm"
                >
                  {/* Domain Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl text-foreground">
                          {tx(domain.title, lang)}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {tx(domain.subtitle, lang)}
                        </p>
                      </div>
                    </div>

                    <span className="self-start sm:self-auto font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground">
                      {domain.skills.length} {lang === "fr" ? "technologies" : "technologies"}
                    </span>
                  </div>

                  {/* Skills Grid within Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {domain.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-border/50 bg-background/50 hover:bg-card hover:border-primary/40 transition-all duration-200"
                      >
                        <div className="w-9 h-9 rounded-lg bg-card border border-border/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                          {skill.slug ? (
                            <TechIcon slug={skill.slug} className="w-5 h-5" />
                          ) : (
                            <Terminal className="w-4 h-4 text-primary" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="font-medium text-sm text-foreground truncate">
                              {skill.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                skill.level === "Core"
                                  ? "bg-primary/15 text-primary font-semibold"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>
                          {skill.desc && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {skill.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Seamless Marquee Ticker ───────────────────────────────────── */}
        <div className="mt-14 pt-8 border-t border-border/60">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
            {lang === "fr" ? "Écosystème & outils en production continue" : "Tools & Ecosystem in Continuous Production"}
          </p>
          <Marquee items={MARQUEE_TECH} speed={30} className="py-2" />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
