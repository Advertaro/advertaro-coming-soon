# Next.js SEO Guide — Complete Course Notes

> Source: https://nextjs.org/learn/seo (34 chapters)

---

## Table of Contents

1. [Why is SEO so Important?](#chapter-1-why-is-seo-so-important)
2. [Search Systems](#chapter-2-search-systems)
3. [What are Web Crawlers?](#chapter-3-what-are-web-crawlers)
4. [Crawling and Indexing](#chapter-4-crawling-and-indexing)
5. [HTTP Status Codes](#chapter-5-http-status-codes)
6. [robots.txt](#chapter-6-robotstxt)
7. [XML Sitemaps](#chapter-7-xml-sitemaps)
8. [Special Meta Tags for Search Engines](#chapter-8-special-meta-tags-for-search-engines)
9. [Canonical Tags](#chapter-9-canonical-tags)
10. [Rendering and Ranking](#chapter-10-rendering-and-ranking)
11. [Rendering Strategies](#chapter-11-rendering-strategies)
12. [AMP](#chapter-12-amp)
13. [URL Structure](#chapter-13-url-structure)
14. [Metadata](#chapter-14-metadata)
15. [On Page SEO](#chapter-15-on-page-seo)
16. [Web Performance & Core Web Vitals](#chapter-16-web-performance--core-web-vitals)
17. [Web Vitals Overview](#chapter-17-web-vitals-overview)
18. [Largest Contentful Paint (LCP)](#chapter-18-largest-contentful-paint-lcp)
19. [First Input Delay (FID)](#chapter-19-first-input-delay-fid)
20. [Cumulative Layout Shift (CLS)](#chapter-20-cumulative-layout-shift-cls)
21. [SEO Impact](#chapter-21-seo-impact)
22. [Improving your Core Web Vitals](#chapter-22-improving-your-core-web-vitals)
23. [Introducing Lighthouse](#chapter-23-introducing-lighthouse)
24. [Automatic Image Optimization](#chapter-24-automatic-image-optimization)
25. [Dynamic Imports](#chapter-25-dynamic-imports)
26. [Dynamic Imports for Components](#chapter-26-dynamic-imports-for-components)
27. [Optimizing Fonts](#chapter-27-optimizing-fonts)
28. [Optimizing Third-Party Scripts](#chapter-28-optimizing-third-party-scripts)
29. [Monitoring your Core Web Vitals](#chapter-29-monitoring-your-core-web-vitals)
30. [Next.js Speed Insights](#chapter-30-nextjs-speed-insights)
31. [Custom Reporting](#chapter-31-custom-reporting)
32. [Other Tools](#chapter-32-other-tools)
33. [Data Studio (Chrome UX Report)](#chapter-33-data-studio-chrome-user-experience-report)
34. [Next Steps](#chapter-34-next-steps)

---

## Chapter 1: Why is SEO so Important?

SEO stands for **Search Engine Optimization** — the practice of improving a website's position in organic search results.

**Search engine organic traffic** (visitors who arrive from clicking search results, not paid ads) matters for three reasons:

- **Qualitative** — higher chance visitors become customers
- **Trustable** — higher confidence in your brand or mission
- **Low-Cost** — no direct cost to appear in top organic positions

SEO is different from **Search Engine Marketing (SEM)**, where top-of-results placements are paid and labelled "Sponsored."

### Three Pillars of Optimization

- **Technical** — optimize for crawling and web performance
- **Creation** — content strategy targeting specific keywords
- **Popularity** — build site presence through backlinks from trusted sources

---

## Chapter 2: Search Systems

Search engines (Google, Bing, DuckDuckGo, etc.) have four main responsibilities:

- **Crawling** — traversing the web and parsing content across all websites (300M+ domains)
- **Indexing** — storing crawled data so it can be accessed for search queries
- **Rendering** — executing JavaScript and other resources on pages; may happen after indexing if resources are unavailable at crawl time
- **Ranking** — querying the index and applying ranking criteria to return the most relevant results for a user query

---

## Chapter 3: What are Web Crawlers?

Web crawlers are bots that navigate the web by following links, indexing pages for search engines. Google uses **Googlebot Desktop** and **Googlebot Smartphone** as its primary crawlers.

### How Googlebot Works

1. **Find URLs** — discovered via Search Console, links between sites, XML sitemaps
2. **Add to Crawl Queue** — URLs wait seconds to days before being processed
3. **HTTP Request** — Googlebot fetches the page and acts on the status code:
   - `200` → crawls and parses HTML
   - `30X` → follows the redirect
   - `40X` → notes the error, does not load HTML
   - `50X` → may return later to check if status changed
4. **Render Queue** — JavaScript-heavy pages go to a separate render queue (more resource-intensive; a smaller percentage of pages are rendered vs. crawled)
5. **Indexed** — if all criteria are met, the page becomes eligible for search results

**Key implication for Next.js:** Because JavaScript rendering is delayed, pages that rely entirely on client-side rendering will take longer to index. SSG or SSR ensures content is available in the initial HTML.

---

## Chapter 4: Crawling and Indexing

The Crawling and Indexing section covers:

- HTTP status code fundamentals
- Metadata and what crawlers look for when parsing pages
- How to communicate new content to Google
- Meta robot tags and canonical links for indexing control

---

## Chapter 5: HTTP Status Codes

HTTP status codes tell crawlers how to handle a page. Only a handful matter for SEO.

### 200 — OK
The page loaded successfully. **Required for indexing.** Next.js returns 200 by default for successfully rendered pages.

### 301 / 308 — Permanent Redirect
Content has definitively moved. Use for permanently relocated URLs to preserve link equity.

> **Note:** Next.js uses `308` (not `301`) for permanent redirects — it's the newer standard and doesn't allow changing the request method from POST to GET.

```javascript
// In getStaticProps
return {
  redirect: {
    destination: '/',
    permanent: true, // triggers 308
  },
};

// Or in next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true, // triggers 308
      },
    ];
  },
};
```

### 302 — Temporary Redirect
Content has temporarily moved (e.g., a promotion page, location-based redirect). Google may not update its index to the new URL.

### 404 — Not Found
The URL doesn't exist. Next.js automatically returns 404 for unknown routes. You can also explicitly return 404 from `getStaticProps`:

```javascript
export async function getStaticProps(context) {
  return {
    notFound: true, // triggers 404
  };
}
```

Create a custom 404 page at `pages/404.js`:

```javascript
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}
```

### 410 — Gone
Content is permanently removed and will never return. Use for permanently deleted products, forum threads, or blog posts. Signals to bots: never re-crawl this URL.

### 500 — Internal Server Error
Unexpected server error. Next.js returns 500 automatically for application errors. Create a custom page at `pages/500.js`.

### 503 — Service Unavailable
Server is not ready to handle requests. Return this when your site is intentionally down for an extended period to avoid losing rankings.

---

## Chapter 6: robots.txt

A `robots.txt` file tells crawlers which pages or files they can or cannot access. It sits at the root of your domain.

### How to Add to a Next.js Project

Place a `robots.txt` file in the `/public` directory (it will be served at `/robots.txt`):

```
# Block all crawlers for /accounts
User-agent: *
Disallow: /accounts

# Allow all crawlers
User-agent: *
Allow: /
```

Common use cases:
- Blocking CMS/admin areas
- Blocking user account pages in e-commerce
- Blocking API routes

> **Note:** The `public` folder name cannot be changed and is the only directory for static file serving.

---

## Chapter 7: XML Sitemaps

Sitemaps are the easiest way to communicate with Google — they list URLs on your site and when they were last updated, enabling faster discovery and crawling.

### When You Need a Sitemap
- Your site is large (Google might miss some pages)
- You have many isolated pages with few internal links
- Your site is new with few external backlinks
- You have rich media (video, images) or appear in Google News

### How to Add to a Next.js Project

**Manual (static sites):** Add `sitemap.xml` to the `/public` directory:

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://www.example.com/foo</loc>
    <lastmod>2021-06-01</lastmod>
  </url>
</urlset>
```

**Dynamic (SSR-generated):** Create `pages/sitemap.xml.js` using `getServerSideProps`:

```javascript
const EXTERNAL_DATA_URL = 'https://jsonplaceholder.typicode.com/posts';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url><loc>https://jsonplaceholder.typicode.com</loc></url>
     ${posts.map(({ id }) => `
       <url><loc>${EXTERNAL_DATA_URL}/${id}</loc></url>
     `).join('')}
   </urlset>`;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const request = await fetch(EXTERNAL_DATA_URL);
  const posts = await request.json();
  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default SiteMap;
```

> **Best practice:** Use dynamic sitemaps that update as new content is added — static sitemaps are less useful for discovery.

---

## Chapter 8: Special Meta Tags for Search Engines

Meta robot tags are **directives** — search engines will always obey them. (Canonical tags, by contrast, are only recommendations.)

### Robots Tag

```html
<meta name="robots" content="noindex,nofollow" />
```

Default is `index,follow` (doesn't need to be specified). Common directives:

- `noindex` — don't show this page in search results (e.g., settings pages, internal search, policy pages)
- `nofollow` — don't follow links on this page
- `all` — equivalent to `index,follow`
- `noarchive` — don't show a cached version
- `nosnippet` — don't show a text snippet in results

### Googlebot Tag (Google-specific)

```html
<meta name="googlebot" content="noindex,nofollow" />
```

Use when you want separate rules for Googlebot vs. other search bots. When conflicting tags exist, the more restrictive one applies.

### Google-specific Tags

```html
<!-- Don't show sitelinks search box -->
<meta name="google" content="nositelinkssearchbox" />

<!-- Don't translate this page -->
<meta name="google" content="notranslate" />
```

### Next.js Example

```javascript
import Head from 'next/head';

function IndexPage() {
  return (
    <div>
      <Head>
        <title>Meta Tag Example</title>
        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
      </Head>
      <p>Here we show some meta tags off!</p>
    </div>
  );
}
```

> Use the `key` prop in `next/head` to prevent duplicate tags from being inserted.

---

## Chapter 9: Canonical Tags

A **canonical URL** is the preferred URL for a page when the same content is accessible from multiple URLs.

### Why Canonicals Matter
Duplicate content (same content at multiple URLs) can:
- Dilute ranking signals across multiple URLs
- Cause Google to demote pages (especially cross-domain duplicates)
- Lead to confusion about which URL to rank

### Common Duplicate Scenarios
- `example.com/products/phone` and `example.com/phone`
- UTM parameters: `example.com/page?utm_source=newsletter`
- Trailing slash: `example.com/page` vs `example.com/page/`

### Implementation in Next.js

```javascript
import Head from 'next/head';

function IndexPage() {
  return (
    <div>
      <Head>
        <title>Canonical Tag Example</title>
        <link
          rel="canonical"
          href="https://example.com/blog/original-post"
          key="canonical"
        />
      </Head>
      <p>This post exists on two URLs.</p>
    </div>
  );
}
```

---

## Chapter 10: Rendering and Ranking

JavaScript has transformed how pages are built — but it also complicates search engine crawling. This section introduces:

- Rendering strategies: CSR, ISR, SSG, SSR
- How URL structure impacts SEO ranking
- Headings and internal links for on-page SEO

---

## Chapter 11: Rendering Strategies

The rendering strategy you choose directly affects SEO.

### Static Site Generation (SSG) — Best for SEO
HTML is generated at **build time** and served for every request. All HTML is available on page load (pre-rendered), giving both excellent SEO and page performance — now a ranking factor.

### Server-Side Rendering (SSR) — Great for SEO
HTML is generated at **request time**. Also pre-rendered, so excellent for SEO. Best for highly dynamic pages that change frequently.

### Incremental Static Regeneration (ISR)
Enables static generation on a per-page basis without rebuilding the entire site. Lets you retain SSG benefits while scaling to millions of pages.

### Client-Side Rendering (CSR) — Not recommended for SEO
HTML is served with little to no content until JavaScript fetches data and renders. Generally **not recommended** for pages you want indexed. CSR is appropriate for:
- Data-heavy dashboards
- Account pages
- Any content you don't need indexed

### Key Rule
> **The most important thing for SEO is that page data and metadata is available on page load without JavaScript.** SSG or SSR are the best options.

One of Next.js's major strengths is that each rendering strategy can be applied on a per-page basis within the same application.

---

## Chapter 12: AMP

In 2016, Google gave ranking preference to AMP pages. This benefit ended in 2021 when Google dropped AMP as a requirement for search carousels.

> **As of Next.js 16, AMP support has been removed.** For new projects, focus on optimizing Core Web Vitals directly using Next.js's built-in performance features. For legacy projects using Next.js 15 or earlier, refer to the [legacy AMP documentation](https://nextjs.org/docs/15/pages/guides/amp).

---

## Chapter 13: URL Structure

URL structure is an important part of SEO strategy. Best practices:

- **Semantic** — use words, not IDs: `/learn/basics/create-nextjs-app` not `/learn/course-1/lesson-1`
- **Logical and consistent** — maintain patterns across all pages
- **Keyword focused** — include relevant keywords in the URL to signal page purpose
- **Not parameter-based** — avoid `/page?id=12345`; parameters are not semantic and may confuse crawlers

### Next.js File-System Routing

Next.js uses file-system routing from the `pages` directory:

- `pages/index.js` → `https://example.com`
- `pages/products.js` → `https://example.com/products`
- `pages/products/product.js` → `https://example.com/products/product`

**Dynamic routing** (for slugs):

- `pages/products/[product].js` → `https://example.com/products/nextjs-shirt`
- `pages/blog/[blog-name].js` → `https://example.com/blog/seo-in-nextjs`

**SSG example with dynamic routes:**

```javascript
// pages/blog/[slug].js
import Head from 'next/head';

export async function getStaticPaths() {
  const res = await fetch('https://www.example.com/api/posts');
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://www.example.com/api/blog/${params.slug}`);
  const data = await res.json();

  return { props: { blog: data } };
}

function BlogPost({ blog }) {
  return (
    <>
      <Head>
        <title>{blog.title} | My Site</title>
      </Head>
      <h1>{blog.title}</h1>
      <p>{blog.text}</p>
    </>
  );
}

export default BlogPost;
```

> Use `fallback: 'blocking'` to SSR new posts added after build time, ensuring SEO for new content.

---

## Chapter 14: Metadata

### Title Tag

The `<title>` tag is the most important SEO element:
1. It's the clickable headline users see in search results
2. It's a primary signal Google uses to understand page content

```html
<title>iPhone 12 XS Max For Sale in Colorado - Big Discounts | Apple</title>
```

Best practice: include keywords + a value proposition.

### Meta Description

Less impactful on ranking directly, but affects click-through rate (CTR). Keywords in the description appear **bold** in search results when they match the user's query.

```html
<meta
  name="description"
  content="Check out iPhone 12 XR Pro and iPhone 12 Pro Max. Visit your local store for expert advice."
/>
```

### Next.js Implementation

```javascript
import Head from 'next/head';

function IndexPage() {
  return (
    <div>
      <Head>
        <title>iPhone 12 XS Max For Sale in Colorado - Big Discounts | Apple</title>
        <meta
          name="description"
          content="Check out iPhone 12 XR Pro and iPhone 12 Pro Max."
          key="desc"
        />
      </Head>
      <h1>iPhones for Sale</h1>
    </div>
  );
}
```

### Open Graph Tags

Originally created by Facebook, Open Graph standardizes metadata for social sharing. Doesn't affect search rankings but increases clickability when links are shared.

```javascript
<Head>
  <title>Cool Title</title>
  <meta name="description" content="Checkout our cool page" key="desc" />
  <meta property="og:title" content="Social Title for Cool Page" />
  <meta property="og:description" content="And a social description for our cool page" />
  <meta property="og:image" content="https://example.com/images/cool-page.jpg" />
</Head>
```

### Structured Data and JSON-LD

Structured data (using [schema.org](https://schema.org/) vocabulary) helps search engines understand pages and enables **rich results** in search.

Recommended format: **JSON-LD** (embedded in a `<script>` tag, doesn't mix with HTML).

```javascript
import Head from 'next/head';

function ProductPage() {
  function addProductJsonLd() {
    return {
      __html: `{
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Executive Anvil",
        "image": ["https://example.com/photos/1x1/photo.jpg"],
        "description": "Perfect for business travelers.",
        "sku": "0446310786",
        "brand": { "@type": "Brand", "name": "ACME" },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.4",
          "reviewCount": "89"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://example.com/anvil",
          "priceCurrency": "USD",
          "price": "119.99",
          "availability": "https://schema.org/InStock"
        }
      }`,
    };
  }

  return (
    <div>
      <Head>
        <title>My Product</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd()}
          key="product-jsonld"
        />
      </Head>
      <h1>My Product</h1>
    </div>
  );
}
```

---

## Chapter 15: On Page SEO

On-page SEO refers to headings and links that make up the overall structure of a page.

### Headings and H1

Headings signal document hierarchy and importance to both users and search engines.

- Use **H1** on every page — it should represent the main topic and be similar to the `<title>` tag
- Headings go from H1 (most important) to H6 (least important)
- H1 helps Google understand what the page is about

```javascript
function Page() {
  return <h1>Your Main Page Heading</h1>;
}
```

### Internal Links

Links are the foundation of the web and a key ranking signal (PageRank algorithm).

- **Quantity** — more links pointing to a page signals importance
- **Quality** — links from reputable domains are worth more than links from spam sites
- **Always use `href`** — links must use `href` for PageRank calculations (not just JavaScript click handlers)

### next/link

Next.js provides the `Link` component for client-side navigation that also correctly adds `href` to anchor tags for SEO:

```javascript
function NavLink({ href, name }) {
  return (
    <Link href={href}>
      <a>{name}</a>
    </Link>
  );
}
```

If the child of `Link` is a custom component wrapping an `<a>` tag, use `passHref` to ensure the `href` attribute is passed:

```javascript
import Link from 'next/link';
import styled from 'styled-components';

const RedLink = styled.a`color: red;`;

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref>
      <RedLink>{name}</RedLink>
    </Link>
  );
}
```

---

## Chapter 16: Web Performance & Core Web Vitals

[Web Vitals](https://web.dev/vitals/) is Google's initiative to provide unified guidance for measuring end-user page experience.

**Core Web Vitals** are a subset of Web Vitals currently consisting of three metrics:

- **LCP** — Largest Contentful Paint (loading)
- **FID** — First Input Delay (interactivity)
- **CLS** — Cumulative Layout Shift (visual stability)

Google uses Core Web Vitals as a **ranking factor** — poor vitals can negatively impact search traffic and business results.

---

## Chapter 17: Web Vitals Overview

Each Core Web Vital is measured in three categories: **"Good"**, **"Needs Improvement"**, and **"Poor"**, with different thresholds per metric.

### Approaches to Improving Vitals

- **Strive for the highest possible score** — ideal but may be difficult on large sites with many dependencies
- **Benchmark against competitors** — you're not competing with every optimized site globally, just those ranking for your target keywords

---

## Chapter 18: Largest Contentful Paint (LCP)

LCP measures **loading performance** — the time it takes for the largest visible element in the viewport to render.

The largest element could be a large text block, video, or image occupying primary real estate on the page.

> LCP is not the same as First Contentful Paint (FCP). FCP measures when the first element renders; LCP continues counting until the largest element is fully visible.

**Target:** LCP should occur within **2.5 seconds** of the page first starting to load.

**Common LCP elements:** hero images, large headings, video thumbnails.

---

## Chapter 19: First Input Delay (FID)

FID measures **interactivity** — the time from when a user first interacts with a page (clicks a button, taps a link) to when the browser can actually respond.

FID requires real user data and **cannot be measured in a lab environment** (e.g. Lighthouse). Instead, **Total Blocking Time (TBT)** is the lab-measurable proxy metric that correlates with FID.

FID occurs when the browser's main thread is busy executing JavaScript and is unable to respond to user input.

**Target:** FID should be less than **100 milliseconds**.

---

## Chapter 20: Cumulative Layout Shift (CLS)

CLS measures **visual stability** — the total amount of unexpected layout shifts during the lifespan of a page.

A layout shift occurs when a visible element changes its position unexpectedly. CLS = impact fraction × distance fraction for each shift.

Common causes of CLS:
- Images without explicit width/height dimensions
- Ads or iframes with unknown sizes
- Fonts that cause text to reflow when they load (FOIT/FOUT)
- Content injected above existing content after the initial render

**Target:** CLS should be less than **0.1**.

> Layout shifts caused by user interaction (e.g., expanding an accordion) do not count toward CLS.

---

## Chapter 21: SEO Impact

Google began using page speed as a ranking factor for mobile in 2018. In June 2021, Google published specific Core Web Vitals metrics and ranges as part of the Page Experience update.

### Lighthouse (v6) Weights for Performance Score

| Metric | Weight |
|--------|--------|
| Largest Contentful Paint | 25% |
| Total Blocking Time | 25% |
| First Contentful Paint | 15% |
| Speed Index | 15% |
| Time to Interactive | 15% |
| Cumulative Layout Shift | 5% |

> **Note:** Google's ranking impact is the same for all pages in the "Good" range — you're not rewarded for exceeding the threshold, only penalized for falling below it.

### UX Impact Beyond SEO

Core Web Vitals ultimately benefit users. A study by Amazon found that **one additional second of load time could cost the company $1.6 billion USD annually** — showing how directly performance impacts business outcomes.

---

## Chapter 22: Improving your Core Web Vitals

This section covers Next.js-specific optimizations to improve Core Web Vitals:

- **Ch23** — Measuring with Lighthouse
- **Ch24** — `next/image` for automatic image optimization
- **Ch25** — Dynamic imports to reduce initial JS bundle
- **Ch26** — Dynamically importing React components
- **Ch27** — Font optimization
- **Ch28** — Third-party script optimization

---

## Chapter 23: Introducing Lighthouse

Lighthouse is Google's open-source tool for auditing web page quality. It runs a series of audits on a URL and generates a report with scores and improvement recommendations.

### How to Run Lighthouse in Chrome DevTools

1. Open Chrome in an **incognito window** (to avoid plugin interference)
2. Navigate to your URL
3. Open DevTools → **Lighthouse** tab
4. Click **Generate Report**

> Always test with a **production build** (`npm run build && npm run start`) for accurate results, not the development server.

### Setting Up the Tutorial Project

```bash
npx create-next-app@latest nextjs-lighthouse --use-npm --example "https://github.com/vercel/next-learn/tree/main/seo"
cd nextjs-lighthouse
npm run build && npm run start
```

---

## Chapter 24: Automatic Image Optimization

### The Problem with `<img>`

Using a standard `<img>` tag requires manual handling of:
- Responsive images for different screen sizes
- Image optimization (compression, format)
- Lazy loading

### The `next/image` Component

`next/image` is an extension of `<img>` that handles all optimizations automatically:

- **On-demand optimization** — images are optimized as users request them (not at build time), so build times don't scale with image count
- **Lazy loaded by default** — images outside the viewport don't affect page speed; they load when scrolled into view
- **Prevents CLS** — images always render with proper dimensions, avoiding layout shifts
- **Modern formats** — serves WebP when the browser supports it
- **Works with external sources** — even images from a CMS can be optimized

### Usage

```javascript
import Image from 'next/image';

// Before
<img src="large-image.jpg" alt="Large Image" />

// After
<Image src="/large-image.jpg" alt="Large Image" width={3048} height={2024} />

// Footer logo
<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
```

---

## Chapter 25: Dynamic Imports

Next.js supports ES2020 dynamic `import()` for JavaScript modules. This enables **code splitting** — loading JavaScript only when it's needed rather than on every page load.

### The Problem

Importing large third-party libraries at the top of a file loads them on every visit, even if the user never uses that feature:

```javascript
// These load on every page visit — bad for performance
import Fuse from 'fuse.js';
import { now } from 'lodash-es';
```

### The Solution — Dynamic Import

```javascript
<input
  type="text"
  placeholder="Country search..."
  onChange={async (e) => {
    const { value } = e.currentTarget;

    // Libraries only load when the user types
    const Fuse = (await import('fuse.js')).default;
    const { now } = await import('lodash-es');

    const fuse = new Fuse(countries, { keys: ['name'], threshold: 0.3 });
    const searchResult = fuse.search(value).map((result) => result.item);
    setResults(searchResult.length ? searchResult : countries);

    console.info({ searchedAt: now() });
  }}
/>
```

**Benefits:** Fixes "Remove unused JavaScript" Lighthouse issue; improves Time to Interactive (TTI), which improves FID.

---

## Chapter 26: Dynamic Imports for Components

React components can also be imported dynamically using `next/dynamic`. This delays loading until the component is actually needed.

### Usage

```javascript
import dynamic from 'next/dynamic';

// Replace static import:
// import CodeSampleModal from '../components/CodeSampleModal';

// With dynamic import:
const CodeSampleModal = dynamic(() => import('../components/CodeSampleModal'), {
  ssr: false, // Don't render on server — only load client-side when needed
});
```

### Conditional Loading

Wrap the component in a condition so it only loads when needed:

```javascript
{isModalOpen && (
  <CodeSampleModal
    isOpen={isModalOpen}
    closeModal={() => setIsModalOpen(false)}
  />
)}
```

When `isModalOpen` is toggled to `true` for the first time, the JavaScript for the modal is requested — not before.

**Benefit:** Removes third-party library JS from the initial page load bundle.

---

## Chapter 27: Optimizing Fonts

82% of desktop web pages use custom web fonts. Custom fonts matter for branding and cross-browser consistency, but can harm performance if not handled correctly.

### Next.js Automatic Webfont Optimization

Next.js has built-in font optimization that **inlines font CSS at build time**, eliminating an extra network round trip to fetch font declarations.

```html
<!-- Before (requires extra network request) -->
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

<!-- After (Next.js inlines the CSS) -->
<style data-href="https://fonts.googleapis.com/css2?family=Inter">
  @font-face { font-family: 'Inter'; font-style: normal; }
</style>
```

This improves **First Contentful Paint (FCP)** and **Largest Contentful Paint (LCP)** by removing the font fetch from the critical rendering path.

---

## Chapter 28: Optimizing Third-Party Scripts

Third-party JavaScript (analytics, ads, customer support widgets) can delay page content from rendering and harm user performance if loaded too early.

### The Problem with Standard `<script>` Tags

```javascript
import Head from 'next/head';

// Bad — script loads in document head, blocking rendering
function IndexPage() {
  return (
    <Head>
      <script src="https://www.googletagmanager.com/gtag/js?id=123" />
    </Head>
  );
}
```

### The `next/script` Component

Next.js provides a `Script` component with a `strategy` prop:

```javascript
import Script from 'next/script';

function IndexPage() {
  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=123"
      />
    </div>
  );
}
```

### Strategy Options

- `beforeInteractive` — load before the page becomes interactive (for critical scripts)
- `afterInteractive` — load immediately after the page becomes interactive (default; recommended for most third-party scripts)
- `lazyOnload` — load lazily during browser idle time (for low-priority scripts)

> **Best practice:** Most third-party scripts should use `afterInteractive` or `lazyOnload` to avoid negatively affecting LCP.

---

## Chapter 29: Monitoring your Core Web Vitals

Optimizing once isn't enough — monitoring in production over time is essential for maintaining performance.

Key monitoring approaches:
- **Next.js Speed Insights** — real user monitoring on Vercel
- **Custom Reporting** — send metrics to your own service or Google Analytics
- **CrUX Report** — Chrome User Experience Report (open dataset)
- **Other Tools** — PageSpeed Insights, Search Console, Lighthouse, Chrome DevTools

---

## Chapter 30: Next.js Speed Insights

[Next.js Speed Insights](https://nextjs.org/analytics) allows you to analyze and measure page performance using real Core Web Vitals data.

On **Vercel deployments**, Speed Insights works with zero configuration — simply deploy and your **Real Experience Score** starts collecting automatically from real user sessions.

---

## Chapter 31: Custom Reporting

You can send Core Web Vitals data to your own service or to Google Analytics using the built-in `reportWebVitals` function.

### Setup

In `pages/_app.js`, export a `reportWebVitals` function:

```javascript
export function reportWebVitals(metric) {
  console.log(metric);
}
```

Then build and start your application:

```bash
npm run build && npm run start
```

Each metric will be logged to the browser's DevTools console. Note that **FID only triggers once a user interacts with the page**.

You can replace `console.log` with any service endpoint (Google Analytics, your own analytics backend, etc.).

---

## Chapter 32: Other Tools

### Field Data Tools (Real User Monitoring)
These use actual user sessions to measure performance:

- **[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)** — Google's tool showing both field and lab data for any URL
- **[Chrome User Experience Report (CrUX)](https://developers.google.com/web/tools/chrome-user-experience-report)** — open-source field data dataset
- **[Google Search Console](https://support.google.com/webmasters/answer/9205520)** — Core Web Vitals report showing field data for your site

### Lab Data Tools (Simulated Testing)
These simulate performance in a controlled environment:

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse?hl=en)** — Google's open-source automated auditing tool
- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)** — built into Chrome browser

> **Important:** For lab tools (Lighthouse, DevTools), use **Total Blocking Time (TBT)** as a proxy for FID, since FID can only be measured with real user data.

---

## Chapter 33: Data Studio (Chrome User Experience Report)

The **Chrome User Experience Report (CrUX)** dataset provides real-world user experience metrics from Chrome users for popular destinations.

This dataset is:
- Publicly available via [BigQuery](https://console.cloud.google.com/bigquery?project=chrome-ux-report)
- Accessible in [Google Data Studio (Looker Studio)](https://datastudio.google.com/overview) for free
- Available as [open-source dashboards](https://g.co/chromeuxdash) you can copy and use as templates

### Limitations
- Your site needs a **meaningful volume of visits** to appear in the CrUX dataset (not suitable for new or low-traffic sites)
- Data is updated **monthly** (~15 days after the month ends), so there's a lag that may not be suitable for rapid iteration

---

## Chapter 34: Next Steps

Congratulations on completing the Next.js SEO and Core Web Vitals course!

### Recommended Actions
- **Monitor continuously** — use Speed Insights, Search Console, and CrUX to track vitals over time
- **Join the conversation** — ask questions in [GitHub Discussions](https://github.com/vercel/next.js/discussions) or the [Next.js Discord](https://www.nextjs.org/discord)
- **Apply what you learned** — implement structured data, optimize images with `next/image`, use `next/script` for third-party scripts, and choose the right rendering strategy per page

---

## Quick Reference: Next.js SEO Checklist

### Crawling & Indexing
- [ ] Return HTTP 200 for all indexable pages
- [ ] Use 301/308 for permanent redirects, 302 for temporary
- [ ] Return 404 for non-existent pages (avoid soft 404s)
- [ ] Add `robots.txt` to block non-indexable areas
- [ ] Submit a dynamic XML sitemap to Google Search Console
- [ ] Add `noindex` meta tag to pages that should not appear in search
- [ ] Use `rel="canonical"` to consolidate duplicate URLs

### Rendering
- [ ] Use SSG or SSR for pages that need to be indexed
- [ ] Avoid CSR for SEO-critical pages
- [ ] Use dynamic routing with `fallback: 'blocking'` for new dynamic pages

### Metadata
- [ ] Unique, descriptive `<title>` tag on every page
- [ ] Meaningful `<meta name="description">` on every page
- [ ] Open Graph tags for social sharing (`og:title`, `og:description`, `og:image`)
- [ ] JSON-LD structured data for products, articles, recipes, events, etc.

### On-Page SEO
- [ ] One `<h1>` per page that matches the page topic
- [ ] Semantic URL structure (words, not IDs; hyphens, not underscores)
- [ ] Internal links using `<Link>` component with proper `href`
- [ ] Descriptive anchor text (not "click here")

### Performance (Core Web Vitals)
- [ ] LCP < 2.5s — use `next/image`, prioritize critical images
- [ ] FID < 100ms — use dynamic imports to reduce JS bundle
- [ ] CLS < 0.1 — set explicit dimensions on images and embeds
- [ ] Use `next/image` instead of `<img>` for automatic optimization
- [ ] Use `next/script` with `afterInteractive` for third-party scripts
- [ ] Use `next/font` / font optimization to inline font CSS
- [ ] Dynamically import large libraries and components (`next/dynamic`)

### Monitoring
- [ ] Set up Google Search Console and verify ownership
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Use Vercel Speed Insights or `reportWebVitals` for production monitoring
- [ ] Run Lighthouse audits regularly on production builds
