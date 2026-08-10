import { motion, useReducedMotion } from "framer-motion";
import { Code, Palette, Rocket, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi } from "@/i18n";

const values: { icon: typeof Code; title: Bi; description: Bi }[] = [
  {
    icon: Code,
    title: "Clean Code",
    description: { fr: "Du code maintenable, lisible et documenté, pensé pour durer.", en: "Maintainable, readable, documented code built to last." },
  },
  {
    icon: Palette,
    title: { fr: "Produit", en: "Product" },
    description: { fr: "Des interfaces claires et utiles, au service de l'usage réel.", en: "Clear, useful interfaces serving real-world use." },
  },
  {
    icon: Rocket,
    title: "Performance",
    description: { fr: "J'optimise chaque couche pour une expérience fluide.", en: "I optimise every layer for a smooth experience." },
  },
  {
    icon: Users,
    title: "Collaboration",
    description: { fr: "Communication directe et travail efficace en équipe.", en: "Direct communication and effective teamwork." },
  },
];

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
          className="mb-8 md:mb-12 lg:mb-16"
        />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.45 }}
            className="card-swiss p-5 sm:p-6 lg:p-8"
          >
            <span className="kicker">{t("about.journeyKicker")}</span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold mt-1.5 mb-3 sm:mb-4">
              {t("about.journeyTitle")}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">{t("about.journeyP1")}</p>
            <p className="text-base text-muted-foreground leading-relaxed">{t("about.journeyP2")}</p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.08 }}
            className="card-swiss p-5 sm:p-6 lg:p-8"
          >
            <span className="kicker">{t("about.philoKicker")}</span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold mt-1.5 mb-3 sm:mb-4">
              {t("about.philoTitle")}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">{t("about.philoP1")}</p>
            <p className="text-base text-muted-foreground leading-relaxed">{t("about.philoP2")}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {values.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={tx(title, lang)}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.06 * index }}
              className="group card-swiss p-3 sm:p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h4 className="text-sm sm:text-base lg:text-lg font-display font-semibold mb-1 sm:mb-2">{tx(title, lang)}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">{tx(description, lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
