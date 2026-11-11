# Advertaro project instructions

## Commands
- Use Bun 1.4 workspaces and Turborepo from the repository root.
- `bun run type-check` checks TypeScript; `bun run lint` runs Biome; `bun run build` builds production.
- `bun run check` applies Biome fixes; `bun run dev` starts development. No test runner is configured.

## Architecture
- `apps/web` is Next.js 16 App Router with React 19; `packages/ui` owns shared components and design tokens, `packages/content` owns typed copy, and `packages/config` owns TypeScript configuration.
- Import workspace packages by their declared exports. Preserve existing public barrels and package boundaries.
- `/api/contact` validates with Zod and sends through Resend. No database, authentication provider, Hono, or Sanity is installed.
- Design tokens live in `packages/ui/src/styles.css`; preserve the established orange/near-black identity and reduced-motion support in GSAP/Lenis interactions.
- Keep draft copy and unverified metrics marked as drafts until confirmed.
- Before changing web code, follow `apps/web/AGENTS.md` and read the relevant installed Next.js guides under `apps/web/node_modules/next/dist/docs/`.

## Workflow
- Fix root causes, keep changes within scope, run relevant checks, and regenerate generated files with project tooling.

## Codex project guidance
Read relevant files in `.codex/guidance/` before editing; their `paths` describe applicability.

# Communication style
Use the `caveman` skill for concise communication while preserving technical accuracy.

# Build discipline
Use the `ponytail` skill to make the smallest complete change that solves the task.
