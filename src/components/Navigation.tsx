import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useT } from "@/i18n";

const links = [
  { id: "projets", fr: "Projets", en: "Work" },
  { id: "apropos", fr: "Approche", en: "Approach" },
  { id: "parcours", fr: "Parcours", en: "Experience" },
];

export default function Navigation() {
  const { lang, setLang, t } = useT();
  const [light, setLight] = useState(
    () => localStorage.getItem("portfolio-theme") === "light",
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !light);
    localStorage.setItem("portfolio-theme", light ? "light" : "dark");
  }, [light]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) dialog.current?.close();
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  const navigateFromMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const hash = event.currentTarget.hash;
    close();
    // Wait until the modal is closed and the background is scrollable again.
    requestAnimationFrame(() => {
      window.history.pushState(null, "", hash);
      document.querySelector(hash)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  };
  return (
    <>
      <a href="#main" className="skip-link">
        {lang === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <header className="site-header">
        <a href="#accueil" className="wordmark" aria-label={t("nav.backHome")}>
          jm<span>.</span>
          <span className="wordmark-name">Johary Manantena</span>
        </a>
        <nav className="desktop-nav" aria-label={t("nav.mainNav")}>
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`}>
              {link[lang]}
            </a>
          ))}
        </nav>
        <div className="nav-tools">
          <button
            className="language-toggle"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            aria-label={t("nav.switchLang")}
          >
            {lang.toUpperCase()}
            <span aria-hidden="true"> / {lang === "fr" ? "EN" : "FR"}</span>
          </button>
          <button
            className="icon-button theme-toggle"
            onClick={() => setLight(!light)}
            aria-label={light ? t("nav.darkMode") : t("nav.lightMode")}
          >
            {light ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <a href="#contact" className="nav-contact">
            {lang === "fr" ? "Échangeons" : "Let's talk"}
            <ArrowUpRight size={16} />
          </a>
          <button
            ref={trigger}
            className="icon-button menu-toggle"
            aria-label={t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              dialog.current?.showModal();
              setOpen(true);
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        aria-label={t("nav.menu")}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = dialog.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          if (!items?.length) return;
          const first = items[0],
            last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        id="mobile-menu"
        className="mobile-menu"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
      >
        <div className="mobile-menu-top">
          <span className="eyebrow">{t("nav.menu")}</span>
          <button
            className="icon-button"
            onClick={close}
            aria-label={t("nav.closeMenu")}
            autoFocus
          >
            <X />
          </button>
        </div>
        <nav aria-label={t("nav.mainNav")}>
          {[
            { id: "accueil", fr: "Accueil", en: "Home" },
            ...links,
            { id: "competences", fr: "Expertise", en: "Expertise" },
            { id: "contact", fr: "Échangeons", en: "Let's talk" },
          ].map((link, index) => (
            <a key={link.id} href={`#${link.id}`} onClick={navigateFromMenu}>
              <span className="eyebrow">0{index + 1}</span>
              {link[lang]}
              <ArrowUpRight size={24} />
            </a>
          ))}
        </nav>
        <p className="eyebrow">Antananarivo, Madagascar · UTC+3</p>
      </dialog>
    </>
  );
}
