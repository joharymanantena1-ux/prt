import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Meta tags à URL absolue (canonical, og:url, og:image) — injectés seulement
// quand l'origine de prod est connue : VITE_SITE_URL (prioritaire) ou URL,
// fournie automatiquement par Netlify au build. En local, aucun tag n'est émis.
const injectSiteMeta = (): Plugin => {
  const siteUrl = (process.env.VITE_SITE_URL || process.env.URL || "").replace(/\/+$/, "");
  return {
    name: "inject-site-meta",
    transformIndexHtml(html) {
      if (!siteUrl) return html;
      const tags = [
        `<link rel="canonical" href="${siteUrl}/" />`,
        `<meta property="og:url" content="${siteUrl}/" />`,
        `<meta property="og:image" content="${siteUrl}/og-image.jpg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="Johary Manantena — Développeur Full-Stack" />`,
        `<meta name="twitter:image" content="${siteUrl}/og-image.jpg" />`,
      ].join("\n    ");
      return html.replace("</head>", `  ${tags}\n  </head>`);
    },
  };
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), injectSiteMeta(), ...(mode === "development" ? [] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split stable vendor code so it caches across deploys (long-term immutable headers).
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["framer-motion"],
        },
      },
    },
  },
}));
