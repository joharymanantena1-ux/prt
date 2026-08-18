import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";

interface NavigationProps {
  currentSection: number;
  onNavigate: (index: number) => void;
  sectionNames: string[];
}

const Navigation = ({
  currentSection,
  onNavigate,
  sectionNames,
}: NavigationProps) => {
  const reduce = useReducedMotion();
  const { t, lang, setLang } = useT();
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
      {/* Header éditorial — barre pleine largeur, fond quasi opaque, filet fin
          en pied. Pas de pilule flottante ni d'effet verre. */}
      <header className="rise fixed top-0 left-0 right-0 z-header bg-background/95 backdrop-blur-sm border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-3.5 flex items-center justify-between">
          <a
            href="#accueil"
            className="group text-xl md:text-2xl font-display font-bold tracking-tight rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={t("nav.backHome")}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(0);
            }}
          >
            {/* Micro-animation : le trait d'union s'étire et prend l'accent au survol */}
            J
            <span className="inline-block text-muted-foreground/40 transition-[transform,color] duration-300 group-hover:scale-x-150 group-hover:text-primary motion-reduce:transform-none" aria-hidden="true">
              -
            </span>
            <span className="text-primary">m</span>
          </a>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label={t("nav.mainNav")}>
            {sectionNames.map((name, index) => {
              const active = currentSection === index;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onNavigate(index)}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex items-center min-h-11 px-3.5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {name}
                  {/* Le filet actif glisse d'un onglet à l'autre (layout partagé) */}
                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-x-3 bottom-1 h-0.5 bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              aria-label={t("nav.switchLang")}
              className="inline-flex items-center justify-center min-h-11 min-w-11 px-2 rounded-md font-mono text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className={lang === "fr" ? "text-primary" : ""}>FR</span>
              <span className="mx-0.5 opacity-40" aria-hidden="true">/</span>
              <span className={lang === "en" ? "text-primary" : ""}>EN</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? t("nav.lightMode") : t("nav.darkMode")}
              className="rounded-md hover:bg-secondary w-11 h-11 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-md hover:bg-secondary w-11 h-11 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label={t("nav.openMenu")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

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
              className="absolute inset-0 bg-foreground/25"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.mainNav")}
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={reduce ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="kicker !text-primary">{t("nav.menu")}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md w-11 h-11 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={t("nav.closeMenu")}
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
                      className={`min-h-11 text-base font-medium text-left px-4 py-3 rounded-md border-l-2 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        active
                          ? "border-primary text-foreground bg-secondary/60"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
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

    </>
  );
};

export default Navigation;
