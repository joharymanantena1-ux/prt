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

// ── OG image 1200×630 — miroir du Hero éditorial ─────────────────────────────
// Composition alignée sur le site : portrait détouré debout sur un panneau
// discret (tête débordante), trame de points + équerre teal, cartouche
// d'identité à filet teal, et à gauche la hiérarchie du Hero (kicker technos,
// « Bonjour, je suis », nom en capitales, « Développeur / Full-Stack »).
async function ogImage() {
  const W = 1200, H = 630;

  // Portrait détouré : ratio du recadrage 1353×2134 (≈0.634), aligné au bas.
  const PH = 560;
  const PW = Math.round((PH * 1353) / 2134); // ≈ 355
  const PX = 790;                            // bord gauche du portrait
  const PY = H - PH;                         // pied au ras du cadre
  // Panneau d'appui — mêmes proportions que le Hero (la tête déborde).
  const PANEL = { x: PX - 55, y: PY + Math.round(PH * 0.14), w: PW + 110 };

  // Trame de points (coin haut-gauche du panneau, à cheval sur le bord)
  let dots = "";
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 6; c++)
      dots += `<circle cx="${PANEL.x - 34 + c * 14}" cy="${PANEL.y - 26 + r * 14}" r="2"
                 fill="${TEAL}" opacity="${(0.62 - r * 0.06 - c * 0.04).toFixed(2)}"/>`;

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}"/>
    ${grid(W, H)}
    <radialGradient id="halo" cx="0.82" cy="0.55" r="0.55">
      <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <rect width="${W}" height="${H}" fill="url(#halo)"/>

    <!-- Panneau d'appui du portrait -->
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2130" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#1a2130" stop-opacity="0.3"/>
    </linearGradient>
    <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.w}" height="${H - PANEL.y}" rx="10" fill="url(#panel)"/>
    <rect x="${PANEL.x + 0.5}" y="${PANEL.y + 0.5}" width="${PANEL.w - 1}" height="${H - PANEL.y + 20}" rx="10"
          fill="none" stroke="${BORDER}" stroke-width="1.5"/>
    ${dots}
    <!-- Équerre teal, coin haut-droit du panneau -->
    <path d="M${PANEL.x + PANEL.w - 46} ${PANEL.y - 1} H${PANEL.x + PANEL.w - 9}
             q10 0 10 10 V${PANEL.y + 45}" fill="none" stroke="${TEAL}" stroke-width="3"/>

    <!-- Colonne texte : hiérarchie du Hero -->
    <text x="82" y="120" font-family="${esc(fonts.mono)}" font-size="21" font-weight="600"
          letter-spacing="5" fill="${TEAL}">REACT · NODE.JS · TYPESCRIPT</text>
    <circle cx="88" cy="152" r="4.5" fill="#3fd68f"/>
    <text x="103" y="159" font-family="${esc(fonts.mono)}" font-size="18" fill="${MUTED}"
          letter-spacing="2">DISPONIBLE</text>

    <text x="80" y="230" font-family="${esc(fonts.display)}" font-size="30" font-weight="500"
          fill="${MUTED}">Bonjour, je suis</text>
    <text x="80" y="282" font-family="${esc(fonts.display)}" font-size="42" font-weight="700"
          letter-spacing="2" fill="${FG}">JOHARY MANANTENA</text>

    <text x="80" y="390" font-family="${esc(fonts.display)}" font-size="88" font-weight="700"
          fill="${FG}" letter-spacing="-2">Développeur</text>
    <text x="80" y="478" font-family="${esc(fonts.display)}" font-size="88" font-weight="700"
          fill="${TEAL}" letter-spacing="-2">Full-Stack</text>

    <line x1="82" y1="524" x2="700" y2="524" stroke="${LINE}" stroke-width="1.5"/>
    <text x="82" y="566" font-family="${esc(fonts.mono)}" font-size="15" fill="${FAINT}" letter-spacing="2">EXPÉRIENCE</text>
    <text x="82" y="598" font-family="${esc(fonts.display)}" font-size="27" font-weight="700" fill="${FG}">3+ ans</text>
    <text x="302" y="566" font-family="${esc(fonts.mono)}" font-size="15" fill="${FAINT}" letter-spacing="2">PROJETS</text>
    <text x="302" y="598" font-family="${esc(fonts.display)}" font-size="27" font-weight="700" fill="${FG}">30+</text>
    <text x="482" y="566" font-family="${esc(fonts.mono)}" font-size="15" fill="${FAINT}" letter-spacing="2">STATUT</text>
    <text x="482" y="598" font-family="${esc(fonts.display)}" font-size="27" font-weight="700" fill="${FG}">Freelance</text>
  </svg>`;

  // Portrait détouré (alpha conservée) posé sur le panneau
  const portrait = await sharp(path.join(PUBLIC, "portrait", "johary-880.webp"))
    .resize({ height: PH })
    .png()
    .toBuffer();

  // Cartouche d'identité — filet teal + fond translucide, comme sur le site
  const cartouche = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <g>
      <rect x="${PANEL.x + 22}" y="${H - 92}" width="238" height="66" rx="6" fill="${BG}" fill-opacity="0.82"/>
      <rect x="${PANEL.x + 22}" y="${H - 92}" width="4" height="66" fill="${TEAL}"/>
      <text x="${PANEL.x + 42}" y="${H - 64}" font-family="${esc(fonts.display)}" font-size="21"
            font-weight="600" fill="${FG}">Johary Manantena</text>
      <text x="${PANEL.x + 42}" y="${H - 39}" font-family="${esc(fonts.mono)}" font-size="13"
            letter-spacing="2" fill="${MUTED}">MADAGASCAR · REMOTE</text>
    </g>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([
      { input: portrait, left: PX, top: PY },
      { input: Buffer.from(cartouche), left: 0, top: 0 },
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
