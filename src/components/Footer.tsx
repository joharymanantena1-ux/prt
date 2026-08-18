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

/* Horloge locale (Antananarivo, GMT+3) — mise à jour toutes les 30 s. */
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
 * Footer — colophon éditorial asymétrique sur navy profond (nuance distincte
 * de la bande contact) : identité et liens à gauche, la grande horloge
 * d'Antananarivo comme élément graphique à droite, navigation et copyright
 * en pied. Le nom reste volontairement discret.
 */
const Footer = ({ sectionNames, onNavigate }: FooterProps) => {
  const { t } = useT();
  const time = useLocalTime();
  const year = new Date().getFullYear();

  const linkClass =
    "link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <footer className="dark bg-[hsl(221,36%,6%)] text-foreground border-t border-border/40">
      {/* pb mobile : dégage la pilule de navigation fixe (masquée dès md) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-10 lg:pt-14 pb-20 md:pb-5">
        {/* ── Rangée principale : identité ↔ horloge graphique ── */}
        <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-8 md:items-end">
          <div className="md:col-span-7">
            <p className="font-display font-semibold text-xl sm:text-2xl leading-tight">
              Johary Manantena<span className="text-primary">.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="link-editorial text-sm font-medium text-primary break-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              {SOCIALS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (${t("common.newTab")})`}
                  className={linkClass}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* L'heure locale comme signe graphique : grand sérif tabulaire */}
          <div className="md:col-span-5 md:text-right">
            <p className="font-display font-medium leading-none tabular-nums text-[clamp(2.6rem,5vw,4rem)] text-foreground/95">
              {time}
            </p>
            <p className="mt-2 kicker">
              {t("footer.localTime")} · GMT+3
            </p>
          </div>
        </div>

        {/* ── Pied : navigation, copyright, retour en haut ── */}
        <div className="mt-8 lg:mt-10 border-t border-border/50 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label={t("nav.sectionNav")} className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {sectionNames.map((name, index) => (
              <button key={name} type="button" onClick={() => onNavigate(index)} className={`${linkClass} text-xs`}>
                {name}
              </button>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground ml-auto">© {year} Johary Manantena</p>
          <p className="text-xs text-muted-foreground/70 hidden lg:block">{t("footer.colophon")}</p>
          <button
            type="button"
            onClick={() => onNavigate(0)}
            aria-label={t("footer.backToTopAria")}
            className="group inline-flex items-center gap-1.5 min-h-11 px-2 -mr-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
