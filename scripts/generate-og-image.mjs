/**
 * Génère public/og-image.jpg (1200×630 — aperçu LinkedIn, X, Slack…), miroir
 * du hero actuel : encre, wordmark « jm. », kicker mono, les trois lignes du
 * titre en Mona Sans (la dernière en lime), filet de stack en pied, et à
 * droite le portrait détouré qui déborde de sa plaque olive, ses orbites, la
 * croix et le cartouche lime.
 *
 * Rendu par le navigateur (Playwright, déjà en devDependency) plutôt que par
 * librsvg : les fontes du site sont des woff2 — Mona Sans en variable —, que
 * fontconfig ne lit pas, et c'est ce qui avait figé l'ancienne image en
 * Helvetica. Fontes et portrait sont embarqués en data: URI, la page est
 * capturée en ×2 puis réduite (texte plus net qu'un rendu ×1).
 *
 * Usage :  node scripts/generate-og-image.mjs
 * L'image est commitée — ne relancer qu'en cas de changement du hero.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const W = 1200;
const H = 630;

const dataUri = async (file, type) =>
  `data:${type};base64,${(await readFile(path.join(PUBLIC, file))).toString("base64")}`;

const [mona, dmRegular, dmMedium, portrait] = await Promise.all([
  dataUri("fonts/mona-sans-wght.woff2", "font/woff2"),
  dataUri("fonts/dm-sans-regular.woff2", "font/woff2"),
  dataUri("fonts/dm-sans-medium.woff2", "font/woff2"),
  dataUri("portrait/johary-880.webp", "image/webp"),
]);

// Valeurs reprises d'index.css (thème sombre, hero) — à garder alignées.
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: "Mona Sans"; src: url(${mona}) format("woff2"); font-weight: 200 900; }
@font-face { font-family: "DM Sans"; src: url(${dmRegular}) format("woff2"); font-weight: 400; }
@font-face { font-family: "DM Sans"; src: url(${dmMedium}) format("woff2"); font-weight: 500 700; }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; background: #0e100f; color: #efefec; }
body { font-family: "DM Sans", sans-serif; -webkit-font-smoothing: antialiased; }
.mono { font-family: "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  text-transform: uppercase; letter-spacing: 0.1em; }
.og { display: grid; grid-template-columns: 1fr 392px; gap: 56px;
  width: 100%; height: 100%; padding: 56px 64px 56px 64px; }

.copy { display: flex; flex-direction: column; min-width: 0; }
.brand { display: flex; align-items: baseline; gap: 18px; }
.wm { font-size: 42px; font-weight: 600; letter-spacing: -0.09em; line-height: 1; }
.wm i { font-style: normal; color: #d0f764; }
.name { font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
.kicker { margin-top: auto; font-size: 13px; color: #a3a6a0; }
h1 { margin: 22px 0 0 -0.055em; font-family: "Mona Sans", "DM Sans", sans-serif;
  font-size: 104px; font-weight: 500; line-height: 0.97; letter-spacing: -0.058em; }
h1 span { display: block; }
h1 .accent { color: #d0f764; }
.foot { margin-top: auto; padding-top: 18px; border-top: 1px solid #262b26;
  font-size: 12px; color: #8f938c; }

/* Le portrait : même construction que .hero-portrait, à l'échelle. */
figure { position: relative; isolation: isolate; align-self: stretch; }
.plate { position: absolute; inset: 30px 0 0; background: #202820;
  border: 1px solid #394237; overflow: hidden; }
.orbit { position: absolute; width: 360px; height: 360px; top: 20px;
  left: calc(50% - 180px); border: 1px solid #586445; border-radius: 50%; }
.orbit.two { transform: scale(0.74); }
.cross { position: absolute; top: 12px; right: 18px; color: #d2f663;
  font: 23px Menlo, monospace; }
.photo { position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: 50% 0%; filter: grayscale(1); }
figcaption { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
  display: grid; grid-template-columns: 1fr auto; gap: 4px;
  padding: 16px 20px; background: #d2f663; color: #18200b; }
figcaption .mono { font-size: 10px; }
figcaption p { font-size: 17px; line-height: 1.22; letter-spacing: -0.025em; }
figcaption svg { align-self: end; grid-row: 1 / 3; grid-column: 2; }
</style></head>
<body><main class="og">
  <section class="copy">
    <div class="brand"><span class="wm">jm<i>.</i></span><span class="name">Johary Manantena</span></div>
    <p class="kicker mono">Full-Stack Developer / Web &amp; Mobile</p>
    <h1><span>Code.</span><span>Purpose.</span><span class="accent">Real impact.</span></h1>
    <p class="foot mono">React · TypeScript · Node.js · React Native</p>
  </section>
  <figure>
    <div class="plate"><span class="orbit"></span><span class="orbit two"></span><span class="cross">+</span></div>
    <img class="photo" src="${portrait}" alt="">
    <figcaption>
      <span class="mono">Antananarivo, MG</span>
      <p>A curious mind.<br>Practical solutions.</p>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
    </figcaption>
  </figure>
</main></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const shot = await page.screenshot({ type: "png" });
await browser.close();

await sharp(shot)
  .resize(W, H, { kernel: "lanczos3" })
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(path.join(PUBLIC, "og-image.jpg"));
console.log(`✓ public/og-image.jpg (${W}×${H})`);
