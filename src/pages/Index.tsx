import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";

const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
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
  { id: "accueil",    name: "Accueil",      component: HeroSection },
  { id: "apropos",    name: "À propos",     component: AboutSection },
  { id: "parcours",   name: "Parcours",     component: ExperienceSection },
  { id: "competences",name: "Compétences",  component: SkillsSection },
  { id: "projets",    name: "Projets",      component: ProjectsSection },
  { id: "contact",    name: "Contact",      component: ContactSection },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  // Determine active section based on scroll position (no automatic navigation)
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      // The section whose top is closest to 40% from the top of the viewport is "active"
      const trigger = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= trigger) active = index;
      });
      setCurrentSection(active);
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

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="bg-background">
      <Navigation
        currentSection={currentSection}
        totalSections={sections.length}
        onNavigate={navigateToSection}
        sectionNames={sections.map((s) => s.name)}
      />

      {sections.map(({ id, component: Component }) => (
        <div id={id} key={id} className="scroll-section">
          <Suspense fallback={<SectionLoader />}>
            <Component onNavigate={navigateToSection} />
          </Suspense>
        </div>
      ))}

      {/* Mobile dots — navigate on click only, never auto-trigger */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden flex gap-1.5 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50">
        {sections.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => navigateToSection(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSection === index ? "bg-primary w-5" : "bg-muted-foreground/40 w-2"
            }`}
            aria-label={`Aller à la section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
