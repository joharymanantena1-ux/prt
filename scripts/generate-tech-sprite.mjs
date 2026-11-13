/**
 * Logos des technologies (bandeau de la section Expertise).
 *
 * Assemble un sprite SVG (un <symbol> par logo) à partir des sources locales
 * de src/assets/tech/source, et écrit la liste affichée dans
 * src/data/techStack.ts (identifiant, nom, rapport largeur/hauteur).
 *
 * Sources :
 *   - Simple Icons (CC0) — tracés des logos de marque, monochromes ;
 *   - Wikimedia Commons — Oracle, AWS (logos officiels) ;
 *   - klaviyo.com — mot-symbole officiel, tiré de l'en-tête du site.
 * Chaque logo est passé en `currentColor` : il prend la couleur du texte et
 * suit le thème, comme les marques clientes.
 *
 * Liste retenue (novembre 2026) : technologies employées dans au moins une
 * mission professionnelle ou dans deux projets de formation (données du site),
 * avec un logo officiel disponible en local. Écartées : formats et standards
 * (REST API, CSV, XML…), fonctions d'une plateforme (Liquid, Consent Mode…),
 * et Java, C#, Channable, Google Merchant Center, Axeptio, OneTrust, Okendo,
 * Zenoti, Criteo, faute de logo officiel disponible.
 *
 * Usage : node scripts/generate-tech-sprite.mjs (fichiers commités).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src/assets/tech/source");

/* Ordre d'affichage : langages, interfaces, mobile, back, données, infra,
   e-commerce et marketing. `wordmark` : le logo écrit déjà le nom, il n'est
   pas répété à l'écran (il reste lu par les lecteurs d'écran). `size` :
   hauteur relative, pour équilibrer optiquement les mots-symboles. */
const TECHS = [
  ["typescript", "TypeScript"],
  ["javascript", "JavaScript"],
  ["python", "Python"],
  ["php", "PHP"],
  ["cplusplus", "C++"],
  ["react", "React"],
  ["vuedotjs", "Vue.js"],
  ["tailwindcss", "Tailwind CSS"],
  ["html5", "HTML5"],
  ["css", "CSS"],
  ["react", "React Native", "react-native"],
  ["expo", "Expo"],
  ["nodedotjs", "Node.js"],
  ["springboot", "Spring Boot"],
  ["symfony", "Symfony"],
  ["laravel", "Laravel"],
  ["codeigniter", "CodeIgniter"],
  ["graphql", "GraphQL"],
  ["mysql", "MySQL"],
  ["postgresql", "PostgreSQL"],
  ["oracle", "Oracle", null, true, 0.6],
  ["firebase", "Firebase"],
  ["aws", "AWS", null, true, 1.05],
  ["docker", "Docker"],
  ["linux", "Linux"],
  ["shopify", "Shopify"],
  ["googleads", "Google Ads"],
  ["googleanalytics", "Google Analytics"],
  ["googletagmanager", "Google Tag Manager"],
  ["meta", "Meta"],
  ["klaviyo", "Klaviyo", null, true, 0.85],
  ["n8n", "n8n"],
  ["odoo", "Odoo", null, true, 1.9],
  ["frappe", "Frappe"],
];

/* Contenu d'un SVG source réduit à ses formes, couleurs retirées. */
function symbolOf(svg, id) {
  const viewBox = svg.match(/viewBox=["']([^"']+)["']/)[1].trim();
  let inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(fill|class|style|color)=("[^"]*"|'[^']*')/g, "")
    // Deux décimales suffisent à 30 px d'affichage : ~30 % de poids en moins.
    .replace(/(\d+\.\d{2})\d+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return {
    viewBox,
    markup: `<symbol id="${id}" viewBox="${viewBox}" fill="currentColor">${inner}</symbol>`,
  };
}

const symbols = new Map();
const entries = [];
for (const [file, name, alias, wordmark = false, size = 1] of TECHS) {
  const id = file;
  if (!symbols.has(id)) {
    const svg = await readFile(path.join(SRC, `${file}.svg`), "utf8");
    symbols.set(id, symbolOf(svg, id));
  }
  const [, , w, h] = symbols
    .get(id)
    .viewBox.split(/[\s,]+/)
    .map(Number);
  entries.push({
    key: alias ?? id,
    symbol: id,
    name,
    ratio: +(w / h).toFixed(3),
    wordmark,
    size,
  });
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">${[...symbols.values()]
  .map((s) => s.markup)
  .join("")}</svg>\n`;
await writeFile(path.join(ROOT, "src/assets/tech/tech-logos.svg"), sprite);

await writeFile(
  path.join(ROOT, "src/data/techStack.ts"),
  `/* Généré par scripts/generate-tech-sprite.mjs — ne pas modifier à la main.
   Les technologies du bandeau Expertise : symbole du sprite, nom affiché et
   lu, rapport largeur/hauteur du logo, hauteur relative. */
export interface TechLogo {
  key: string;
  symbol: string;
  name: string;
  ratio: number;
  wordmark: boolean;
  size: number;
}

export const techStack: TechLogo[] = ${JSON.stringify(entries, null, 2)};
`,
);

console.log(
  `✓ src/assets/tech/tech-logos.svg — ${symbols.size} logos, ${(sprite.length / 1024).toFixed(1)} kB`,
);
console.log(`✓ src/data/techStack.ts — ${entries.length} technologies`);
