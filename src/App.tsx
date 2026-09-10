import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/i18n";

/* Single-page site: Netlify rewrites every path to index.html, so the only
   routing decision is home vs. not-found — no router needed in the bundle. */
const path = window.location.pathname.replace(/\/+$/, "");
const isHome = path === "" || path === "/index.html";

const App = () => (
  <LanguageProvider>
    {isHome ? <Index /> : <NotFound />}
    <CookieConsent />
  </LanguageProvider>
);

export default App;
