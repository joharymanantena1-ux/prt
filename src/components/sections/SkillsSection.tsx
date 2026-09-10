import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n";
const skills = [
  {
    n: "01",
    fr: "Interfaces & mobile",
    en: "Interfaces & mobile",
    tech: "React / TypeScript / React Native",
    other: "Next.js · Vue.js · Angular · Tailwind CSS · Flutter",
    frProof: "BeautyBay · EduContent",
    enProof: "BeautyBay · EduContent",
  },
  {
    n: "02",
    fr: "Architecture & API",
    en: "Architecture & APIs",
    tech: "Node.js / Laravel / Spring Boot",
    other: "GraphQL · REST · Symfony · Django · Java · C#",
    frProof: "Levitation · OTA Server",
    enProof: "Levitation · OTA Server",
  },
  {
    n: "03",
    fr: "Données & infrastructure",
    en: "Data & infrastructure",
    tech: "PostgreSQL / MySQL / AWS",
    other: "Docker · Firebase · Linux · Git · Oracle · PostGIS",
    frProof: "Konecta · DayByDay CRM",
    enProof: "Konecta · DayByDay CRM",
  },
  {
    n: "04",
    fr: "Intégration & automatisation",
    en: "Integration & automation",
    tech: "Python / Shopify / n8n",
    other: "Liquid · Shopify API · XML · CSV · Frappe",
    frProof: "Paul Beuscher · The Cool Republic",
    enProof: "Paul Beuscher · The Cool Republic",
  },
];
export default function SkillsSection() {
  const { lang } = useT();
  return (
    <section
      id="competences"
      className="skills-section shell section-space"
      aria-labelledby="skills-title"
    >
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow section-kicker">03 / Expertise</p>
          <h2 id="skills-title">
            {lang === "fr" ? (
              <>
                La bonne stack.
                <br />
                Pour le bon usage.
              </>
            ) : (
              <>
                The right stack.
                <br />
                For the right job.
              </>
            )}
          </h2>
        </div>
        <p>
          {lang === "fr"
            ? "Un socle full-stack, enrichi sur le terrain. Chaque outil est relié à un usage concret."
            : "A full-stack foundation, strengthened in practice. Every tool connects to a real use case."}
        </p>
      </Reveal>
      <div className="skill-list">
        {skills.map((s) => (
          <Reveal key={s.n}>
            <article className="skill-row">
              <span className="eyebrow skill-number">{s.n}</span>
              <h3>{s[lang]}</h3>
              <div>
                <p className="skill-tech">{s.tech}</p>
                <p className="skill-other">{s.other}</p>
                <a href="#projets" className="skill-proof eyebrow">
                  ↗ {s[lang === "fr" ? "frProof" : "enProof"]}
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
