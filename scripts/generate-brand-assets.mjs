/**
 * Génère les assets de marque à partir du portrait + des tokens du design system :
 *   - public/og-image.jpg        (1200×630 — aperçu réseaux sociaux)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/favicon.ico          (48×48, PNG — accepté par tous les navigateurs)
 *
 * Usage :  node scripts/generate-brand-assets.mjs
 * Les artefacts sont commités — ne relancer qu'en cas de changement de photo
 * ou de charte. Les fontes du site (Space Grotesk / JetBrains Mono) sont
 * téléchargées dans un cache local ; à défaut, repli sur les fontes système.
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
const MUTED = "#8f938c";
const FAINT = "#6b6f68";
const LINE = "#1f241f";
const PLATE = "#202820"; // plaque du portrait (Hero)
const PLATE_LINE = "#394237";
const ORBIT = "#586445";

// ── Fonte du site (DM Sans variable, licence OFL) ────────────────────────────
// Le site sert du woff2, que fontconfig ne lit pas : on récupère le TTF
// variable pour le rendu serveur (repli système si le réseau est absent).
const FONTS = [
  [
    "DMSans.ttf",
    "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf",
  ],
];

const exists = (p) => access(p).then(() => true, () => false);

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

// ── OG image 1200×630 — miroir du Hero ───────────────────────────────────────
// Même composition que la page : encre, kicker mono, nom, les trois lignes du
// titre (la dernière en lime), filet de stack en pied, et à droite le portrait
// détouré sur sa plaque olive avec l'orbite et le cartouche lime.
// Aucun chiffre ni badge « Disponible » : le site les a retirés volontairement.
async function ogImage() {
  const W = 1200,
    H = 630;

  // Plaque du portrait, à fleur du bas comme dans le Hero.
  const PLATE_BOX = { x: 792, y: 64, w: 344, h: H - 64 };
  const PH = 496; // hauteur du portrait détouré (ratio 1353×2134)
  const PW = Math.round((PH * 1353) / 2134);
  const PX = PLATE_BOX.x + Math.round((PLATE_BOX.w - PW) / 2);
  const PY = H - PH;
  const CAP_H = 78; // cartouche lime, recouvre le bas du portrait

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <clipPath id="plate">
      <rect x="${PLATE_BOX.x}" y="${PLATE_BOX.y}" width="${PLATE_BOX.w}" height="${PLATE_BOX.h}"/>
    </clipPath>
    <rect x="${PLATE_BOX.x}" y="${PLATE_BOX.y}" width="${PLATE_BOX.w}" height="${PLATE_BOX.h}"
          fill="${PLATE}" stroke="${PLATE_LINE}" stroke-width="1"/>
    <g clip-path="url(#plate)" fill="none" stroke="${ORBIT}" stroke-width="1">
      <circle cx="${PLATE_BOX.x + PLATE_BOX.w / 2}" cy="${PLATE_BOX.y + 210}" r="196"/>
      <circle cx="${PLATE_BOX.x + PLATE_BOX.w / 2}" cy="${PLATE_BOX.y + 210}" r="145"/>
    </g>
    <text x="${PLATE_BOX.x + PLATE_BOX.w - 30}" y="${PLATE_BOX.y + 44}" text-anchor="end"
          font-family="${esc(fonts.mono)}" font-size="26" fill="${LIME}">+</text>

    <!-- Colonne texte : hiérarchie exacte du Hero -->
    <text x="80" y="92" font-family="${esc(fonts.mono)}" font-size="16"
          letter-spacing="3.2" fill="${MUTED}">DÉVELOPPEUR FULL-STACK / WEB &amp; MOBILE</text>
    <text x="80" y="158" font-family="${esc(fonts.display)}" font-size="24"
          font-weight="400" fill="${FG}">Johary Manantena</text>

    <g font-family="${esc(fonts.display)}" font-size="92" font-weight="500" letter-spacing="-5.5">
      <text x="74" y="290" fill="${FG}">Du code.</text>
      <text x="74" y="382" fill="${FG}">Du sens.</text>
      <text x="74" y="474" fill="${LIME}">De l’impact.</text>
    </g>

    <line x1="80" y1="536" x2="700" y2="536" stroke="${LINE}" stroke-width="1.5"/>
    <text x="80" y="576" font-family="${esc(fonts.mono)}" font-size="15"
          letter-spacing="2.6" fill="${FAINT}">REACT · TYPESCRIPT · NODE.JS · REACT NATIVE</text>
  </svg>`;

  // Portrait détouré (alpha conservée), en niveaux de gris comme sur le site.
  const portrait = await sharp(path.join(PUBLIC, "portrait", "johary-880.webp"))
    .resize({ height: PH })
    .grayscale()
    .png()
    .toBuffer();

  // Cartouche lime au pied de la plaque (écho de la légende du Hero).
  const caption = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${PLATE_BOX.x}" y="${H - CAP_H}" width="${PLATE_BOX.w}" height="${CAP_H}" fill="${LIME}"/>
    <text x="${PLATE_BOX.x + 24}" y="${H - CAP_H + 28}" font-family="${esc(fonts.mono)}"
          font-size="13" letter-spacing="2.4" fill="#1b2410">ANTANANARIVO, MG</text>
    <text x="${PLATE_BOX.x + 24}" y="${H - CAP_H + 58}" font-family="${esc(fonts.display)}"
          font-size="21" font-weight="500" fill="#18200b">Un esprit curieux.</text>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([
      { input: portrait, left: PX, top: PY },
      { input: Buffer.from(caption), left: 0, top: 0 },
    ])
    .flatten({ background: BG })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
  console.log("✓ public/og-image.jpg (1200×630)");
}

// ── Icônes (même dessin que public/favicon.svg) ──────────────────────────────
// Monogramme « jm. » : le wordmark de l'en-tête, point lime compris.
const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
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

await ogImage();
await icons();
