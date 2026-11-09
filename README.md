# Advertaro — advertaro.lk

Monorepo for the Advertaro Creative Studio website. Next.js 16 · Bun · Turborepo · Tailwind CSS v4.

```
apps/
  web/                 Next.js app (App Router)
    src/app/           Routes: / · /work · /work/[slug] · /services · /services/[slug]
                       /about · /blog · /blog/[slug] · /contact · /privacy · /terms · /api/contact
    src/components/
      layout/          Navbar, Footer, MotionProvider (Lenis + GSAP scroll reveals)
      sections/home/   Landing page, one component per prototype section
      sections/shared/ PageHero, WorkCard, BriefForm, CtaBand, FaqList, …
      three/           Hero particle field (lazy-loaded, reduced-motion aware)
      ui/              FilmStill canvas, LiveTimecode, Blocks renderer, DraftBanner
    src/styles/        sections.css (ported prototype CSS) · pages.css (inner pages)
packages/
  ui/                  Design system: tokens + primitives (styles.css) and React components
  content/             Typed site content, shaped like the planned Sanity schemas
  config/              Shared TypeScript configs
```

## Commands

```bash
bun install
bun run dev          # turbo dev → http://localhost:3000
bun run build
bun run type-check
bun run check        # biome lint + format
```

## Design system

Extracted from the HTML prototype: near-black surfaces, a single orange accent (`--color-accent`),
grotesk display type with tight tracking, Instrument Serif italic for emphasis, JetBrains Mono for
technical labels, timecode section strips with ruler ticks, and procedural "film still" canvases in
place of imagery. Tokens live in `packages/ui/src/styles.css` and are exposed to Tailwind via `@theme`
(`bg-bg`, `text-accent`, `font-mono`, …).

## Content

All copy lives in `packages/content`. Entries marked `draft: true` render a visible draft banner —
case study metrics (`+XX%`), client quotes, years and the legal pages need confirmation before launch.
The types mirror the Sanity schemas in the project plan so the module can later be replaced by GROQ
queries without changing page components.

## Contact form

`POST /api/contact` validates with Zod, uses a honeypot and a per-IP rate limit, and sends a
notification plus an auto-reply through Resend. Set `RESEND_API_KEY` (see `.env.example`);
without it the form tells visitors to email hello@advertaro.lk instead.

## Deployment (Vercel)

Set the Vercel project's **Root Directory** to `apps/web`. `apps/web/vercel.json` installs from the
monorepo root with Bun and builds through Turborepo.
