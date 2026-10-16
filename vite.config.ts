import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

// Meta tags à URL absolue (canonical, og:url, og:image) — injectés seulement
// quand l'origine de prod est connue : VITE_SITE_URL (prioritaire) ou
// VERCEL_PROJECT_PRODUCTION_URL, fournie par Vercel au build. En local, aucun tag n'est émis.
const injectSiteMeta = (): Plugin => {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (
    process.env.VITE_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")
  ).replace(/\/+$/, "");
  // Empreinte du fichier dans l'URL : LinkedIn, Slack ou X gardent l'image en
  // cache par URL — une nouvelle image doit avoir une nouvelle adresse.
  const ogVersion = createHash("sha256")
    .update(readFileSync(path.resolve(__dirname, "public/og-image.jpg")))
    .digest("hex")
    .slice(0, 8);
  const ogImage = `${siteUrl}/og-image.jpg?v=${ogVersion}`;
  const ogAlt =
    "Johary Manantena — Full-Stack Developer. Code. Purpose. Real impact.";
  return {
    name: "inject-site-meta",
    transformIndexHtml(html) {
      if (!siteUrl) return html;
      const tags = [
        `<link rel="canonical" href="${siteUrl}/" />`,
        `<meta property="og:url" content="${siteUrl}/" />`,
        `<meta property="og:image" content="${ogImage}" />`,
        `<meta property="og:image:secure_url" content="${ogImage}" />`,
        `<meta property="og:image:type" content="image/jpeg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${ogAlt}" />`,
        `<meta name="twitter:image" content="${ogImage}" />`,
        `<meta name="twitter:image:alt" content="${ogAlt}" />`,
      ].join("\n    ");
      return html.replace("</head>", `  ${tags}\n  </head>`);
    },
  };
};

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), injectSiteMeta()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    // Les masques de marque (src/assets/logos) pèsent 1–3 kB chacun : inlinés
    // en base64 ils ajoutaient ~19 kB gzip au chunk principal. En fichiers
    // séparés ils sont récupérés à la demande et mis en cache à part.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Split stable vendor code so it caches across deploys (long-term immutable headers).
        manualChunks: { "react-vendor": ["react", "react-dom"] },
      },
    },
  },
}));
