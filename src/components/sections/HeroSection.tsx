import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";

// Portrait détouré, servi depuis /public (URL stable) pour que index.html puisse
// le précharger avant même que ce chunk lazy soit évalué : c'est l'élément LCP.
// 440px couvre le mobile, 880px le desktop en 2x — AVIF ~18/48 Ko, WebP en repli.
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

/**
 * Hero — composition sobre en deux colonnes : texte à gauche, portrait détouré
 * à droite, surmonté d'une plaque nominative inclinée (skewX(-12°)).
 *
 * Perf : aucune dépendance d'animation ici (pas de tilt 3D, de halo, de
 * parallaxe ni de boucle infinie). Les entrées se font en CSS pur (`.rise`,
 * transform/opacity uniquement), donc le LCP ne dépend d'aucun JS d'animation.
 */
const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const { t } = useT();

  const stats: { label: string; value: string }[] = [
    { label: t("hero.statExp"), value: `3${t("hero.statExpSuffix")}` },
    { label: t("hero.statProjects"), value: "30+" },
    { label: t("hero.statStatus"), value: t("hero.statStatusValue") },
  ];

  return (
    <section className="section-container items-center relative overflow-hidden">
      {/* Trame technique, statique et discrète (décorative) — dissoute vers les bords. */}
      <div
        className="absolute inset-0 grid-bg opacity-[0.28] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 55% 40%, black 20%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 70% at 55% 40%, black 20%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">

        {/* ── Colonne texte ────────────────────────────────────────────── */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          {/* Étiquette mono + disponibilité */}
          <div className="rise flex flex-wrap items-center gap-x-3 gap-y-1.5 justify-center lg:justify-start">
            <span className="kicker !text-primary">React · Node.js · TypeScript</span>
            <span className="h-px w-8 bg-border hidden sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              {t("hero.available")}
            </span>
          </div>

          {/* Le nom vit sur la plaque du portrait — ici, le métier fait le titre
              (pas de doublon de nom à l'écran). */}
          <h1 className="rise mt-5 font-display font-bold leading-[0.95] tracking-tight" style={{ animationDelay: "60ms" }}>
            <span className="block text-xl sm:text-2xl text-muted-foreground font-medium mb-1.5">
              {t("hero.greeting")}
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-[4.25rem]">{t("hero.roleL1")}</span>
            <span className="block text-4xl sm:text-5xl lg:text-[4.25rem] text-primary">{t("hero.roleL2")}</span>
          </h1>

          <p
            className="rise mt-5 text-base text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed"
            style={{ animationDelay: "120ms" }}
          >
            {t("hero.lead")}
          </p>

          {/* Actions */}
          <div
            className="rise mt-7 flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start"
            style={{ animationDelay: "180ms" }}
          >
            <Button
              size="lg"
              className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              onClick={() => onNavigate("projets")}
            >
              {t("hero.ctaProjects")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-md border-border hover:border-primary/50 hover:bg-secondary font-semibold px-7 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              onClick={() => onNavigate("contact")}
            >
              {t("hero.ctaContact")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-md border-border hover:border-primary/50 hover:bg-secondary font-semibold px-7 gap-2 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              asChild
            >
              <a
                href="https://drive.google.com/file/d/1TW1OODP6uhMU2yf7uOci1v-cVwj3qxhh/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                {t("hero.ctaCV")}
              </a>
            </Button>
          </div>

          {/* Réseaux */}
          <div
            className="rise mt-6 flex gap-2 justify-center lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-border/60 text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${label} (nouvel onglet)`}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Chiffres clés — en flux, sur une ligne mono séparée par des filets */}
          <dl
            className="rise mt-8 pt-6 border-t border-border/60 flex items-center justify-center lg:justify-start gap-6 sm:gap-8"
            style={{ animationDelay: "300ms" }}
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
                  {label}
                </dt>
                <dd className="font-display text-base sm:text-lg font-bold leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Portrait détouré + plaque nominative inclinée ─────────────── */}
        {/* Pas d'animation d'entrée sur cette colonne : le portrait est l'élément
            LCP, on le laisse peindre immédiatement. */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-[min(74vw,300px)] sm:w-[340px] lg:w-[400px]">
            <picture>
              <source type="image/avif" srcSet={PORTRAIT.avif} sizes="(min-width: 1024px) 400px, (min-width: 640px) 340px, 74vw" />
              <source type="image/webp" srcSet={PORTRAIT.webp} sizes="(min-width: 1024px) 400px, (min-width: 640px) 340px, 74vw" />
              <img
                src={PORTRAIT.png}
                alt="Johary Manantena, développeur full-stack"
                width={PORTRAIT.width}
                height={PORTRAIT.height}
                decoding="async"
                draggable={false}
                // React 18 ne mappe pas `fetchPriority` : on passe l'attribut DOM
                // en minuscules pour conserver l'indice de priorité sans warning.
                {...{ fetchpriority: "high" }}
                className="w-full h-auto select-none"
              />
            </picture>

            {/* Ligne de sol — ancre la silhouette détourée, un seul filet. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Plaque nominative : un seul bandeau incliné (skewX(-12°)) posé sur
                le bas du portrait — le nom uniquement, sans libellé de poste.
                Le texte est contre-incliné pour rester droit. */}
            <div className="absolute inset-x-0 bottom-8 sm:bottom-10 z-10 flex justify-center pointer-events-none">
              <span className="-skew-x-12 border-l-4 border-primary bg-foreground px-5 sm:px-6 py-2 sm:py-2.5 shadow-elevated">
                <span className="block skew-x-12 font-display text-lg sm:text-2xl font-bold tracking-tight text-background whitespace-nowrap">
                  Johary Manantena
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement — statique, s'anime seulement au survol */}
      <button
        type="button"
        onClick={() => onNavigate("apropos")}
        aria-label={t("hero.scrollAria")}
        className="rise group absolute bottom-6 right-6 hidden lg:flex flex-col items-center gap-1.5 px-2 py-1 rounded-md text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ animationDelay: "360ms" }}
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
