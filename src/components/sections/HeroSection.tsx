import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import MorphingRoles from "@/components/motion/MorphingRoles";
import { useT } from "@/i18n";

// Portrait détouré, servi depuis /public (URL stable) pour que index.html puisse
// le précharger avant même que ce chunk soit évalué : c'est l'élément LCP.
// 440px couvre le mobile, 880px le desktop en 2x — AVIF ~18/48 Ko, WebP en repli.
// `SIZES` est dupliqué dans le <link rel="preload"> d'index.html — garder en phase.
const SIZES = "(min-width: 1280px) 460px, (min-width: 1024px) 42vw, (min-width: 640px) 400px, 78vw";
const PORTRAIT = {
  avif: "/portrait/johary-440.avif 440w, /portrait/johary-880.avif 880w",
  webp: "/portrait/johary-440.webp 440w, /portrait/johary-880.webp 880w",
  png: "/portrait/johary-660.png",
  // Dimensions intrinsèques du recadrage (ratio 0.634) — réserve la place et
  // évite tout décalage de mise en page au chargement.
  width: 440,
  height: 694,
};

interface HeroSectionProps {
  /** Navigue vers une section par son id (ex. "projets", "contact"). */
  onNavigate: (id: string) => void;
}

const SOCIALS = [
  { icon: Github, href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
  { icon: Mail, href: "mailto:andrianmanantena@gmail.com", label: "Email" },
];

/* ── Zone portrait — composition éditoriale ─────────────────────────────────
   Le portrait détouré s'appuie sur un panneau discret (la tête déborde du
   panneau pour la profondeur), ponctué d'une trame de points et d'une équerre
   accent. Le cartouche d'identité (border-left accent, fond translucide) chevauche
   le bas du panneau. Aucune animation : c'est l'élément LCP, il peint direct. */
const HeroPortrait = () => {
  const { t } = useT();
  const reduce = useReducedMotion();

  // Parallax de sortie : la trame décorative glisse un peu plus lentement que
  // le scroll (transform-only, hors LCP). Nul sous prefers-reduced-motion.
  const { scrollY } = useScroll();
  const rawDotsY = useTransform(scrollY, [0, 700], [0, -46]);
  const dotsY = reduce ? 0 : rawDotsY;

  // Cartouche : fermé au premier rendu, s'ouvre (clip-path) quand la zone du
  // portrait devient visible, puis reste statique. On observe le CONTENEUR du
  // portrait, pas le cartouche lui-même : Chrome applique le clip-path à la
  // géométrie d'intersection, un élément entièrement clippé n'intersecte jamais.
  // Ouvert d'emblée sous reduced-motion ; observation unique, puis déconnexion.
  const portraitRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => {
    const el = portraitRef.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCartOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCartOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-center flex justify-center lg:justify-start">
      <div ref={portraitRef} className="relative w-[min(78vw,340px)] sm:w-[400px] lg:w-full lg:max-w-[420px] xl:max-w-[460px]">

        {/* Panneau d'appui — commence sous la tête, file jusqu'au sol (flat, éditorial) */}
        <div
          className="absolute inset-x-0 top-[14%] bottom-0 rounded-md border border-border/70 bg-secondary/35 dark:bg-secondary/25"
          aria-hidden="true"
        />

        {/* Trame de points — coin haut-gauche, à cheval sur le bord du panneau.
            Parallax de sortie très léger (transform-only, nul sous reduced-motion). */}
        <motion.div
          className="pointer-events-none absolute top-[8%] -left-5 sm:-left-7 w-24 h-28 opacity-80"
          style={{
            y: dotsY,
            backgroundImage: "radial-gradient(hsl(var(--primary) / 0.45) 1.5px, transparent 2px)",
            backgroundSize: "13px 13px",
            WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
            maskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        {/* Équerre accent — coin haut-droit du panneau */}
        <span
          className="pointer-events-none absolute top-[14%] right-0 w-10 h-10 -translate-y-px translate-x-px border-t-2 border-r-2 border-primary rounded-tr-md"
          aria-hidden="true"
        />

        {/* Rail éditorial vertical — coordonnées d'Antananarivo (décoratif) */}
        <div
          className="pointer-events-none absolute -left-9 xl:-left-11 bottom-10 hidden xl:flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span className="h-16 w-px bg-border" />
          <span
            className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground/70 uppercase whitespace-nowrap"
            style={{ writingMode: "vertical-rl" }}
          >
            18.8792° S · 47.5079° E — TNR
          </span>
          {/* « Jm » en binaire — détail dev statique, volontairement à peine visible */}
          <span
            className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35 whitespace-nowrap select-none"
            style={{ writingMode: "vertical-rl" }}
          >
            01001010 01101101
          </span>
        </div>

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
            // React 18 ne mappe pas `fetchPriority` : attribut DOM en minuscules
            // pour conserver l'indice de priorité sans warning console.
            {...{ fetchpriority: "high" }}
            className="relative z-10 w-full h-auto select-none"
          />
        </picture>

        {/* Ligne de sol — ancre la silhouette, un seul filet */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />

        {/* Cartouche — localisation seule : le nom vit désormais dans le h1,
            le répéter ici ferait doublon. */}
        <div
          className="absolute left-3 sm:left-4 bottom-4 sm:bottom-6 z-20 border-l border-primary rounded-r-md bg-background/85 px-4 py-2.5"
          style={{
            clipPath: cartOpen ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className={`transition-opacity duration-300 ${cartOpen ? "opacity-100 delay-200" : "opacity-0"}`}>
            <p className="font-mono text-[10px] xl:text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("hero.location")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hero — composition éditoriale en deux zones : portrait-panneau à gauche
 * (~44 %), présentation à droite (~56 %). En mobile, l'ordre est spécifique :
 * eyebrow → identité → description → portrait → actions → stats (via `order-*`,
 * la grille ne s'activant qu'à partir de lg).
 *
 * Perf : entrées en CSS pur (`.rise`, transform/opacity), aucune dépendance
 * d'animation JS ; le portrait (LCP) n'est pas animé et peint immédiatement.
 */
const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const { t } = useT();
  const reduce = useReducedMotion();

  // La trame technique du fond recule légèrement au scroll (profondeur).
  const { scrollY } = useScroll();
  const rawGridY = useTransform(scrollY, [0, 700], [0, 70]);
  const gridY = reduce ? 0 : rawGridY;

  const stats: { label: string; value: string }[] = [
    { label: t("hero.statExp"), value: `3${t("hero.statExpSuffix")}` },
    { label: t("hero.statProjects"), value: "30+" },
    { label: t("hero.statStatus"), value: t("hero.statStatusValue") },
  ];

  return (
    <section className="section-container min-h-[100svh] items-center relative overflow-hidden">
      {/* Trame technique discrète (décorative), dissoute vers les bords ;
          parallax arrière très léger au scroll */}
      <motion.div
        className="absolute inset-0 grid-bg opacity-[0.28] pointer-events-none"
        style={{
          y: gridY,
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 45% 42%, black 20%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 70% at 45% 42%, black 20%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-y-10 lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:grid-rows-[auto_auto] lg:gap-y-9 lg:gap-x-14 xl:gap-x-20">

        {/* ── Identité : eyebrow → nom → métier → description ───────────── */}
        <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end text-center lg:text-left">
          <div className="rise flex flex-wrap items-center gap-x-3 gap-y-1.5 justify-center lg:justify-start">
            {/* Technologies en défilement automatique — un mot à la fois,
                en pause hors écran et sous prefers-reduced-motion. */}
            <span className="label-mono !text-primary inline-flex items-center gap-1.5">
              <MorphingRoles items={["React", "Node.js", "TypeScript", "React Native", "Laravel", "Spring Boot"]} />
              <span className="caret-terminal" aria-hidden="true" />
            </span>
            <span className="h-px w-8 bg-border hidden sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              {t("hero.available")}
            </span>
          </div>

          <p className="rise mt-6 text-base sm:text-lg text-muted-foreground font-medium" style={{ animationDelay: "60ms" }}>
            {t("hero.greeting")}
          </p>

          {/* Un seul h1 : nom + métier (SEO). Le nom porte le grand sérif sur
              deux lignes légèrement décalées ; le métier suit, « Full-Stack »
              en italique sérif royal — le contraste typographique fait l'accent. */}
          <h1 className="rise mt-1.5" style={{ animationDelay: "90ms" }}>
            <span className="block font-display font-semibold leading-[1.02] text-[clamp(2.5rem,5vw,4.5rem)]">
              <span className="block">Johary</span>
              <span className="block lg:pl-[0.75em]">
                Manantena<span className="text-primary">.</span>
              </span>
            </span>
            {/* L'italique royale porte sur « Full-Stack », quelle que soit sa
                position dans la langue (FR : Développeur Full-Stack ;
                EN : Full-Stack Developer). */}
            <span className="mt-4 block font-body font-medium tracking-normal text-[clamp(1.15rem,1.7vw,1.5rem)] text-foreground/80 leading-snug">
              {[t("hero.roleL1"), t("hero.roleL2")].map((part, i) => (
                <span key={part}>
                  {i > 0 && " "}
                  {/^full-stack$/i.test(part) ? (
                    <em className="font-display italic font-medium text-primary text-[1.12em]">{part}</em>
                  ) : (
                    part
                  )}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="rise mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
            style={{ animationDelay: "150ms" }}
          >
            {t("hero.lead")}
          </p>
        </div>

        {/* ── Portrait (mobile : entre description et actions) ──────────── */}
        <HeroPortrait />

        {/* ── Actions : CTA → réseaux → stats ───────────────────────────── */}
        <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:self-start text-center lg:text-left">
          {/* Hiérarchie d'action : un seul CTA plein (projets), un contour
              (contact), et le CV en lien texte éditorial — trois poids nets. */}
          <div
            className="rise flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 justify-center lg:justify-start"
            style={{ animationDelay: "210ms" }}
          >
            <Button
              size="lg"
              className="rounded-md bg-brand hover:bg-brand/90 text-brand-foreground font-semibold px-7 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              onClick={() => onNavigate("projets")}
            >
              {t("hero.ctaProjects")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-md border-foreground/30 hover:bg-foreground hover:text-background hover:border-foreground font-semibold px-7 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              onClick={() => onNavigate("contact")}
            >
              {t("hero.ctaContact")}
            </Button>
            <a
              href="https://drive.google.com/file/d/1TW1OODP6uhMU2yf7uOci1v-cVwj3qxhh/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="link-editorial inline-flex items-center justify-center sm:justify-start gap-2 min-h-11 text-sm font-semibold text-foreground/85 hover:text-foreground transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 self-center sm:self-auto"
            >
              <Download className="w-4 h-4 text-primary" aria-hidden="true" />
              {t("hero.ctaCV")}
            </a>
          </div>

          <div
            className="rise mt-6 flex gap-2 justify-center lg:justify-start"
            style={{ animationDelay: "270ms" }}
          >
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-border/60 text-foreground/75 hover:text-brand-foreground hover:bg-brand hover:border-brand transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${label} (${t("common.newTab")})`}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Chiffres clés — trois colonnes alignées sur la grille du contenu */}
          <dl
            className="rise mt-8 pt-6 border-t border-border/60 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto lg:mx-0"
            style={{ animationDelay: "330ms" }}
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <dt className="order-2 text-sm text-muted-foreground leading-none">{label}</dt>
                <dd className="order-1 font-display font-semibold leading-none text-[clamp(1.2rem,5.5vw,1.7rem)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Indicateur de défilement — statique, s'anime seulement au survol */}
      <button
        type="button"
        onClick={() => onNavigate("apropos")}
        aria-label={t("hero.scrollAria")}
        className="rise group absolute bottom-6 right-8 lg:right-12 hidden xl:flex flex-col items-center gap-1.5 px-2 py-1 rounded-md text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ animationDelay: "400ms" }}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">{t("hero.scroll")}</span>
        <ArrowDown
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          aria-hidden="true"
        />
      </button>
    </section>
  );
};

export default HeroSection;
