import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n";
export default function AboutSection() {
  const { lang } = useT();
  return (
    <section
      id="apropos"
      className="about-section shell section-space"
      aria-labelledby="about-title"
    >
      <Reveal>
        <p className="eyebrow section-kicker">
          02 / {lang === "fr" ? "L’approche" : "The approach"}
        </p>
        <div className="about-layout">
          <h2 id="about-title">
            {lang === "fr" ? (
              <>
                Comprendre.
                <br />
                Construire.
                <br />
                <span>Faire avancer.</span>
              </>
            ) : (
              <>
                Understand.
                <br />
                Build.
                <br />
                <span>Move forward.</span>
              </>
            )}
          </h2>
          <div className="about-copy">
            <p className="about-lead">
              {lang === "fr"
                ? "Ce qui m’intéresse, c’est ce que le code permet de faire."
                : "What interests me is what code makes possible."}
            </p>
            <p>
              {lang === "fr"
                ? "Simplifier le quotidien d’une école. Coordonner le transport d’une équipe. Relier une boutique à son application mobile. Des contextes différents qui demandent d’abord de comprendre les personnes et leurs usages."
                : "Make a school’s day easier. Coordinate a team’s transport. Connect a store to its mobile app. Different contexts that first require an understanding of people and how they work."}
            </p>
            <p>
              {lang === "fr"
                ? "Formé à IT-University, à Madagascar, je développe de bout en bout. J’aime passer du modèle de données au dernier détail d’interface, en gardant une architecture lisible et maintenable."
                : "Trained at IT-University in Madagascar, I build end to end. I enjoy moving from the data model to the final interface detail, keeping the architecture clear and maintainable."}
            </p>
            <a href="#competences" className="text-link">
              {lang === "fr"
                ? "Les outils derrière les idées"
                : "The tools behind the ideas"}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </Reveal>
      <Reveal className="approach-principles">
        <div>
          <span className="eyebrow">
            01 — {lang === "fr" ? "Le besoin d’abord" : "Needs first"}
          </span>
          <p>
            {lang === "fr"
              ? "La technique au service de l’usage."
              : "Technology in service of people."}
          </p>
        </div>
        <div>
          <span className="eyebrow">
            02 — {lang === "fr" ? "De bout en bout" : "End to end"}
          </span>
          <p>
            {lang === "fr"
              ? "De la première idée à la production."
              : "From the first idea to production."}
          </p>
        </div>
        <div>
          <span className="eyebrow">
            03 — {lang === "fr" ? "Pensé pour durer" : "Built to last"}
          </span>
          <p>
            {lang === "fr"
              ? "Du code clair, qui peut évoluer."
              : "Clear code with room to evolve."}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
