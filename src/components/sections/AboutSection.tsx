import { motion, useReducedMotion } from "framer-motion";
import { Code, Palette, Rocket, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const AboutSection = () => {
  const reduce = useReducedMotion();
  const values = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Du code maintenable, lisible et documenté, pensé pour durer.",
    },
    {
      icon: Palette,
      title: "Produit",
      description: "Des interfaces claires et utiles, au service de l'usage réel.",
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "J'optimise chaque couche pour une expérience fluide.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Communication directe et travail efficace en équipe.",
    },
  ];

  return (
    <section className="section-container">
      <div className="section-content">
        <SectionHeading
          index="01"
          label="À propos"
          title="Qui suis-je ?"
          description="Développeur full-stack, je conçois des applications web et mobile de bout en bout — du modèle de données jusqu'à l'interface finale."
          className="mb-8 md:mb-12 lg:mb-16"
        />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            className="card-swiss p-5 sm:p-6 lg:p-8"
          >
            <span className="kicker">Mon parcours</span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold mt-1.5 mb-3 sm:mb-4">
              De la formation au terrain
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Diplômé d'une Licence en Informatique (IT-University, 2022–2025), je me suis
              spécialisé en développement full-stack : Java, Python, PHP, C/C#, et les frameworks
              React, React Native, Spring Boot, Laravel et Symfony.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Depuis, j'enchaîne les missions concrètes : digitalisation du transport du personnel
              chez Konecta, plateforme SaaS scolaire chez Levitation, et aujourd'hui développement
              web &amp; mobile en freelance pour une marque de cosmétiques.
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
            className="card-swiss p-5 sm:p-6 lg:p-8"
          >
            <span className="kicker">Ma philosophie</span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold mt-1.5 mb-3 sm:mb-4">
              Simple, solide, livré
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Je crois aux solutions simples et bien architecturées, qui répondent précisément au
              besoin métier plutôt qu'à la tendance du moment — et qui restent maintenables dans le temps.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Curieux des nouvelles technologies, notamment l'IA générative (certifié Google Cloud),
              je cherche à affiner ma pratique et à livrer des produits fiables, du premier commit à la production.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {values.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.1 * index }}
              className="group card-swiss p-3 sm:p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h4 className="text-sm sm:text-base lg:text-lg font-display font-semibold mb-1 sm:mb-2">{title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
