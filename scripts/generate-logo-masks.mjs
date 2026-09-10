/**
 * Normalise les logos clients/produits en masques monochromes.
 *
 * Les fichiers d'origine (src/assets/*) n'ont aucune transparence et arrivent
 * chacun avec son fond (noir, blanc, bleu, rouge) : posés tels quels sur les
 * plans encre/papier du site, ils forment un patchwork. On en extrait donc la
 * forme dans le canal alpha, pour que le CSS les colore avec `currentColor`
 * (mask-image) et qu'ils prennent la couleur du plan et du thème.
 *
 * Usage :  node scripts/generate-logo-masks.mjs
 * Les artefacts sont commités — ne relancer qu'en cas de changement de logo.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src", "assets");
const OUT = path.join(SRC, "logos");

// `light` : la marque est claire sur fond sombre (on garde la luminance).
// Sinon la marque est sombre sur fond clair et on inverse — ce qui traduit
// fidèlement les logos « bloc de couleur + typo en réserve » (Paul Beuscher,
// ERPNext) en bloc plein à typo évidée.
const LOGOS = [
  // `scale` réduit les marques carrées : à hauteur égale, un carré pèse plus
  // qu'un logotype large.
  { file: "beautybay.webp", out: "beautybay", light: false, scale: 0.8 },
  // Typo noire sur aplat rouge (lum 112) : seuil haut pour ne garder que la typo.
  { file: "paulbeaucher.png", out: "paul-beuscher", light: false, threshold: 200 },
  { file: "musierparis.webp", out: "musier-paris", light: true },
  { file: "TCR.webp", out: "the-cool-republic", light: false },
  { file: "fingerinthenose.png", out: "finger-in-the-nose", light: true },
  { file: "konecta.png", out: "konecta", light: false },
  { file: "OTA.avif", out: "ota", light: true, scale: 0.82 },
  { file: "daybyday.png", out: "daybyday", light: false },
  // « E » blanc sur aplat bleu (lum 128) : on ne garde que le E.
  { file: "erpnext_official_logo.jpeg", out: "erpnext", light: true, threshold: 185, scale: 0.8 },
  // « odoo » blanc sur aplat violet (lum 94).
  { file: "odoo.svg", out: "odoo", light: true, threshold: 175, scale: 0.9 },
];

// Toutes les marques sont posées dans la même boîte 3:1 : le CSS n'a plus qu'à
// fixer une hauteur commune, et la grille du mur de logos s'aligne d'elle-même.
// 360×120 : les marques sont affichées au plus large dans le mur de logos
// (~102 px), donc la boîte tient jusqu'à 3,5× — net sur écran haute densité,
// pour 2 à 4 kB par fichier.
const BOX_W = 360;
const BOX_H = 120;

for (const { file, out, light, threshold = 62, scale = 1 } of LOGOS) {
  await mkdir(OUT, { recursive: true });
  const input = await readFile(path.join(SRC, file));

  // Luminance → canal alpha, calculée à la main : sharp applique `threshold`
  // avant `negate` quel que soit l'ordre d'appel, ce qui vidait les masques.
  // Rampe douce (±18) autour du seuil : bords lissés sur les traits fins.
  const { data, info } = await sharp(input)
    .grayscale()
    .toColourspace("b-w")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const alpha = Buffer.alloc(width * height);
  for (let i = 0; i < alpha.length; i++) {
    const value = light ? data[i * info.channels] : 255 - data[i * info.channels];
    alpha[i] = Math.max(
      0,
      Math.min(255, Math.round(((value - (threshold - 18)) / 36) * 255)),
    );
  }

  const mark = await sharp({
    create: { width, height, channels: 3, background: "#000000" },
  })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  // Détourage puis mise en boîte : chaque marque est centrée dans le même
  // cadre, l'échelle vient du CSS et non des marges du fichier d'origine.
  const trimmed = await sharp(mark)
    .trim({ threshold: 12 })
    .resize({
      width: Math.round(BOX_W * scale),
      height: Math.round(BOX_H * scale),
      fit: "inside",
    })
    .toBuffer();
  const box = await sharp(trimmed).metadata();
  const left = Math.round((BOX_W - box.width) / 2);
  const top = Math.round((BOX_H - box.height) / 2);

  const file_out = path.join(OUT, `${out}.png`);
  const written = await sharp(trimmed)
    .extend({
      left,
      top,
      right: BOX_W - box.width - left,
      bottom: BOX_H - box.height - top,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    // Le RGB est un aplat noir : seul l'alpha porte la forme. On sort donc un
    // PNG gris+alpha (2 canaux au lieu de 4) et une palette réduite.
    .toColourspace("b-w")
    .png({ compressionLevel: 9, effort: 10, palette: true, colours: 32 })
    .toFile(file_out);

  console.log(
    `✓ ${path.relative(ROOT, file_out)} — ${written.width}×${written.height}, ${(written.size / 1024).toFixed(1)} kB`,
  );
}
