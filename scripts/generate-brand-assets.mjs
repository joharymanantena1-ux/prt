/**
 * Génère les icônes à partir des tokens du design system :
 *   - public/apple-touch-icon.png (180×180)
 *   - public/favicon.ico          (48×48, PNG — accepté par tous les navigateurs)
 *
 * Usage :  node scripts/generate-brand-assets.mjs
 * L'image de partage (og-image.jpg) a son propre script, rendu par le
 * navigateur : scripts/generate-og-image.mjs.
 * Les artefacts sont commités — ne relancer qu'en cas de changement de charte.
 * La fonte (DM Sans) est téléchargée dans un cache local ; à défaut, repli sur
 * les fontes système.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const CACHE = path.join(ROOT, "node_modules", ".cache", "brand-fonts");

// ── Palette (miroir des tokens index.css, thème sombre) ──────────────────────
const BG = "#0e100f"; // hsl(150 7% 6%) — encre
const FG = "#efefec"; // hsl(60 9% 93%)
const LIME = "#d2f663"; // accent unique

// ── Fonte du site (DM Sans variable, licence OFL) ────────────────────────────
// Le site sert du woff2, que fontconfig ne lit pas : on récupère le TTF
// variable pour le rendu serveur (repli système si le réseau est absent).
const FONTS = [
  [
    "DMSans.ttf",
    "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf",
  ],
];

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

async function setupFonts() {
  try {
    await mkdir(CACHE, { recursive: true });
    for (const [name, url] of FONTS) {
      const dest = path.join(CACHE, name);
      if (await exists(dest)) continue;
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    const conf = path.join(CACHE, "fonts.conf");
    await writeFile(
      conf,
      `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${CACHE}</dir>
  <cachedir>${path.join(CACHE, "fc-cache")}</cachedir>
</fontconfig>
`,
    );
    // Doit être posé AVANT le premier rendu de texte par libvips/pango.
    process.env.FONTCONFIG_FILE = conf;
    return { display: "DM Sans", mono: "Menlo, Consolas, monospace" };
  } catch (err) {
    console.warn(
      `⚠ fonte du site indisponible (${err.message}) → repli système`,
    );
    return {
      display: "Helvetica Neue, Helvetica, Arial, sans-serif",
      mono: "Menlo, Consolas, monospace",
    };
  }
}

const fonts = await setupFonts();
const { default: sharp } = await import("sharp");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ── Icônes (même dessin que public/favicon.svg) ──────────────────────────────
// Monogramme « jm. » : le wordmark de l'en-tête, point lime compris.
const iconSvg = (
  size,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="${size >= 180 ? 0 : 12}" fill="${BG}"/>
    <text x="32" y="44" text-anchor="middle" font-family="${esc(fonts.display)}"
          font-size="38" font-weight="600" letter-spacing="-3"><tspan fill="${FG}">jm</tspan><tspan fill="${LIME}">.</tspan></text>
  </svg>`;

async function icons() {
  await sharp(Buffer.from(iconSvg(180)), { density: 288 })
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png (180×180)");

  // PNG 48×48 servi sous le nom favicon.ico (accepté par tous les navigateurs
  // modernes — le fichier précédent était déjà un PNG).
  const png48 = await sharp(Buffer.from(iconSvg(64)), { density: 288 })
    .resize(48, 48)
    .png()
    .toBuffer();
  await writeFile(path.join(PUBLIC, "favicon.ico"), png48);
  console.log("✓ public/favicon.ico (48×48)");
}

await icons();
