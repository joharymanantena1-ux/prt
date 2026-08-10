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
const BG = "#0e1016"; //  hsl(224 24% 7%)
const FG = "#f2f5f7";
const TEAL = "#22d3c1"; // hsl(174 72% 48%) — accent unique
const MUTED = "#98a2b3";
const FAINT = "#6b7484";
const LINE = "#1c2230";
const BORDER = "#262d3d";

// ── Fontes du site (variables TTF, licence OFL) ──────────────────────────────
const FONTS = [
  ["SpaceGrotesk.ttf", "https://github.com/google/fonts/raw/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf"],
  ["JetBrainsMono.ttf", "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"],
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
    return { display: "Space Grotesk", mono: "JetBrains Mono" };
  } catch (err) {
    console.warn(`⚠ fontes du site indisponibles (${err.message}) → repli système`);
    return { display: "Helvetica Neue, Helvetica, Arial, sans-serif", mono: "Menlo, Consolas, monospace" };
  }
}

const fonts = await setupFonts();
const { default: sharp } = await import("sharp");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Grille d'ingénierie discrète (pas de 60 px)
const grid = (w, h) => {
  let d = "";
  for (let x = 60; x < w; x += 60) d += `M${x} 0V${h}`;
  for (let y = 60; y < h; y += 60) d += `M0 ${y}H${w}`;
  return `<path d="${d}" stroke="${LINE}" stroke-width="1" opacity="0.5"/>`;
};

// Ticks d'angle (écho du cadre Hero) autour d'un rectangle
const ticks = (x, y, w, h, len = 22, sw = 3, color = TEAL, off = 10) => `
  <g stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="square">
    <path d="M${x - off} ${y - off + len}V${y - off}H${x - off + len}"/>
    <path d="M${x + w + off - len} ${y - off}H${x + w + off}V${y - off + len}"/>
    <path d="M${x + w + off} ${y + h + off - len}V${y + h + off}H${x + w + off - len}"/>
    <path d="M${x - off + len} ${y + h + off}H${x - off}V${y + h + off - len}"/>
  </g>`;

// ── OG image 1200×630 ─────────────────────────────────────────────────────────
async function ogImage() {
  const W = 1200, H = 630;
  const P = { w: 396, h: 500 };
  P.x = W - 76 - P.w;
  P.y = (H - P.h) / 2;

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}"/>
    ${grid(W, H)}
    <radialGradient id="halo" cx="0.78" cy="0.5" r="0.55">
      <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <rect width="${W}" height="${H}" fill="url(#halo)"/>
    ${ticks(36, 36, W - 72, H - 72, 30, 3, TEAL, 0)}

    <text x="84" y="163" font-family="${esc(fonts.mono)}" font-size="23" font-weight="600"
          letter-spacing="7" fill="${TEAL}">01 — PORTFOLIO</text>

    <text x="80" y="268" font-family="${esc(fonts.display)}" font-size="97" font-weight="700"
          fill="${FG}" letter-spacing="-2">Johary</text>
    <text x="80" y="368" font-family="${esc(fonts.display)}" font-size="97" font-weight="700"
          fill="${TEAL}" letter-spacing="-2">Manantena</text>

    <text x="84" y="441" font-family="${esc(fonts.display)}" font-size="33" font-weight="500"
          fill="${MUTED}">Développeur Full-Stack — Web &amp; Mobile</text>

    <text x="84" y="500" font-family="${esc(fonts.mono)}" font-size="21" fill="${FAINT}"
          letter-spacing="1">React · Node.js · TypeScript · Laravel · Spring Boot</text>

    <circle cx="92" cy="551" r="5" fill="${TEAL}"/>
    <text x="108" y="559" font-family="${esc(fonts.mono)}" font-size="20" fill="${MUTED}">Disponible pour missions freelance</text>
  </svg>`;

  const mask = Buffer.from(
    `<svg width="${P.w}" height="${P.h}"><rect width="${P.w}" height="${P.h}" rx="10" fill="#fff"/></svg>`,
  );
  const portrait = await sharp(path.join(PUBLIC, "portrait", "johary-880.webp"))
    .resize(P.w, P.h, { fit: "cover", position: "top" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${P.x + 0.5}" y="${P.y + 0.5}" width="${P.w - 1}" height="${P.h - 1}" rx="10"
          fill="none" stroke="${BORDER}" stroke-width="1.5"/>
    ${ticks(P.x, P.y, P.w, P.h)}
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([
      { input: portrait, left: P.x, top: Math.round(P.y) },
      { input: Buffer.from(frame), left: 0, top: 0 },
    ])
    .flatten({ background: BG })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
  console.log("✓ public/og-image.jpg (1200×630)");
}

// ── Icônes (même dessin que public/favicon.svg) ──────────────────────────────
const iconSvg = (size) => {
  const s = size / 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="${size >= 180 ? 0 : 13}" fill="${BG}"/>
    <path d="M9 17v-4a4 4 0 0 1 4-4h4" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M55 47v4a4 4 0 0 1-4 4h-4" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linecap="round"/>
    <text x="32" y="43" text-anchor="middle" font-family="${esc(fonts.display)}"
          font-size="31" font-weight="700"><tspan fill="${TEAL}">J</tspan><tspan fill="#dbe2e8">m</tspan></text>
  </svg>`;
};

async function icons() {
  await sharp(Buffer.from(iconSvg(180)), { density: 288 })
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png (180×180)");

  // PNG 48×48 servi sous le nom favicon.ico (accepté par tous les navigateurs
  // modernes — le fichier précédent était déjà un PNG).
  const png48 = await sharp(Buffer.from(iconSvg(64)), { density: 288 }).resize(48, 48).png().toBuffer();
  await writeFile(path.join(PUBLIC, "favicon.ico"), png48);
  console.log("✓ public/favicon.ico (48×48)");
}

await ogImage();
await icons();
