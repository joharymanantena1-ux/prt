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

### Scroll navigation system

The core of the app is a custom full-screen, section-by-section scroll system in [src/pages/Index.tsx](src/pages/Index.tsx). It manages a `currentSection` index and responds to:
- Mouse wheel (throttled, 600ms debounce via a custom `useThrottle` hook)
- Touch gestures (vertical swipe and horizontal slide)
- Keyboard arrows (Up/Down/Left/Right)

Sections are animated with Framer Motion spring physics and lazy-loaded via `React.lazy` + `Suspense`.

### Sections (in order)

Six portfolio sections live in [src/components/sections/](src/components/sections/):
`HeroSection` → `AboutSection` → `ExperienceSection` → `SkillsSection` → `ProjectsSection` → `ContactSection`

Each section receives `isActive` and `isMobile` props from `Index.tsx`.

### UI components

shadcn/ui primitives live in [src/components/ui/](src/components/ui/) (Radix UI wrappers). Import with the `@/` alias (maps to `src/`). The `cn()` utility (classname merging) is in [src/lib/utils.ts](src/lib/utils.ts).

### Design tokens

Colors are defined as HSL CSS variables in [src/index.css](src/index.css) and consumed by [tailwind.config.ts](tailwind.config.ts). Primary: cyan/teal (`175°`), Accent: purple (`280°`). Dark mode uses the `class` strategy.

Custom utility classes defined in `index.css`: `.text-gradient`, `.glow-primary`, `.section-container`, `.nav-dot`, `.animate-gradient-border`, `.scrollbar-hide`.

Fonts: `Syne` (headings/display) and `Space Grotesk` (body), loaded via Google Fonts in [index.html](index.html).

### TypeScript config

Loose settings — `noImplicitAny: false`, `strictNullChecks: false`, unused variable warnings off. Don't tighten these without user instruction.

### No tests

There is no test infrastructure configured in this project.
