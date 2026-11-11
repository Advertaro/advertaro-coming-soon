---
name: next-pro-seo
description: >
  SEO and GEO audit and auto-fix skill for Next.js projects. Use this skill whenever the user types /audit-seo or /fix-seo, or says anything like "audit my SEO", "check my site's SEO", "what SEO is missing", "fix my SEO issues", "optimize for Google", "improve search visibility", "add structured data", "fix metadata", "check robots.txt", "create a sitemap", "improve Core Web Vitals", "optimize for AI search", "GEO optimization", or any SEO/performance/discoverability improvement request on a Next.js codebase. Also triggers for questions like "why isn't my site ranking", "Google can't index my pages", "missing Open Graph tags", or "my Lighthouse SEO score is low". Works on both single Next.js apps and monorepos — always invoke this skill even if the user hasn't explicitly said "SEO" but is clearly asking about search performance, discoverability, or structured data for their Next.js project.
---

# next-pro-seo

Audits and auto-fixes SEO & GEO issues in Next.js projects, grounded in Google's official SEO documentation and the Next.js SEO best practices guide.

## Commands

| Command | What it does |
|---------|-------------|
| `/audit-seo` | Scans the project and produces a structured report across 4 SEO/GEO categories |
| `/fix-seo` | Runs the audit, applies safe automated fixes, runs formatter/lint/type-check, then produces a delta report |

---

## Step 0: Monorepo Detection (Always Do This First)

Before running either command, determine the target app:

1. Search for `next.config.js`, `next.config.mjs`, or `next.config.ts` at directory depth ≤ 3 from the current working directory.
2. Also check for workspace signals: `apps/`, `packages/` directories; `pnpm-workspace.yaml`, `turbo.json`, `nx.json` files.
3. **Single Next.js app found** → set `APP_ROOT` to its directory and proceed.
4. **Multiple Next.js apps found** → list them clearly (show relative paths) and ask the user to select one. Set `APP_ROOT` to the selected app's directory.

---

## Running the Commands

**For `/audit-seo`:**
Read `commands/audit-seo.md` and follow the full audit procedure.

**For `/fix-seo`:**
Read `commands/fix-seo.md` and follow the full fix procedure.

---

## Knowledge References

The `references/` folder contains 7 SEO knowledge documents. Load them selectively — only when working on the relevant audit section:

| Document | Load when working on |
|----------|---------------------|
| `01-essentials.md` | Quality signals, spam checks, E-E-A-T basics |
| `02-fundamentals.md` | Title tags, meta descriptions, content quality |
| `03-crawling-indexing.md` | robots.txt, sitemaps, canonicals, redirects, JS SEO |
| `04-ranking-search-appearance.md` | Structured data schemas, rich results, ranking systems |
| `05-monitoring-debugging.md` | Only if user asks about monitoring or traffic drops |
| `06-ecommerce.md` | Only when the project is detected as an ecommerce site |
| `07-nextjs-seo.md` | Next.js-specific patterns throughout all sections |

### Ecommerce Detection

Identify the project as an ecommerce site if ANY of these are present:

- `package.json` dependencies: `stripe`, `@stripe/stripe-js`, `shopify`, `@shopify/hydrogen`, `@vercel/commerce`, `commerce`, `medusa`, `saleor`
- Route patterns (in `app/` or `pages/`): `/products/`, `/shop/`, `/cart`, `/checkout`, `/order`
- Component names: `Cart`, `ProductCard`, `CheckoutForm`, `AddToCart`, `ProductGallery`

If ecommerce is detected:
- Note it in the report header: `**Type**: Ecommerce`
- Load `references/06-ecommerce.md` for additional structured data checks
- Include Product/Offer/AggregateRating schema checks in Section 4
