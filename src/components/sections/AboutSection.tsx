import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi } from "@/i18n";

/* Principes de travail — liste typographique fluide, sans cartes ni filets. */
const values: { title: Bi; description: Bi }[] = [
  {
    title: "Clean Code",
    description: { fr: "Du code maintenable, lisible et documenté, pensé pour durer.", en: "Maintainable, readable, documented code built to last." },
  },
  {
    title: { fr: "Produit", en: "Product" },
    description: { fr: "Des interfaces claires et utiles, au service de l'usage réel.", en: "Clear, useful interfaces serving real-world use." },
  },
  {
    title: "Performance",
    description: { fr: "J'optimise chaque couche pour une expérience fluide.", en: "I optimise every layer for a smooth experience." },
  },
  {
    title: "Collaboration",
    description: { fr: "Communication directe et travail efficace en équipe.", en: "Direct communication and effective teamwork." },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * À propos — un seul geste éditorial : titre, grand chapeau sérif, puis le
 * récit face à la philosophie (panneau teinté calme), et les principes en
 * liste typographique fluide. Un unique filet, fonctionnel, avant les
 * principes.
 */
const AboutSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();

  return (
    <section className="section-container">
      <div className="section-content max-w-6xl">
        <SectionHeading
          label={t("about.label")}
          title={t("about.title")}
          className="mb-6"
        />

        {/* Chapeau — la description devient une vraie phrase d'ouverture */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="font-display text-[clamp(1.25rem,2vw,1.65rem)] leading-[1.4] text-foreground/90 max-w-3xl mb-12 md:mb-16 [text-wrap:pretty]"
        >
          {t("about.desc")}
        </motion.p>

        {/* Récit / philosophie — 7/5, le panneau teinté donne le contrepoint */}
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12 mb-14 md:mb-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
            className="lg:col-span-7"
          >
            <h3 className="font-display font-semibold text-xl sm:text-2xl leading-snug mb-4">
              {t("about.journeyTitle")}
            </h3>
            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed mb-4 max-w-[60ch]">
              {t("about.journeyP1")}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-[60ch]">
              {t("about.journeyP2")}
            </p>
          </motion.div>

          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.1, ease: EASE }}
            className="lg:col-span-5 rounded-md bg-muted/70 p-7 sm:p-8 lg:self-start"
          >
            <h3 className="font-display font-semibold text-xl leading-snug mb-4">
              {t("about.philoTitle")}
            </h3>
            <p className="text-sm sm:text-[0.95rem] text-muted-foreground leading-relaxed mb-3">
              {t("about.philoP1")}
            </p>
            <p className="text-sm sm:text-[0.95rem] text-muted-foreground leading-relaxed">
              {t("about.philoP2")}
            </p>
          </motion.aside>
        </div>

        {/* Principes — texte courant sur deux colonnes, titre en gras enchâssé */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="border-t border-border pt-8 md:pt-10"
        >
          <p className="kicker mb-6">{t("about.valuesTitle")}</p>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5 max-w-4xl">
            {values.map(({ title, description }) => (
              <p key={tx(title, lang)} className="text-[0.95rem] leading-relaxed text-muted-foreground">
                <strong className="font-semibold text-foreground">{tx(title, lang)}.</strong>{" "}
                {tx(description, lang)}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
