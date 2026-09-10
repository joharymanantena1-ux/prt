import { useEffect, useState } from "react";
import { useT } from "@/i18n";
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
const STORAGE_KEY = "cookie-consent";

// Load analytics only after opt-in; no third-party request on the first paint.
function enableAnalytics() {
  if (document.getElementById("portfolio-analytics")) return;
  window.dataLayer = window.dataLayer || [];
  // gtag’s queue expects an Arguments object, matching Google’s bootstrap.
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "granted",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", "G-09ET3KDENS", { anonymize_ip: true });
  const script = document.createElement("script");
  script.id = "portfolio-analytics";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-09ET3KDENS";
  document.head.appendChild(script);
}
export default function CookieConsent() {
  const { lang, t } = useT();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "granted") enableAnalytics();
    else if (saved !== "denied") setVisible(true);
  }, []);
  const decide = (accept: boolean) => {
    localStorage.setItem(STORAGE_KEY, accept ? "granted" : "denied");
    if (accept) enableAnalytics();
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <aside className="cookie-banner" aria-label={t("cookies.aria")}>
      <p>
        {lang === "fr"
          ? "Autoriser Google Analytics pour mesurer les visites ? Aucun suivi sans votre accord."
          : "Allow Google Analytics to measure visits? No tracking without your permission."}
      </p>
      <div className="cookie-actions">
        <button onClick={() => decide(false)}>{t("cookies.refuse")}</button>
        <button onClick={() => decide(true)}>{t("cookies.accept")}</button>
      </div>
    </aside>
  );
}
