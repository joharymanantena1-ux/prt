import type { Bi } from "@/i18n";
/* Logos d'établissement, couleurs d'origine, en deux versions selon le fond
   (scripts/generate-school-logos.mjs). */
import estiaDark from "@/assets/schools/estia-dark.png";
import estiaLight from "@/assets/schools/estia-light.png";
import googleCloudDark from "@/assets/schools/google-cloud-dark.svg";
import googleCloudLight from "@/assets/schools/google-cloud-light.svg";
import ituDark from "@/assets/schools/it-university-dark.png";
import ituLight from "@/assets/schools/it-university-light.png";

/** `scale` équilibre optiquement des logos de proportions différentes. */
export interface SchoolLogo {
  light: string;
  dark: string;
  scale?: number;
}

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
  logo?: SchoolLogo;
}

export const experiences: ExpItem[] = [
  /* Une seule entrée en cours : la mission freelance chez Regard Beauty, dont
     l’écosystème BeautyBay est le chantier principal. Les deux étaient listées
     séparément avec les mêmes dates, ce qui se lisait comme un doublon. Le
     travail BeautyBay reste détaillé en étude de cas 01 sur la page. */
  {
    title: {
      fr: "Développeur Full-Stack – Freelance on-site",
      en: "Full-Stack Developer – On-site Freelance",
    },
    company: "Regard Beauty",
    period: { fr: "Avr 2026 – Présent", en: "Apr 2026 – Present" },
    current: true,
    description: {
      fr: "Mission freelance à temps plein en présentiel. Développement full-stack de l’écosystème e-commerce BeautyBay, web et mobile : évolution des interfaces clientes et de l’API, intégration de données entre les systèmes métier (flux produits, stocks et commandes synchronisés), intégration mobile React Native et services cloud AWS (stockage S3, automatisations). Maintenance des applications internes, en lien direct avec les équipes métier.",
      en: "Full-time on-site freelance mission. Full-stack development of the BeautyBay e-commerce ecosystem, web and mobile: customer-facing interfaces and API work, data integration across business systems (synchronised product, stock and order flows), React Native mobile integration and AWS cloud services (S3 storage, automations). Maintenance of internal applications, working directly with the business teams.",
    },
    technologies: ["ReactJS", "React Native", "Node.js", "GraphQL", "AWS"],
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
    title: { fr: "Master IA & Big Data", en: "Master’s in AI & Big Data" },
    school: "eBIHAR · ESTIA",
    period: { fr: "2026 – en cours", en: "2026 – present" },
    current: true,
    description: {
      fr: "Master of Science BIHAR (Big Data & IA) de l’ESTIA Institute of Technology, suivi en ligne : ingénierie et analyse de données massives, apprentissage automatique et intégration de l’IA dans des applications, avec des modules Oracle et Google.",
      en: "ESTIA Institute of Technology’s Master of Science BIHAR (Big Data & AI), taken online: big-data engineering and analytics, machine learning and bringing AI into applications, with Oracle and Google modules.",
    },
    highlight: { fr: "Master of Science", en: "Master of Science" },
    logo: { light: estiaLight, dark: estiaDark, scale: 1.3 },
  },
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
    logo: { light: ituLight, dark: ituDark },
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
    logo: { light: googleCloudLight, dark: googleCloudDark, scale: 0.8 },
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
