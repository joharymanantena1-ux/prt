// Project logos + per-project brand accent.
//
// Logos live in src/assets/ and vary in shape (square vs wide wordmark) and in
// background (transparent, black, coloured). To keep the Swiss-tech aesthetic
// coherent we normalise them all onto a single neutral "chip" (see ProjectLogo):
// a white rounded tile so dark-bg logos (Finger, Musier) and light/transparent
// ones (TCR, BeautyBay) read equally well, while already-coloured logos
// (biloki, erpnext, odoo) keep their own identity.
//
// Vite resolves these imports to hashed asset URLs at build time.

import ota from "@/assets/OTA.avif";
import tcr from "@/assets/TCR.webp";
import beautybay from "@/assets/beautybay.webp";
import biloki from "@/assets/biloki.png";
import konecta from "@/assets/konecta.png";
import daybyday from "@/assets/daybyday.png";
import erpnext from "@/assets/erpnext_official_logo.jpeg";
import odoo from "@/assets/odoo.svg";
import fingerinthenose from "@/assets/fingerinthenose.png";
import musierparis from "@/assets/musierparis.webp";

export interface LogoConfig {
  src: string;
  bg: string;
  padded?: boolean;
}

// Map: exact project title → logo config. Titles must match ProjectsSection data.
export const PROJECT_LOGOS: Record<string, LogoConfig> = {
  "BeautyBay – Web & Mobile": { src: beautybay, bg: "#ffffff" },
  "fingerinthenose.com": { src: fingerinthenose, bg: "#0a0a0a" },
  "The Cool Republic": { src: tcr, bg: "#ffffff", padded: true },
  "Musier Paris": { src: musierparis, bg: "#0a0a0a" },
  "OTA Server": { src: ota, bg: "#0a0a0a" },
  "Test Technique Biloki": { src: biloki, bg: "#00a3ff" },
  "Transport Interne Konecta": { src: konecta, bg: "#ffffff", padded: true },
  "DayByDay CRM": { src: daybyday, bg: "#ffffff" },
  "ERPNext Migration": { src: erpnext, bg: "#0089ff" },
};

// Odoo is used by bank-file-converter (Odoo XML); kept here for reuse if needed.
export const ODOO_LOGO = odoo;
export const PROJECT_COLORS: Record<string, string> = {
  "The Cool Republic": "#111111", // mono black wordmark
  "OTA Server": "#f59e0b", // AWS amber
  "Test Technique Biloki": "#00a3ff", // biloki blue
  "BeautyBay – Web & Mobile": "#ec4899", // pink (beauty)
  "fingerinthenose.com": "#16a34a", // green
  "Musier Paris": "#111111", // mono black
  "Transport Interne Konecta": "#4f1fff", // konecta violet
  "DayByDay CRM": "#4f5fe0", // daybyday indigo
  "ERPNext Migration": "#0089ff", // erpnext blue
  // No-logo projects → explicit brand-ish accents for their monogram fallback.
  "bank-file-converter": "#0d9488", // teal (matches site accent)
  "Edu Levitation SaaS": "#7c3aed", // violet (education)
  "EduContent Mobile App": "#2563eb", // blue (mobile)
  "Cryptomoney Cloud": "#f59e0b", // amber (crypto)
};

// Deterministic hue from a string (0–360) — same title always yields same colour.
export const hueFromString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};
