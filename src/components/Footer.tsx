import { ArrowUp } from "lucide-react";
import { useT } from "@/i18n";
export default function Footer() {
  const { lang, t } = useT();
  return (
    <footer className="site-footer shell">
      <a href="#accueil" className="wordmark" aria-label={t("nav.backHome")}>
        jm<span>.</span>
      </a>
      <p>© {new Date().getFullYear()} Johary Manantena</p>
      <p className="footer-note">
        {lang === "fr"
          ? "Pensé avec soin. Développé avec intention."
          : "Thoughtfully designed. Purposefully built."}
      </p>
      <a href="#accueil" className="text-link">
        {t("footer.backToTop")}
        <ArrowUp size={16} />
      </a>
    </footer>
  );
}
