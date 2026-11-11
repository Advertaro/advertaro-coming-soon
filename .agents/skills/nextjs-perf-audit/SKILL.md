---
name: nextjs-perf-audit
description: Audit Next.js code for performance bottlenecks and give fix directions, starting with a TL;DR and offering a detailed report. Works on any scope, from a pasted component or function, a single file, a feature folder, a directory of files, up to a full Next.js project or monorepo app. Use this skill whenever the user asks to review, audit, profile, speed up, or optimize Next.js or React Server Components code, mentions slow pages, bundle size, Core Web Vitals (LCP, INP, CLS), hydration, caching, "use cache", next/image, next/font, next/script, or asks "why is this slow" about a Next.js app, even if they do not say "performance audit". Knowledge is verified current to Next.js 16.3 / React 19.3 (Sep 2026) and flags outdated 2024 to 2025 era advice.
---

# Next.js Performance Audit

Find performance bottlenecks in Next.js code at whatever scope the user gives, then report in two
stages: a short TL;DR first, and a detailed report only if the user asks for it.

The two-stage output exists because most users want to know "what are the big problems" in a
glance, and a 40-item report buries the three things that matter. Respect it: never append the
detailed report to the TL;DR in the same turn.

## Bundled resources

- `scripts/scan.py`: fast heuristic scanner. Gives project context (Next/React versions, router,
  `next.config` flags) and candidate findings tagged with rule IDs. It is a first pass, not the
  verdict.
- `references/checklist.md`: the rule catalog (IDs, severity, how to spot, how to fix, version
  gates). Read the sections relevant to what you found or to the scope; read it all for a whole-
  project audit.
- `references/guide-2025-audit.md`: what changed since widely circulated 2025 advice. Read it when
  code shows legacy patterns (sync `cookies()`, `priority`, `export const revalidate`, edge runtime,
  manual `useCallback` everywhere) so findings can explain what changed.
- `references/report-template.md`: exact formats for both output stages. Read before writing
  output.

## Workflow

### 1. Establish scope and context

Identify what was given:
- **Pasted snippet** (component, hook, function, config): write it to a temp file with a
  realistic name so the scanner's file-type rules work, e.g. `/tmp/audit/app/products/page.tsx`
  for a page, `/tmp/audit/components/Foo.tsx` with `'use client'` preserved for a client
  component. Infer the role from the code.
- **File, folder, or feature**: scan that path; the scanner walks up to find the project root for
  version and config context.
- **Whole project** (path, repo, or uploaded archive): extract if needed, find the Next.js app
  root. In a monorepo (Turborepo, pnpm workspaces), audit each Next app under `apps/*` and also
  check shared UI packages under `packages/*` that those apps import, since barrel files and
  client-heavy shared components often live there.

Determine the Next.js version from `package.json` (or lockfile). If there is no project context
(bare snippet), assume the latest release (16.3) and note that in the TL;DR scope line; where advice
differs by version, give the current approach and mention the older equivalent briefly. Do not
stop to ask for the version before producing the TL;DR.

### 2. Run the scanner

```bash
python <skill-dir>/scripts/scan.py <path> --format md          # readable
python <skill-dir>/scripts/scan.py <path> > /tmp/scan.json       # full detail
```

Use `--root <dir>` when the app root is not an ancestor of the path. For narrow scopes, the
scanner moves config-level observations into "Project-level notes"; mention those only briefly
unless the user asked for a project audit.

### 3. Read the code

The scanner cannot see intent, data dependencies across files, or what renders above the fold.
Read the actual code, prioritizing by impact:

1. Root `layout.tsx`, `proxy.ts`/`middleware.ts`, `next.config.*`, `_app`/`_document` (these
   affect every route).
2. Landing/home and the highest-traffic routes (marketing, product/listing pages, dashboards).
3. Every `'use client'` file that imports third-party packages.
4. Data access layer (fetchers, ORM calls) used by those routes.

For large projects, do not try to read everything. Cover the hot paths above, then sample one or
two representative routes per feature area, and say in the report what was sampled.

While reading, look for what regex misses: waterfalls spanning parent and child components,
Suspense boundaries around LCP content, client boundaries that could move down a level, props
bloat across the boundary, context providers causing wide re-renders, unvirtualized long lists,
and caching decisions that force routes dynamic.

### 4. Triage

- Confirm each scanner candidate against the code; drop false positives silently.
- Merge repeats of the same rule into one finding with all locations.
- Calibrate severity by where it runs: root layout or landing page issues go up a level; an
  admin-only page goes down.
- Apply version gates from the checklist. Never recommend an API the detected version lacks
  without saying it requires an upgrade.
- Rank by impact ÷ effort. Correctness blockers that stop upgrades (sync request APIs on 15+)
  go near the top.

Base everything on the code. Do not invent measured numbers (bundle KB, ms timings) you did not
compute; say "likely" or "large" instead, and suggest how to measure.

### 5. Output the TL;DR, then ask

Use the Stage 1 template in `references/report-template.md`. Maximum 7 numbered issues, each one
line of problem plus one line of fix, with `file:line`. End by asking whether the user wants the
detailed report. Then end your turn.

If the environment provides a tappable-options tool, it is fine to offer "Detailed report" /
"Just fix the top issues" / "No thanks" as options; otherwise ask in one plain sentence.

### 6. On the user's answer

- **Yes**: produce the Stage 2 detailed report from the template, reusing the triage from step 4
  (do not rescan unless the code changed). Include code-level fixes that use the user's own names.
- **No / "just fix it"**: offer to apply the top fixes, or apply them if asked, starting with the
  highest impact ÷ effort item.
- **Follow-up about one finding**: expand just that finding.

## Principles

- Server first: the cheapest JS is JS that never ships. Prefer fixes that move work to Server
  Components, cache it, or stream it, over client-side micro-optimizations.
- Be specific: every finding names a location and a concrete change.
- Be honest about static limits: LCP element, real INP, and cache hit rates need runtime data.
  Point to the measurement tools in checklist section 16.
- Current practice only: if a fix would be outdated advice (manual `useCallback` everywhere,
  `priority` on v16, edge runtime for speed, `babel-plugin-styled-components`), use the current
  equivalent from the checklist instead.
