import type { Bi } from "@/i18n";

export interface ExpItem {
  title: Bi;
  company?: string;
  school?: string;
  companyUrl?: string;
  period: Bi;
  current?: boolean;
  description: Bi;
  technologies?: string[];
  result?: Bi;
  highlight?: Bi;
}

export const experiences: ExpItem[] = [
  {
    title: { fr: "Développeur Full-Stack", en: "Full-Stack Developer" },
    company: "BeautyBay",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    description: {
      fr: "Développement full-stack de l’écosystème e-commerce BeautyBay, web et mobile : évolution des interfaces clientes et de l’API, intégration de données entre les systèmes métier (flux produits, stocks et commandes synchronisés), intégration mobile React Native et services cloud AWS (stockage S3, automatisations).",
      en: "Full-stack development of the BeautyBay e-commerce ecosystem, web and mobile: customer-facing interfaces and API work, data integration across business systems (synchronised product, stock and order flows), React Native mobile integration and AWS cloud services (S3 storage, automations).",
    },
    technologies: ["ReactJS", "React Native", "Node.js", "GraphQL", "AWS"],
  },
  {
    title: {
      fr: "Développeur – Freelance On-site",
      en: "Developer – On-site Freelance",
    },
    company: "Regard Beauty",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    description: {
      fr: "Mission freelance à temps plein en présentiel : développement et maintenance d’applications internes, collaboration directe avec les équipes métier.",
      en: "Full-time on-site freelance mission: building and maintaining internal applications, working directly with the business teams.",
    },
  },
  {
    title: {
      fr: "Projet SaaS – Gestion des Écoles",
      en: "SaaS Project – School Management",
    },
    company: "Levitation",
    period: { fr: "Jan 2026 – Mai 2026", en: "Jan 2026 – May 2026" },
    current: false,
    description: {
      fr: "Conception et développement d’une plateforme SaaS scolaire complète : gestion des notes et bulletins, facturation, automatisation des workflows (emails/SMS via n8n), gestion multi-établissements.",
      en: "Design and development of a complete school SaaS platform: grades and report cards, billing, workflow automation (emails/SMS via n8n), multi-school management.",
    },
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    result: {
      fr: "Plateforme livrée en production – edu.levitation.mg",
      en: "Platform shipped to production – edu.levitation.mg",
    },
  },
  {
    title: {
      fr: "Application Logistique & Transport",
      en: "Logistics & Transport App",
    },
    company: "Konecta Madagascar",
    period: { fr: "Sep – Déc 2025", en: "Sep – Dec 2025" },
    current: false,
    description: {
      fr: "Digitalisation du transport du personnel : suivi des livraisons en temps réel, optimisation des trajets (OSRM), tableaux de bord multi-profils (admin, chauffeur, RH).",
      en: "Digitalising staff transport: real-time delivery tracking, route optimisation (OSRM), multi-role dashboards (admin, driver, HR).",
    },
    technologies: ["React Native", "ReactJS", "Node.js", "Firebase", "MySQL"],
    result: {
      fr: "Réduction de 30% des temps d’attente",
      en: "30% reduction in waiting times",
    },
  },
];

export const education: ExpItem[] = [
  {
    title: {
      fr: "Licence en Informatique",
      en: "Bachelor’s in Computer Science",
    },
    school: "IT-University",
    period: "2022 – 2025",
    description: {
      fr: "Formation complète en algorithmique, bases de données, programmation orientée objet, développement web et mobile. Projets académiques variés sur toute la durée du cursus.",
      en: "Comprehensive training in algorithms, databases, object-oriented programming, web and mobile development. Varied academic projects throughout the curriculum.",
    },
    highlight: { fr: "Diplômé", en: "Graduated" },
  },
  {
    title: { fr: "Parcours IA Générative", en: "Generative AI Track" },
    school: "Google Cloud Skill Boost",
    period: { fr: "En cours", en: "Ongoing" },
    current: true,
    description: {
      fr: "Formation en Intelligence Artificielle Générative — prompting, modèles de langage, intégration d’IA dans des applications métier.",
      en: "Generative AI training — prompting, language models, integrating AI into business applications.",
    },
    highlight: { fr: "Google Cloud", en: "Google Cloud" },
  },
  {
    title: { fr: "Baccalauréat Série D", en: "High-School Diploma (Sciences)" },
    school: "Lycée Manjary Soa",
    period: "2022",
    description: {
      fr: "Baccalauréat scientifique option Sciences de la Vie et de la Terre (série D).",
      en: "Scientific high-school diploma, Life & Earth Sciences track (série D).",
    },
    highlight: { fr: "Mention obtenue", en: "With honours" },
  },
];
