import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useMotionPreset } from "@/hooks/useMotionPreset";

// ─── PROJETS PROFESSIONNELS ──────────────────────────────────────────────────
const professionalProjects = [
  {
    title: "Edu Levitation SaaS",
    description: "Plateforme SaaS scolaire : gestion des notes, bulletins, facturation, workflows automatisés (email/SMS), multi-établissements.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    category: "SaaS",
    liveUrl: "https://edu.levitation.mg",
    githubUrl: "https://github.com/joharymanantena1-ux/educontent-app",
    gradient: "from-primary/30 to-cyan-500/20",
  },
  {
    title: "EduContent Mobile App",
    description: "Application mobile React Native/Expo pour la consultation et gestion de contenu éducatif en ligne.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    technologies: ["React Native", "Expo", "JavaScript"],
    category: "Mobile",
    githubUrl: "https://github.com/joharymanantena1-ux/educontent-app",
    gradient: "from-cyan-500/25 to-primary/20",
  },
  {
    title: "Levitation – Mini ESN",
    description: "Site collectif de développeurs freelance proposant des solutions web, mobile et SaaS sur mesure.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    technologies: ["ReactJS", "Node.js", "Tailwind CSS"],
    category: "Startup",
    liveUrl: "https://levitation.mg",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-accent/30 to-purple-500/20",
  },
  {
    title: "Transport Interne Konecta",
    description: "Digitalisation du transport du personnel : planification, optimisation OSRM, suivi temps réel, reporting multi-profils.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    technologies: ["TypeScript", "React", "MySQL", "OSRM"],
    category: "Entreprise",
    githubUrl: "https://github.com/joharymanantena1-ux/Projet-de-Stage",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "Shopify Data Automation",
    description: "Script Python d'automatisation pour l'import/export de données designers vers Shopify, avec BDD et export CSV.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    technologies: ["Python", "Shopify API", "PostgreSQL", "CSV"],
    category: "Automation",
    githubUrl: "https://github.com/joharymanantena1-ux/script-bash-shopify",
    gradient: "from-green-500/25 to-primary/20",
  },
  {
    title: "ERPNext Migration",
    description: "Migration d'un ERP existant vers Spring Boot avec refonte de l'architecture API et modernisation de la stack.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    technologies: ["Python", "Frappe", "Vue.js", "Spring Boot", "MySQL"],
    category: "ERP",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-orange-500/20 to-primary/20",
  },
  {
    title: "DayByDay CRM",
    description: "Migration et amélioration d'un CRM vers Spring Boot avec Docker et nouvelle architecture REST.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    technologies: ["Symfony", "Spring Boot", "MySQL", "Docker"],
    category: "CRM",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-primary/20 to-green-500/20",
  },
  {
    title: "Cryptomoney Cloud",
    description: "Plateforme crypto cloud-native : gestion de portefeuille, suivi du marché, apps web et mobile.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    technologies: ["Symfony", "Spring Boot", "React", "React Native", "Docker"],
    category: "Cloud",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-yellow-500/20 to-primary/20",
  },
];

// ─── PROJETS ACADÉMIQUES ──────────────────────────────────────────────────────
const academicProjects = [
  // ── Java / Spring Boot ──
  {
    title: "ProjetKidoro",
    description: "Application web full-stack Spring Boot avec base PostgreSQL : gestion métier complète avec API REST.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    technologies: ["Spring Boot", "Java", "PostgreSQL", "Web"],
    category: "Java",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-amber-500/20 to-primary/20",
  },
  // ── Java / Oracle ──
  {
    title: "Trandraka-Volamena",
    description: "Application Java de gestion avec interface Servlet, GUI Swing et base de données Oracle.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    technologies: ["Java", "Servlet", "Swing", "Oracle"],
    category: "Java",
    githubUrl: "https://github.com/joharymanantena1-ux/Trandraka-Volamena",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    title: "Valan-Omby",
    description: "Application JavaEE distribuée avec EJB pour la gestion métier et base de données Oracle.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    technologies: ["Java", "JavaEE", "EJB", "Oracle"],
    category: "Java",
    githubUrl: "https://github.com/joharymanantena1-ux/Valan-Omby",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "eHanofaTrano",
    description: "Application JavaEE avec EJB pour la gestion de biens immobiliers, connectée à une base Oracle.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    technologies: ["Java", "JavaEE", "EJB", "Oracle"],
    category: "Java",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-primary/20 to-amber-500/20",
  },
  {
    title: "Scoot-Tiger-Oracle",
    description: "Application desktop Java Swing avec interface graphique complète et base Oracle.",
    image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&q=80",
    technologies: ["Java", "Java Swing", "Oracle"],
    category: "Java",
    githubUrl: "https://github.com/joharymanantena1-ux/Scoot-Tiger-Oracle",
    gradient: "from-accent/20 to-amber-500/20",
  },
  // ── C# / .NET ──
  {
    title: "Solonify-ve",
    description: "Application WinForms de gestion interne pour cabinet dentaire : patients, rendez-vous, facturation.",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    technologies: ["C#", "WinForms", "PostgreSQL"],
    category: "C#",
    githubUrl: "https://github.com/joharymanantena1-ux/Solonify-ve",
    gradient: "from-blue-500/20 to-primary/20",
  },
  {
    title: "eFootball – Détection Hors-Jeu",
    description: "Système de détection de hors-jeu en temps réel via analyse vidéo et traitement d'image.",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
    technologies: ["C#", "ASP.NET", "Postgres"],
    category: "C#",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-green-500/20 to-primary/20",
  },
  // ── Mobile / Flutter ──
  {
    title: "Tickety – App Flutter",
    description: "Application mobile Flutter pour la gestion et l'organisation d'événements et de tickets.",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80",
    technologies: ["Flutter", "Dart"],
    category: "Flutter",
    githubUrl: "https://github.com/joharymanantena1-ux/tickety",
    gradient: "from-cyan-500/20 to-primary/20",
  },
  // ── Web React / Next.js ──
  {
    title: "GestionTaches",
    description: "Application Angular de gestion des tâches avec filtrage avancé, catégories et suivi de progression.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    technologies: ["Angular", "TypeScript", "Karma"],
    category: "Web",
    githubUrl: "https://github.com/joharymanantena1-ux/task-manager",
    gradient: "from-red-500/20 to-primary/20",
  },
  {
    title: "hero-webdifference",
    description: "Test technique – hero section moderne avec animations, Next.js et Tailwind CSS.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    technologies: ["Next.js", "Tailwind CSS", "CSS"],
    category: "Web",
    githubUrl: "https://github.com/joharymanantena1-ux/hero-webdifference",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "NextTask – Gestionnaire React",
    description: "Application To-Do list React complète avec filtrage, tags colorés et persistance LocalStorage.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    category: "Web",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-cyan-500/20 to-primary/20",
  },
  {
    title: "Portfolio Web",
    description: "Portfolio personnel développé avec React.js, TypeScript et Vite, déployé sur Netlify.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    technologies: ["React.js", "TypeScript", "Vite"],
    category: "Web",
    githubUrl: "https://github.com/joharymanantena1-ux/portfolio",
    liveUrl: "https://github.com/joharymanantena1-ux/prt",
    gradient: "from-accent/20 to-primary/20",
  },
  // ── WordPress / PHP ──
  {
    title: "Site Vitrine – Cabinet Dentaire",
    description: "Site WordPress professionnel pour cabinet dentaire avec prise de RDV en ligne et blog santé.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    technologies: ["WordPress", "Elementor", "PHP", "MySQL"],
    category: "PHP",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-blue-500/20 to-primary/20",
  },
  {
    title: "Botry",
    description: "Application web CodeIgniter de gestion avec base MySQL : CRUD complet, authentification et tableau de bord.",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
    technologies: ["CodeIgniter", "PHP", "MySQL"],
    category: "PHP",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "Gestion de Restauration",
    description: "Application web de gestion d'un restaurant : commandes, menus, tables et suivi des ventes.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    technologies: ["CodeIgniter", "PHP", "MySQL"],
    category: "PHP",
    githubUrl: "https://github.com/joharymanantena1-ux/TP-Gestion-Restauration",
    gradient: "from-orange-500/20 to-accent/20",
  },
  {
    title: "Jeu de Poker – S1",
    description: "Application web PHP d'un jeu de poker : distribution des cartes, évaluation des mains, gestion des tours.",
    image: "https://images.unsplash.com/photo-1541278107931-e006523892df?w=800&q=80",
    technologies: ["PHP"],
    category: "PHP",
    githubUrl: "https://github.com/joharymanantena1-ux/Poket-S1",
    gradient: "from-emerald-500/20 to-accent/20",
  },
  {
    title: "Gestion Garage Automobile",
    description: "Application web de gestion d'atelier mécanique : réception véhicules, suivi réparations, historique client.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    technologies: ["CodeIgniter", "PHP", "MySQL"],
    category: "PHP",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-red-500/20 to-primary/20",
  },
  // ── Algo / Scripts / Python ──
  {
    title: "Projet SGBD – S3",
    description: "Projet algorithmique de gestion de base de données avec scripts Python et Bash.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
    technologies: ["Algorithmique", "Python", "Bash"],
    category: "Algo",
    githubUrl: "https://github.com/joharymanantena1-ux/Projet-SGBD-S3",
    gradient: "from-primary/20 to-green-500/20",
  },
  {
    title: "Codage Son WAV",
    description: "Traitement et analyse de fichiers audio WAV : lecture binaire, visualisation de forme d'onde.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    technologies: ["Python", "WAV"],
    category: "Algo",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "Codage Huffman",
    description: "Algorithme de compression Huffman avec visualisation de l'arbre binaire et calcul du taux de compression.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    technologies: ["Python", "Numpy", "Matplotlib"],
    category: "Algo",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    title: "Clustering FTP",
    description: "Système de clustering avec serveur FTP distribué et load balancer HAProxy sous Linux.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    technologies: ["Python", "FTP", "HAProxy", "Linux"],
    category: "Algo",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-accent/20 to-cyan-500/20",
  },
  // ── SIG / Géo ──
  {
    title: "SIG McArthur's Madagascar",
    description: "Système d'Information Géographique pour la gestion territoriale et la cartographie interactive.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    technologies: ["JavaScript", "SIG", "PostGIS"],
    category: "Géomatique",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-primary/20 to-cyan-500/20",
  },
  // ── Jeux ──
  {
    title: "Police & Voleur",
    description: "Jeu interactif Police-Voleur développé avec Python (logique) et React (interface) : IA de poursuite et déplacement sur grille.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
    technologies: ["Python", "React", "JavaScript"],
    category: "Jeu",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-slate-500/20 to-accent/20",
  },
  {
    title: "Helicoptera",
    description: "Jeu 2D de type hélicoptère développé en Perl avec interface graphique Tkinter et base PostgreSQL.",
    image: "https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800&q=80",
    technologies: ["Perl", "Tkinter", "PostgreSQL"],
    category: "Jeu",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-red-500/20 to-primary/20",
  },
  {
    title: "Civilisation",
    description: "Jeu de stratégie temps réel : gestion de ressources, construction, conquête de territoires.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
    technologies: ["Java", "Swing", "Postgres"],
    category: "Jeu",
    githubUrl: "https://github.com/joharymanantena1-ux/Civilisation",
    gradient: "from-yellow-500/20 to-accent/20",
  },
  // ── C++ ──
  {
    title: "RallyChronoWeb",
    description: "Application web de chronométrage pour rallye automobile : classements en temps réel, gestion des étapes et résultats.",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    technologies: ["C++", "JavaScript", "ASP", "HTML/CSS"],
    category: "C++",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-yellow-500/20 to-red-500/20",
  },
  {
    title: "Chiffres et Lettres",
    description: "Jeu en ligne inspiré de l'émission TV : résolution de mots à partir de lettres tirées et calcul avec des chiffres.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    technologies: ["C++", "JavaScript", "HTML/CSS"],
    category: "C++",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
  // ── Réseaux ──
  {
    title: "Clustering Réseaux",
    description: "Mise en place d'une architecture réseau distribuée avec clustering, load balancing et haute disponibilité.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    technologies: ["Réseaux", "Linux", "Clustering"],
    category: "Réseaux",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-slate-500/20 to-cyan-500/20",
  },
  // ── Django / Python ──
  {
    title: "eDrambola",
    description: "Application web Django de gestion avec API REST intégrée et base de données MySQL.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
    technologies: ["Django", "Python", "MySQL", "API REST"],
    category: "Web",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-green-500/20 to-primary/20",
  },
  // ── Autres ──
  {
    title: "AsaSprint Framework",
    description: "Framework Java maison MVC pour le développement rapide d'applications web, avec routeur et templates.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    technologies: ["Java"],
    category: "Framework",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "Atelier Réparation PC",
    description: "Application web de gestion d'atelier : suivi des interventions, devis et facturation clients.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    technologies: ["Spring Boot", "Postgres", "Bootstrap"],
    category: "Framework",
    githubUrl: "https://github.com/joharymanantena1-ux",
    gradient: "from-gray-500/20 to-primary/20",
  },
];

// ─── CATEGORY COLORS (theme-aware, AA in both light & dark) ──────────────────
// Brand pairs are token-based (always safe). Hue accents use text-{c}-700 (light)
// / text-{c}-300 (dark) so they never collapse below 4.5:1 on their tinted bg.
const categoryColors: Record<string, string> = {
  // brand teal
  SaaS:       "bg-primary/10 text-primary border-primary/30",
  Web:        "bg-primary/10 text-primary border-primary/30",
  Cloud:      "bg-primary/10 text-primary border-primary/30",
  // brand purple
  Startup:    "bg-accent/10 text-accent border-accent/30",
  "C#":       "bg-accent/10 text-accent border-accent/30",
  Jeu:        "bg-accent/10 text-accent border-accent/30",
  CRM:        "bg-accent/10 text-accent border-accent/30",
  PHP:        "bg-accent/10 text-accent border-accent/30",
  // safe theme-aware hues (700 light / 300 dark)
  Mobile:     "bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30",
  Flutter:    "bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30",
  Automation: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Géomatique: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Algo:       "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Entreprise: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  ERP:        "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  Java:       "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  "C++":      "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  Réseaux:    "bg-secondary text-secondary-foreground border-border/50",
  Framework:  "bg-secondary text-secondary-foreground border-border/50",
};
const getCategoryColor = (c: string) => categoryColors[c] ?? categoryColors["Framework"];

// Shared badge — 12px floor (MASTER §2), AA both themes
const CategoryBadge = ({ category }: { category: string }) => (
  <span
    className={`absolute top-2 left-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getCategoryColor(
      category,
    )}`}
  >
    {category}
  </span>
);

// Reusable 44px icon link with FR aria-label + focus-visible ring
const IconLink = ({
  href,
  label,
  variant = "neutral",
  children,
}: {
  href: string;
  label: string;
  variant?: "neutral" | "primary";
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-full bg-card/80 backdrop-blur-sm cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      variant === "primary"
        ? "text-primary hover:bg-primary hover:text-primary-foreground"
        : "hover:bg-foreground hover:text-background"
    }`}
  >
    {children}
  </a>
);

// ─── PROFESSIONAL PROJECT CARD (carousel) ────────────────────────────────────
const ProfessionalCard = ({ project, index }: { project: any; index: number }) => {
  const { reduce } = useMotionPreset();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, delay: (index % 6) * 0.06 }}
      className="flex-shrink-0 w-[260px] sm:w-[300px] card-floating overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          width={800}
          height={450}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <CategoryBadge category={project.category} />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {project.githubUrl && (
            <IconLink href={project.githubUrl} label={`Code source de ${project.title}`}>
              <Github className="w-4 h-4" aria-hidden="true" />
            </IconLink>
          )}
          {project.liveUrl && (
            <IconLink href={project.liveUrl} label={`Voir le site de ${project.title}`} variant="primary">
              <Globe className="w-4 h-4" aria-hidden="true" />
            </IconLink>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-display font-semibold mb-1.5 line-clamp-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground dark:text-foreground/80 mb-3 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech: string) => (
            <span key={tech} className="px-1.5 py-0.5 rounded-md bg-secondary text-xs font-medium border border-border/40">{tech}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">+{project.technologies.length - 4}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// ─── ACADEMIC PROJECT CARD (grid, compact with image) ───────────────────────
const AcademicCard = ({ project, index }: { project: any; index: number }) => {
  const { reduce } = useMotionPreset();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, delay: (index % 12) * 0.04 }}
      className="card-floating overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          width={800}
          height={224}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
        <CategoryBadge category={project.category} />
        <div className="absolute top-2 right-2 flex gap-1">
          {project.githubUrl && (
            <IconLink href={project.githubUrl} label={`Code source de ${project.title}`}>
              <Github className="w-4 h-4" aria-hidden="true" />
            </IconLink>
          )}
          {project.liveUrl && (
            <IconLink href={project.liveUrl} label={`Voir le site de ${project.title}`} variant="primary">
              <Globe className="w-4 h-4" aria-hidden="true" />
            </IconLink>
          )}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-display font-semibold mb-1 line-clamp-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground dark:text-foreground/80 mb-2 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech: string) => (
            <span key={tech} className="px-1.5 py-0.5 rounded bg-secondary text-xs font-medium border border-border/40">{tech}</span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-1.5 py-0.5 rounded bg-secondary text-xs text-muted-foreground">+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// ─── ACCESSIBLE CAROUSEL (professional only) ─────────────────────────────────
// rAF-throttled pointer drag + keyboard (←/→/Home/End) + region role/aria + controls.
const AccessibleCarousel = ({ projects }: { projects: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const rafId = useRef<number | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startScroll.current = scrollRef.current.scrollLeft;
    scrollRef.current.setPointerCapture(e.pointerId);
  }, []);

  const stop = useCallback(() => {
    isDragging.current = false;
  }, []);

  // rAF-throttled scroll write (one update per frame max)
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const pageX = e.pageX;
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!scrollRef.current) return;
      const x = pageX - scrollRef.current.offsetLeft;
      scrollRef.current.scrollLeft = startScroll.current - (x - startX.current) * 1.5;
    });
  }, []);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!scrollRef.current) return;
      if (e.key === "ArrowRight") { e.preventDefault(); scrollByCards(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCards(-1); }
      else if (e.key === "Home") { e.preventDefault(); scrollRef.current.scrollTo({ left: 0, behavior: "smooth" }); }
      else if (e.key === "End") { e.preventDefault(); scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" }); }
    },
    [scrollByCards],
  );

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Projets professionnels — faites défiler avec les flèches gauche et droite"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {projects.map((p, i) => <ProfessionalCard key={p.title} project={p} index={i} />)}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />
      </div>

      {/* right-edge scroll affordance */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" aria-hidden="true" />

      {/* prev / next controls (44px, FR labels) */}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Projet précédent"
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Projet suivant"
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// ─── FILTER CATEGORIES ────────────────────────────────────────────────────────
const filterCategories = ["Tous", "Java", "C#", "C++", "Flutter", "Web", "PHP", "Algo", "Réseaux", "Jeu", "Géomatique", "Framework"];

const INITIAL_LIMIT = 10;

// ─── SECTION ─────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const { reduce } = useMotionPreset();
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAll, setShowAll] = useState(false);

  const filtered = activeFilter === "Tous"
    ? academicProjects
    : academicProjects.filter((p) => p.category === activeFilter);

  // Limit to 10 only on "Tous"; specific filters show all their items
  const displayed = activeFilter === "Tous" && !showAll
    ? filtered.slice(0, INITIAL_LIMIT)
    : filtered;

  const remaining = filtered.length - INITIAL_LIMIT;

  return (
    <section className="section-container">
      <div className="section-content">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.55 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3">Mes Projets</h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {professionalProjects.length + academicProjects.length} projets — parcours académique et professionnel.
          </p>
        </motion.div>

        {/* ── Projets professionnels — carousel horizontal ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.45 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent flex-shrink-0" />
            <h3 className="text-base font-display font-semibold">Projets Professionnels</h3>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{professionalProjects.length}</span>
          </div>
          <AccessibleCarousel projects={professionalProjects} />
        </motion.div>

        {/* ── Projets académiques — grille filtrée ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-accent to-primary flex-shrink-0" />
            <h3 className="text-base font-display font-semibold">Projets Académiques</h3>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{academicProjects.length}</span>
          </div>

          {/* Filtres */}
          <div role="group" aria-label="Filtrer les projets par catégorie" className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-5">
            {filterCategories.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                  className={`flex-shrink-0 inline-flex items-center min-h-11 px-4 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                  {cat !== "Tous" && (
                    <span className="ml-1.5 opacity-70">
                      {academicProjects.filter((p) => p.category === cat).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grille responsive */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + String(showAll)}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
            >
              {displayed.map((project, index) => (
                <AcademicCard key={project.title} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Voir plus / Voir moins — uniquement sur "Tous" */}
          {activeFilter === "Tous" && filtered.length > INITIAL_LIMIT && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                aria-expanded={showAll}
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full border border-primary/50 bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-sm font-medium text-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {showAll ? (
                  <>Voir moins</>
                ) : (
                  <>Voir plus <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-semibold">+{remaining}</span></>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
