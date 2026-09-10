import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useT } from "@/i18n";
import type { CSSProperties } from "react";

const CV =
  "https://drive.google.com/file/d/1yJRJjEtqKmmKQsksbJHn5eYcRBE6KP-O/view?usp=sharing";

export default function HeroSection() {
  const { lang, t } = useT();
  const lines =
    lang === "fr"
      ? ["Du code.", "Du sens.", "De l’impact."]
      : ["Code.", "Purpose.", "Real impact."];
  return (
    <section id="accueil" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-topline eyebrow">
        <span>{t("hero.role")} / Web & Mobile</span>
        <span className="hero-edition">Portfolio — 2026</span>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-intro">
            Johary Manantena <span aria-hidden="true">↘</span>
          </p>
          <h1
            id="hero-title"
            className="hero-title"
            aria-label={lines.join(" ")}
          >
            {lines.map((line, index) => (
              <span className="hero-line" key={line} aria-hidden="true">
                <span style={{ "--line": index } as CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-description">
            {lang === "fr"
              ? "Je transforme les besoins métier en applications web et mobile. De l’architecture à l’interface, avec le souci du détail."
              : "I turn business needs into web and mobile applications. From architecture to interface, with an eye for detail."}
          </p>
          <div className="hero-actions">
            <a href="#projets" className="button-primary">
              {t("hero.ctaProjects")}
              <ArrowDown size={18} />
            </a>
            <a
              href={CV}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {lang === "fr" ? "Mon CV" : "My résumé"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <figure className="hero-portrait">
          <div className="portrait-art" aria-hidden="true">
            <span className="portrait-orbit orbit-one" />
            <span className="portrait-orbit orbit-two" />
            <span className="portrait-cross">+</span>
            <span className="portrait-type">JM</span>
          </div>
          <picture>
            <source
              type="image/avif"
              srcSet="/portrait/johary-440.avif 440w, /portrait/johary-880.avif 880w"
              sizes="(max-width: 767px) 200px, (max-width: 1199px) 38vw, 460px"
            />
            <source
              type="image/webp"
              srcSet="/portrait/johary-440.webp 440w, /portrait/johary-880.webp 880w"
              sizes="(max-width: 767px) 200px, (max-width: 1199px) 38vw, 460px"
            />
            <img
              src="/portrait/johary-440.webp"
              alt={t("common.portraitAlt")}
              width="440"
              height="694"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption>
            <span className="eyebrow">Antananarivo, MG</span>
            <span className="portrait-caption">
              {lang === "fr"
                ? "Un esprit curieux.\nDes solutions concrètes."
                : "A curious mind.\nPractical solutions."}
            </span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </figcaption>
        </figure>
      </div>
      <div className="hero-foot">
        <span className="eyebrow">
          React · TypeScript · Node.js · React Native
        </span>
        <a href="#projets" className="eyebrow">
          {lang === "fr" ? "La suite, en projets" : "Discover the work"}
          <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
