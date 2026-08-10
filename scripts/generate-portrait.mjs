/**
 * Génère les déclinaisons web du portrait détouré à partir du master :
 *   assets/portrait/newDev-image.png  (hors /public : jamais déployé)
 * →  public/portrait/johary-440.avif|webp   (mobile / 1x)
 *    public/portrait/johary-880.avif|webp   (desktop / 2x)
 *    public/portrait/johary-880.png         (repli, alpha conservée)
 *
 * Le master est recadré automatiquement sur la boîte englobante du sujet
 * (l'export sans arrière-plan laisse de larges marges transparentes) : le
 * portrait remplit ainsi son cadre sans marge morte à télécharger.
 *
 * Usage :  node scripts/generate-portrait.mjs
 * Les fichiers produits sont commités — à relancer uniquement si la photo change.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets", "portrait", "newDev-image.png");
const OUT = path.join(ROOT, "public", "portrait");

/** Marge conservée autour du sujet, en px du master (évite un recadrage au ras). */
const PAD = 10;
/** Largeurs générées (le portrait est affiché ~380–440px de large au maximum). */
const WIDTHS = [440, 880];

/** Boîte englobante des pixels non transparents (alpha > 16). */
async function subjectBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("portrait entièrement transparent");
  const left = Math.max(0, minX - PAD);
  const top = Math.max(0, minY - PAD);
  return {
    left,
    top,
    width: Math.min(width - left, maxX - minX + 1 + PAD * 2),
    height: Math.min(height - top, maxY - minY + 1 + PAD * 2),
  };
}

const kb = async (file) => Math.round((await stat(file)).size / 1024);

const box = await subjectBox(SRC);
await mkdir(OUT, { recursive: true });
console.log(`master recadré → ${box.width}×${box.height} (offset ${box.left},${box.top})`);

for (const width of WIDTHS) {
  const base = sharp(SRC).extract(box).resize({ width, withoutEnlargement: true });

  const avif = path.join(OUT, `johary-${width}.avif`);
  await base.clone().avif({ quality: 58, effort: 6 }).toFile(avif);
  console.log(`✓ ${path.relative(ROOT, avif)} (${await kb(avif)} Ko)`);

  const webp = path.join(OUT, `johary-${width}.webp`);
  await base.clone().webp({ quality: 78, effort: 6 }).toFile(webp);
  console.log(`✓ ${path.relative(ROOT, webp)} (${await kb(webp)} Ko)`);
}

// Repli PNG (navigateurs sans AVIF ni WebP) — palettisé, largeur intermédiaire :
// il ne sera quasiment jamais servi, autant ne pas le payer cher.
const png = path.join(OUT, "johary-660.png");
await sharp(SRC)
  .extract(box)
  .resize({ width: 660 })
  .png({ compressionLevel: 9, palette: true, quality: 70, colors: 128 })
  .toFile(png);
console.log(`✓ ${path.relative(ROOT, png)} (${await kb(png)} Ko)`);
