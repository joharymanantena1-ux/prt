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
 * Footer — clôture de la bande encre : grand wordmark sérif, une ligne de
 * navigation et de contact, puis le colophon (heure locale TNR, copyright,
 * retour en haut). Compact et dense, aucune colonne flottant dans le vide.
 */
const Footer = ({ sectionNames, onNavigate }: FooterProps) => {
  const { t } = useT();
  const time = useLocalTime();
  const year = new Date().getFullYear();

  return (
    // Nuance navy plus profonde que la bande contact (midnight) : séparation
    // nette mais dans la palette, identique dans les deux modes.
    <footer className="dark bg-[hsl(221,36%,6%)] text-foreground border-t border-border/40">
      {/* pb mobile : dégage la pilule de navigation fixe (masquée dès md) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-10 lg:pt-12 pb-20 md:pb-5">
        {/* Wordmark — présent mais proportionné, il ne domine plus la page */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="font-display font-semibold leading-tight text-[clamp(1.5rem,3vw,2.1rem)]">
            Johary Manantena<span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Navigation + contact — une seule ligne dense, wrap naturel */}
        <div className="mt-6 lg:mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <nav aria-label={t("nav.sectionNav")} className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            {sectionNames.map((name, index) => (
              <button
                key={name}
                type="button"
                onClick={() => onNavigate(index)}
                className="link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {name}
              </button>
            ))}
          </nav>
          <span aria-hidden="true" className="hidden sm:block h-3 w-px bg-border self-center" />
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-editorial text-sm font-medium text-primary transition-colors break-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            {SOCIALS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (nouvel onglet)`}
                className="link-editorial text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-7 lg:mt-8 border-t border-border/50 pt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="text-xs text-muted-foreground">© {year} Johary Manantena</p>
          <p className="text-xs text-muted-foreground/70 hidden md:block">{t("footer.colophon")}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground ml-auto tabular-nums">
            {t("footer.localTime")} {time} <span className="text-muted-foreground/60">GMT+3</span>
          </p>
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
