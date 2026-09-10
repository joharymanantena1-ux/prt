import type { Bi } from "@/i18n";
import { professionalProjects, type Project } from "./projects";

/**
 * Les trois missions racontées en long sur la page (enjeu → contribution →
 * résultat). `projectTitle` pointe vers l’entrée de `professionalProjects` :
 * la stack et le lien viennent de là, et l’archive exclut ces trois projets
 * pour ne pas répéter ce qui est déjà détaillé au-dessus.
 */
export interface CaseStudy {
  key: string;
  name: string;
  projectTitle: string;
  category: Bi;
  headline: Bi;
  problem: Bi;
  solution: Bi;
  result: Bi;
}

export const caseStudies: CaseStudy[] = [
  {
    key: "beauty",
    name: "BeautyBay",
    projectTitle: "BeautyBay – Web & Mobile",
    category: {
      fr: "E-commerce · Web & Mobile",
      en: "E-commerce · Web & Mobile",
    },
    headline: {
      fr: "Une expérience, du web au mobile.",
      en: "One experience, from web to mobile.",
    },
    problem: {
      fr: "Faire évoluer l’expérience cliente d’une marque de cosmétiques sur plusieurs plateformes.",
      en: "Evolve a cosmetics brand’s customer experience across platforms.",
    },
    solution: {
      fr: "Interfaces React et React Native, API GraphQL et intégration des flux produits, stocks et commandes.",
      en: "React and React Native interfaces, GraphQL API and integration of product, stock and order flows.",
    },
    result: {
      fr: "Des composants partagés et des données synchronisées entre les systèmes métier.",
      en: "Shared components and synchronised data across business systems.",
    },
  },
  {
    key: "edu",
    name: "Levitation",
    projectTitle: "Edu Levitation SaaS",
    category: { fr: "SaaS · Éducation", en: "SaaS · Education" },
    headline: {
      fr: "L’école, mieux connectée.",
      en: "A more connected school.",
    },
    problem: {
      fr: "Réunir la gestion pédagogique et administrative de plusieurs établissements.",
      en: "Bring academic and administrative management together across schools.",
    },
    solution: {
      fr: "Une plateforme Laravel et React : notes, bulletins, facturation et workflows email/SMS avec n8n.",
      en: "A Laravel and React platform: grades, reports, billing and n8n email/SMS workflows.",
    },
    result: {
      fr: "Une plateforme multi-établissements livrée en production.",
      en: "A multi-school platform delivered to production.",
    },
  },
  {
    key: "konecta",
    name: "Konecta",
    projectTitle: "Transport Interne Konecta",
    category: {
      fr: "Application métier · Logistique",
      en: "Business application · Logistics",
    },
    headline: {
      fr: "Moins d’attente. Plus de visibilité.",
      en: "Less waiting. More visibility.",
    },
    problem: {
      fr: "Coordonner le transport du personnel et donner de la visibilité aux équipes.",
      en: "Coordinate staff transport and give teams better visibility.",
    },
    solution: {
      fr: "Planification, optimisation des trajets avec OSRM et tableaux de bord pour les RH, chauffeurs et administrateurs.",
      en: "Planning, route optimisation with OSRM and dashboards for HR, drivers and administrators.",
    },
    result: {
      fr: "Un suivi en temps réel et un reporting adapté à chaque profil.",
      en: "Real-time tracking and reporting tailored to each role.",
    },
  },
];

/** Projet source d’une étude de cas — `undefined` si le titre ne correspond plus. */
export const caseStudyProject = (study: CaseStudy): Project | undefined =>
  professionalProjects.find((project) => project.title === study.projectTitle);

/** Missions professionnelles qui ne sont pas déjà racontées en étude de cas. */
export const otherProfessionalProjects = professionalProjects.filter(
  (project) =>
    !caseStudies.some((study) => study.projectTitle === project.title),
);
