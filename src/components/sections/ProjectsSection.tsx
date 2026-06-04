import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Globe, ChevronLeft, ChevronRight, ArrowUpRight, X } from "lucide-react";
import { useMotionPreset } from "@/hooks/useMotionPreset";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import SectionHeading from "@/components/SectionHeading";

// ─── PROJETS PROFESSIONNELS ──────────────────────────────────────────────────
// Descriptions volontairement factuelles et discrètes : on décrit la contribution
// réelle (ex. « rectification frontend ») sans sur-promettre ni exposer le client.
const professionalProjects = [
  {
    title: "BeautyBay – Web & Mobile",
    description:
      "Applications web et mobile pour une marque de cosmétiques : interfaces clientes, API GraphQL et composants partagés entre React et React Native.",
    technologies: ["ReactJS", "React Native", "GraphQL", "TypeScript"],
    category: "Web & Mobile",
  },
  {
    title: "fingerinthenose.com",
    description:
      "Reprise et correction de l'intégration frontend d'une boutique Shopify : ajustements du thème (Liquid), responsive et fidélité au design existant.",
    technologies: ["Shopify", "Liquid", "JavaScript", "CSS"],
    category: "E-commerce",
  },
  {
    title: "Musier Paris",
    description:
      "Intégration et finitions frontend d'une boutique e-commerce Shopify : composants de thème, responsive et ajustements visuels.",
    technologies: ["Shopify", "Liquid", "JavaScript"],
    category: "E-commerce",
  },
  {
    title: "bank-file-converter",
    description:
      "Outil de conversion de fichiers bancaires : transformation des fichiers XML Odoo en XLSX et conversion inverse (revert), pour l'intégration comptable d'une banque (BRED, FR).",
    technologies: ["Python", "Odoo", "XML", "XLSX"],
    category: "Script",
  },
  {
    title: "Edu Levitation SaaS",
    description:
      "Plateforme SaaS scolaire : gestion des notes, bulletins, facturation, workflows automatisés (email/SMS), multi-établissements.",
    technologies: ["Laravel", "ReactJS", "MySQL", "n8n", "API REST"],
    category: "SaaS",
    liveUrl: "https://edu.levitation.mg",
    githubUrl: "https://github.com/joharymanantena1-ux/educontent-app",
  },
  {
    title: "EduContent Mobile App",
    description:
      "Application mobile React Native/Expo pour la consultation et la gestion de contenu éducatif en ligne.",
    technologies: ["React Native", "Expo", "JavaScript"],
    category: "Mobile",
    githubUrl: "https://github.com/joharymanantena1-ux/educontent-app",
  },
  {
    title: "Transport Interne Konecta",
    description:
      "Digitalisation du transport du personnel : planification, optimisation OSRM, suivi temps réel, reporting multi-profils.",
    technologies: ["TypeScript", "React", "MySQL", "OSRM"],
    category: "Entreprise",
    githubUrl: "https://github.com/joharymanantena1-ux/Projet-de-Stage",
  },
  {
    title: "Shopify Data Automation",
    description:
      "Script Python d'automatisation pour l'import/export de données designers vers Shopify, avec base de données et export CSV.",
    technologies: ["Python", "Shopify API", "PostgreSQL", "CSV"],
    category: "Automation",
    githubUrl: "https://github.com/joharymanantena1-ux/script-bash-shopify",
  },
  {
    title: "ERPNext Migration",
    description:
      "Migration d'un ERP existant vers Spring Boot avec refonte de l'architecture API et modernisation de la stack.",
    technologies: ["Python", "Frappe", "Vue.js", "Spring Boot", "MySQL"],
    category: "ERP",
  },
  {
    title: "DayByDay CRM",
    description:
      "Migration et amélioration d'un CRM vers Spring Boot avec Docker et nouvelle architecture REST.",
    technologies: ["Symfony", "Spring Boot", "MySQL", "Docker"],
    category: "CRM",
  },
  {
    title: "Cryptomoney Cloud",
    description:
      "Plateforme crypto cloud-native : gestion de portefeuille, suivi du marché, applications web et mobile.",
    technologies: ["Symfony", "Spring Boot", "React", "React Native", "Docker"],
    category: "Cloud",
  },
];

// ─── PROJETS ACADÉMIQUES ──────────────────────────────────────────────────────
const academicProjects = [
  { title: "ProjetKidoro", description: "Application web full-stack Spring Boot avec base PostgreSQL : gestion métier complète avec API REST.", technologies: ["Spring Boot", "Java", "PostgreSQL"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Trandraka-Volamena", description: "Application Java de gestion avec interface Servlet, GUI Swing et base de données Oracle.", technologies: ["Java", "Servlet", "Swing", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Trandraka-Volamena" },
  { title: "Valan-Omby", description: "Application JavaEE distribuée avec EJB pour la gestion métier et base de données Oracle.", technologies: ["Java", "JavaEE", "EJB", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Valan-Omby" },
  { title: "eHanofaTrano", description: "Application JavaEE avec EJB pour la gestion de biens immobiliers, connectée à une base Oracle.", technologies: ["Java", "JavaEE", "EJB", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Scoot-Tiger-Oracle", description: "Application desktop Java Swing avec interface graphique complète et base Oracle.", technologies: ["Java", "Java Swing", "Oracle"], category: "Java", githubUrl: "https://github.com/joharymanantena1-ux/Scoot-Tiger-Oracle" },
  { title: "Solonify-ve", description: "Application WinForms de gestion interne pour cabinet dentaire : patients, rendez-vous, facturation.", technologies: ["C#", "WinForms", "PostgreSQL"], category: "C#", githubUrl: "https://github.com/joharymanantena1-ux/Solonify-ve" },
  { title: "eFootball – Détection Hors-Jeu", description: "Système de détection de hors-jeu en temps réel via analyse vidéo et traitement d'image.", technologies: ["C#", "ASP.NET", "Postgres"], category: "C#", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Tickety – App Flutter", description: "Application mobile Flutter pour la gestion et l'organisation d'événements et de tickets.", technologies: ["Flutter", "Dart"], category: "Flutter", githubUrl: "https://github.com/joharymanantena1-ux/tickety" },
  { title: "GestionTaches", description: "Application Angular de gestion des tâches avec filtrage avancé, catégories et suivi de progression.", technologies: ["Angular", "TypeScript", "Karma"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/task-manager" },
  { title: "hero-webdifference", description: "Test technique – hero section moderne avec animations, Next.js et Tailwind CSS.", technologies: ["Next.js", "Tailwind CSS", "CSS"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/hero-webdifference" },
  { title: "NextTask – Gestionnaire React", description: "Application To-Do list React complète avec filtrage, tags colorés et persistance LocalStorage.", technologies: ["React", "TypeScript", "Tailwind CSS"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Portfolio Web", description: "Portfolio personnel développé avec React.js, TypeScript et Vite, déployé sur Netlify.", technologies: ["React.js", "TypeScript", "Vite"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux/portfolio" },
  { title: "Site Vitrine – Cabinet Dentaire", description: "Site WordPress professionnel pour cabinet dentaire avec prise de RDV en ligne et blog santé.", technologies: ["WordPress", "Elementor", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Botry", description: "Application web CodeIgniter de gestion avec base MySQL : CRUD complet, authentification et tableau de bord.", technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Gestion de Restauration", description: "Application web de gestion d'un restaurant : commandes, menus, tables et suivi des ventes.", technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux/TP-Gestion-Restauration" },
  { title: "Jeu de Poker – S1", description: "Application web PHP d'un jeu de poker : distribution des cartes, évaluation des mains, gestion des tours.", technologies: ["PHP"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux/Poket-S1" },
  { title: "Gestion Garage Automobile", description: "Application web de gestion d'atelier mécanique : réception véhicules, suivi réparations, historique client.", technologies: ["CodeIgniter", "PHP", "MySQL"], category: "PHP", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Projet SGBD – S3", description: "Projet algorithmique de gestion de base de données avec scripts Python et Bash.", technologies: ["Algorithmique", "Python", "Bash"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux/Projet-SGBD-S3" },
  { title: "Codage Son WAV", description: "Traitement et analyse de fichiers audio WAV : lecture binaire, visualisation de forme d'onde.", technologies: ["Python", "WAV"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Codage Huffman", description: "Algorithme de compression Huffman avec visualisation de l'arbre binaire et calcul du taux de compression.", technologies: ["Python", "Numpy", "Matplotlib"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Clustering FTP", description: "Système de clustering avec serveur FTP distribué et load balancer HAProxy sous Linux.", technologies: ["Python", "FTP", "HAProxy", "Linux"], category: "Algo", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "SIG McArthur's Madagascar", description: "Système d'Information Géographique pour la gestion territoriale et la cartographie interactive.", technologies: ["JavaScript", "SIG", "PostGIS"], category: "Géomatique", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Police & Voleur", description: "Jeu interactif Police-Voleur développé avec Python (logique) et React (interface) : IA de poursuite sur grille.", technologies: ["Python", "React", "JavaScript"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Helicoptera", description: "Jeu 2D de type hélicoptère développé en Perl avec interface graphique Tkinter et base PostgreSQL.", technologies: ["Perl", "Tkinter", "PostgreSQL"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Civilisation", description: "Jeu de stratégie temps réel : gestion de ressources, construction, conquête de territoires.", technologies: ["Java", "Swing", "Postgres"], category: "Jeu", githubUrl: "https://github.com/joharymanantena1-ux/Civilisation" },
  { title: "RallyChronoWeb", description: "Application web de chronométrage pour rallye automobile : classements temps réel, gestion des étapes.", technologies: ["C++", "JavaScript", "ASP", "HTML/CSS"], category: "C++", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Chiffres et Lettres", description: "Jeu en ligne inspiré de l'émission TV : résolution de mots et calcul avec des chiffres tirés.", technologies: ["C++", "JavaScript", "HTML/CSS"], category: "C++", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Clustering Réseaux", description: "Architecture réseau distribuée avec clustering, load balancing et haute disponibilité.", technologies: ["Réseaux", "Linux", "Clustering"], category: "Réseaux", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "eDrambola", description: "Application web Django de gestion avec API REST intégrée et base de données MySQL.", technologies: ["Django", "Python", "MySQL", "API REST"], category: "Web", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "AsaSprint Framework", description: "Framework Java maison MVC pour le développement rapide d'applications web, avec routeur et templates.", technologies: ["Java"], category: "Framework", githubUrl: "https://github.com/joharymanantena1-ux" },
  { title: "Atelier Réparation PC", description: "Application web de gestion d'atelier : suivi des interventions, devis et facturation clients.", technologies: ["Spring Boot", "Postgres", "Bootstrap"], category: "Framework", githubUrl: "https://github.com/joharymanantena1-ux" },
];

// ─── Types & helpers ──────────────────────────────────────────────────────────
interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
}

// 2-letter monogram derived from the title — replaces stock cover images.
const getMonogram = (title: string) => {
  const words = title.replace(/[^a-zA-Z0-9\s-]/g, " ").split(/[\s-]+/).filter(Boolean);
  const letters = words.length > 1 ? words.map((w) => w[0]).join("") : words[0] ?? "";
  return letters.slice(0, 2).toUpperCase();
};

const pad = (n: number) => String(n).padStart(2, "0");

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
    className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-md cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      variant === "primary"
        ? "text-primary hover:bg-primary hover:text-primary-foreground"
        : "text-muted-foreground hover:bg-foreground hover:text-background"
    }`}
  >
    {children}
  </a>
);

// Mono category label (Swiss — single accent, no rainbow)
const CategoryTag = ({ category, accent = false }: { category: string; accent?: boolean }) => (
  <span className={`kicker !text-[11px] !tracking-wider ${accent ? "!text-primary" : ""}`}>
    {category}
  </span>
);

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
const ProfessionalCard = ({ project, index }: { project: Project; index: number }) => {
  const { reduce } = useMotionPreset();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, delay: (index % 6) * 0.06 }}
      className="flex-shrink-0 w-[280px] sm:w-[320px] card-swiss overflow-hidden group flex flex-col"
    >
      {/* Cover — no image: index watermark + monogram + category */}
      <div className="relative h-28 border-b border-border bg-secondary/40 overflow-hidden px-4 py-3 flex flex-col justify-between">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute -right-1 -bottom-5 font-display font-bold text-[5.5rem] leading-none text-foreground/[0.06] select-none"
        >
          {getMonogram(project.title)}
        </span>
        <div className="relative flex items-center justify-between">
          <CategoryTag category={project.category} accent />
          <span className="font-mono text-[11px] text-muted-foreground">№{pad(index + 1)}</span>
        </div>
        <span className="relative font-mono text-xs text-muted-foreground">~/work/{getMonogram(project.title).toLowerCase()}</span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-display font-semibold leading-snug line-clamp-1">{project.title}</h3>
          <div className="flex gap-0.5 flex-shrink-0 -mr-2 -mt-1">
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
        <p className="text-sm text-muted-foreground dark:text-foreground/80 line-clamp-3 leading-relaxed flex-1">
          {project.description}
        </p>
        <TechTags technologies={project.technologies} />
      </div>
    </motion.article>
  );
};

// ─── ACADEMIC PROJECT CARD (compact, image-free) ─────────────────────────────
const AcademicCard = ({ project, index }: { project: Project; index: number }) => {
  const { reduce } = useMotionPreset();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, delay: (index % 12) * 0.03 }}
      className="card-swiss p-3.5 flex flex-col gap-2 group"
    >
      <div className="flex items-center justify-between">
        <CategoryTag category={project.category} accent />
        {project.githubUrl && (
          <IconLink href={project.githubUrl} label={`Code source de ${project.title}`}>
            <Github className="w-4 h-4" aria-hidden="true" />
          </IconLink>
        )}
      </div>
      <h3 className="text-sm font-display font-semibold leading-snug line-clamp-1">{project.title}</h3>
      <p className="text-sm text-muted-foreground dark:text-foreground/80 line-clamp-2 leading-relaxed">
        {project.description}
      </p>
      <TechTags technologies={project.technologies} max={3} />
    </motion.article>
  );
};

// ─── ACCESSIBLE CAROUSEL (professional only) ─────────────────────────────────
const AccessibleCarousel = ({ projects }: { projects: Project[] }) => {
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
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
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
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {projects.map((p, i) => <ProfessionalCard key={p.title} project={p} index={i} />)}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />
      </div>

      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" aria-hidden="true" />

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Projet précédent"
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Projet suivant"
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// ─── FILTER CATEGORIES ────────────────────────────────────────────────────────
const filterCategories = ["Tous", "Java", "C#", "C++", "Flutter", "Web", "PHP", "Algo", "Réseaux", "Jeu", "Géomatique", "Framework"];

// ─── ACADEMIC DRAWER (hidden by default, full-screen, slides up) ─────────────
const AcademicDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { reduce } = useMotionPreset();
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = activeFilter === "Tous"
    ? academicProjects
    : academicProjects.filter((p) => p.category === activeFilter);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92vh] card-swiss !rounded-b-none focus-visible:outline-none">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full min-h-0 px-4 sm:px-6 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pt-2 pb-4 border-b border-border">
            <div>
              <span className="kicker !text-primary">Archive</span>
              <h2 className="text-xl sm:text-2xl font-display font-bold mt-1">
                Projets académiques
                <span className="font-mono text-sm text-muted-foreground ml-2">{academicProjects.length}</span>
              </h2>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Fermer la liste des projets académiques"
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-border hover:bg-secondary cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </DrawerClose>
          </div>

          {/* Filters */}
          <div role="group" aria-label="Filtrer les projets par catégorie" className="flex gap-2 overflow-x-auto py-4 scrollbar-hide flex-shrink-0">
            {filterCategories.map((cat) => {
              const active = activeFilter === cat;
              const count = cat === "Tous" ? academicProjects.length : academicProjects.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(cat)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-md font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                  <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable grid */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide -mx-1 px-1 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.18 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
              >
                {filtered.map((project, index) => (
                  <AcademicCard key={project.title} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// ─── SECTION ─────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const { reduce } = useMotionPreset();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="section-container">
      <div className="section-content">
        {/* Header */}
        <SectionHeading
          index="04"
          label="Portfolio"
          title="Projets sélectionnés"
          description={
            <>
              Travaux clients et missions professionnelles. L'archive académique
              (<span className="font-mono text-sm">{academicProjects.length}</span> projets) est consultable à la demande.
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
            <span className="kicker">Professionnel</span>
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
            <span className="kicker">Archive académique</span>
            <h3 className="text-lg sm:text-xl font-display font-semibold mt-1.5">
              {academicProjects.length} projets de formation
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Java, C#, C++, PHP, Python, jeux, réseaux, SIG… L'ensemble de mon parcours,
              filtrable par technologie — affiché uniquement si vous le souhaitez.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            className="relative flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium cursor-pointer transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Voir les {academicProjects.length} projets
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      <AcademicDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </section>
  );
};

export default ProjectsSection;
