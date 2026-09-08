import { motion, useReducedMotion } from "framer-motion";
import { Server, Layers, Zap, ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useT } from "@/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

export const AboutSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();

  const pillars = [
    {
      icon: Server,
      title: lang === "fr" ? "Architecture Système & Backend" : "System Architecture & Backend",
      desc: lang === "fr"
        ? "Conception d'APIs robustes, modélisation de bases relationnelles (PostgreSQL, MySQL) et déploiement de microservices (Node.js, Spring Boot, Laravel) scalables."
        : "Designing robust APIs, relational database modeling (PostgreSQL, MySQL), and deploying scalable microservices (Node.js, Spring Boot, Laravel).",
      tag: "Backend & Cloud",
    },
    {
      icon: Layers,
      title: lang === "fr" ? "Interfaces Web & Mobile Avancées" : "Advanced Web & Mobile Interfaces",
      desc: lang === "fr"
        ? "Développement d'expériences fluides à 60 FPS, composants réutilisables et applications mobiles hybrides (React, React Native, TypeScript)."
        : "Building fluid 60 FPS interfaces, maintainable design systems, and cross-platform mobile apps (React, React Native, TypeScript).",
      tag: "Frontend & Mobile",
    },
    {
      icon: Zap,
      title: lang === "fr" ? "Culture Produit & Impact Réel" : "Product Craft & Measurable Impact",
      desc: lang === "fr"
        ? "Focus sur la valeur métier : réduction mesurée des temps de traitement, automatisation des flux (n8n, AWS) et livraison continue en production."
        : "Laser focus on real business outcomes: quantifiable latency reduction, workflow automation (n8n, AWS), and reliable CI/CD delivery.",
      tag: "Execution & Delivery",
    },
  ];

  return (
    <section className="section-container relative overflow-hidden py-24 sm:py-32">
      <div className="section-content max-w-6xl mx-auto">
        <SectionHeading
          label={t("about.label")}
          title={lang === "fr" ? "L'art de concevoir et délivrer." : "Engineering scalable digital products."}
          description={t("about.desc")}
          className="mb-14 sm:mb-18"
        />

        {/* ── Storytelling Manifesto & Journey ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16 sm:mb-20">
          
          {/* Main Story Narrative */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="lg:col-span-7 flex flex-col justify-between p-7 sm:p-9 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-4">
                <Terminal className="w-4 h-4" />
                <span>{t("about.journeyTitle")}</span>
              </div>
              
              <h3 className="font-display font-semibold text-2xl sm:text-3xl text-foreground leading-snug mb-5">
                {lang === "fr"
                  ? "De la rigueur académique à la production en conditions réelles."
                  : "From academic foundations to high-stakes production."}
              </h3>
              
              <p className="text-base sm:text-lg text-foreground/85 leading-relaxed mb-4">
                {t("about.journeyP1")}
              </p>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("about.journeyP2")}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-secondary-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                IT-University (2022–2025)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-secondary-foreground">
                Google Cloud AI Certified
              </span>
            </div>
          </motion.div>

          {/* Philosophy / Mindset Box */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-9 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/80 to-secondary/30 backdrop-blur-md shadow-sm"
          >
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-widest block mb-4">
                {lang === "fr" ? "Philosophie d'ingénieur" : "Engineering Philosophy"}
              </span>

              <h4 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-snug mb-4">
                {t("about.philoTitle")}
              </h4>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                {t("about.philoP1")}
              </p>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("about.philoP2")}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <blockquote className="italic font-display text-sm text-foreground/80 border-l-2 border-primary pl-3">
                {lang === "fr"
                  ? "« La simplicité est la sophistication suprême. Le bon code est celui qu'on comprend immédiatement. »"
                  : "“Simplicity is prerequisite for reliability. Great code solves real user problems with zero friction.”"}
              </blockquote>
            </div>
          </motion.div>
        </div>

        {/* ── 3 Core Engineering Pillars ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="group relative p-6 sm:p-7 rounded-xl border border-border/70 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2 block">
                    {pillar.tag}
                  </span>

                  <h4 className="font-display font-semibold text-lg sm:text-xl text-foreground mb-3 leading-snug">
                    {pillar.title}
                  </h4>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
