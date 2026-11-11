# /fix-seo — Full Fix Procedure

## Step 1: Git State Check

Run from `APP_ROOT` (or the repo root if APP_ROOT is inside a monorepo):

```bash
git status --porcelain
```

- **Empty output** → working tree is clean, proceed.
- **Any output** → stop immediately and tell the user:

  > Your working tree has uncommitted changes. Please commit or stash them before running `/fix-seo` — this keeps the SEO fixes isolated in git so you can review exactly what changed.
  >
  > Quick options:
  > - `git stash` — temporarily stash changes, run `/fix-seo`, then `git stash pop`
  > - `git add -A && git commit -m "WIP: stash before SEO fixes"`

Do not proceed until the tree is clean.

---

## Step 2: Run the Full Audit (Internal)

Read and execute the complete audit from `commands/audit-seo.md`.

Collect all findings into an internal checklist — you'll use them in Step 3. Do **not** print the audit report yet. Just gather the data.

---

## Step 3: Apply Safe Automated Fixes

Work through fixes in this order. For each fix applied, keep a running list: `{file, what was changed, why}`. You'll use this in the delta report.

### Principle

Apply fixes that are unambiguous and mechanical. When something requires understanding the site's content, business logic, or design intent, add a `TODO:` comment instead of guessing. Never silently remove something — always leave a trace.

---

### 3a. Missing Infrastructure Files

**robots.txt** — if `public/robots.txt` doesn't exist:

Create `APP_ROOT/public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```
Attempt to detect `[DOMAIN]` from: `NEXT_PUBLIC_SITE_URL` in `.env`, `siteUrl` in `next.config.js`, or any `metadataBase` in `app/layout.tsx`. If not found, leave the placeholder clearly commented: `# TODO: replace [DOMAIN] with your production domain`.

**Sitemap** — if no sitemap exists at all:

- App Router: create `APP_ROOT/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'

// TODO: extend this with dynamic routes from your database/CMS
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://[DOMAIN]', // TODO: replace with your domain
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

- Pages Router: create `APP_ROOT/pages/sitemap.xml.js` with a static sitemap returning the homepage and a comment to extend it.

**404 / not-found page** — if missing:

- App Router: create `APP_ROOT/app/not-found.tsx`:
```tsx
export default function NotFound() {
  return (
    <main>
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Return home</a>
    </main>
  )
}
```
- Pages Router: create `APP_ROOT/pages/404.tsx` with equivalent content.

**Favicon** — if missing:
Do NOT generate an image file. Instead, note in the report: "No favicon found — add `app/icon.{ico|png|svg}` (App Router) or `public/favicon.ico` (Pages Router)."

---

### 3b. Metadata Additions

**Root layout missing metadata (App Router):**

If `app/layout.tsx` has no `export const metadata` and no `generateMetadata`, add:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | TODO: Site Name',  // TODO: set your site name
    default: 'TODO: Default Page Title',
  },
  description: 'TODO: Default meta description (120–160 chars)',
  metadataBase: new URL('https://TODO-your-domain.com'), // TODO: set your domain
  openGraph: {
    type: 'website',
    locale: 'en_US', // TODO: adjust locale
    url: 'https://TODO-your-domain.com',
    siteName: 'TODO: Site Name',
    images: [
      {
        url: '/og-image.png', // TODO: create a 1200x630 OG image
        width: 1200,
        height: 630,
        alt: 'TODO: OG image alt text',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TODO: Twitter title',
    description: 'TODO: Twitter description',
    images: ['/og-image.png'], // TODO: same as OG image
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

Add this just before the `export default function RootLayout` line. Import `Metadata` at the top of the file if not already imported.

**Dynamic routes missing generateMetadata:**

For each dynamic page file flagged in the audit (e.g., `app/[slug]/page.tsx` with no metadata), add a `generateMetadata` stub:

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // TODO: fetch page data here and return real title/description
  // Example: const page = await getPage(params.slug)
  return {
    title: `TODO: Dynamic title for ${params.slug}`,
    description: 'TODO: Dynamic description',
    alternates: {
      canonical: `/TODO-path/${params.slug}`,
    },
  }
}
```

**Canonical tags on static pages** (App Router, if missing from layout or page):

Add `alternates: { canonical: '/' }` to the root layout metadata. For static pages, add the full path.

---

### 3c. Image Fixes

For each raw `<img>` tag found (skip: `.md` files, test files `*.test.*`, `*.spec.*`, story files `*.stories.*`):

1. Add `import Image from 'next/image'` at the top of the file (if not already imported).
2. Replace `<img src="..." alt="..." width="..." height="..." />` with `<Image src="..." alt="..." width={width} height={height} />`.
   - Convert `width`/`height` HTML string attrs to numbers.
   - If no `width`/`height` on the original: use `fill` + a wrapper div with `position: relative; width: X; height: Y` or add `TODO:` comment for sizing.
3. If `alt` is missing, add `alt="TODO: describe this image"`.
4. If the image is clearly the main hero/above-the-fold image, add `priority`.

---

### 3d. Internal Link Fixes

For each raw `<a href="...">` pointing to an internal path (starts with `/`, not `http`, `mailto:`, `tel:`, `#`):

1. Add `import Link from 'next/link'` at the top (if not already).
2. Replace `<a href="/path">text</a>` with `<Link href="/path">text</Link>`.
3. Keep any existing `className`, `onClick`, or other props.

Do NOT convert: external links, anchor links (`#section`), `mailto:`, `tel:`.

---

### 3e. Font Optimization

For each `@import url('https://fonts.googleapis.com/...')` or `<link href="https://fonts.googleapis.com/..."` found:

Do NOT silently remove the font import — the font will break. Instead:
1. Comment out the old import.
2. Add a comment with the `next/font/google` equivalent:

```typescript
// TODO: Migrate from Google Fonts CDN to next/font (eliminates render-blocking request)
// Replace with:
// import { FontName } from 'next/font/google'
// const font = FontName({ subsets: ['latin'], display: 'swap' })
// Then add className={font.className} to your root <html> element
//
// OLD (render-blocking — commented out):
// @import url('https://fonts.googleapis.com/css2?family=...')
```

---

### 3f. Script Optimization

For third-party `<script src="...">` tags found in layout/page JSX files (NOT in `pages/_document.tsx` — those need to stay):

1. Add `import Script from 'next/script'` at the top.
2. Replace `<script src="..." async>` with `<Script src="..." strategy="afterInteractive" />`.
   - `analytics, gtag, clarity` → `strategy="afterInteractive"`
   - `intercom, zendesk chat` → `strategy="lazyOnload"`
   - Scripts that must run before page interactive → `strategy="beforeInteractive"` (rare, use carefully)

---

### 3g. Structured Data Templates

**Homepage — Organization + WebSite schema** (if no structured data on homepage):

Add to `app/page.tsx` or `pages/index.tsx`:

```tsx
// App Router version:
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://TODO-your-domain.com/#organization',
        name: 'TODO: Your Organization Name',
        url: 'https://TODO-your-domain.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://TODO-your-domain.com/logo.png', // TODO: add logo
        },
        sameAs: [
          // TODO: add social media URLs
          // 'https://twitter.com/yourhandle',
          // 'https://linkedin.com/company/yourcompany',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://TODO-your-domain.com/#website',
        url: 'https://TODO-your-domain.com',
        name: 'TODO: Site Name',
        publisher: { '@id': 'https://TODO-your-domain.com/#organization' },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* existing page content */}
    </>
  )
}
```

**Blog/article pages — Article schema** (if blog routes exist, no Article schema):

Add a `generateMetadata`-aware Article schema to `app/blog/[slug]/page.tsx` (or equivalent). Populate `author`, `datePublished`, `dateModified` from the page's data source where available.

**Product schema** (ecommerce only — if product pages have no structured data):

Add a `Product` schema template with placeholders for: `name`, `description`, `image`, `brand`, `offers` (with `price`, `priceCurrency`, `availability`). Leave `aggregateRating` as a `TODO:` if no reviews system is set up yet.

---

## Step 4: Run Formatter

Detect from `APP_ROOT/package.json` scripts:

```bash
# Check for formatter scripts
cat APP_ROOT/package.json | grep -E '"format|"fmt|"prettier|"biome"'
```

Run the appropriate command from `APP_ROOT`:

| Detected | Command |
|----------|---------|
| `"format"` script in package.json | `npm run format` (or `pnpm run format`, `yarn format`) |
| `prettier` in devDependencies (no script) | `npx prettier --write "**/*.{ts,tsx,js,jsx,css,md}" --ignore-path .gitignore` |
| `biome` in devDependencies | `npx biome format --write .` |
| `dprint` in devDependencies | `npx dprint fmt` |
| None found | Skip — note "No formatter detected" in report |

Detect package manager from lockfile: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm.

---

## Step 5: Lint Check

Detect from `APP_ROOT/package.json`:

```bash
cat APP_ROOT/package.json | grep -E '"lint"'
```

Run:
- If `"lint"` script exists: `npm run lint` (or pnpm/yarn equivalent)
- Else if `eslint` in devDependencies: `npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0`
- Else if `biome` in devDependencies: `npx biome lint .`
- Else: skip — note "No linter detected"

Capture the output. Do NOT auto-fix lint errors — surface them in the report so the user can review. Common lint issues from SEO fixes: unused import warnings (if a component didn't need the import), import ordering.

---

## Step 6: Type Check

```bash
cat APP_ROOT/package.json | grep -E '"type-check|"typecheck|"tsc"'
```

Run:
- If `"type-check"` or `"typecheck"` script exists: run it
- Else if `typescript` in devDependencies: `npx tsc --noEmit` from `APP_ROOT`
- Else: skip — note "TypeScript not configured"

Capture any errors. Common type errors from SEO fixes:
- `next/image` width/height expecting `number` but got `string` — if the original `<img>` had string attrs
- Metadata type mismatches if the metadata structure is wrong

Do NOT auto-fix type errors. List them in the report.

---

## Step 7: Delta Audit & Final Report

Re-run the full audit from `commands/audit-seo.md` on the post-fix state.

Compare before vs after. Produce this report:

```
# /fix-seo Results — [App Name]
**Date**: [today's date]
**Project**: [APP_ROOT]

---

## ✅ Fixed ([N] items)

| File | Fix Applied |
|------|-------------|
| public/robots.txt | Created — Googlebot allowed, sitemap URL referenced |
| app/layout.tsx | Added metadata export with title template, OG tags, Twitter card |
| app/blog/[slug]/page.tsx | Added generateMetadata() stub |
| components/Hero.tsx | Replaced <img> with next/image + priority prop |
| components/Nav.tsx | Replaced 3 <a href> with next/link |
| app/not-found.tsx | Created 404 page |
| ... | ... |

## ⚠️ Needs Manual Care ([N] items)

| Issue | Why Manual | Suggested Action |
|-------|-----------|-----------------|
| Sitemap only includes homepage | Dynamic routes require CMS/DB integration | Extend app/sitemap.ts with your blog posts and product URLs |
| Blog post titles use generic TODO: | Requires your CMS data | Wire generateMetadata() to your content API |
| No favicon image | Can't generate images | Create a 512×512 icon, add as app/icon.png |
| Google Font migration commented out | Requires font variable wiring | Complete the next/font migration with className on <html> |
| ... | ... | ... |

---

## 🔧 Formatter / Lint / Type Check

| Tool | Result |
|------|--------|
| Formatter | ✅ Ran successfully / ⚠️ Not configured / ❌ [error message] |
| Linter | ✅ Clean / ⚠️ [N] warnings / ❌ [N] errors |
| Type check | ✅ No errors / ❌ [N] errors |

[If there are lint or type errors, list them here with file:line references]

---

## Before vs After

| | Critical ❌ | Warnings ⚠️ | Passing ✅ |
|-|------------|------------|-----------|
| Before | [N] | [N] | [N] |
| After | [N] | [N] | [N] |
| Delta | [−N] | [−N] | [+N] |
```

Note: fixes leave changes unstaged for your review. Use `git diff` to inspect everything before committing.
