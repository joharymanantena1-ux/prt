# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Dev server on port 8080
npm run build         # Production build → dist/
npm run build:dev     # Development build
npm run lint          # ESLint (TypeScript-aware)
npm run typecheck     # tsc --noEmit (app + node configs)
npm run test:e2e      # Playwright suite (builds nothing — run `npm run build` first)
npm run format        # Prettier write · `format:check` in CI
npm run preview       # Preview the production build locally
```

Node version: 18.18.0 (`.nvmrc`). Deployment target: Netlify.

## Architecture

Single-page portfolio (bilingual FR/EN, French first) for a full-stack developer.
Stack: React 18 + TypeScript + Vite. **No UI framework and no animation library** —
the interface is hand-written CSS in [src/index.css](src/index.css) plus `lucide-react` icons.

Runtime dependencies are deliberately limited to `react`, `react-dom` and `lucide-react`.
Before adding one, check whether ~30 lines of CSS would do; the first-load budget
(≈70 kB gzip of JS + CSS) is a feature of this project.

### Page shell

[src/App.tsx](src/App.tsx) has no router: Netlify rewrites every path to `index.html`,
so `App` renders [Index](src/pages/Index.tsx) for `/` and [NotFound](src/pages/NotFound.tsx)
for anything else. Sections are plain anchors; scrolling is native
(`scroll-behavior: smooth` + `scroll-padding-top` in `index.css`), never hijacked.

### Sections (in render order)

`HeroSection` → `ProjectsSection` → `AboutSection` → `SkillsSection` →
`ExperienceSection` → `ContactSection` (lazy), in [src/components/sections/](src/components/sections/).
Anchors: `#accueil`, `#projets`, `#apropos`, `#competences`, `#parcours`, `#contact`.
[Navigation.tsx](src/components/Navigation.tsx) holds the desktop links, the language
and theme toggles, and a native `<dialog>` mobile menu with a focus trap.

### Motion

One primitive: [Reveal](src/components/motion/Reveal.tsx) — a single
`IntersectionObserver` flips `data-revealed`, and CSS transitions opacity/translateY
(0.65s, `cubic-bezier(.22,1,.36,1)`). Reduced motion (or no `IntersectionObserver`)
reveals immediately; the global `prefers-reduced-motion` block in `index.css` kills
every transition and animation. Keep entrances transform/opacity only, one per block;
`delay` staggers siblings (used lightly on the case grid).

Hover conventions, all ≤ 0.3s and colour/transform only: arrows translate
`2px,-2px`, the primary button lifts 2px, nav links grow an underline, icon buttons
take a `color-mix(currentColor 12%)` ground, archive rows nudge 3px and their brand
mark goes to full ink, the archive toggle gains inner padding. Modals fade the
backdrop and lift the panel 16px (`modal-in` / `backdrop-in`).

### Welcome screen

The intro lives **in [index.html](index.html)** — markup, inline CSS and a small
inline script — not in React: rendered from the bundle it would appear *after* the
hero and read as a bug. It mirrors the hero (ink ground, mono kicker, the three
title lines with the last in lime, a lime progress rule) and runs ~5.6s.

It plays **once per browser** (`localStorage["portfolio-intro-seen"]`), never under
`prefers-reduced-motion`, and is skipped by the "Passer" button, Escape, Enter or a
click anywhere. Append `?intro=1` (or `#intro`) to replay it for review. Because it
is painted pre-paint with the hero rendering underneath, it costs nothing in
Lighthouse (FCP 1.4s / LCP 2.2s, performance 98) — keep that property if you touch
it: never gate the app's render behind it. Tests set the storage flag in a
`beforeEach`; the welcome-screen describe block clears it again.

### Projects data model

- [src/data/projects.ts](src/data/projects.ts) — `professionalProjects` (paid work).
- [src/data/caseStudies.ts](src/data/caseStudies.ts) — the three missions told in full
  (enjeu → contribution → résultat). Each points at a `professionalProjects` entry by
  title for its stack and link; `otherProfessionalProjects` is the rest, so the archive
  never repeats a case study.
- [src/data/academicProjects.ts](src/data/academicProjects.ts) — coursework, each tagged
  with a `theme`; `academicThemes` carries the label, the teaching goal and the takeaway.

### Brand marks (client & product logos)

The source logos in `src/assets/*` have no transparency and each carries its own
background (black, white, blue, red), which is why raw logos looked like a
patchwork on the ink/paper planes. [scripts/generate-logo-masks.mjs](scripts/generate-logo-masks.mjs)
extracts each shape into the **alpha channel** of a shared 3:1 box
(`src/assets/logos/*.png`, ~2 kB each, committed); [BrandMark](src/components/BrandMark.tsx)
renders them with `mask-image` over `background: currentColor`, so a mark takes
the colour of its plane and follows the theme. Sizing is CSS-only (one height per
context) — the uniform box keeps the logo wall optically aligned.

`brandMarks` in [src/data/brandMarks.ts](src/data/brandMarks.ts) maps an exact
project title to its mask; `clientMarks` is the client wall under the case
studies. Three placements: the client wall, a gutter in the professional archive
rows (always rendered, so titles stay aligned when a mission has no mark), and a
discreet mark inside a case-study visual. Academic rows carry no marks.

Adding a logo: drop the file in `src/assets/`, add a line to the `LOGOS` table in
the script (`light` = the mark is the light part; `threshold` and `scale` tune
mid-tone backgrounds and square marks), re-run it, then map the title. Always
check the result — a wrong polarity yields a solid block. `assetsInlineLimit: 0`
in [vite.config.ts](vite.config.ts) keeps these masks out of the main JS chunk
(inlined as base64 they added ~19 kB gzip to it).

**Professional and academic work must stay visibly separate.** [ProjectArchive](src/components/ProjectArchive.tsx)
renders two titled groups: the professional missions as rows on the page, and
"Projets académiques" as a **five-line preview** (one per theme, with counts) plus a
button that opens the detail in a [Modal](src/components/Modal.tsx) — 31 coursework
rows must not weigh on the page (moving them out cut ~20 % of the page height).
Each list owns its own search field; the preview counts stay unfiltered because it is
a summary. Academic projects keep their theme grouping with goal and takeaway, and are
never mixed into the professional list.

### Modal

[Modal](src/components/Modal.tsx) wraps a native `<dialog>` — same base as the mobile
menu: Escape and a backdrop click close it, Tab cycles inside, focus returns to the
element that opened it, and the body stops scrolling. Only `.modal-body` scrolls so
the header and the close button stay reachable; below 768 px it fills the screen.
Reuse it for any new modal rather than building an overlay by hand, and keep the axe
audit of the open modal in the test suite.

### i18n

[src/i18n/](src/i18n/) — `LanguageProvider` + `useT()`. `t("nav.menu")` for chrome
strings (`fr.ts` / `en.ts`, kept trimmed to what is actually used), and
`tx({fr, en}, lang)` for bilingual data fields. The choice persists in
`localStorage["portfolio-lang"]` and syncs `<html lang>`.

### Design tokens & theming

HSL CSS variables in [src/index.css](src/index.css), mirrored in
[tailwind.config.ts](tailwind.config.ts). **Dark-first**: `:root, .dark` holds the dark
tokens, `:root[data-theme="light"]` overrides for light. An inline script in
[index.html](index.html) sets `data-theme` *and* the `dark` class before the first
paint from `localStorage["portfolio-theme"]` (dark unless `"light"`) — it is the single
source of truth, don't add a second one.

Palette: ink `#0e100f` page, lime accent `#d0f764` (`--primary` / `--brand`, `#d2f663`
where the accent is hard-coded in decorative art), text `#efefec`. In light mode
`--primary` becomes a deep green (`#3c6916`) so accent text stays AA-legible.
Page depth comes from two planes: the ink page and a **paper** plane
(`--paper`, ivory) used by the Projects and Experience sections, which carry ink text
via `--ink` / `--paper-muted` / `--paper-line`. Light mode replays the same rhythm
(near-white page, ivory band) — keep the two tones distinct enough to read.

Typography: **DM Sans only**, self-hosted in `public/fonts/*.woff2` (400 and a 500–700
face), preloaded in `index.html`. `--font-mono` is a system stack, used only for
`.eyebrow` labels (small uppercase mono: kickers, dates, categories, counts).
No serif display face.

Class naming: semantic, hand-written, BEM-ish (`.case-story`, `.timeline-entry`,
`.theme-block`). Tailwind is kept **only** for preflight, `sr-only` and the token
mirror — do not write utility classes in components, and do not reintroduce shadcn/ui
(all 46 unused primitives were removed; `npx shadcn add` would pull back ~30 Radix deps).

### Contact form

[ContactSection](src/components/sections/ContactSection.tsx) POSTs to
`/.netlify/functions/contact` ([netlify/functions/contact.mjs](netlify/functions/contact.mjs)),
which relays server-side to Google Apps Script (`GOOGLE_SCRIPT_URL`, set in Netlify —
see [google-apps-script/Code.gs](google-apps-script/Code.gs)). Includes a honeypot
field and a required consent checkbox. Public contact details come from
`VITE_CONTACT_EMAIL` / `VITE_CONTACT_PHONE`.

Analytics (GA4) loads **only** after explicit opt-in via
[CookieConsent](src/components/CookieConsent.tsx) — no third-party request before that.

### SEO / meta

`canonical`, `og:url` and `og:image` are absolute and injected at build time by the
`inject-site-meta` plugin in [vite.config.ts](vite.config.ts), from `VITE_SITE_URL` or
Netlify's `URL`. Nothing is emitted locally, so those tags are absent in `npm run dev`.

### Tests

[tests/portfolio.spec.ts](tests/portfolio.spec.ts) (Playwright, Chrome, against
`npm run preview`): layout and no-horizontal-overflow at nine widths from 320 to
1920 px, mobile dialog focus trap, the professional/academic archive split, the
academic modal (open, filter, focus trap, three ways to close, full-screen on
mobile), the welcome screen (plays once, skippable, absent under reduced motion), language
and theme persistence, scroll reveals never leaving content hidden, the 404 page,
analytics consent, the contact form (both outcomes, network intercepted) and four
axe WCAG 2.1 AA audits (dark/light × 390/1440). Keep them green — they encode
decisions, not just behaviour.

### TypeScript config

Loose settings — `noImplicitAny: false`, `strictNullChecks: false`, unused-variable
warnings off. Don't tighten these without user instruction.
