/**
 * Logos des établissements du parcours académique (section Parcours).
 *
 * Contrairement aux marques clients (generate-logo-masks.mjs, monochromes),
 * ces logos gardent leurs couleurs et leurs proportions d'origine. Seule leur
 * partie neutre — le texte noir ou blanc — suit le fond, comme les versions
 * positive / négative d'une charte : chaque logo sort en deux fichiers,
 * `-light` (plan ivoire) et `-dark` (plan encre).
 *
 * Sources officielles (src/assets/schools/source) :
 *   - IT University : ituniversity.mg, ITU_logo_MAJ_negatif_sans_fond.png
 *     (texte blanc) — la version claire passe le texte à l'encre ;
 *   - ESTIA Institute of Technology : estia.fr, logo-estia.png (texte noir)
 *     — la version sombre passe le noir et le gris à leurs équivalents clairs ;
 *   - Google Cloud : logo officiel (Wikimedia Commons, Google_Cloud_logo.svg)
 *     — la version sombre passe le mot « Google Cloud » au gris clair que
 *     Google utilise sur fond sombre.
 * Le bleu ESTIA, les verts ITU et les quatre couleurs Google ne changent pas.
 *
 * Usage : node scripts/generate-school-logos.mjs (fichiers commités).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src/assets/schools/source");
const OUT = path.join(ROOT, "src/assets/schools");
const INK = [24, 27, 24]; // --ink du plan clair (#181b18)

/* Recolore les pixels neutres (peu saturés) avec `map(valeur)` ; l'alpha et
   les pixels colorés restent tels quels. */
async function recolor(input, map) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (Math.max(r, g, b) - Math.min(r, g, b) > 28) continue;
    const next = map((r + g + b) / 3);
    if (!next) continue;
    [data[i], data[i + 1], data[i + 2]] = next;
  }
  return sharp(data, { raw: info });
}

/* Hauteur de sortie : 4× la plus grande taille d'affichage (24 px). */
const HEIGHT = 96;
const png = (img) =>
  img.resize({ height: HEIGHT }).png({ compressionLevel: 9, palette: true });

await mkdir(OUT, { recursive: true });

// IT University : le texte blanc devient encre sur le plan clair.
const itu = path.join(SRC, "itu-university-negatif.png");
await png(sharp(itu)).toFile(path.join(OUT, "it-university-dark.png"));
await png(await recolor(itu, (v) => (v > 150 ? INK : null))).toFile(
  path.join(OUT, "it-university-light.png"),
);

// ESTIA : noir (#111) → texte clair, gris (#666) → gris clair, bleu intact.
const estia = path.join(SRC, "estia.png");
await png(sharp(estia)).toFile(path.join(OUT, "estia-light.png"));
await png(
  await recolor(estia, (v) => {
    const t = Math.min(1, Math.max(0, (v - 17) / (102 - 17)));
    const c = Math.round(239 - t * (239 - 163));
    return [c, c, c - 3];
  }),
).toFile(path.join(OUT, "estia-dark.png"));

// Google Cloud : vectoriel, seule la couleur du mot change.
const gc = await readFile(path.join(SRC, "google-cloud.svg"), "utf8");
await writeFile(path.join(OUT, "google-cloud-light.svg"), gc);
await writeFile(
  path.join(OUT, "google-cloud-dark.svg"),
  gc.replace(".cls-5{fill:#5f6368;}", ".cls-5{fill:#e8eaed;}"),
);

console.log("✓ src/assets/schools : IT University, ESTIA, Google Cloud");
