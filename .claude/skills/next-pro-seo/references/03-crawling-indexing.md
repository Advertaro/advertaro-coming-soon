# Crawling & Indexing

> Source: https://developers.google.com/search/docs/crawling-indexing

This section covers how Google discovers, crawls, and indexes your content — and how to control that process.

---

## How Googlebot Works

Googlebot is Google's web crawler. It:
1. **Discovers** URLs via links, sitemaps, and previously crawled pages
2. **Crawls** pages by fetching their HTML (and linked resources)
3. **Renders** JavaScript (in a separate rendering queue)
4. **Indexes** the processed content for use in search results

Googlebot respects standard HTTP protocols and the `robots.txt` file. It identifies itself with a user agent string like `Googlebot/2.1`.

---

## Sitemaps

> Source: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

### What Is a Sitemap?
A sitemap is a file where you list the URLs of your site, along with optional metadata about each URL (last modified date, change frequency, priority). It tells Google which pages exist and when they were last updated.

Sitemaps can also include information about:
- **Images** — helps Google discover images that might not be found via crawling
- **Videos** — provides video metadata (title, description, duration, thumbnail)
- **News** — for news publishers using Google News

### When You Need a Sitemap
- Your site is **large** (hundreds or thousands of pages)
- Your site is **new** and has few external links pointing to it
- Your site has **rich media content** (videos, images) you want indexed
- Your pages are **isolated** and not well-connected by internal links

### When You May Not Need a Sitemap
- Your site is **small** (fewer than ~500 pages that you want indexed)
- Your site is **comprehensively linked** — all pages are reachable from the homepage via links
- You only have a few pages and you already submit them manually

### Sitemap Formats
- **XML sitemap** (standard) — most common; supported by Google
- **RSS/Atom feeds** — automatically available if you have a feed
- **Text file** — simplest; one URL per line

### Submitting a Sitemap
Submit via Google Search Console → Sitemaps section. You can also reference your sitemap in `robots.txt`:
```
Sitemap: https://www.example.com/sitemap.xml
```

### Sitemap Limits
- Maximum 50,000 URLs per sitemap file
- Maximum 50MB uncompressed per file
- You can use a **sitemap index file** to reference multiple sitemaps

---

## robots.txt

> Source: https://developers.google.com/search/docs/crawling-indexing/robots/intro

### What Is robots.txt?
`robots.txt` is a file at the root of your site (`https://example.com/robots.txt`) that tells crawlers which pages they can or cannot access.

### What robots.txt Controls
- **Web pages** — can block Googlebot from crawling specific pages or sections
- **Media files** — can block crawling of images, videos, PDFs
- **Resource files** — can block crawling of CSS, JavaScript (but this can hurt rendering)

### Important Limitations
- **Not all crawlers obey it** — Only well-behaved crawlers respect it; malicious bots may not.
- **Different syntax interpretations** — Some crawlers may parse directives differently.
- **Does NOT prevent indexing** — If a page is linked to from other sites, Google may still index it (and can show it in search results without seeing the content). Use `noindex` to prevent indexing.
- **Do not use for canonicalization** — `robots.txt` disallow does not help resolve duplicate content issues.

### robots.txt Syntax
```
User-agent: *          # Applies to all crawlers
Disallow: /private/    # Block this directory

User-agent: Googlebot
Disallow: /staging/    # Block only for Googlebot
Allow: /               # Allow everything else

Sitemap: https://www.example.com/sitemap.xml
```

### When to Use robots.txt
- Preventing Googlebot from wasting crawl budget on unimportant pages (e.g., faceted navigation, search results pages, internal search)
- Blocking staging or development areas
- Managing crawl load on your servers

### When NOT to Use robots.txt
- To hide content from users (it won't work reliably)
- To manage duplicate content (use canonical tags instead)
- To prevent indexing of sensitive content (use `noindex` + access controls)

---

## Canonicalization

> Source: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

### What Is Canonicalization?
Canonicalization is the process of selecting the **preferred version** of a URL when multiple URLs serve duplicate or very similar content. Google consolidates signals (links, etc.) to the canonical URL.

Examples of duplicate URL patterns:
- `http://example.com/page` vs `https://example.com/page`
- `example.com/page` vs `www.example.com/page`
- `example.com/page` vs `example.com/page?utm_source=newsletter`
- `example.com/page` vs `example.com/page/`

### Canonicalization Methods (Strongest to Weakest)

#### 1. 301 Redirect (Strongest)
Redirect duplicate URLs to the canonical URL:
```
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/canonical-page
```
This is the most explicit signal and consolidates all link equity.

#### 2. `rel="canonical"` Link Element
Add to the `<head>` of duplicate pages:
```html
<link rel="canonical" href="https://www.example.com/canonical-page">
```

This can also be a **self-referential canonical** (a page pointing to itself) — this is recommended and confirms you intend that URL to be the canonical.

**HTTP header version** (for non-HTML files like PDFs):
```
Link: <https://www.example.com/canonical-page>; rel="canonical"
```

#### 3. Sitemap Inclusion (Weakest)
Including a URL in your sitemap signals that it's preferred, but this is the weakest signal and Google may override it.

### Best Practices
- Always use **HTTPS** — Google prefers HTTPS over HTTP when choosing canonical.
- Keep canonical URLs **consistent** in all internal links, sitemaps, and structured data.
- For paginated content, each page should canonicalize to itself (not page 1).
- For hreflang (international SEO), canonical clusters and hreflang clusters should be aligned.
- **Self-referential canonicals** are fine and encouraged.

### What Google Does With Canonicals
Google treats canonicalization signals as hints, not directives. It may override your canonical choice if it determines a different URL is more appropriate (e.g., prefers HTTPS over HTTP even if you specified HTTP as canonical). The strongest signal is a 301 redirect.

---

## Mobile-First Indexing

Google uses **mobile-first indexing** — it uses the mobile version of a page for indexing and ranking, even for desktop users.

### Requirements
- Your mobile site must have the same content as your desktop site.
- Mobile site must be crawlable (robots.txt must not block Googlebot-Mobile).
- Structured data should be present on both mobile and desktop versions.
- Metadata (`<title>`, meta description) should be present on both versions.

### Responsive Design (Recommended)
Use responsive design (same URL, adapts via CSS media queries) — this is the simplest approach for mobile-first indexing.

### Separate Mobile Site (`m.dot`)
If using a separate mobile site (e.g., `m.example.com`), ensure:
- Proper bidirectional annotation: `<link rel="alternate">` on desktop pointing to mobile, `<link rel="canonical">` on mobile pointing to desktop.
- Same content quality on both versions.

---

## AMP (Accelerated Mobile Pages)

AMP is an open-source framework for fast-loading mobile pages. While Google no longer requires AMP for Top Stories, AMP pages can still appear in search results.

- AMP pages are indexed normally.
- AMP still receives Core Web Vitals assessment benefits when fast.
- A canonical non-AMP version of each AMP page should exist.

---

## JavaScript SEO

> Source: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

### Three-Phase Processing
Google processes JavaScript pages in three phases:

1. **Crawl** — Googlebot fetches the initial HTML
2. **Render** — Google renders the page with a headless Chromium browser to execute JavaScript
3. **Index** — Rendered content is processed and indexed

### The Render Queue Problem
JavaScript rendering is **not immediate**. There is often a delay (hours to weeks) between crawling and rendering. This means:
- Content that only appears after JavaScript executes may take longer to index.
- Critical SEO content (main headings, body text, links) should ideally be in the initial HTML (server-side rendered or statically generated).

### Key Best Practices for JavaScript SEO

#### Unique Titles and Descriptions
Ensure each page has a unique `<title>` and `<meta name="description">` that reflects the page content — even in single-page applications (SPAs).

#### Canonical URLs
Set canonical URLs correctly in JavaScript apps. The canonical URL should reflect the current page's URL, not the app shell:
```javascript
// React Helmet example
<Helmet>
  <link rel="canonical" href="https://example.com/current-page" />
</Helmet>
```

#### Use History API, Not Hash Fragments
For SPAs, use the HTML5 History API for navigation:
- **Good:** `example.com/products/shoes` (History API)
- **Avoid:** `example.com/#/products/shoes` (Hash fragments — Google doesn't index these as separate pages)

#### Avoid Soft 404 Errors
When a page doesn't exist in an SPA, make sure the server also returns a 404 HTTP status code. Showing a "Page Not Found" message with a 200 status code is a soft 404 and wastes crawl budget.

#### Proper HTTP Status Codes
Ensure your server returns correct HTTP status codes even for SPAs:
- 200 for existing pages
- 404 for non-existent pages
- 301 for redirects

#### Lazy-Loaded Content
Content loaded lazily (as the user scrolls) may not be rendered by Googlebot. Use `IntersectionObserver` for visual lazy loading, but ensure important content (text, links) is available without requiring user interaction.

#### Structured Data
Structured data can be generated by JavaScript, but it's still subject to rendering delay. For time-sensitive structured data, prefer server-side generation.

#### Web Components / Shadow DOM
Google can index content inside Shadow DOM (open mode). However, closed Shadow DOM content is not accessible.

#### Long-Lived Caching
Use content-based fingerprinting for cache busting (e.g., `app.a1b2c3.js`) to allow long-lived caching while ensuring updates are picked up.

#### Compatible Code
- Use feature detection rather than browser sniffing.
- Provide polyfills for modern APIs if supporting older browser/renderer versions.
- Test rendering with Google's Rich Results Test or URL Inspection tool.

---

## Meta Tags

Google supports these meta tags for controlling indexing and serving:

### `<meta name="robots">`
Controls crawling and indexing at the page level:
```html
<meta name="robots" content="noindex">          <!-- Don't index this page -->
<meta name="robots" content="nofollow">         <!-- Don't follow links on this page -->
<meta name="robots" content="noindex, nofollow"> <!-- Neither -->
<meta name="robots" content="index, follow">    <!-- Default behavior -->
<meta name="robots" content="noarchive">        <!-- Don't show cached version -->
<meta name="robots" content="nosnippet">        <!-- Don't show text snippet in results -->
<meta name="robots" content="max-snippet:150">  <!-- Limit snippet to 150 chars -->
```

### Googlebot-Specific
```html
<meta name="googlebot" content="noindex">  <!-- Only affects Googlebot -->
```

---

## Redirects

### 301 Permanent Redirect
Use when a page has permanently moved. Passes link equity (PageRank) to the new URL. Google will update its index to the new URL.

### 302 Temporary Redirect
Use for temporary moves (e.g., A/B testing, maintenance pages). Google may not update its index to the new URL.

### Redirect Chains
Avoid chains of multiple redirects (A → B → C → D). Each hop introduces latency and risks losing PageRank. Redirect directly to the final destination where possible.

---

## Site Moves

When moving a site (new domain, from HTTP to HTTPS, or restructuring URLs), follow these steps:

1. Set up the new site with all content.
2. Implement 301 redirects from all old URLs to new URLs.
3. Update internal links to point to new URLs.
4. Update your sitemap.
5. Use the **Change of Address tool** in Google Search Console (for domain moves).
6. Maintain redirects for at least a year (ideally longer).
7. Monitor traffic and indexing in Search Console.

Note: Site moves can cause temporary ranking drops. This is normal. Rankings typically recover within weeks to months.
