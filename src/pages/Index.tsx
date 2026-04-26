import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";

const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const ExperienceSection = lazy(() => import("@/components/sections/ExperienceSection"));
const SkillsSection = lazy(() => import("@/components/sections/SkillsSection"));
const ProjectsSection = lazy(() => import("@/components/sections/ProjectsSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

const SectionFallback = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const sections = [
  { name: "Accueil", component: HeroSection },
  { name: "À propos", component: AboutSection },
  { name: "Parcours", component: ExperienceSection },
  { name: "Compétences", component: SkillsSection },
  { name: "Projets", component: ProjectsSection },
  { name: "Contact", component: ContactSection },
];

// Walk up the DOM to find the nearest scrollable overflow container
const getScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
  if (!el || el === document.documentElement || el === document.body) return null;
  const { overflow, overflowY } = window.getComputedStyle(el);
  if (/(auto|scroll)/.test(overflow + overflowY) && el.scrollHeight > el.clientHeight + 2) {
    return el;
  }
  return getScrollableParent(el.parentElement);
};

const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  const lastRan = useRef(Date.now() - delay);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, delay - (now - lastRan.current));
    }
  }, [callback, delay]);
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  // Accumulate wheel delta to avoid triggering on tiny trackpad nudges
  const wheelAccumulatorRef = useRef(0);
  const wheelResetRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
    };
  }, []);

  const navigateToSection = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSection) return;
      if (index < 0 || index >= sections.length) return;
      setIsAnimating(true);
      setCurrentSection(index);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 800);
    },
    [currentSection, isAnimating]
  );

  const throttledNavigate = useThrottle(navigateToSection, 800);

  useEffect(() => {
    if (isLoading) return;
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;

      // If inside a scrollable container that hasn't reached its edge, let content scroll naturally
      const scrollable = getScrollableParent(e.target as HTMLElement);
      if (scrollable) {
        const { scrollTop, clientHeight, scrollHeight } = scrollable;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 8;
        const atTop = scrollTop <= 8;
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }

      // Accumulate delta so trackpad gentle nudges don't trigger navigation
      wheelAccumulatorRef.current += e.deltaY;
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
      wheelResetRef.current = setTimeout(() => {
        wheelAccumulatorRef.current = 0;
      }, 300);

      if (Math.abs(wheelAccumulatorRef.current) >= 200) {
        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        wheelAccumulatorRef.current = 0;
        const newIndex = currentSection + direction;
        if (newIndex >= 0 && newIndex < sections.length) throttledNavigate(newIndex);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, isAnimating, throttledNavigate, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isAnimating) return;
      const deltaX = touchStartRef.current.x - e.changedTouches[0].clientX;
      const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;
      const threshold = 80;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
        // Only navigate when section content is at its scroll edge
        const scrollable = getScrollableParent(e.target as HTMLElement);
        if (scrollable) {
          const { scrollTop, clientHeight, scrollHeight } = scrollable;
          const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
          const atTop = scrollTop <= 10;
          if (deltaY > 0 && !atBottom) { touchStartRef.current = null; return; }
          if (deltaY < 0 && !atTop) { touchStartRef.current = null; return; }
        }
        const newIndex = currentSection + (deltaY > 0 ? 1 : -1);
        if (newIndex >= 0 && newIndex < sections.length) throttledNavigate(newIndex);
      }
      touchStartRef.current = null;
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, isAnimating, throttledNavigate, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      let direction = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") direction = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") direction = -1;
      if (direction !== 0) {
        const newIndex = currentSection + direction;
        if (newIndex >= 0 && newIndex < sections.length) throttledNavigate(newIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, isAnimating, throttledNavigate, isLoading]);

  const sectionVariants = useMemo(() => ({
    enter: (_direction: number) => ({ y: _direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (_direction: number) => ({ y: _direction < 0 ? "100%" : "-100%", opacity: 0 }),
  }), []);

  const CurrentSectionComponent = useMemo(() => sections[currentSection].component, [currentSection]);

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Navigation
        currentSection={currentSection}
        totalSections={sections.length}
        onNavigate={navigateToSection}
        sectionNames={sections.map((s) => s.name)}
      />

      <AnimatePresence mode="wait" custom={currentSection}>
        <motion.div
          key={currentSection}
          custom={currentSection}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 260, damping: 30 },
            opacity: { duration: 0.28 },
          }}
          className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        >
          <Suspense fallback={<SectionFallback />}>
            <CurrentSectionComponent onNavigate={navigateToSection} />
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Mobile section dots */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden flex gap-1.5 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSection(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSection === index ? "bg-primary w-5" : "bg-muted-foreground/40 w-2"
            }`}
            type="button"
            aria-label={`Aller à la section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
