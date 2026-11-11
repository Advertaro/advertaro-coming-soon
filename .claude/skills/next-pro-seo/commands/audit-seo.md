# /audit-seo — Full Audit Procedure

## Step 1: Detect Router Type

Determine which Next.js routing pattern the project uses:

- **App Router** — `app/` directory exists with `layout.tsx`/`page.tsx` files → metadata via `export const metadata` or `generateMetadata()`
- **Pages Router** — `pages/` directory exists with `_app.tsx`/`_document.tsx` → metadata via `next/head` in each page
- **Hybrid** — both directories present

Note the router type — it affects which patterns you check for metadata, structured data, and sitemaps.

---

## Step 2: Collect Files to Scan

Use bash/grep to gather file lists. Work from `APP_ROOT`.

```bash
# Find all page files
find APP_ROOT/app -name "page.tsx" -o -name "page.jsx" 2>/dev/null | head -30
find APP_ROOT/pages -name "*.tsx" -o -name "*.jsx" 2>/dev/null | grep -v "_app\|_document\|api/" | head -30

# Find layout files
find APP_ROOT/app -name "layout.tsx" -o -name "layout.jsx" 2>/dev/null

# Find raw <img> tags (not inside node_modules, .next, or test files)
grep -r "<img " APP_ROOT/src APP_ROOT/app APP_ROOT/pages APP_ROOT/components --include="*.tsx" --include="*.jsx" -l 2>/dev/null | grep -v node_modules | grep -v ".next" | grep -v ".test.\|.spec.\|.stories."

# Find raw <a href links
grep -r '<a ' APP_ROOT --include="*.tsx" --include="*.jsx" -l 2>/dev/null | grep -v node_modules | grep -v ".next"

# Find Google Font imports
grep -r "fonts.googleapis.com" APP_ROOT --include="*.tsx" --include="*.jsx" --include="*.css" -l 2>/dev/null | grep -v node_modules

# Find raw <script tags
grep -r "<script " APP_ROOT/app APP_ROOT/pages APP_ROOT/src APP_ROOT/components --include="*.tsx" --include="*.jsx" -l 2>/dev/null | grep -v node_modules

# Check for sitemap
find APP_ROOT -name "sitemap.ts" -o -name "sitemap.js" -o -name "sitemap.xml" 2>/dev/null | grep -v node_modules | grep -v ".next"
```

Also read these key files directly:
- `APP_ROOT/package.json`
- `APP_ROOT/next.config.{js,mjs,ts}` (whichever exists)
- `APP_ROOT/public/robots.txt` (if exists)
- `APP_ROOT/app/layout.tsx` or `APP_ROOT/pages/_document.tsx`
- `APP_ROOT/app/page.tsx` or `APP_ROOT/pages/index.tsx`

---

## Step 3: Run the 4-Section Audit

Load `references/07-nextjs-seo.md` and `references/02-fundamentals.md` before starting.

For each check: mark ✅ Pass / ⚠️ Warning / ❌ Missing.

---

### Section 1: Basic SEO Setup

**Metadata — load `references/02-fundamentals.md`**

| Check | How to verify |
|-------|--------------|
| **Title tags** | App Router: look for `metadata.title` or `title` in `generateMetadata()` in `app/layout.tsx` and key page files. Pages Router: look for `<title>` in `next/head` blocks. Flag: missing entirely, same title on multiple pages, or titles longer than ~60 chars. |
| **Meta descriptions** | Same locations as title. Look for `metadata.description` or `<meta name="description">`. Flag: missing, under 80 chars, over 160 chars, or duplicate across pages. |
| **Open Graph tags** | Look for `metadata.openGraph` (App Router) or `<meta property="og:..."` (Pages Router). Minimum: `og:title`, `og:description`, `og:image`, `og:url`. Flag if completely absent from the root layout. |
| **Twitter Card tags** | Look for `metadata.twitter` or `<meta name="twitter:..."`. Minimum: `twitter:card`, `twitter:title`. Flag if absent. |

**Structure**

| Check | How to verify |
|-------|--------------|
| **H1 per page** | Scan page files for `<h1` or `# ` (MDX). Each page should have exactly one H1. Flag pages with 0 or 2+ H1s. For dynamic pages, check that the H1 uses a dynamic value (not hardcoded generic text). |
| **Heading hierarchy** | Check that headings don't skip levels (e.g., H1 → H3 without H2). Spot-check 3–5 pages. |
| **Image alt text** | For every `<img` and `<Image` component found, check for an `alt` prop. Flag: missing `alt` entirely (accessibility + SEO issue). Note: `alt=""` is valid for decorative images. |
| **Internal linking** | Check that navigation components and links within page content use `next/link` (or `<Link>`) rather than raw `<a href="...">` to internal paths. Raw `<a>` tags cause full page reloads and miss prefetching. |

**Assets**

| Check | How to verify |
|-------|--------------|
| **Favicon** | App Router: check for `app/icon.ico`, `app/icon.png`, `app/icon.svg`. Pages Router: check `public/favicon.ico`. Flag if none found. |
| **404 page** | App Router: check for `app/not-found.tsx` or `app/not-found.jsx`. Pages Router: check `pages/404.tsx`. Flag if missing — without it, Next.js returns a generic error page. |

---

### Section 2: Lighthouse Optimizations

Load `references/07-nextjs-seo.md` (Performance & Core Web Vitals chapters).

**Images (LCP impact)**

| Check | How to verify |
|-------|--------------|
| **next/image vs `<img>`** | Count raw `<img>` tags in JSX/TSX files (excluding tests, stories, markdown). Each one is a missed optimization: no automatic sizing, no lazy loading, no WebP conversion, potential LCP regression. |
| **Image sizing props** | For `<Image>` components: check for `width` + `height` props or `fill` prop. Missing sizing causes layout shift (CLS). |
| **Priority on hero images** | Check if the main above-the-fold image (homepage hero, etc.) has `priority` prop. Without it, the LCP image is lazy-loaded, hurting LCP score. |

**Fonts (Render-blocking)**

| Check | How to verify |
|-------|--------------|
| **next/font vs Google Fonts CDN** | Scan for `@import url('https://fonts.googleapis.com')` in CSS files and `<link href="https://fonts.googleapis.com"` in JSX layout files. These are render-blocking. `next/font/google` downloads fonts at build time, eliminates the CDN request, and sets `display: swap` automatically. |
| **next/font usage** | Check if `next/font` is already in use: look for `from 'next/font/google'` or `from 'next/font/local'` imports. |

**Third-party Scripts**

| Check | How to verify |
|-------|--------------|
| **next/script vs `<script>`** | Scan layout and page files for `<script src="...">` tags. Third-party scripts (analytics, chat, ad pixels) should use `<Script>` from `next/script` with a `strategy` prop. `strategy="afterInteractive"` for analytics; `strategy="lazyOnload"` for non-critical. Raw `<script>` tags block rendering. |

**Code Splitting**

| Check | How to verify |
|-------|--------------|
| **Dynamic imports** | Look for large client-only components (modals, charts, rich text editors, map components) that are statically imported. These bloat the initial JS bundle. Check if `next/dynamic` or `import()` is used anywhere. If a heavy dependency (e.g., `chart.js`, `monaco-editor`, `leaflet`, `@tiptap`) is in a static import at page level, flag it. |

---

### Section 3: Crawling & Indexing

Load `references/03-crawling-indexing.md` for this section.

**Discoverability**

| Check | How to verify |
|-------|--------------|
| **robots.txt** | Read `APP_ROOT/public/robots.txt`. Check: file exists, `Disallow: /` is NOT present for Googlebot, sitemap URL is referenced. Flag if missing entirely or if Googlebot is blocked. |
| **Sitemap** | Check for: `APP_ROOT/public/sitemap.xml` (static), `APP_ROOT/app/sitemap.ts` (App Router dynamic), `APP_ROOT/pages/sitemap.xml.js` (Pages Router dynamic). Flag if none exist. Note: for sites with dynamic content (blog posts, products), a static sitemap is insufficient — a dynamic sitemap is needed. |

**Indexing Controls**

| Check | How to verify |
|-------|--------------|
| **noindex audit** | Search for `noindex` in: `public/robots.txt`, any `<meta name="robots">` or `<meta name="googlebot">` tags, `metadata.robots` in App Router files. Flag: `noindex` on the homepage or key landing pages (unless intentional). Also flag: important pages (product listings, blog index) that SHOULD be indexed but have noindex. |
| **Canonical tags** | App Router: look for `metadata.alternates.canonical`. Pages Router: look for `<link rel="canonical">` in `next/head`. Self-referential canonicals (a page pointing to itself) are best practice. Flag pages with no canonical and pages where the canonical doesn't match the URL. |

**Redirects & Errors**

| Check | How to verify |
|-------|--------------|
| **Redirects in next.config** | Read `next.config.{js,mjs,ts}`. Check `redirects()` array. Permanent moves should use `permanent: true` (308). Temporary ones use `permanent: false` (307). Flag any redirect chains (A→B→C). |
| **Soft 404s** | In dynamic routes, check that when a resource doesn't exist, the code calls `notFound()` (App Router) or `return { notFound: true }` (Pages Router), not just renders an error message with a 200 status. Scan `[slug]/page.tsx` files for this pattern. |

---

### Section 4: Programmatic SEO & GEO

Load `references/04-ranking-search-appearance.md` for structured data schemas.
Load `references/07-nextjs-seo.md` for Next.js metadata API patterns.
If ecommerce detected: also load `references/06-ecommerce.md`.

**Dynamic Metadata**

| Check | How to verify |
|-------|--------------|
| **generateMetadata on dynamic routes** | Find all dynamic route files: `app/[slug]/page.tsx`, `app/[id]/page.tsx`, `app/(group)/[param]/page.tsx`, etc. Each should export `generateMetadata()` that derives title/description from the route param. Static `export const metadata` on dynamic pages is a flag — it means all variations share the same title. |
| **Rendering strategy** | Review key SEO pages. Pages that fetch data and are important for ranking should use SSG (`generateStaticParams` / `getStaticProps`) not pure CSR. CSR pages (only `"use client"` with `useEffect` fetching) are harder for Google to index reliably. Flag: product pages, blog posts, or landing pages that are client-rendered with no server data. |

**Structured Data (JSON-LD)**

Check for `<script type="application/ld+json">` or `dangerouslySetInnerHTML` patterns with JSON-LD content in page files.

| Schema type | Where to check | Flag if missing |
|-------------|---------------|-----------------|
| `Organization` or `WebSite` | Homepage (`app/page.tsx` or `pages/index.tsx`) | Yes — helps Google understand the site entity |
| `Article` / `BlogPosting` | Blog post pages | Yes — if a blog exists |
| `BreadcrumbList` | Category/listing pages | Warning — for multi-level navigation |
| `FAQPage` | FAQ or accordion sections | Warning |
| `Product` + `Offer` | Product pages (ecommerce only) | Yes — critical for Shopping eligibility |
| `AggregateRating` | Product pages with reviews (ecommerce) | Warning |

**GEO — Generative Engine Optimization**

GEO optimizes for AI-powered search (Google AI Overviews, ChatGPT Browse, Perplexity). These signals help AI engines cite and surface your content.

| Check | How to verify |
|-------|--------------|
| **FAQ / Q&A content patterns** | Look for FAQ sections, accordion components, or Q&A formatting on key pages. AI search engines favor content that directly answers questions. Flag if important informational pages have no FAQ-style structure. |
| **Author / E-E-A-T signals** | Blog/article pages should have author attribution. Check for: author name in `metadata.authors`, `Article` schema with `author` property, author bio pages, About page. Authorless content scores lower with Google's E-E-A-T systems. |
| **Content structure for passage ranking** | Pages targeting informational queries should have clear H2/H3 headings that answer specific questions (e.g., "How do I..." "What is..." "Why does..."). Google's passage ranking can surface a single well-structured section in isolation. |
| **speakable schema** | For content/news sites: check for `speakable` property in Article schema. Marks sections suitable for voice search / text-to-speech AI responses. |
| **Ecommerce GEO** (if ecommerce) | Product pages should have complete `Product` schema including: `name`, `description`, `image`, `brand`, `offers` with `price` + `priceCurrency` + `availability`, and `aggregateRating` if reviews exist. AI shopping assistants use this data directly. |

**International SEO**

| Check | How to verify |
|-------|--------------|
| **hreflang** | Check `next.config.{js,mjs,ts}` for `i18n` configuration. If i18n is configured, verify that pages include `metadata.alternates.languages` (App Router) or hreflang `<link>` tags (Pages Router). Missing hreflang causes duplicate content issues across locales. |

---

## Step 4: Generate the Report

Use this exact format:

```
# SEO Audit Report — [App Name from package.json "name" field]
**Date**: [today's date]
**Project**: [APP_ROOT]
**Router**: [App Router / Pages Router / Hybrid]
**Type**: [Standard / Ecommerce]

---

## 🔷 Basic SEO Setup

| Check | Status | Details |
|-------|--------|---------|
| Title tags | [✅/⚠️/❌] | [specifics — e.g. "Missing on 3 pages: /blog/[slug], /products/[id]"] |
| Meta descriptions | | |
| Open Graph tags | | |
| Twitter Card tags | | |
| H1 headings | | |
| Image alt text | | |
| Internal linking | | |
| Favicon | | |
| 404 page | | |

## 🔦 Lighthouse Optimizations

| Check | Status | Details |
|-------|--------|---------|
| next/image (raw <img> tags) | | |
| Image sizing props | | |
| Priority on hero images | | |
| next/font (Google Fonts CDN) | | |
| next/script (raw <script>) | | |
| Dynamic imports | | |

## 🕷️ Crawling & Indexing

| Check | Status | Details |
|-------|--------|---------|
| robots.txt | | |
| Sitemap | | |
| noindex audit | | |
| Canonical tags | | |
| Redirects config | | |
| Soft 404s | | |

## 🌐 Programmatic SEO & GEO

| Check | Status | Details |
|-------|--------|---------|
| generateMetadata on dynamic routes | | |
| Rendering strategy | | |
| Organization/WebSite schema | | |
| Article/BlogPosting schema | | |
| Product schema (ecommerce) | | |
| BreadcrumbList schema | | |
| FAQ / Q&A patterns | | |
| Author / E-E-A-T signals | | |
| Content structure (passage ranking) | | |
| hreflang (if i18n configured) | | |

---

## Summary
- ❌ **Critical** ([N]): [comma-separated list of critical issues]
- ⚠️ **Warnings** ([N]): [comma-separated list]
- ✅ **Passing** ([N])

**Estimated SEO impact if fixed**: High / Medium / Low
```

Keep the Details column specific — include file paths and counts where possible. Avoid vague descriptions like "some pages are missing titles."
