import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, Code2, Download, Github, Layers, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/motion/CountUp";
import MagneticButton from "@/components/motion/MagneticButton";
import RevealText from "@/components/motion/RevealText";
import Parallax from "@/components/motion/Parallax";
import MorphingRoles from "@/components/motion/MorphingRoles";
import { useT } from "@/i18n";

// The portrait lives in /public (stable URLs) so index.html can <link rel="preload">
// it before this lazy chunk even loads — it's the LCP element on mobile.
const developerPortraitAvif = "/portrait/developer-portrait.avif";
const developerPortraitWebp = "/portrait/developer-portrait.webp";
const developerPortrait = "/portrait/developer-portrait.png";

interface HeroSectionProps {
  /** Navigate to a section by its id (e.g. "projets", "contact"). */
  onNavigate: (id: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const reduce = useReducedMotion();
  const { t } = useT();
  // Looping ambient animations (float, scanline, scroll cue) only run while the
  // Hero is on screen — they stop once the user scrolls to a later section, so
  // nothing burns the GPU/battery in the background.
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const loop = !reduce && inView;
  const stats: { label: string; to?: number; suffix?: string; text?: string }[] = [
    { label: t("hero.statExp"), to: 3, suffix: t("hero.statExpSuffix") },
    { label: t("hero.statProjects"), to: 30, suffix: "+" },
    { label: t("hero.statStatus"), text: t("hero.statStatusValue") },
  ];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 28 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return; // respect prefers-reduced-motion — no 3D tilt
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const socials = [
    { icon: Github, href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
    { icon: Mail, href: "mailto:andrianmanantena@gmail.com", label: "Email" },
  ];

  return (
    <section ref={sectionRef} className="section-container relative overflow-hidden min-h-screen flex items-center">
      {/* Swiss engineering grid backdrop (decorative) — radial mask concentrates
          it around the content and lets it dissolve toward the edges for depth */}
      <div
        className="absolute inset-0 grid-bg opacity-[0.35] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 60% 42%, black 25%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 60% 42%, black 25%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Ambient washes — single teal accent, static (zero runtime cost) */}
      <div
        className="absolute top-[-8%] right-[4%] w-[26rem] h-[26rem] rounded-full bg-primary/[0.06] dark:bg-primary/[0.09] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-14%] left-[-6%] w-[22rem] h-[22rem] rounded-full bg-primary/[0.04] dark:bg-primary/[0.06] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center py-8 lg:py-0">

        {/* ── Text content ─────────────────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left order-2 lg:order-1 space-y-6"
        >
          {/* mono kicker + availability */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-3 justify-center lg:justify-start"
          >
            <span className="kicker !text-primary inline-flex items-center gap-1.5">
              <MorphingRoles items={["Full-Stack", "React", "Node.js", "TypeScript", "Mobile"]} />
            </span>
            <span className="h-px w-8 bg-border hidden sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              {t("hero.available")}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <h1 className="font-display font-bold leading-[0.92] tracking-tight">
              <span className="block text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-medium mb-1">
                {t("hero.greeting")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Johary</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient">Manantena</span>
            </h1>
          </motion.div>

          <RevealText
            text={t("hero.lead")}
            as="p"
            trigger="mount"
            delay={0.4}
            stagger={0.025}
            className="text-base text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed"
          />

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start"
          >
            <MagneticButton>
              <Button
                size="lg"
                className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 shadow-sm cursor-pointer"
                onClick={() => onNavigate("projets")}
              >
                {t("hero.ctaProjects")}
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="rounded-md border-border hover:border-primary/50 hover:bg-secondary font-semibold px-7 cursor-pointer"
                onClick={() => onNavigate("contact")}
              >
                {t("hero.ctaContact")}
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="rounded-md border-border hover:border-primary/50 hover:bg-secondary font-semibold px-7 gap-2 cursor-pointer"
                asChild
              >
                <a
                  href="https://drive.google.com/file/d/1TW1OODP6uhMU2yf7uOci1v-cVwj3qxhh/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  {t("hero.ctaCV")}
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-2 justify-center lg:justify-start"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md bg-secondary/60 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 border border-border/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${label} (nouvel onglet)`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Portrait — Swiss framed ──────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative order-1 lg:order-2 flex justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative w-72 sm:w-80 md:w-[340px] lg:w-[380px]">
            {/* Halo lumineux — soft teal wash anchoring the portrait (static) */}
            <div
              className="absolute -inset-10 sm:-inset-14 rounded-full bg-primary/10 dark:bg-primary/[0.13] blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Instrument dial — tick ring peeking from behind the frame,
                slow rotation only while the Hero is on screen (transform-only) */}
            <motion.svg
              viewBox="0 0 220 220"
              className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 hidden sm:block"
              animate={loop ? { rotate: 360 } : { rotate: 0 }}
              transition={loop ? { duration: 90, repeat: Infinity, ease: "linear" } : undefined}
              aria-hidden="true"
            >
              <circle cx="110" cy="110" r="104" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
              <circle cx="110" cy="110" r="95" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 7" />
              {/* single teal arc — the accent sweep of the dial */}
              <circle
                cx="110" cy="110" r="104" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="1.5"
                strokeDasharray="30 623" strokeLinecap="round" opacity="0.85"
              />
            </motion.svg>

            {/* Dot-matrix patch — engineering texture behind the lower-left corner */}
            <div
              className="pointer-events-none absolute -bottom-10 -left-12 w-28 h-36 hidden sm:block opacity-80"
              style={{
                backgroundImage: "radial-gradient(hsl(var(--primary) / 0.38) 1px, transparent 1.5px)",
                backgroundSize: "11px 11px",
                WebkitMaskImage: "linear-gradient(135deg, black 25%, transparent 78%)",
                maskImage: "linear-gradient(135deg, black 25%, transparent 78%)",
              }}
              aria-hidden="true"
            />

            {/* Coordinate ruler — mono annotation, Antananarivo (decorative) */}
            <div
              className="pointer-events-none absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2.5"
              aria-hidden="true"
            >
              <span className="flex flex-col items-end gap-[9px]">
                {Array.from({ length: 13 }).map((_, i) => (
                  <span key={i} className={`h-px bg-border ${i % 4 === 0 ? "w-3.5" : "w-2"}`} />
                ))}
              </span>
              <span
                className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground/70 uppercase whitespace-nowrap"
                style={{ writingMode: "vertical-rl" }}
              >
                18.8792° S · 47.5079° E — TNR
              </span>
            </div>

            {/* Decorative frame + corner ticks — drift on scroll for depth (parallax).
                Kept separate from the portrait so it never conflicts with the 3D tilt. */}
            <Parallax speed={22} className="absolute -left-3 -top-3 -right-3 -bottom-3 pointer-events-none">
              <div className="absolute inset-0 border border-border rounded-md" aria-hidden="true" />
              <span className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-primary" aria-hidden="true" />
              <span className="absolute right-0 top-0 w-4 h-4 border-r-2 border-t-2 border-primary" aria-hidden="true" />
              <span className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-primary" aria-hidden="true" />
              <span className="absolute right-0 bottom-0 w-4 h-4 border-r-2 border-b-2 border-primary" aria-hidden="true" />
            </Parallax>

            {/* tilt + float container */}
            <motion.div
              style={{ rotateX: springRotateX, rotateY: springRotateY, perspective: 1000 }}
              animate={loop ? { y: [0, -8, 0] } : { y: 0 }}
              transition={loop ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
              className="relative z-10"
            >
              <div className="relative h-[440px] sm:h-[500px] md:h-[540px] lg:h-[580px] rounded-md overflow-hidden border border-border bg-card shadow-elevated">
                {/* portrait — AVIF (15KB) → WebP (28KB) → PNG fallback, eager + high priority */}
                <picture>
                  <source srcSet={developerPortraitAvif} type="image/avif" />
                  <source srcSet={developerPortraitWebp} type="image/webp" />
                  <img
                    src={developerPortrait}
                    alt="Portrait de Johary Manantena, développeur full-stack"
                    width={380}
                    height={580}
                    decoding="async"
                    // React 18 doesn't map camelCase `fetchPriority`; pass the lowercase
                    // DOM attribute directly to keep the priority hint without the warning.
                    {...{ fetchpriority: "high" }}
                    className="w-full h-full object-cover object-center"
                  />
                </picture>

                {/* animated scan line — pure transform, GPU-cheap; unmounts when
                    reduced-motion is set or the Hero scrolls off screen */}
                {loop && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ y: "-10%", opacity: 0 }}
                    animate={{ y: ["0%", "100%"], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                    className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent pointer-events-none"
                  />
                )}

                {/* bottom mono caption strip */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-3 py-2 bg-background/70 backdrop-blur-sm border-t border-border">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-foreground/90">
                    JOHARY MANANTENA
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-primary">full-stack.dev</span>
                </div>
              </div>
            </motion.div>

            {/* Floating mono chips — drift at different speeds for depth.
                pointer-events-none so they never intercept the tilt/CTAs. */}
            <Parallax speed={14} className="pointer-events-none absolute -left-9 top-12 hidden md:block z-20">
              <span className="card-swiss shadow-soft inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-card/90 backdrop-blur-sm">
                <Code2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] leading-none text-foreground/85">clean code</span>
              </span>
            </Parallax>
            <Parallax speed={30} className="pointer-events-none absolute -right-7 bottom-24 hidden md:block z-20">
              <span className="card-swiss shadow-soft inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-card/90 backdrop-blur-sm">
                <Layers className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] leading-none text-foreground/85">web · mobile</span>
              </span>
            </Parallax>
          </div>
        </motion.div>
      </div>

      {/* ── Mono stats strip ───────────────────────────────────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-6 px-5 py-2.5 rounded-md bg-card/80 backdrop-blur-sm border border-border/60"
      >
        {stats.map(({ label, to, suffix, text }, i) => (
          <div key={label} className="flex items-center gap-6">
            {i > 0 && <span className="h-6 w-px bg-border" aria-hidden="true" />}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-1">{label}</span>
              <span className="font-display text-sm font-bold leading-none">
                {typeof to === "number" ? <CountUp to={to} suffix={suffix} /> : text}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 right-6 hidden lg:block"
      >
        <motion.button
          type="button"
          onClick={() => onNavigate("apropos")}
          animate={loop ? { y: [0, 6, 0] } : { y: 0 }}
          transition={loop ? { duration: 2, repeat: Infinity } : undefined}
          aria-label={t("hero.scrollAria")}
          className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-2 py-1"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            {t("hero.scroll")}
          </span>
          <ArrowDown className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
