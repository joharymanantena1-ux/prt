import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useT } from "@/i18n";

interface FooterProps {
  sectionNames: string[];
  onNavigate: (index: number) => void;
}

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "andrianmanantena@gmail.com";

const SOCIALS = [
  { href: "https://github.com/joharymanantena1-ux", label: "GitHub" },
  { href: "https://www.linkedin.com/in/johary-andrianjafinoro-73b29b3a3", label: "LinkedIn" },
];

/* Horloge locale (Antananarivo, GMT+3) — détail humain du colophon.
   Mise à jour toutes les 30 s ; format 24 h, stable FR/EN. */
const useLocalTime = () => {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Indian/Antananarivo",
    }).format(new Date()),
  );

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Indian/Antananarivo",
    });
    const id = window.setInterval(() => setTime(fmt.format(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
};

/**
 * Footer colophon — clôture éditoriale : identité et rôle à gauche, sommaire
 * mono au centre, contact à droite ; rangée basse avec heure locale (TNR),
 * copyright et retour en haut. Filets hairline, aucune carte.
 */
const Footer = ({ sectionNames, onNavigate }: FooterProps) => {
  const { t } = useT();
  const time = useLocalTime();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* ── Rangée principale ─────────────────────────────────────────── */}
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-8 py-12 lg:py-16">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="font-display font-bold text-2xl tracking-tight">
              Johary Manantena<span className="text-primary">.</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          <nav className="md:col-span-3 lg:col-span-3 lg:col-start-7" aria-label={t("nav.sectionNav")}>
            <p className="kicker mb-4">{t("footer.navTitle")}</p>
            <ul className="space-y-2.5">
              {sectionNames.map((name, index) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => onNavigate(index)}
                    className="link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 lg:col-span-2 lg:col-start-11">
            <p className="kicker mb-4">{t("footer.contactTitle")}</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors break-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              {SOCIALS.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (nouvel onglet)`}
                    className="link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Rangée basse — colophon ───────────────────────────────────── */}
        <div className="border-t border-border/70 py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            © {year} Johary Manantena
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 hidden sm:block">
            {t("footer.colophon")}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground ml-auto tabular-nums">
            {t("footer.localTime")} — {time} <span className="text-muted-foreground/60">GMT+3</span>
          </p>
          <button
            type="button"
            onClick={() => onNavigate(0)}
            aria-label={t("footer.backToTopAria")}
            className="group inline-flex items-center gap-1.5 min-h-11 px-2 -mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("footer.backToTop")}
            <ArrowUp
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
