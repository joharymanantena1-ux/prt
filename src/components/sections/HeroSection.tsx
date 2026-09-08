import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AmbientCanvas from "@/components/motion/AmbientCanvas";
import { useT } from "@/i18n";

// LCP Portrait configuration
const SIZES = "(min-width: 1280px) 440px, (min-width: 1024px) 38vw, (min-width: 640px) 320px, 72vw";
const PORTRAIT = {
  avif: "/portrait/johary-440.avif 440w, /portrait/johary-880.avif 880w",
  webp: "/portrait/johary-440.webp 440w, /portrait/johary-880.webp 880w",
  png: "/portrait/johary-660.png",
  width: 440,
  height: 694,
};

interface HeroSectionProps {
  onNavigate: (id: string) => void;
}

const SOCIALS = [
  { icon: Github, href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
  { icon: Mail, href: "mailto:andrianmanantena@gmail.com", label: "Email" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const { t, lang } = useT();
  const reduce = useReducedMotion();

  const stats = [
    { label: t("hero.statExp"), value: "3+ ans" },
    { label: t("hero.statProjects"), value: "30+" },
    { label: "Architecture", value: "Full-Stack" },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 md:px-10 lg:px-16">
      {/* ── Dynamic Ambient Background ─────────────────────────────────── */}
      <AmbientCanvas className="opacity-90 dark:opacity-80" interactive />

      {/* Subtle radial spotlight overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 radial-glow opacity-70"
      />

      {/* ── Main Hero Container ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-y-10 lg:gap-x-12 xl:gap-x-16">

        {/* ── Left Column: Value proposition & kinetic typography ───────── */}
        <div className="w-full text-center lg:text-left flex flex-col items-center lg:items-start order-1">
          
          {/* Top Status Pill — Technical & minimal */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-card/60 backdrop-blur-md shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Full-Stack Software Engineer
            </span>
          </motion.div>

          {/* Kinetic Display Headline */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="font-display font-bold tracking-tight text-[clamp(2.6rem,6.5vw,5.2rem)] leading-[1.04] text-foreground mb-4 sm:mb-6"
          >
            <span className="block">Johary</span>
            <span className="block text-foreground/95">
              Manantena<span className="text-primary font-sans font-normal">.</span>
            </span>
          </motion.h1>

          {/* Role & Value Statement */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="max-w-xl mb-7 sm:mb-8"
          >
            <p className="font-body text-lg sm:text-xl font-medium text-foreground/90 leading-snug mb-3">
              {lang === "fr" ? (
                <>
                  Développeur <span className="text-primary font-semibold">Full-Stack & Mobile</span> spécialisé dans les systèmes performants et les architectures fiables.
                </>
              ) : (
                <>
                  <span className="text-primary font-semibold">Full-Stack & Mobile</span> Software Engineer specialized in resilient architectures and high-performance digital products.
                </>
              )}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("hero.lead")}
            </p>
          </motion.div>

          {/* Primary Action Group (CTAs) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10"
          >
            <Button
              size="lg"
              className="group relative px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              onClick={() => onNavigate("projets")}
            >
              <span>{t("hero.ctaProjects")}</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-6 py-3 rounded-lg border-border/80 hover:bg-secondary/60 hover:text-foreground font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              onClick={() => onNavigate("contact")}
            >
              {t("hero.ctaContact")}
            </Button>

            <a
              href="https://drive.google.com/file/d/1yJRJjEtqKmmKQsksbJHn5eYcRBE6KP-O/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors duration-200"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>{t("hero.ctaCV")}</span>
            </a>
          </motion.div>

          {/* Social Links & Key Metrics */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            className="w-full pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (${t("common.newTab")})`}
                  className="w-10 h-10 rounded-lg border border-border/60 bg-card/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-6 sm:gap-8">
              {stats.map(({ label, value }) => (
                <div key={label} className="flex flex-col text-left">
                  <span className="font-display font-bold text-lg sm:text-xl text-foreground leading-none mb-1">
                    {value}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Cinematic Portrait Presentation ────────────── */}
        <div className="w-full flex justify-center lg:justify-end order-2 lg:order-none">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative w-[min(72vw,300px)] sm:w-[360px] lg:w-[400px] xl:w-[440px]"
          >
            {/* Ambient Backlight Glow (No harsh rectangular card) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-tr from-primary/20 via-blue-500/10 to-transparent blur-3xl opacity-60 dark:opacity-40 animate-pulse"
              style={{ animationDuration: "6s" }}
            />

            {/* Refined Glass Pedestal Background (soft, rounded, elegant) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-[18%] bottom-0 rounded-2xl border border-border/50 bg-gradient-to-b from-card/70 via-card/40 to-transparent backdrop-blur-md"
            />

            {/* Portrait Image */}
            <picture>
              <source type="image/avif" srcSet={PORTRAIT.avif} sizes={SIZES} />
              <source type="image/webp" srcSet={PORTRAIT.webp} sizes={SIZES} />
              <img
                src={PORTRAIT.png}
                alt={t("common.portraitAlt")}
                width={PORTRAIT.width}
                height={PORTRAIT.height}
                decoding="async"
                draggable={false}
                {...{ fetchpriority: "high" }}
                className="relative z-10 w-full h-auto select-none drop-shadow-2xl"
              />
            </picture>

            {/* Seamless Bottom Fade */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent z-10"
            />

            {/* Interactive Floating Status Badge */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-2 left-4 sm:left-6 z-20 px-3.5 py-2 rounded-lg border border-border/80 bg-card/90 backdrop-blur-md shadow-lg flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-mono text-xs text-foreground/90 font-medium">
                Antananarivo · Remote (UTC+3)
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <motion.button
        type="button"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onClick={() => onNavigate("apropos")}
        aria-label={t("hero.scrollAria")}
        className="hidden xl:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span>{t("hero.scroll")}</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
