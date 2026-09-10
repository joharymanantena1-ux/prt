// Marques monochromes des clients et des produits croisés en mission.
//
// Les logos d'origine (src/assets/*) n'ont aucune transparence et arrivent
// chacun avec son fond — noir, blanc, bleu, rouge — ce qui donnait un patchwork
// sur les plans encre/papier. `scripts/generate-logo-masks.mjs` en extrait la
// forme dans le canal alpha, dans une boîte 3:1 commune : le CSS les colore
// ensuite avec `currentColor`, donc elles suivent le plan et le thème.
//
// Vite résout ces imports en URLs hashées au build.

import beautybay from "@/assets/logos/beautybay.png";
import daybyday from "@/assets/logos/daybyday.png";
import erpnext from "@/assets/logos/erpnext.png";
import fingerInTheNose from "@/assets/logos/finger-in-the-nose.png";
import konecta from "@/assets/logos/konecta.png";
import musierParis from "@/assets/logos/musier-paris.png";
import odoo from "@/assets/logos/odoo.png";
import ota from "@/assets/logos/ota.png";
import paulBeuscher from "@/assets/logos/paul-beuscher.png";
import theCoolRepublic from "@/assets/logos/the-cool-republic.png";

/** Titre exact du projet (voir data/projects.ts) → masque de la marque. */
export const brandMarks: Record<string, string> = {
  "BeautyBay – Web & Mobile": beautybay,
  "Paul Beuscher": paulBeuscher,
  "Musier Paris": musierParis,
  "The Cool Republic": theCoolRepublic,
  "fingerinthenose.com": fingerInTheNose,
  "Transport Interne Konecta": konecta,
  "OTA Server": ota,
  "DayByDay CRM": daybyday,
  "ERPNext Migration": erpnext,
  // L'outil convertit des fichiers XML Odoo : la marque situe l'écosystème.
  "bank-file-converter": odoo,
};

/** Marques clientes affichées en mur de logos sous les études de cas. */
export const clientMarks = [
  { name: "Paul Beuscher", src: paulBeuscher },
  { name: "Musier Paris", src: musierParis },
  { name: "The Cool Republic", src: theCoolRepublic },
  { name: "Finger in the Nose", src: fingerInTheNose },
];
