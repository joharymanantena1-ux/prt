import { lazy, Suspense, useState } from "react";
import { ArrowUpRight, Orbit } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n";
import Lines from "@/components/motion/Lines";
import TechMarquee from "@/components/TechMarquee";

/* La constellation (données de tous les projets + rendu SVG) reste hors du
   premier chargement : importée au premier clic, préchargée au survol. */
const loadUniverse = () => import("@/components/universe/TechUniverse");
const TechUniverse = lazy(loadUniverse);
export default function SkillsSection() {
  const { lang } = useT();
  /* `null` tant qu'elle n'a jamais été ouverte : le module reste à part. */
  const [universeOpen, setUniverseOpen] = useState<boolean | null>(null);
  return (
    <section
      id="competences"
      className="skills-section shell section-space"
      aria-labelledby="skills-title"
    >
      <Reveal className="section-heading" at={15}>
        <div>
          <p className="eyebrow section-kicker">03 / Expertise</p>
          <h2 id="skills-title">
            <Lines
              lines={
                lang === "fr"
                  ? ["La bonne stack.", "Pour le bon usage."]
                  : ["The right stack.", "For the right job."]
              }
            />
          </h2>
        </div>
        <p>
          {lang === "fr"
            ? "Un socle full-stack, enrichi sur le terrain. Chaque outil est relié à un usage concret."
            : "A full-stack foundation, strengthened in practice. Every tool connects to a real use case."}
        </p>
      </Reveal>
      <TechMarquee />
      <Reveal className="universe-cta" at={10}>
        <p>
          {lang === "fr"
            ? "Toutes les technologies de mes projets, reliées entre elles : où je les ai utilisées, et avec quoi."
            : "Every technology from my projects, connected: where I used each one, and with what."}
        </p>
        <button
          type="button"
          className="universe-open"
          onClick={() => setUniverseOpen(true)}
          onPointerEnter={loadUniverse}
          onFocus={loadUniverse}
        >
          <Orbit size={18} aria-hidden="true" />
          {lang === "fr"
            ? "Explorer mon univers tech"
            : "Explore my tech universe"}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </Reveal>
      {universeOpen !== null && (
        <Suspense fallback={null}>
          <TechUniverse
            open={universeOpen}
            onClose={() => setUniverseOpen(false)}
          />
        </Suspense>
      )}
    </section>
  );
}
