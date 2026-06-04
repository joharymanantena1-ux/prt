import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { fr } from "./fr";
import { en } from "./en";

export type Lang = "fr" | "en";
type Dict = typeof fr;

const dicts: Record<Lang, Dict> = { fr, en };
const STORAGE_KEY = "portfolio-lang";

/* Read a dot-path ("hero.ctaProjects") out of a nested dict. */
const getNested = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, k) => (acc == null ? acc : (acc as Record<string, unknown>)[k]), obj);

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("fr");

  // Hydrate from storage (default FR for the primary francophone audience).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  // Keep <html lang> in sync for a11y / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (path: string) => {
      const val = getNested(dicts[lang], path);
      if (typeof val === "string") return val;
      const fallback = getNested(fr, path); // fall back to FR, then the key itself
      return typeof fallback === "string" ? fallback : path;
    },
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useT = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within a LanguageProvider");
  return ctx;
};

/* Inline bilingual data fields: `tx({fr,en}, lang)`, or pass-through a plain string. */
export type Bi = string | { fr: string; en: string };
// eslint-disable-next-line react-refresh/only-export-components
export const tx = (v: Bi, lang: Lang): string => (typeof v === "string" ? v : v[lang]);
