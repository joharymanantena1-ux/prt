# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build → dist/
npm run build:dev  # Development build
npm run lint       # ESLint (TypeScript-aware)
npm run preview    # Preview production build locally
```

Node version: 18.18.0 (enforced via `.nvmrc`). Deployment target: Netlify.

## Architecture

This is a single-page portfolio site (French-language) for a full-stack developer. The stack is React 18 + TypeScript + Vite, styled with Tailwind CSS (CSS variable design tokens) and animated heavily with Framer Motion and GSAP.

### Scroll navigation

Natural page scroll (no scroll hijacking). [src/pages/Index.tsx](src/pages/Index.tsx) tracks the active section with an rAF-throttled scroll listener (scrollspy) and exposes `navigateToSection` (smooth `scrollIntoView`) to the nav, side dots and mobile dots. The hero is imported statically (LCP); the other sections are lazy-loaded via `React.lazy` + `Suspense`.

Animation is Framer Motion only (GSAP is not used). Shared reduced-motion-aware presets live in [src/hooks/useMotionPreset.ts](src/hooks/useMotionPreset.ts); entrance/`whileInView` reveals are transform/opacity only.

### Sections (in order)

Six portfolio sections live in [src/components/sections/](src/components/sections/):
`HeroSection` → `AboutSection` → `ExperienceSection` → `SkillsSection` → `ProjectsSection` → `ContactSection`

Each section receives an `onNavigate(id)` callback from `Index.tsx`.

### UI components

shadcn/ui primitives live in [src/components/ui/](src/components/ui/) (Radix UI wrappers). Import with the `@/` alias (maps to `src/`). The `cn()` utility (classname merging) is in [src/lib/utils.ts](src/lib/utils.ts).

### Design tokens

Colors are defined as HSL CSS variables in [src/index.css](src/index.css) and consumed by [tailwind.config.ts](tailwind.config.ts). Palette « Heritage Royal »: midnight ink `#111722`, warm ivory `#F1ECE2`, royal blue `#2447A8`, oxblood `#6F283A` (rare accent), stone `#B8AD9D`. Two accent tiers: `brand` (raw royal, fills/CTA only) and `primary` (AA-safe per mode — royal in light, lightened royal in dark — for accent text and thin lines); `brand-secondary` is the oxblood. Dark mode uses the `class` strategy, applied pre-paint by an inline script in [index.html](index.html).

Custom utility classes defined in `index.css`: `.text-gradient`, `.card-floating`, `.card-swiss`, `.section-container`, `.kicker`, `.grid-bg`, `.nav-dot`, `.link-editorial`, `.caret-terminal`, `.scrollbar-hide`, `.rise`.

Fonts: `Space Grotesk` (headings/display), `DM Sans` (body) and `JetBrains Mono` (mono labels), loaded via Google Fonts in [index.html](index.html).

### TypeScript config

Loose settings — `noImplicitAny: false`, `strictNullChecks: false`, unused variable warnings off. Don't tighten these without user instruction.

### No tests

There is no test infrastructure configured in this project.
