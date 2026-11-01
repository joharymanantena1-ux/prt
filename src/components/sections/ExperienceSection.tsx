import { experiences, education } from "@/data/experience";
import { useT, tx } from "@/i18n";
import Reveal from "@/components/motion/Reveal";
import Lines from "@/components/motion/Lines";
import type { CSSProperties } from "react";
export default function ExperienceSection() {
  const { lang } = useT();
  return (
    <section
      id="parcours"
      className="experience-section section-space"
      aria-labelledby="experience-title"
    >
      <div className="shell experience-layout">
        <Reveal className="experience-heading" at={15}>
          <p className="eyebrow section-kicker">
            04 / {lang === "fr" ? "Parcours" : "Experience"}
          </p>
          <h2 id="experience-title">
            <Lines
              lines={
                lang === "fr"
                  ? ["Apprendre.", "Faire.", "Évoluer."]
                  : ["Learn.", "Build.", "Grow."]
              }
            />
          </h2>
          <p>
            {lang === "fr"
              ? "Des fondations solides, des missions concrètes et toujours quelque chose à apprendre."
              : "Solid foundations, real projects and always something new to learn."}
          </p>
        </Reveal>
        <div className="timeline">
          {experiences.map((item) => (
            <Reveal key={item.company}>
              <article className="timeline-entry">
                <div className="timeline-meta eyebrow">
                  <span>{tx(item.period, lang)}</span>
                  {item.current && (
                    <span className="current-label">
                      {lang === "fr" ? "En cours" : "Current"}
                    </span>
                  )}
                </div>
                <h3>{item.company}</h3>
                <p className="timeline-role">{tx(item.title, lang)}</p>
                <p>{tx(item.description, lang)}</p>
                {item.technologies && (
                  <p className="eyebrow timeline-stack">
                    {item.technologies.join(" · ")}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
          <details className="education-details">
            <summary>
              <span className="education-summary">
                {lang === "fr"
                  ? "Formation & apprentissage"
                  : "Education & learning"}
              </span>
            </summary>
            {education.map((item, index) => (
              <article
                key={item.school}
                style={{ "--i": index } as CSSProperties}
              >
                <div className="education-head">
                  <p className="eyebrow">
                    {tx(item.period, lang)} · {item.school}
                  </p>
                  {/* Décoratif : l'établissement est déjà nommé à côté. Une
                      version par plan, l'autre reste masquée (et non chargée). */}
                  {item.logo && (
                    <span
                      className="school-logo"
                      style={{ "--s": item.logo.scale ?? 1 } as CSSProperties}
                      aria-hidden="true"
                    >
                      <img
                        className="on-light"
                        src={item.logo.light}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        className="on-dark"
                        src={item.logo.dark}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  )}
                </div>
                <h3>{tx(item.title, lang)}</h3>
                <p>{tx(item.description, lang)}</p>
              </article>
            ))}
          </details>
        </div>
      </div>
    </section>
  );
}
