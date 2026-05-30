import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onNavigate: (index: number) => void;
  sectionNames: string[];
}

const Navigation = ({
  currentSection,
  totalSections,
  onNavigate,
  sectionNames,
}: NavigationProps) => {
  const reduce = useReducedMotion();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Persist theme in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // System preference fallback
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const toggleTheme = useCallback(() => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("portfolio-theme", newMode ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      {/* Glassmorphism top nav */}
      <motion.header
        initial={reduce ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-header"
      >
        <div className="mx-4 md:mx-8 mt-3 md:mt-4 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/40 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <a
              href="#accueil"
              className="text-xl md:text-2xl font-display font-bold rounded-md cursor-pointer transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Retour à l'accueil"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(0);
              }}
            >
              <span className="text-gradient">J</span>
              <span className="text-foreground/70">-m</span>
            </a>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
              {sectionNames.map((name, index) => {
                const active = currentSection === index;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onNavigate(index)}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex items-center min-h-11 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {name}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        transition={reduce ? { duration: 0 } : undefined}
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
                className="rounded-xl hover:bg-secondary/60 w-11 h-11 cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-secondary/60 w-11 h-11 cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : undefined}
            className="fixed inset-0 z-overlay lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={reduce ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-xl border-l border-border/50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-bold text-lg text-gradient">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl w-11 h-11 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {sectionNames.map((name, index) => {
                  const active = currentSection === index;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        onNavigate(index);
                        setIsMenuOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`min-h-11 text-base font-medium text-left px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side navigation dots */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.8 }}
        className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-header hidden md:flex flex-col gap-1"
        aria-label="Navigation par section"
      >
        {Array.from({ length: totalSections }).map((_, index) => {
          const active = currentSection === index;
          const name = sectionNames[index] ?? `Section ${index + 1}`;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate(index)}
              aria-label={`Aller à : ${name}`}
              aria-current={active ? "true" : undefined}
              className="flex items-center justify-center min-h-11 min-w-11 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className={`nav-dot ${active ? "active" : ""}`} />
            </button>
          );
        })}
      </motion.div>
    </>
  );
};

export default Navigation;
