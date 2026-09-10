import type { Bi } from "@/i18n";

export interface Project {
  title: string;
  description: Bi;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Marks the flagship work — renders a small "Sélection" tag on the card. */
  featured?: boolean;
  /** Short functional highlights — rendered as a compact mono checklist. */
  keyPoints?: Bi[];
}

// ─── PROJETS PROFESSIONNELS ──────────────────────────────────────────────────
// Descriptions volontairement factuelles et discrètes (contribution réelle).
export const professionalProjects: Project[] = [
  {
    title: "BeautyBay – Web & Mobile",
    description: {
      fr: "Applications web et mobile pour une marque de cosmétiques : interfaces clientes, API GraphQL et composants partagés entre React et React Native.",
      en: "Web and mobile apps for a cosmetics brand: customer-facing interfaces, a GraphQL API and components shared across React and React Native.",
    },
    technologies: ["ReactJS", "React Native", "GraphQL", "TypeScript"],
    category: "Web & Mobile",
    featured: true,
    liveUrl: "https://www.beautybay.com",
  },
  {
    title: "Paul Beuscher",
    description: {
      fr: "Boutique Shopify : refonte des emails transactionnels (Liquid) aux couleurs de la marque, et script Python de détection/nettoyage des produits en doublon via l’API Admin Shopify.",
      en: "Shopify store: redesign of transactional emails (Liquid) in the brand’s colours, and a Python script to detect and clean up duplicate products via the Admin API.",
    },
    technologies: ["Shopify", "Liquid", "Python", "Shopify API"],
    category: "E-commerce",
    liveUrl: "https://www.paul-beuscher.com",
  },
  {
    title: "fingerinthenose.com",
    description: {
      fr: "Reprise et correction de l’intégration frontend d’une boutique Shopify : ajustements du thème (Liquid), responsive et fidélité au design existant.",
      en: "Took over and fixed the frontend integration of a Shopify store: theme tweaks (Liquid), responsive and fidelity to the existing design.",
    },
    technologies: ["Shopify", "Liquid", "JavaScript", "CSS"],
    category: "E-commerce",
    liveUrl: "https://fingerinthenose.com",
  },
  {
    title: "The Cool Republic",
    description: {
      fr: "Automatisation Python de l’import des données produits designers vers la boutique Shopify (mobilier & décoration) : mapping des catalogues, base de données et export CSV.",
      en: "Python automation for importing designer product data into the Shopify store (furniture & decor): catalogue mapping, database and CSV export.",
    },
    technologies: ["Python", "Shopify API", "PostgreSQL", "CSV"],
    category: "Automation",
    liveUrl: "https://thecoolrepublic.com",
  },
  {
    title: "Musier Paris",
    description: {
      fr: "Intégration et finitions frontend d’une boutique e-commerce Shopify : composants de thème, responsive et ajustements visuels.",
      en: "Frontend integration and finishing of a Shopify e-commerce store: theme components, responsive and visual adjustments.",
    },
    technologies: ["Shopify", "Liquid", "JavaScript"],
    category: "E-commerce",
    liveUrl: "https://musier-paris.com",
  },
  {
    title: "OTA Server",
    description: {
      fr: "Serveur de mises à jour OTA (Over-The-Air) : distribution de firmwares/builds, API Node.js TypeScript et infrastructure cloud sur AWS.",
      en: "Over-The-Air (OTA) update server: firmware/build distribution, a Node.js TypeScript API and cloud infrastructure on AWS.",
    },
    technologies: ["TypeScript", "Node.js", "AWS", "Cloud"],
    category: "Cloud",
  },
  {
    title: "bank-file-converter",
    description: {
      fr: "Outil de conversion de fichiers bancaires : transformation des fichiers XML Odoo en XLSX et conversion inverse (revert), pour l’intégration comptable d’une banque (BRED, FR).",
      en: "Banking file-conversion tool: transforming Odoo XML files into XLSX and back (revert), for the accounting integration of a bank (BRED, FR).",
    },
    technologies: ["Python", "Odoo", "XML", "XLSX"],
    category: "Script",
  },
  {
    title: "Edu Levitation SaaS",
    description: {
      fr: "Plateforme SaaS scolaire : gestion des notes, bulletins, facturation, workflows automatisés (email/SMS), multi-établissements.",
      en: "School SaaS platform: grades, report cards, billing, automated email/SMS workflows, multi-school management.",
    },
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    category: "SaaS",
    featured: true,
    liveUrl: "https://edu.levitation.mg",
  },
  {
    title: "EduContent Mobile App",
    description: {
      fr: "Application mobile React Native/Expo pour la consultation et la gestion de contenu éducatif en ligne.",
      en: "React Native/Expo mobile app for browsing and managing educational content online.",
    },
    technologies: ["React Native", "Expo", "JavaScript"],
    category: "Mobile",
  },
  {
    title: "Transport Interne Konecta",
    description: {
      fr: "Digitalisation du transport du personnel : planification, optimisation OSRM, suivi temps réel, reporting multi-profils.",
      en: "Digitalising staff transport: planning, OSRM optimisation, real-time tracking, multi-role reporting.",
    },
    technologies: ["TypeScript", "React", "MySQL", "OSRM"],
    category: "Entreprise",
    featured: true,
  },
  {
    title: "ERPNext Migration",
    description: {
      fr: "Migration d’un ERP existant vers Spring Boot avec refonte de l’architecture API et modernisation de la stack.",
      en: "Migration of an existing ERP to Spring Boot with a redesigned API architecture and a modernised stack.",
    },
    technologies: ["Python", "Frappe", "Vue.js", "Spring Boot", "MySQL"],
    category: "ERP",
  },
  {
    title: "DayByDay CRM",
    description: {
      fr: "Migration et amélioration d’un CRM vers Spring Boot avec Docker et nouvelle architecture REST.",
      en: "Migration and improvement of a CRM to Spring Boot with Docker and a new REST architecture.",
    },
    technologies: ["Symfony", "Spring Boot", "MySQL", "Docker"],
    category: "CRM",
  },
  {
    title: "Cryptomoney Cloud",
    description: {
      fr: "Plateforme crypto cloud-native : gestion de portefeuille, suivi du marché, applications web et mobile.",
      en: "Cloud-native crypto platform: wallet management, market tracking, web and mobile apps.",
    },
    technologies: ["Symfony", "Spring Boot", "React", "React Native", "Docker"],
    category: "Cloud",
  },
];

// ─── PROJETS ACADÉMIQUES ──────────────────────────────────────────────────────
