import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/motion/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import { useT } from "@/i18n";

// Le hero est importé statiquement : c'est le contenu au-dessus de la ligne de
// flottaison, il ne doit pas attendre un chunk supplémentaire pour peindre.
// Les sections suivantes restent chargées à la demande.
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const ExperienceSection = lazy(() => import("@/components/sections/ExperienceSection"));
const SkillsSection = lazy(() => import("@/components/sections/SkillsSection"));
const ProjectsSection = lazy(() => import("@/components/sections/ProjectsSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const sections = [
  { id: "accueil",    navKey: "nav.home",     component: HeroSection },
  { id: "apropos",    navKey: "nav.about",    component: AboutSection },
  { id: "parcours",   navKey: "nav.journey",  component: ExperienceSection },
  { id: "competences",navKey: "nav.skills",   component: SkillsSection },
  { id: "projets",    navKey: "nav.projects", component: ProjectsSection },
  { id: "contact",    navKey: "nav.contact",  component: ContactSection },
];

const Index = () => {
  const { t } = useT();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const sectionNames = sections.map((s) => t(s.navKey));

  // Determine active section based on scroll position (rAF-throttled — one read per frame)
  useEffect(() => {
    if (isLoading) return;
    let ticking = false;

    const compute = () => {
      ticking = false;
      // The section whose top is closest to 40% from the top of the viewport is "active"
      const trigger = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= trigger) active = index;
      });
      setCurrentSection(active);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  // Smooth-scroll to a section on explicit user action (nav click / dot click)
  const navigateToSection = useCallback((index: number) => {
    const el = document.getElementById(sections[index].id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Id-based navigation so sections can navigate without brittle magic indices
  const goToId = useCallback(
    (id: string) => navigateToSection(sections.findIndex((s) => s.id === id)),
    [navigateToSection],
  );

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="bg-background">
      <ScrollProgress />
      <Navigation
        currentSection={currentSection}
        totalSections={sections.length}
        onNavigate={navigateToSection}
        sectionNames={sectionNames}
      />

      {/* Pas d'enveloppe animée par section : chaque section gère sa propre
          entrée. Une couche `whileInView` supplémentaire ici rendait le contenu
          invisible jusqu'à ce que l'IntersectionObserver se déclenche — coûteux
          pour le hero, et six observateurs de plus à maintenir. */}
      {sections.map(({ id, component: Component }) => (
        <div id={id} key={id} className="scroll-section">
          <Suspense fallback={<SectionLoader />}>
            <Component onNavigate={goToId} />
          </Suspense>
        </div>
      ))}

      {/* Mobile dots — navigate on click only, never auto-trigger. 44px hit area, FR labels. */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-header md:hidden flex gap-0.5 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
        {sections.map(({ id }, index) => {
          const active = currentSection === index;
          return (
            <button
              key={id}
              type="button"
              onClick={() => navigateToSection(index)}
              aria-label={`${t("nav.goTo")} : ${sectionNames[index]}`}
              aria-current={active ? "true" : undefined}
              className="flex items-center justify-center min-h-11 min-w-11 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  active ? "bg-primary w-5" : "bg-muted-foreground/40 w-2"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
