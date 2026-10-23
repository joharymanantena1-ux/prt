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

Node version: 18.18.0 (`.nvmrc`). Deployment target: Vercel (`vercel.json`: headers, SPA rewrite; the contact function is `api/contact.mjs`).

## Architecture

Single-page portfolio (bilingual EN/FR, **English by default**) for a full-stack developer.
Stack: React 18 + TypeScript + Vite. **No UI framework and no animation library** —
the interface is hand-written CSS in [src/index.css](src/index.css) plus `lucide-react` icons.

Runtime dependencies are deliberately limited to `react`, `react-dom` and `lucide-react`.
Before adding one, check whether ~30 lines of CSS would do; the first-load budget
(≈70 kB gzip of JS + CSS) is a feature of this project.

### Page shell

[src/App.tsx](src/App.tsx) has no router: Vercel rewrites every path to `index.html`,
so `App` renders [Index](src/pages/Index.tsx) for `/` and [NotFound](src/pages/NotFound.tsx)
for anything else. Sections are plain anchors; scrolling is native
(`scroll-behavior: smooth` + `scroll-padding-top` in `index.css`), never hijacked.

### Sections (in render order)

`HeroSection` → `ProjectsSection` → `AboutSection` → `SkillsSection` →
`ExperienceSection` → `ContactSection` (lazy), in [src/components/sections/](src/components/sections/).
Anchors: `#accueil`, `#projets`, `#apropos`, `#competences`, `#parcours`, `#contact`.
The hero's "Mon CV" link opens the résumé on **Google Drive** (`CV` in
[HeroSection](src/components/sections/HeroSection.tsx)) — update the Drive file
to publish a new version, no deploy needed.
[Navigation.tsx](src/components/Navigation.tsx) holds the desktop links, the language
and theme toggles, and a native `<dialog>` mobile menu with a focus trap.

### Motion

One primitive: [Reveal](src/components/motion/Reveal.tsx) — a single
`IntersectionObserver` flips `data-revealed`, and CSS transitions opacity/translateY
(0.65s, `cubic-bezier(.22,1,.36,1)`). Reduced motion (or no `IntersectionObserver`)
reveals immediately; the global `prefers-reduced-motion` block in `index.css` kills
every transition and animation. Keep entrances transform/opacity only, one per block;
`delay` staggers siblings. `at` (default 6) is how far above the bottom edge, in %,
the block must be before it plays: headings use 15, the Approche sequence 25, skill
rows 12 — a sequence that fires at the very bottom edge plays unseen, which is why
the first round of section effects read as "nothing changed". Opening a `<details>`
animates its panel (`detail-in`), never the element itself — `details` has no
native transition.

**The page's common motif: section titles compose line by line**, like the hero
title. [Lines](src/components/motion/Lines.tsx) wraps each line of an h2 in a
`.title-line` mask; the parent Reveal slides the lines up in turn (95 ms apart).
The accent word is a `.title-accent` span — never style `h2 span`, every line is
a span now. The masks carry 0.1em of clip room (accents, descenders) given back by
negative margins, so titles take exactly the space they did before (measured to
the pixel); lines keep a trailing space so the heading still reads as one sentence.

Scroll-linked effects use **native CSS scroll-driven animations** (`view-timeline` /
`animation-timeline`), always inside `@supports (animation-timeline: view())` and
`prefers-reduced-motion: no-preference`. Firefox stable still ships them behind a
flag (2026): it gets the static layout, which must always be the finished state —
keyframes animate _from_ an offset _to_ the element's normal style, never the reverse.
Anything the reader must _see happen_ (titles, sequences) is IO-triggered instead,
so it plays in every browser. No GSAP / Three.js: evaluated and declined, see
"Case studies — showcase".

Section effects (amplitudes reduced under 768 px):

- **Hero** (scroll-linked) — three planes on exit: the plate and its orbits lag the
  most (`--plate-lag` 150 px), the photo less (`--photo-lag` 64 px), the green
  caption stays with the page, the copy lifts (`--copy-lift`) and fades to 0.15;
  orbits open to 1.32 / close to 0.5, the cross turns 135°. `.hero-portrait` clips
  so the receding layers slide behind the caption. The first version (photo only,
  60 px) was imperceptible.
- **Hero intro** ([src/components/hero/](src/components/hero/)) — three
  effects, all waiting for the welcome screen to leave (`useIntroDone`, which
  watches `html.intro-active`) and all absent under reduced motion:
  **particle portrait** (`ParticlePortrait`, lazy): a canvas exactly over the
  photo samples it into grey dots that assemble from a dust cloud (~1.5 s), then
  the real photo fades back and the loop stops; on hover (fine pointer only) the
  photo turns back into dots that part around the cursor. State lives on the
  figure (`data-fx="ghost" | "photo"`); `html.fx` (set by the inline theme
  script) keeps the photo at 7 % opacity from the first paint — never 0, it is
  the LCP element — with a 7 s CSS fallback if the chunk never comes. Drawn via
  ImageData at CSS resolution, shown `image-rendering: pixelated`.
  **Touch** (no hover): the assembly waits until the portrait is half on
  screen (it sits below the fold on phones); a tap splashes the dots away from
  the finger, a horizontal drag brushes them, releasing brings the photo back.
  The figure is `touch-action: pan-y` under `(hover: none)`, so vertical
  scrolling stays native and cancels the gesture; no image callout. On iOS
  the URL bar fires resizes: particles are re-sampled only if the box really
  changed. Mobile portrait: 270 px tall, photo 215 px wide.
  **Water drops** (`WaterRipples`, lazy): a faint dot grid behind the hero;
  mouse travel (every ~110 px) or a click drops a ring that pushes the dots
  and lights a few in the accent. Edge fade is a per-dot weight, not a CSS
  `mask-image` (a mask on a canvas redrawn every frame halved the frame rate).
  On touch, drops wait for a real tap (`click`): `pointerdown` also fires at
  the start of a scroll.
  **Text**: mono labels decode once (`ScrambleText`), name / description /
  actions rise after the title, a sheen crosses the accent line once — these
  wait for the welcome screen via `animation-play-state` under
  `.intro-active`. Measured under CPU ×4: hover ~54–60 fps, drops 60 fps,
  mobile load on par with the no-effects baseline; nothing runs when idle.
- **Approche** (IO) — three hairline segments in the principles' accent colour,
  split by the column gutter, draw one after another; each principle's text rises
  behind its line. The block itself no longer fades as a whole.
- **Expertise** — each row's top rule draws on entry; on hover (and on keyboard
  focus) an accent rule draws over it, the number takes the accent, the title moves
  8 px, the stack line brightens. A tinted hover band was tried and rejected — its
  hard edge read as a selected cell, and it overflowed the gutter under 768 px.
- **Parcours** (scroll-linked) — a 2 px ink progress line (`.timeline::after`,
  `scaleY`) draws down to a reading line at 40 % of the viewport; each step's 12 px
  dot fills and takes a ring as the line reaches it, and its dates darken (one
  `view-timeline` per entry). Without support the grey timeline stays as it was.
- **Contact** — title lines (IO); the showcase grid (11 % `currentColor`, masked so
  it fades out before the column edges) fades in on arrival and drifts; the big arrow
  aims into place and its hover pushes it 10 px (`translate`, so it composes with
  the scroll `transform`). No glow blob behind the title: generic, declined.

Navigation marks the section being read (`aria-current="true"`) — a rAF-throttled
check of which section top passed 35 % of the viewport. Not an IntersectionObserver:
the lazy Contact section replaces its element on mount and an observer stays bound
to the old one. Inactive desktop links sit at 62 % of the text colour; the current
one is full ink with a 2 px accent **indicator** (`.nav-indicator`, placed by
`useNavIndicator` from the link's `offsetLeft`/`offsetWidth`, recomputed on language
change, resize and font load) that slides from link to link. It is placed once
without sliding, and fades out in place where no desktop link applies (hero,
Expertise, Contact — the Contact button takes the accent instead).

Performance is measured, not assumed: scrolling the whole page at a steady pace
with the CPU throttled ×4 stays at 60 fps on mobile, tablet and desktop (at most
one frame at 33 ms over five desktop runs), and Lighthouse mobile stays at 97–98
with LCP ≈ 2.35 s and CLS 0. The portrait is the LCP element and waits for the main
bundle, so anything below the fold that is heavy in JS (`ShowcaseArt`,
`CaseStudyModal`) is lazy — that is what kept LCP flat.

Hover conventions, colour/transform only and ≤ 0.3s unless drawing a line: arrows
translate `2px,-2px` (the Contact arrow 10 px), the primary button lifts 2px, nav
links grow an underline, icon buttons take a `color-mix(currentColor 12%)` ground,
archive rows nudge 3px and their brand mark goes to full ink, the archive toggle
gains inner padding, skill rows draw an accent rule. Modals fade the backdrop and
lift the panel 16px (`modal-in` / `backdrop-in`).

### Welcome screen

The intro lives **in [index.html](index.html)** — markup, inline CSS and a small
inline script — not in React: rendered from the bundle it would appear _after_ the
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
studies. Three placements: the client wall, the head rail of each case study
(`.case-mark`), and a gutter in the mission rows (`.mission-mark`, always rendered so
titles stay aligned when a mission has no mark). Academic rows carry no marks.

Adding a logo: drop the file in `src/assets/`, add a line to the `LOGOS` table in
the script (`light` = the mark is the light part; `threshold` and `scale` tune
mid-tone backgrounds and square marks), re-run it, then map the title. Always
check the result — a wrong polarity yields a solid block. `assetsInlineLimit: 0`
in [vite.config.ts](vite.config.ts) keeps these masks out of the main JS chunk
(inlined as base64 they added ~19 kB gzip to it).

**Professional and academic work must stay visibly separate.**
[MissionList](src/components/MissionList.tsx) keeps the ten paid missions **on the
page** — one row each (mark · title · category · sign), detail behind a native
`<details>`, with its own search field. The 31 coursework projects live only in
[AcademicModal](src/components/AcademicModal.tsx), opened by the "Voir mes projets
académiques" button and **lazy-loaded on that click** (~6 kB gzip kept out of the
first load). The modal carries the free-text search plus one chip per family
(`short` in `academicThemes`), and every family keeps its teaching goal and takeaway.
Never move coursework back into the page flow.

### Case studies — showcase

The three case studies are a **showcase of dark tinted panels** on the paper plane
(`.showcase` → `.showcase-item` → `.showcase-panel.theme-<key>`): little text (index,
category, name, one-line headline, three tech tags, one button), an illustration
first. The full story (enjeu → contribution → résultat, full stack, link) lives in
[CaseStudyModal](src/components/CaseStudyModal.tsx), which also browses previous /
next without closing — the nav is never remounted so keyboard focus stays put, the
body scrolls back to top and an `aria-live` line announces the project.

- **Illustrations** — [ShowcaseArt](src/components/ShowcaseArt.tsx): one stage
  for the three projects (viewBox `0 20 640 352`) — a **simple desktop window**
  (`Desktop`: title bar with three dots and an address pill, 16:10 screen
  below), same size and place everywhere (`WIN` / `DESK`), with the project's
  second plane standing in front of its right edge and a little below it
  (`FRONT`): the phone (`Phone`) for BB and Konecta, the generated report card
  for Levitation. The devices take about three quarters of the width and leave
  air around — a MacBook frame was tried and rejected: it filled the panel.
  An accent radial glow sits behind (`layer-back`), the window is `layer-mid`,
  the second plane `layer-front`. No device labels.
  **BB** is a white page with the BB logo exactly centred on both screens, a
  sheen sweeping across it and a slow breathe (`bb-sheen` / `logo-breathe`, CSS
  loops, killed under reduced motion). The logo is the alpha-mask PNG drawn
  **directly as an `<image>`** (its opaque pixels are pure black) and the sheen
  is a rect in `mix-blend-mode: screen` clipped to the logo box — invisible on
  the white page, it lights only the logo. Never put an animated SVG `<mask>`
  there: re-rasterising the masked group every frame measured ~17 fps under CPU
  ×4 against ~54 fps without. **Levitation and Konecta keep their original
  compositions** (grades dashboard + report card + n8n SMS toast; route map +
  ETA chip + driver app with the real logo, a static `<mask>`), drawn for the
  old 640×440 box and placed unchanged inside the screens by `Fit` (uniform
  scale, centred; `deskArea` crops them to 16:10 — the dashboard shows four
  pupils instead of five). Their colours come only from the panel's `--panel`,
  `--art-accent`, `--art-hi` (the shared drawing vocabulary `.st`, `.s1`,
  `.tx`, `.ac`, `.hi`…, order matters). On the Konecta map a shuttle (`kn-bus`,
  a round-capped dash on the route with `pathLength=1`) runs the route in 7 s,
  fades out at the terminus and reappears at the start; each stop lights as it
  passes (`kn-stop`, delayed by its fraction along the route, `fractionAt`).
  The route still draws itself on scroll. Panel tints: BB neutral ink
  (`#151618`), Levitation and Konecta their original green / blue-grey. Ids go
  through `useSvgId()` (the art renders twice when the modal is open).
  Screenshotting the stacked panels needs `reducedMotion: "reduce"` — the
  sticky scale animation never lets them settle. A logo-only version of the
  Levitation and Konecta screens was tried and rejected — keep the compositions.
- **Whole panel clickable** — one `<button class="showcase-open">` whose `::after`
  covers the panel; never nest another interactive element in a panel.
- **Stacking** — on **every width** with `min-height: 640px` the items are sticky
  (top 104px + `i × 16px` staircase; 84px + `i × 10px` under 768 px, where the
  header is 72px); the covered panel scales down via the list's `view-timeline`
  (`exit-crossing` split in `--n` ranges). A stuck panel must fit whole under the
  header or its button is covered before it is seen: measured from 360×640 to
  1920×1080 in FR and EN (tightest: 820×640, 9 px to spare). In one column the
  illustration is capped at `min(36svh, 100svh − 440px)` for that reason. Below
  640 px of height (landscape phones, short windows) it's plain flow. **A keyboard-focused
  panel is raised above the stack** (`:has(:focus-visible)` → `z-index`) — without it
  Shift+Tab lands on a button hidden under another panel (WCAG 2.2 focus not
  obscured; the test covers it, with smooth scrolling disabled while measuring).
- **Parallax** — the three layers rise at different depths during the media's `entry`
  range; the Konecta route draws itself (`pathLength=1`, dashoffset). Hover lifts the
  front layers with the `translate` property, which composes with the scroll
  `transform` instead of overriding it.

Earlier versions: editorial spreads with alternating visuals (judged not modern
enough), and a bento grid with shared ink borders (rejected as too hard). Don't bring
either back.

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
`tx({fr, en}, lang)` for bilingual data fields. **English is the default**: the
provider reads `localStorage["portfolio-lang"]` before the first render (no
flash) and only a saved `"fr"` switches to French; the welcome screen, the
static `<head>` (title, description, OG/Twitter, JSON-LD, `og:locale en_US`)
and the share image follow English too. The choice persists and syncs
`<html lang>`. Tests pin `portfolio-lang = "fr"` in their `beforeEach` — their
assertions are in French.

### Design tokens & theming

HSL CSS variables in [src/index.css](src/index.css), mirrored in
[tailwind.config.ts](tailwind.config.ts). **Dark-first**: `:root, .dark` holds the dark
tokens, `:root[data-theme="light"]` overrides for light. An inline script in
[index.html](index.html) sets `data-theme` _and_ the `dark` class before the first
paint from `localStorage["portfolio-theme"]` (dark unless `"light"`) — it is the single
source of truth, don't add a second one.

Palette: ink `#0e100f` page, lime accent `#d0f764` (`--primary` / `--brand`, `#d2f663`
where the accent is hard-coded in decorative art), text `#efefec`. In light mode
`--primary` becomes a deep green (`#3c6916`) so accent text stays AA-legible.
Page depth comes from two planes: the page and a second plane (`--paper`) used
by the Projects and Experience sections **and by every modal**, which carry their
text via `--ink` / `--paper-muted` / `--paper-line`, their accent via
`--paper-primary` and their focus ring via `--paper-focus`. The plane follows the
theme: **light** — near-white page, ivory band (`#ebe9de`), ink text, deep-green
accent; **dark** — ink page, raised ink plane (`#161917`), light text, lime
accent. It used to stay ivory in dark mode, which left half the page and every
modal bright in the dark theme. On the dark plane the dark showcase panels get a
1px inset hairline so they still detach. Never hard-code a light-only colour in
those sections — go through the tokens (the old `.current-label` green and the
search field's forced `color-scheme: light` were the leftovers).

Typography: **Mona Sans** (GitHub, OFL) for every heading via `--font-display`
(`h1–h4` consume it), **DM Sans** for body and UI, both self-hosted woff2 and
preloaded. Mona Sans ships as the weight-axis variable file only (40 kB) — the width
axis doubled it (96 kB). Display tracking was loosened for it (h2 −0.045em, hero
−0.058em): DM Sans values made its letters touch. The wordmark and the mobile "JM"
monogram stay in DM Sans (they match the favicon/OG art). `--font-mono` is a system
stack, used only for `.eyebrow` labels. No serif display face.

Class naming: semantic, hand-written, BEM-ish (`.case-story`, `.timeline-entry`,
`.theme-block`). Tailwind is kept **only** for preflight, `sr-only` and the token
mirror — do not write utility classes in components, and do not reintroduce shadcn/ui
(all 46 unused primitives were removed; `npx shadcn add` would pull back ~30 Radix deps).

### Contact form

[ContactSection](src/components/sections/ContactSection.tsx) POSTs to
`/api/contact` ([api/contact.mjs](api/contact.mjs)),
which relays server-side to Google Apps Script (`GOOGLE_SCRIPT_URL`, set in Vercel —
see [google-apps-script/Code.gs](google-apps-script/Code.gs)). Includes a honeypot
field and a required consent checkbox. Public contact details come from
`VITE_CONTACT_EMAIL` / `VITE_CONTACT_PHONE`.

Analytics (GA4) loads **only** after explicit opt-in via
[CookieConsent](src/components/CookieConsent.tsx) — no third-party request before that.

### SEO / meta

`canonical`, `og:url` and `og:image` are absolute and injected at build time by the
`inject-site-meta` plugin in [vite.config.ts](vite.config.ts), from `VITE_SITE_URL` or
Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. Nothing is emitted locally, so those tags are absent in `npm run dev`.
The image URL carries a content hash (`og-image.jpg?v=<sha256:8>`): LinkedIn,
Slack and X cache previews by image URL, so a new image needs a new address
(LinkedIn also caches per page — refresh with its Post Inspector after a deploy).

[public/og-image.jpg](public/og-image.jpg) (1200×630, committed) mirrors the
current hero and is rendered **by the browser**:
`node scripts/generate-og-image.mjs` (Playwright + sharp, site fonts and portrait
embedded as data URIs, captured ×2 then downsampled). librsvg cannot read the
site's woff2 — that is why the previous image was stuck in Helvetica. Re-run it
whenever the hero changes; [generate-brand-assets.mjs](scripts/generate-brand-assets.mjs)
now only makes the icons.

### Tests

[tests/portfolio.spec.ts](tests/portfolio.spec.ts) (Playwright, Chrome, against
`npm run preview`): layout and no-horizontal-overflow at nine widths from 320 to
1920 px, mobile dialog focus trap, the case-study showcase (little text, whole-panel click, modal
with previous/next, focus kept, focused panel raised above the stack), missions
staying on the page while coursework stays out of it, the academic modal (open, family filters, search, focus trap, three
ways to close, full-screen on mobile), the navigation's current section and its
sliding indicator, section titles composing line by line (and reading as one
sentence), the hero's three planes, the timeline drawing itself, the welcome screen (plays once, skippable, absent under reduced motion), language
and theme persistence, scroll reveals never leaving content hidden, the 404 page,
analytics consent, the contact form (both outcomes, network intercepted) and four
axe WCAG 2.1 AA audits (dark/light × 390/1440). Keep them green — they encode
decisions, not just behaviour.

### TypeScript config

Loose settings — `noImplicitAny: false`, `strictNullChecks: false`, unused-variable
warnings off. Don't tighten these without user instruction.
