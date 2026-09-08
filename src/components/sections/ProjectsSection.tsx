import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Github,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { useMotionPreset } from "@/hooks/useMotionPreset";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi, type Lang } from "@/i18n";
import { PROJECT_LOGOS, PROJECT_COLORS, hueFromString } from "@/data/projectLogos";

export interface Project {
  title: string;
  description: Bi;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  problem?: Bi;
  solution?: Bi;
  result?: Bi;
  keyPoints?: Bi[];
}

// ─── PROJETS PROFESSIONNELS PHARE (Case Studies) ─────────────────────────────
const featuredCaseStudies: Project[] = [
  {
    title: "BeautyBay – Web & Mobile",
    description: {
      fr: "Écosystème e-commerce complet : web app React, application mobile React Native et API GraphQL centralisée pour une marque internationale.",
      en: "Complete e-commerce ecosystem: React web app, React Native mobile app and centralized GraphQL API for an international brand.",
    },
    problem: {
      fr: "Nécessité d'unifier l'expérience client entre web et mobile avec une synchronisation en temps réel des stocks, paniers et catalogues sous fort trafic.",
      en: "Need to unify customer experience across web and mobile with real-time sync of stock, carts, and catalogs under heavy concurrent traffic.",
    },
    solution: {
      fr: "Architecture full-stack modulaire avec GraphQL unifié, composants partagés React / React Native, et infrastructure cloud AWS pour le stockage et les assets.",
      en: "Modular full-stack architecture with unified GraphQL API, shared React / React Native components, and AWS cloud storage and CDN pipeline.",
    },
    result: {
      fr: "Écosystème unifié en production, réduction mesurable du délai de chargement et fluidité cross-platform.",
      en: "Unified ecosystem shipped to production, measurable latency reduction, and seamless cross-platform consistency.",
    },
    technologies: ["ReactJS", "React Native", "GraphQL", "TypeScript", "AWS"],
    category: "Web & Mobile",
    featured: true,
    liveUrl: "https://www.beautybay.com",
  },
  {
    title: "Edu Levitation SaaS",
    description: {
      fr: "Plateforme SaaS scolaire tout-en-un pour la gestion administrative, académique et financière de multiples établissements.",
      en: "All-in-one school SaaS platform for administrative, academic, and billing management across multiple partner institutions.",
    },
    problem: {
      fr: "Gestion manuelle fastidieuse des notes, lenteur dans la génération des bulletins et absence d'automatisation des relances de facturation.",
      en: "Tedious manual grade management, slow report card generation, and lack of automated billing and attendance notifications.",
    },
    solution: {
      fr: "Plateforme SaaS multi-tenant sous Laravel & ReactJS, automatisation des workflows email/SMS via n8n, génération PDF de bulletins et API REST sécurisée.",
      en: "Multi-tenant SaaS platform built on Laravel & ReactJS, automated email/SMS workflows via n8n, dynamic PDF generation, and secure REST API.",
    },
    result: {
      fr: "Plateforme déployée et active en production sur edu.levitation.mg, adoptée par les établissements partenaires.",
      en: "Platform live in production at edu.levitation.mg, actively used daily by partner educational institutions.",
    },
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    category: "SaaS",
    featured: true,
    liveUrl: "https://edu.levitation.mg",
  },
  {
    title: "Transport Interne Konecta",
    description: {
      fr: "Application web et mobile de digitalisation et d'optimisation en temps réel du transport du personnel d'entreprise.",
      en: "Web and mobile fleet management app for real-time dispatch, route optimization, and corporate employee transit.",
    },
    problem: {
      fr: "Temps d'attente excessifs et manque de visibilité en temps réel sur les tournées des navettes transportant des centaines d'employés à Antananarivo.",
      en: "Unpredictable wait times and zero real-time visibility on shuttle routes transporting hundreds of corporate staff in Antananarivo.",
    },
    solution: {
      fr: "App mobile React Native pour les chauffeurs, tableau de bord dispatch ReactJS pour les RH et intégration du moteur d'optimisation d'itinéraires OSRM.",
      en: "React Native mobile app for drivers, ReactJS dispatch dashboard for HR/admin, and OSRM route optimization engine integration.",
    },
    result: {
      fr: "Réduction mesurée de 30% des temps d'attente et traçabilité temps réel complète de la flotte.",
      en: "Measured 30% reduction in passenger wait times and 100% live fleet geolocation tracking.",
    },
    technologies: ["React Native", "TypeScript", "React", "MySQL", "OSRM"],
    category: "Entreprise",
    featured: true,
  },
  {
    title: "The Cool Republic & Paul Beuscher",
    description: {
      fr: "Automatisation d'ingestion de données et refonte e-commerce Shopify pour deux marques de référence (mobilier & instruments de musique).",
      en: "Catalog ingestion automation and Shopify e-commerce engineering for two premier design and music brands.",
    },
    problem: {
      fr: "Importation manuelle chronophage de milliers de références produits hétérogènes et risque élevé de doublons d'inventaire.",
      en: "Time-consuming manual ingestion of thousands of vendor catalog items and high risk of inventory duplicates.",
    },
    solution: {
      fr: "Pipeline Python couplé à l'API Admin Shopify, base PostgreSQL de mapping et déduplication, et refonte des templates transactionnels Liquid.",
      en: "Python automation pipeline interfacing with Shopify Admin API, PostgreSQL deduplication database, and Liquid theme customisation.",
    },
    result: {
      fr: "Des centaines d'heures de travail économisées et synchronisation automatisée et fiable des catalogues.",
      en: "Hundreds of manual operational hours saved with reliable, automated catalog synchronization.",
    },
    technologies: ["Python", "Shopify API", "PostgreSQL", "Liquid", "JavaScript"],
    category: "Automation & E-commerce",
    featured: true,
    liveUrl: "https://thecoolrepublic.com",
  },
];

// Autres missions et réalisations professionnelles
const otherProfessionalProjects: Project[] = [
  {
    title: "fingerinthenose.com",
    description: {
      fr: "Reprise et correction de l'intégration frontend d'une boutique Shopify : ajustements du thème (Liquid), responsive et fidélité au design existant.",
      en: "Took over and fixed the frontend integration of a Shopify store: theme tweaks (Liquid), responsive and fidelity to the existing design.",
    },
    technologies: ["Shopify", "Liquid", "JavaScript", "CSS"],
    category: "E-commerce",
    liveUrl: "https://fingerinthenose.com",
  },
  {
    title: "Musier Paris",
    description: {
      fr: "Intégration et finitions frontend d'une boutique e-commerce Shopify : composants de thème, responsive et ajustements visuels.",
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
      fr: "Outil de conversion de fichiers bancaires : transformation des fichiers XML Odoo en XLSX et conversion inverse (revert), pour l'intégration comptable d'une banque (BRED, FR).",
      en: "Banking file-conversion tool: transforming Odoo XML files into XLSX and back (revert), for the accounting integration of a bank (BRED, FR).",
    },
    technologies: ["Python", "Odoo", "XML", "XLSX"],
    category: "Script",
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
    title: "ERPNext Migration",
    description: {
      fr: "Migration d'un ERP existant vers Spring Boot avec refonte de l'architecture API et modernisation de la stack.",
      en: "Migration of an existing ERP to Spring Boot with a redesigned API architecture and a modernised stack.",
    },
    technologies: ["Python", "Frappe", "Vue.js", "Spring Boot", "MySQL"],
    category: "ERP",
  },
  {
    title: "DayByDay CRM",
    description: {
      fr: "Migration et amélioration d'un CRM vers Spring Boot avec Docker et nouvelle architecture REST.",
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
const academicProjects: Project[] = [
  { title: "ProjetKidoro", description: { fr: "Application web full-stack Spring Boot avec base PostgreSQL : gestion métier complète avec API REST.", en: "Full-stack Spring Boot web app with a PostgreSQL database: complete business management with a REST API." }, technologies: ["Spring Boot", "Java", "PostgreSQL"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Trandraka-Volamena", description: { fr: "Application Java de gestion avec interface Servlet, GUI Swing et base de données Oracle.", en: "Java management app with a Servlet interface, Swing GUI and an Oracle database." }, technologies: ["Java", "Servlet", "Swing", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Trandraka-Volamena" },
  { title: "Valan-Omby", description: { fr: "Application JavaEE distribuée avec EJB pour la gestion métier et base de données Oracle.", en: "Distributed JavaEE application with EJB for business management and an Oracle database." }, technologies: ["Java", "JavaEE", "EJB", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Valan-Omby" },
  { title: "eHanofaTrano", description: { fr: "Application JavaEE avec EJB pour la gestion de biens immobiliers, connectée à une base Oracle.", en: "JavaEE app with EJB for real-estate management, connected to an Oracle database." }, technologies: ["Java", "JavaEE", "EJB", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Scoot-Tiger-Oracle", description: { fr: "Application desktop Java Swing avec interface graphique complète et base Oracle.", en: "Java Swing desktop application with a full GUI and an Oracle database." }, technologies: ["Java", "Java Swing", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Scoot-Tiger-Oracle" },
  { title: "Solonify-ve", description: { fr: "Application WinForms de gestion interne pour cabinet dentaire : patients, rendez-vous, facturation.", en: "WinForms internal-management app for a dental practice: patients, appointments, billing." }, technologies: ["C#", "WinForms", "PostgreSQL"], category: "C#", githubUrl: "https://github.com/joharymanantena1-ux/Solonify-ve" },
  { title: "eFootball – Détection Hors-Jeu", description: { fr: "Système de détection de hors-jeu en temps réel via analyse vidéo et traitement d'image.", en: "Real-time offside-detection system through video analysis and image processing." }, technologies: ["C#", "ASP.NET", "Postgres"], category: "C#", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Tickety – App Flutter", description: { fr: "Application mobile Flutter pour la gestion et l'organisation d'événements et de tickets.", en: "Flutter mobile app for managing and organising events and tickets." }, technologies: ["Flutter", "Dart"], category: "Flutter", githubUrl: "https://github.com/joharymanantena1-ux/tickety" },
  { title: "GestionTaches", description: { fr: "Application Angular de gestion des tâches avec filtrage avancé, catégories et suivi de progression.", en: "Angular task-management app with advanced filtering, categories and progress tracking." }, technologies: ["Angular", "TypeScript", "Karma"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/task-manager" },
  { title: "hero-webdifference", description: { fr: "Test technique – hero section moderne avec animations, Next.js et Tailwind CSS.", en: "Technical test – modern hero section with animations, Next.js and Tailwind CSS." }, technologies: ["Next.js", "Tailwind CSS", "CSS"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/hero-webdifference" },
  { title: "NextTask – Gestionnaire React", description: { fr: "Application To-Do list React complète avec filtrage, tags colorés et persistance LocalStorage.", en: "Complete React to-do app with filtering, colour tags and LocalStorage persistence." }, technologies: ["React", "TypeScript", "Tailwind CSS"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Portfolio Web", description: { fr: "Portfolio personnel développé avec React.js, TypeScript et Vite, déployé sur Netlify.", en: "Personal portfolio built with React.js, TypeScript and Vite, deployed on Netlify." }, technologies: ["React.js", "TypeScript", "Vite"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/portfolio" },
  { title: "Site Vitrine – Cabinet Dentaire", description: { fr: "Site WordPress professionnel pour cabinet dentaire avec prise de RDV en ligne et blog santé.", en: "Professional WordPress site for a dental practice with online booking and a health blog." }, technologies: ["WordPress", "Elementor", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Botry", description: { fr: "Application web CodeIgniter de gestion avec base MySQL : CRUD complet, authentification et tableau de bord.", en: "CodeIgniter management web app with MySQL: full CRUD, authentication and a dashboard." }, technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Gestion de Restauration", description: { fr: "Application web de gestion d'un restaurant : commandes, menus, tables et suivi des ventes.", en: "Restaurant-management web app: orders, menus, tables and sales tracking." }, technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux/TP-Gestion-Restauration" },
  { title: "Jeu de Poker – S1", description: { fr: "Application web PHP d'un jeu de poker : distribution des cartes, évaluation des mains, gestion des tours.", en: "PHP web poker game: card dealing, hand evaluation, turn management." }, technologies: ["PHP"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux/Poket-S1" },
  { title: "Gestion Garage Automobile", description: { fr: "Application web de gestion d'atelier mécanique : réception véhicules, suivi réparations, historique client.", en: "Garage-management web app: vehicle intake, repair tracking, client history." }, technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Projet SGBD – S3", description: { fr: "Projet algorithmique de gestion de base de données avec scripts Python et Bash.", en: "Algorithmic database-management project with Python and Bash scripts." }, technologies: ["Algorithmique", "Python", "Bash"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux/Projet-SGBD-S3" },
  { title: "Codage Son WAV", description: { fr: "Traitement et analyse de fichiers audio WAV : lecture binaire, visualisation de forme d'onde.", en: "WAV audio processing and analysis: binary reading, waveform visualisation." }, technologies: ["Python", "WAV"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Codage Huffman", description: { fr: "Algorithme de compression Huffman avec visualisation de l'arbre binaire et calcul du taux de compression.", en: "Huffman compression algorithm with binary-tree visualisation and compression-ratio computation." }, technologies: ["Python", "Numpy", "Matplotlib"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Clustering FTP", description: { fr: "Système de clustering avec serveur FTP distribué et load balancer HAProxy sous Linux.", en: "Clustering system with a distributed FTP server and an HAProxy load balancer on Linux." }, technologies: ["Python", "FTP", "HAProxy", "Linux"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "SIG McArthur's Madagascar", description: { fr: "Système d'Information Géographique pour la gestion territoriale et la cartographie interactive.", en: "Geographic Information System for territorial management and interactive mapping." }, technologies: ["JavaScript", "SIG", "PostGIS"], category: "Géomatique", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Police & Voleur", description: { fr: "Jeu interactif Police-Voleur développé avec Python (logique) et React (interface) : IA de poursuite sur grille.", en: "Interactive Cops & Robbers game built with Python (logic) and React (UI): grid-based pursuit AI." }, technologies: ["Python", "React", "JavaScript"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Helicoptera", description: { fr: "Jeu 2D de type hélicoptère développé en Perl avec interface graphique Tkinter et base PostgreSQL.", en: "2D helicopter-style game built in Perl with a Tkinter GUI and a PostgreSQL database." }, technologies: ["Perl", "Tkinter", "PostgreSQL"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Civilisation", description: { fr: "Jeu de stratégie temps réel : gestion de ressources, construction, conquête de territoires.", en: "Real-time strategy game: resource management, building, territory conquest." }, technologies: ["Java", "Swing", "Postgres"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux/Civilisation" },
  { title: "RallyChronoWeb", description: { fr: "Application web de chronométrage pour rallye automobile : classements temps réel, gestion des étapes.", en: "Web timing app for car rallies: real-time rankings, stage management." }, technologies: ["C++", "JavaScript", "ASP", "HTML/CSS"], category: "C++", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Chiffres et Lettres", description: { fr: "Jeu en ligne inspiré de l'émission TV : résolution de mots et calcul avec des chiffres tirés.", en: "Online game inspired by the TV show: word solving and arithmetic with drawn numbers." }, technologies: ["C++", "JavaScript", "HTML/CSS"], category: "C++", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Clustering Réseaux", description: { fr: "Architecture réseau distribuée avec clustering, load balancing et haute disponibilité.", en: "Distributed network architecture with clustering, load balancing and high availability." }, technologies: ["Réseaux", "Linux", "Clustering"], category: "Réseaux", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "eDrambola", description: { fr: "Application web Django de gestion avec API REST intégrée et base de données MySQL.", en: "Django management web app with an integrated REST API and a MySQL database." }, technologies: ["Django", "Python", "MySQL", "API REST"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "AsaSprint Framework", description: { fr: "Framework Java maison MVC pour le développement rapide d'applications web, avec routeur et templates.", en: "In-house Java MVC framework for rapid web development, with a router and templates." }, technologies: ["Java"], category: "Framework", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Atelier Réparation PC", description: { fr: "Application web de gestion d'atelier : suivi des interventions, devis et facturation clients.", en: "Workshop-management web app: job tracking, quotes and client billing." }, technologies: ["Spring Boot", "Postgres", "Bootstrap"], category: "Framework", githubUrl: "https://github.com/joharymanantena1-ux" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const catLabel = (cat: string, lang: Lang) => {
  const map: Record<string, string> = {
    Entreprise: "Company",
    Réseaux: "Networks",
    Jeu: "Game",
    Géomatique: "GIS",
  };
  return lang === "en" ? map[cat] ?? cat : cat;
};

// ─── CASE STUDY CARD (Problem, Solution, Impact) ─────────────────────────────
const CaseStudyCard = ({
  project,
  index,
  onOpenDetails,
}: {
  project: Project;
  index: number;
  onOpenDetails: (p: Project) => void;
}) => {
  const { t, lang } = useT();
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
    >
      <div>
        {/* Header meta */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-border/60 mb-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              {t("projects.caseStudy")} #{index + 1}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              {project.category}
            </span>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("projects.liveOf")} ${project.title}`}
              className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
            >
              <span>Live</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Project Title */}
        <h3 className="font-display font-semibold text-2xl sm:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-sm sm:text-base text-foreground/85 leading-relaxed mb-6">
          {tx(project.description, lang)}
        </p>

        {/* Structured 3-Part Case Study Breakdown */}
        <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-secondary/30 border border-border/50 mb-6">
          {project.problem && (
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-0.5">
                  {t("projects.problemLabel")}
                </span>
                <span className="text-foreground/90 leading-snug">
                  {tx(project.problem, lang)}
                </span>
              </div>
            </div>
          )}

          {project.solution && (
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-0.5">
                  {t("projects.solutionLabel")}
                </span>
                <span className="text-foreground/90 leading-snug">
                  {tx(project.solution, lang)}
                </span>
              </div>
            </div>
          )}

          {project.result && (
            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">
                  {t("projects.impactLabel")}
                </span>
                <span className="text-foreground font-medium leading-snug">
                  {tx(project.result, lang)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(project)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
        >
          <span>{t("projects.viewCaseStudy")}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  );
};

// ─── SECONDARY PROFESSIONAL PROJECT CARD ────────────────────────────────────
const SecondaryCard = ({ project }: { project: Project }) => {
  const { lang, t } = useT();

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("projects.liveOf")} ${project.title}`}
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <h4 className="font-display font-semibold text-lg text-foreground mb-2">
          {project.title}
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          {tx(project.description, lang)}
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ProjectsSection = () => {
  const { t, lang } = useT();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filterCategories = [
    "Tous",
    "Java",
    "C#",
    "C++",
    "Flutter",
    "Web",
    "PHP",
    "Algo",
    "Réseaux",
    "Jeu",
  ];

  const filteredAcademic = activeFilter === "Tous"
    ? academicProjects
    : academicProjects.filter((p) => p.category === activeFilter);

  return (
    <section className="section-container relative overflow-hidden py-24 sm:py-32">
      <div className="section-content max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <SectionHeading
          label={t("projects.label")}
          title={lang === "fr" ? "Études de cas & Projets réels." : "Case Studies & Production Work."}
          description={lang === "fr"
            ? "Conception orientée résultat : chaque projet répond à un défi métier concret avec une architecture pérenne."
            : "Outcome-driven engineering: every system addresses concrete business needs with resilient code."
          }
          className="mb-14 sm:mb-18"
        />

        {/* ── 1. Flagship Case Studies Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {featuredCaseStudies.map((project, idx) => (
            <CaseStudyCard
              key={project.title}
              project={project}
              index={idx}
              onOpenDetails={(p) => setSelectedCaseStudy(p)}
            />
          ))}
        </div>

        {/* ── 2. Other Production & Client Work ──────────────────────────── */}
        <div className="mb-16 pt-12 border-t border-border/60">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-1">
                {lang === "fr" ? "Autres Réalisations" : "Additional Missions"}
              </span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
                {lang === "fr" ? "Missions Freelance & Systèmes Métier" : "Freelance & Enterprise Systems"}
              </h3>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {otherProfessionalProjects.length} {lang === "fr" ? "projets" : "projects"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherProfessionalProjects.map((project) => (
              <SecondaryCard key={project.title} project={project} />
            ))}
          </div>
        </div>

        {/* ── 3. Academic Archive Callout ───────────────────────────────── */}
        <div className="relative rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/70 to-secondary/30 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
              {t("projects.archiveKicker")}
            </span>
            <h3 className="font-display font-bold text-2xl text-foreground mb-2">
              {academicProjects.length} {t("projects.archiveTitleSuffix")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              {t("projects.archiveDesc")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 cursor-pointer flex-shrink-0"
          >
            <span>{t("projects.archiveBtnBefore")}{academicProjects.length}{t("projects.archiveBtnAfter")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Case Study Detailed Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedCaseStudy(null)}
                aria-label={t("projects.closeCaseStudy")}
                className="absolute top-6 right-6 w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">
                {t("projects.caseStudy")}
              </span>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-4">
                {selectedCaseStudy.title}
              </h2>

              <p className="text-base text-foreground/85 mb-6">
                {tx(selectedCaseStudy.description, lang)}
              </p>

              <div className="flex flex-col gap-5 p-5 rounded-xl bg-secondary/40 border border-border/60 mb-6">
                {selectedCaseStudy.problem && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {t("projects.problemLabel")}
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {tx(selectedCaseStudy.problem, lang)}
                    </p>
                  </div>
                )}

                {selectedCaseStudy.solution && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {t("projects.solutionLabel")}
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {tx(selectedCaseStudy.solution, lang)}
                    </p>
                  </div>
                )}

                {selectedCaseStudy.result && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      {t("projects.impactLabel")}
                    </h4>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {tx(selectedCaseStudy.result, lang)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCaseStudy.technologies.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-secondary text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {selectedCaseStudy.liveUrl && (
                <a
                  href={selectedCaseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>{t("projects.liveOf")} {selectedCaseStudy.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Academic Archive Drawer ──────────────────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="h-[90vh] bg-card border-t border-border focus-visible:outline-none">
          <div className="mx-auto w-full max-w-6xl flex flex-col h-full px-4 sm:px-6 pb-6">
            <div className="flex items-center justify-between gap-4 pt-4 pb-4 border-b border-border">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {t("projects.drawerKicker")}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {t("projects.drawerTitle")} ({academicProjects.length})
                </h2>
              </div>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label={t("projects.close")}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </DrawerClose>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide flex-shrink-0">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors ${
                    activeFilter === cat
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Academic grid */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAcademic.map((p) => (
                  <div
                    key={p.title}
                    className="p-4 rounded-xl border border-border/60 bg-background/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] uppercase text-primary font-medium">
                          {p.category}
                        </span>
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub ${p.title}`}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <h4 className="font-display font-semibold text-base text-foreground mb-1.5">
                        {p.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {tx(p.description, lang)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default ProjectsSection;
