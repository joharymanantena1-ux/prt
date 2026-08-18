import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi } from "@/i18n";

/* Principes de travail — liste éditoriale numérotée (filets, pas de cartes). */
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
 * À propos — composition éditoriale asymétrique : le récit (colonne large)
 * face à la philosophie (colonne étroite, filet hairline), puis les principes
 * en liste numérotée sur filets. Aucune carte : la hiérarchie est portée par
 * la typographie et les espacements.
 */
const AboutSection = () => {
  const reduce = useReducedMotion();
  const { t, lang } = useT();

  return (
    <section className="section-container">
      <div className="section-content">
        <SectionHeading
          index="01"
          label={t("about.label")}
          title={t("about.title")}
          description={t("about.desc")}
          className="mb-10 md:mb-14 lg:mb-20"
        />

        {/* ── Récit / philosophie — asymétrie 7/4 sur douze colonnes ────── */}
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 mb-14 md:mb-16 lg:mb-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
            className="lg:col-span-7"
          >
            <span className="kicker">{t("about.journeyKicker")}</span>
            <h3 className="mt-3 mb-5 font-display font-semibold text-2xl sm:text-3xl lg:text-[2.1rem] leading-[1.12] tracking-tight max-w-md">
              {t("about.journeyTitle")}
            </h3>
            {/* Premier paragraphe légèrement plus grand : entrée de lecture */}
            <p className="text-lg text-foreground/85 leading-relaxed mb-4 max-w-[62ch]">
              {t("about.journeyP1")}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-[62ch]">
              {t("about.journeyP2")}
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.12, ease: EASE }}
            className="lg:col-span-4 lg:col-start-9 lg:pt-16 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pl-10"
          >
            <span className="kicker">{t("about.philoKicker")}</span>
            <h3 className="mt-3 mb-4 font-display font-semibold text-xl sm:text-2xl leading-snug tracking-tight">
              {t("about.philoTitle")}
            </h3>
            <p className="text-sm sm:text-[0.95rem] text-muted-foreground leading-relaxed mb-3">
              {t("about.philoP1")}
            </p>
            <p className="text-sm sm:text-[0.95rem] text-muted-foreground leading-relaxed">
              {t("about.philoP2")}
            </p>
          </motion.div>
        </div>

        {/* ── Principes — rangées sur filets, numérotation mono ──────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {values.map(({ title, description }, index) => (
            <motion.div
              key={tx(title, lang)}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.07 * index, ease: EASE }}
              className="group border-t border-border pt-5 transition-colors duration-300 hover:border-primary/60"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="font-display font-semibold text-base lg:text-lg tracking-tight">
                  {tx(title, lang)}
                </h4>
                <span className="font-mono text-[11px] text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tx(description, lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
