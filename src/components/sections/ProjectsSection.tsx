import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Github, ChevronLeft, ChevronRight, ArrowUpRight, X } from "lucide-react";
import { useMotionPreset } from "@/hooks/useMotionPreset";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import SectionHeading from "@/components/SectionHeading";
import { useT, tx, type Bi, type Lang } from "@/i18n";
import { PROJECT_LOGOS, PROJECT_COLORS, hueFromString } from "@/data/projectLogos";

interface Project {
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
const professionalProjects: Project[] = [
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
      fr: "Boutique Shopify : refonte des emails transactionnels (Liquid) aux couleurs de la marque, et script Python de détection/nettoyage des produits en doublon via l'API Admin Shopify.",
      en: "Shopify store: redesign of transactional emails (Liquid) in the brand's colours, and a Python script to detect and clean up duplicate products via the Admin API.",
    },
    technologies: ["Shopify", "Liquid", "Python", "Shopify API"],
    category: "E-commerce",
    liveUrl: "https://www.paul-beuscher.com",
  },
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
    title: "The Cool Republic",
    description: {
      fr: "Automatisation Python de l'import des données produits designers vers la boutique Shopify (mobilier & décoration) : mapping des catalogues, base de données et export CSV.",
      en: "Python automation for importing designer product data into the Shopify store (furniture & decor): catalogue mapping, database and CSV export.",
    },
    technologies: ["Python", "Shopify API", "PostgreSQL", "CSV"],
    category: "Automation",
    liveUrl: "https://thecoolrepublic.com",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_EN: Record<string, string> = {
  Entreprise: "Company",
  Réseaux: "Networks",
  Jeu: "Game",
  Géomatique: "GIS",
};
const catLabel = (cat: string, lang: Lang) => (lang === "en" ? CATEGORY_EN[cat] ?? cat : cat);

const getMonogram = (title: string) => {
  const words = title.replace(/[^a-zA-Z0-9\s-]/g, " ").split(/[\s-]+/).filter(Boolean);
  const letters = words.length > 1 ? words.map((w) => w[0]).join("") : words[0] ?? "";
  return letters.slice(0, 2).toUpperCase();
};

const pad = (n: number) => String(n).padStart(2, "0");

// Resolve a project's brand accent: explicit colour, else a stable hue from title.
const projectAccent = (title: string): string =>
  PROJECT_COLORS[title] ?? `hsl(${hueFromString(title)} 70% 55%)`;

// Full-bleed logo header. The logo sits on its own native brand background
// (white / black / brand colour), so dark logos never get a jarring white box.
// `object-contain` keeps every logo's aspect ratio. Projects without a mapped
// logo fall back to a big monogram on a brand-tinted backdrop. The category +
// index overlay the artwork with a top scrim so they stay readable on any bg.
const ProjectLogoHeader = ({ project, index }: { project: Project; index: number }) => {
  const { t, lang } = useT();
  const logo = PROJECT_LOGOS[project.title];
  const accent = projectAccent(project.title);
  const lightBg = logo ? ["#ffffff", "#fff"].includes(logo.bg.toLowerCase()) : false;
  // Meta text colour adapts to the backdrop for contrast.
  const metaClass = lightBg ? "text-foreground/55" : "text-white/75";

  return (
    <div
      className="relative h-32 w-full overflow-hidden flex items-center justify-center"
      style={logo ? { backgroundColor: logo.bg } : { background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
    >
      {/* Top scrim so the meta row reads on busy/dark/light artwork alike */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-12 ${lightBg ? "bg-gradient-to-b from-black/[0.04] to-transparent" : "bg-gradient-to-b from-black/25 to-transparent"}`}
      />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-2.5">
        <span className={`font-mono text-[11px] uppercase tracking-wider ${metaClass}`}>
          {catLabel(project.category, lang)}
        </span>
        <span className={`font-mono text-[11px] ${metaClass}`}>№{pad(index + 1)}</span>
      </div>

      {/* Flagship tag — solid oxblood chip (accent rare), readable on any artwork */}
      {project.featured && (
        <span className="absolute bottom-2 left-3 z-10 font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-brand-secondary text-brand-foreground">
          {t("projects.featured")}
        </span>
      )}

      {logo ? (
        <img
          src={logo.src}
          alt={`Logo ${project.title}`}
          // Padded logos (baked-in transparent margin) display larger to compensate.
          // Subtle zoom on card hover (transform-only); skipped under reduced-motion.
          className={`object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${logo.padded ? "max-h-[80%] max-w-[88%]" : "max-h-[52%] max-w-[70%]"}`}
          loading="lazy"
          draggable={false}
        />
      ) : (
        // No logo → just the big ghost monogram on the brand-tinted backdrop.
        <span aria-hidden="true" className="absolute -bottom-6 -right-2 font-display font-black text-[8rem] leading-none text-white/15 select-none">
          {getMonogram(project.title)}
        </span>
      )}
    </div>
  );
};

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
    className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-md cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      variant === "primary"
        ? "text-primary hover:bg-brand hover:text-brand-foreground"
        : "text-muted-foreground hover:bg-foreground hover:text-background"
    }`}
  >
    {children}
  </a>
);

const CategoryTag = ({ category, accent = false }: { category: string; accent?: boolean }) => {
  const { lang } = useT();
  return (
    <span className={`kicker !text-[11px] !tracking-wider ${accent ? "!text-primary" : ""}`}>
      {catLabel(category, lang)}
    </span>
  );
};

// Compact mono checklist for a project's functional highlights. Capped at 4 so
// it never pushes card heights out of alignment with the rest of the carousel.
const KeyPoints = ({ points, max = 4 }: { points: Bi[]; max?: number }) => {
  const { lang } = useT();
  return (
    <ul className="flex flex-col gap-1">
      {points.slice(0, max).map((point) => (
        <li key={tx(point, lang)} className="flex items-start gap-1.5 font-mono text-[11px] leading-snug text-muted-foreground">
          <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{tx(point, lang)}</span>
        </li>
      ))}
    </ul>
  );
};

const TechTags = ({ technologies, max = 4 }: { technologies: string[]; max?: number }) => (
  <div className="flex flex-wrap gap-1.5">
    {technologies.slice(0, max).map((tech) => (
      <span key={tech} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-secondary border border-border/50 text-secondary-foreground">
        {tech}
      </span>
    ))}
    {technologies.length > max && (
      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">+{technologies.length - max}</span>
    )}
  </div>
);

// ─── PROFESSIONAL PROJECT CARD (image-free Swiss cover) ──────────────────────
// Quand le projet a une URL publique, toute la card devient cliquable via un
// lien « étiré » (overlay), signalé par une flèche ↗ discrète près du titre.
const ProfessionalCard = ({ project, index }: { project: Project; index: number }) => {
  const { reduce } = useMotionPreset();
  const { t, lang } = useT();
  const clickable = Boolean(project.liveUrl);
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, delay: (index % 6) * 0.06 }}
      // Halo glow + subtle lift on hover — transform/shadow only (GPU-cheap),
      // motion-reduce drops the lift. Neutral elevated shadow — no coloured glow.
      className="relative flex-shrink-0 snap-start w-[min(86vw,340px)] sm:w-[380px] lg:w-[400px] card-swiss overflow-hidden group flex flex-col transition-[transform,box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-elevated hover:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
    >
      {/* Lien étiré — z-[15] : au-dessus du contenu, sous les liens d'icônes (z-20).
          draggable=false pour ne pas déclencher un drag natif de lien dans le
          carrousel ; ring-inset car la card est en overflow-hidden. */}
      {clickable && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          aria-label={`${t("projects.liveOf")} ${project.title} (${lang === "fr" ? "nouvel onglet" : "new tab"})`}
          className="absolute inset-0 z-[15] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        />
      )}
      {/* Accent sweep — royal hairline drawn from the left on hover */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 z-20 h-0.5 w-full bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
      />
      {/* Full-bleed logo header — logo sits on its own brand background */}
      <div className="relative border-b border-border">
        <ProjectLogoHeader project={project} index={index} />
      </div>

      <div className="p-5 flex flex-col gap-3.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-display font-semibold leading-snug line-clamp-2 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">{project.title}</h3>
          <div className="relative z-20 flex items-center gap-0.5 flex-shrink-0 -mr-2 -mt-1">
            {project.githubUrl && (
              <IconLink href={project.githubUrl} label={`${t("projects.sourceOf")} ${project.title}`}>
                <Github className="w-4 h-4" aria-hidden="true" />
              </IconLink>
            )}
            {/* Indicateur passif de lien externe — le lien, c'est la card */}
            {clickable && (
              <ArrowUpRight
                aria-hidden="true"
                className="w-4 h-4 mt-2 mr-2 text-muted-foreground/70 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              />
            )}
          </div>
        </div>
        <p className="text-sm sm:text-[0.95rem] text-muted-foreground dark:text-foreground/80 line-clamp-4 leading-relaxed flex-1">
          {tx(project.description, lang)}
        </p>
        {project.keyPoints && <KeyPoints points={project.keyPoints} />}
        <TechTags technologies={project.technologies} max={5} />
      </div>
    </motion.article>
  );
};

// ─── ACADEMIC PROJECT CARD (compact, image-free) ─────────────────────────────
const AcademicCard = ({ project, index }: { project: Project; index: number }) => {
  const { reduce } = useMotionPreset();
  const { t, lang } = useT();
  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, delay: (index % 12) * 0.02, layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      style={{ transition: "box-shadow .3s, border-color .3s" }}
      className="card-swiss p-3.5 flex flex-col gap-2 group hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="flex items-center justify-between">
        <CategoryTag category={project.category} accent />
        {project.githubUrl && (
          <IconLink href={project.githubUrl} label={`${t("projects.sourceOf")} ${project.title}`}>
            <Github className="w-4 h-4" aria-hidden="true" />
          </IconLink>
        )}
      </div>
      <h3 className="text-sm font-display font-semibold leading-snug line-clamp-1">{project.title}</h3>
      <p className="text-sm text-muted-foreground dark:text-foreground/80 line-clamp-2 leading-relaxed">
        {tx(project.description, lang)}
      </p>
      <TechTags technologies={project.technologies} max={3} />
    </motion.article>
  );
};

// ─── ACCESSIBLE CAROUSEL (professional only) ─────────────────────────────────
const AccessibleCarousel = ({ projects }: { projects: Project[] }) => {
  const { t } = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const rafId = useRef<number | null>(null);
  const scrollRafId = useRef<number | null>(null);
  // Reading position: drives the left edge fade, the mono counter and the
  // hairline progress bar under the track.
  const [pos, setPos] = useState({ atStart: true, index: 0, progress: 0 });

  const onScroll = useCallback(() => {
    if (scrollRafId.current != null) return;
    scrollRafId.current = requestAnimationFrame(() => {
      scrollRafId.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const step = (el.querySelector("article")?.clientWidth ?? 380) + 16;
      const max = el.scrollWidth - el.clientWidth;
      setPos({
        atStart: el.scrollLeft < 24,
        index: Math.min(Math.round(el.scrollLeft / step), projects.length - 1),
        progress: max > 0 ? Math.min(el.scrollLeft / max, 1) : 0,
      });
    });
  }, [projects.length]);

  // Drag à la souris uniquement (le tactile garde le scroll natif). La capture
  // du pointeur n'est posée qu'après un vrai déplacement (> 6px) : la poser au
  // pointerdown redirigerait le `click` vers le conteneur et rendrait les cards
  // cliquables inertes. Après un drag, le clic résiduel est neutralisé.
  const dragDistance = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current || e.pointerType !== "mouse") return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startScroll.current = scrollRef.current.scrollLeft;
  }, []);

  const stop = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const pageX = e.pageX;
    const x = pageX - scrollRef.current.offsetLeft;
    dragDistance.current = Math.max(dragDistance.current, Math.abs(x - startX.current));
    if (dragDistance.current > 6 && !scrollRef.current.hasPointerCapture(e.pointerId)) {
      scrollRef.current.setPointerCapture(e.pointerId);
    }
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft = startScroll.current - (x - startX.current) * 1.5;
    });
  }, []);

  // Un clic qui conclut un drag ne doit pas naviguer.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragDistance.current > 6) {
      e.preventDefault();
      e.stopPropagation();
      dragDistance.current = 0;
    }
  }, []);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    // One card width + gap (cards are ~380–400px on ≥sm, narrower on mobile).
    const step = scrollRef.current?.querySelector("article")?.clientWidth ?? 380;
    scrollRef.current?.scrollBy({ left: dir * (step + 16), behavior: "smooth" });
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
        aria-label={t("projects.carousel")}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerMove={onPointerMove}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing snap-x snap-proximity rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {projects.map((p, i) => <ProfessionalCard key={p.title} project={p} index={i} />)}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />
      </div>

      {/* Edge fades — the left one only appears once the track has scrolled */}
      <div
        className={`pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${pos.atStart ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" aria-hidden="true" />

      {/* Reading position: hairline progress + mono counter + arrows */}
      <div className="mt-3 flex items-center gap-4">
        <div className="flex-1 h-px bg-border relative overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 bg-primary origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${pos.progress})` }}
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums" aria-hidden="true">
          {pad(pos.index + 1)} / {pad(projects.length)}
        </span>
        <div className="flex gap-2">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label={t("projects.prev")}
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-brand/50 text-primary hover:bg-brand hover:text-brand-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label={t("projects.next")}
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-brand/50 text-primary hover:bg-brand hover:text-brand-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
        </div>
      </div>
    </div>
  );
};

const filterCategories = ["Tous", "Java", "C#", "C++", "Flutter", "Web", "PHP", "Algo", "Réseaux", "Jeu", "Géomatique", "Framework"];

// ─── ACADEMIC DRAWER (hidden by default, full-screen, slides up) ─────────────
const AcademicDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { reduce } = useMotionPreset();
  const { t, lang } = useT();
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = activeFilter === "Tous"
    ? academicProjects
    : academicProjects.filter((p) => p.category === activeFilter);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92vh] card-swiss !rounded-b-none focus-visible:outline-none">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full min-h-0 px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between gap-4 pt-2 pb-4 border-b border-border">
            <div>
              <span className="kicker !text-primary">{t("projects.drawerKicker")}</span>
              <h2 className="text-xl sm:text-2xl font-display font-bold mt-1">
                {t("projects.drawerTitle")}
                <span className="font-mono text-sm text-muted-foreground ml-2">{academicProjects.length}</span>
              </h2>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label={t("projects.close")}
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-border hover:bg-secondary cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </DrawerClose>
          </div>

          <div role="group" aria-label={t("projects.filterGroup")} className="flex gap-2 overflow-x-auto py-4 scrollbar-hide flex-shrink-0">
            {filterCategories.map((cat) => {
              const active = activeFilter === cat;
              const count = cat === "Tous" ? academicProjects.length : academicProjects.filter((p) => p.category === cat).length;
              const label = cat === "Tous" ? t("projects.filterAll") : catLabel(cat, lang);
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(cat)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-md font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "bg-brand text-brand-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {label}
                  <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide -mx-1 px-1 pb-4">
            {/* Fluid layout: cards keep stable keys and animate their position when the
                filter changes (magic-move) instead of a wholesale fade. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <AcademicCard key={project.title} project={project} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// ─── SECTION ─────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const { reduce } = useMotionPreset();
  const { t } = useT();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="section-container">
      <div className="section-content">
        <SectionHeading
          label={t("projects.label")}
          title={t("projects.title")}
          description={
            <>
              {t("projects.descBefore")}
              <span className="font-mono text-sm">{academicProjects.length}</span>
              {t("projects.descAfter")}
            </>
          }
          className="mb-10 md:mb-12"
        />

        {/* ── Projets professionnels — carousel horizontal ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.45 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="kicker">{t("projects.professional")}</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="font-mono text-xs text-muted-foreground">{pad(professionalProjects.length)}</span>
          </div>
          <AccessibleCarousel projects={professionalProjects} />
        </motion.div>

        {/* ── Accès aux projets académiques — caché par défaut ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.1 }}
          className="relative card-swiss overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
        >
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
          <div className="relative">
            <span className="kicker">{t("projects.archiveKicker")}</span>
            <h3 className="text-lg sm:text-xl font-display font-semibold mt-1.5">
              {academicProjects.length} {t("projects.archiveTitleSuffix")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">{t("projects.archiveDesc")}</p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            className="group relative flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-11 px-6 rounded-md bg-brand text-brand-foreground font-medium cursor-pointer transition-colors duration-200 hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("projects.archiveBtnBefore")}{academicProjects.length}{t("projects.archiveBtnAfter")}
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>

      <AcademicDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </section>
  );
};

export default ProjectsSection;
