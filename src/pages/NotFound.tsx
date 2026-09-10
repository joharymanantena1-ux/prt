import { ArrowRight } from "lucide-react";
import { useT } from "@/i18n";

export default function NotFound() {
  const { lang } = useT();
  return (
    <main className="notfound shell">
      <p className="eyebrow">Error 404</p>
      <h1>
        {lang === "fr" ? (
          <>
            Cette page
            <br />
            <span>n’existe pas.</span>
          </>
        ) : (
          <>
            This page
            <br />
            <span>doesn’t exist.</span>
          </>
        )}
      </h1>
      <p className="notfound-copy">
        {lang === "fr"
          ? "Le lien est peut-être obsolète. Le portfolio, lui, est toujours là."
          : "The link may be out of date. The portfolio, however, is still here."}
      </p>
      <a href="/" className="button-primary">
        {lang === "fr" ? "Retour au portfolio" : "Back to the portfolio"}
        <ArrowRight size={18} />
      </a>
    </main>
  );
}
