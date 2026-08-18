import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";

const STORAGE_KEY = "cookie-consent"; // "granted" | "denied"

// gtag is defined in index.html (Consent Mode v2, default denied).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const updateConsent = (granted: boolean) => {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
};

/**
 * RGPD/CNIL consent banner. Google Analytics stays DENIED (set in index.html)
 * until the visitor explicitly accepts here. Choice is persisted so the banner
 * only appears once.
 */
const CookieConsent = () => {
  const reduce = useReducedMotion();
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "granted") {
      updateConsent(true); // re-affirm grant on every load
    } else if (saved !== "denied") {
      setVisible(true); // no choice yet → ask
    }
  }, []);

  const decide = (granted: boolean) => {
    localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    updateConsent(granted);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label={t("cookies.aria")}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-overlay mx-auto max-w-2xl card-floating p-4 sm:p-5 shadow-elevated"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-4 h-4 text-primary" aria-hidden="true" />
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {t("cookies.text")}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => decide(false)}
                className="min-h-11 border-primary/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("cookies.refuse")}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => decide(true)}
                className="min-h-11 bg-brand text-brand-foreground hover:bg-brand/90 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("cookies.accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
