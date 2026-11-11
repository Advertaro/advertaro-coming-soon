# SEO Fundamentals — SEO Starter Guide

> Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

This guide covers the fundamentals of Search Engine Optimization (SEO) as defined by Google. It is intended for site owners who want to improve their visibility in Google Search.

---

## How Google Search Works

Google Search is a fully automated search engine that uses software programs called **crawlers** (also called spiders or bots) to constantly crawl the web, looking for pages to add to its index.

- You don't need to submit your site to Google — it usually finds sites automatically.
- Google uses many factors to determine how to rank pages, including relevance, quality, and the relationship between pages (links).
- There is no guarantee that Google will crawl or index all your pages.

---

## Help Google Find Your Content

### Verify Google Can Access Your Site
Use the `site:` operator in Google Search to see how many of your pages are indexed:
```
site:yourdomain.com
```

### Use the URL Inspection Tool
In Google Search Console, the URL Inspection tool shows whether a specific URL is indexed and, if not, why.

### Submit a Sitemap
A sitemap is a file that lists the URLs on your site. Submitting one to Google Search Console helps Google discover your pages, especially:
- New or recently updated pages
- Pages that aren't well-linked to from other pages on your site

### Internal Links
Ensure your important pages are linked from other pages on your site. Googlebot follows links to discover pages, so pages that aren't linked will be hard to find.

---

## Organize Your Site

### Use Descriptive, Human-Readable URLs
Choose URLs that are meaningful and describe the page content:
- **Good:** `example.com/blog/seo-tips`
- **Avoid:** `example.com/page?id=12345&session=abc`

URL best practices:
- Use words instead of long ID numbers.
- Use hyphens (`-`) to separate words, not underscores (`_`) or spaces.
- Use lowercase letters.
- Keep URLs as short as reasonably possible.
- Avoid unnecessary URL parameters when possible.

### Group Pages in Directories
Organize related pages in logical subdirectories:
```
example.com/products/shoes/
example.com/products/bags/
example.com/blog/
```
This structure helps both users and Google understand the hierarchy of your site.

### Reduce Duplicate Content
Duplicate content (the same content accessible from multiple URLs) can confuse Google about which version to index. To consolidate duplicates:
- Use a canonical `<link rel="canonical" href="preferred-URL">` tag to indicate the preferred version.
- Use 301 redirects to redirect old/duplicate URLs to the canonical version.
- Use consistent internal links pointing to the same URL.

---

## Make Your Site Useful for Users

### Create Helpful, Unique, and Trustworthy Content
Google rewards content that is:
- **Helpful** — answers the user's question or need
- **Unique** — provides original information, not copied from elsewhere
- **Up-to-date** — regularly refreshed where relevant (e.g., product listings, news)
- **People-first** — written for people, not just to rank in search engines

### Anticipate What Users Are Searching For
Think about the words and phrases your target audience actually uses. Include those naturally in your content. Examples:
- If you sell running shoes, use terms like "trail running shoes," "cushioned running shoes," not just "footwear."
- Use the language of your audience; avoid jargon unless your audience expects it.

### Avoid Distracting Ads
Pages with excessive, intrusive ads (especially above the fold) can be flagged by Google's ranking systems as a poor user experience. Keep advertising reasonable and unobtrusive.

### Link to Relevant External Resources
Linking out to other authoritative, relevant resources builds trust and helps users. Don't be afraid to link to third-party sources when they add value.

### Write Good Link Text (Anchor Text)
The text of a link (anchor text) gives Google context about the linked page. Write descriptive anchor text:
- **Good:** `Learn more about our return policy`
- **Avoid:** `Click here` or `Read more`

---

## Influence How Your Pages Appear in Search Results

### Title Links
The clickable headline in a search result is called a **title link**. Google generates it primarily from the `<title>` element in your HTML:

```html
<title>SEO Tips for Beginners | Example Blog</title>
```

Best practices:
- Write a unique, descriptive title for every page.
- Keep titles concise — Google may truncate long titles.
- Put the most important information first.
- Avoid generic titles like "Home" or "Page 1."
- Avoid stuffing the title with keywords.

Note: Google may override your title tag and use other text from your page if it believes it better represents the page.

### Snippets (Meta Descriptions)
The snippet is the short text shown under the title link. Google generates this from the content of the page but can be guided with a `<meta name="description">`:

```html
<meta name="description" content="Learn the basics of SEO with this beginner-friendly guide covering keywords, links, and content best practices.">
```

Best practices:
- Write a unique, accurate summary of the page.
- Write as if you're describing the page to a human searcher.
- Avoid generic descriptions that could apply to any page.
- Don't fill it with keywords — it doesn't directly affect ranking.

Note: Google may use text from the page instead of your meta description if it believes it's more relevant to the query.

---

## Optimize Images

### Use High-Quality Images
Use sharp, relevant, high-resolution images. Place images near relevant text content.

### Use Descriptive File Names
Name image files descriptively:
- **Good:** `golden-retriever-puppy.jpg`
- **Avoid:** `img001.jpg`

### Write Descriptive Alt Text
The `alt` attribute describes the image to both search engines and screen readers:
```html
<img src="seo-diagram.png" alt="Diagram showing how Google crawls and indexes pages">
```

Best practices:
- Describe the image accurately.
- Include relevant keywords naturally.
- Keep alt text concise (a sentence or less).
- Don't start with "Image of..." or "Photo of..."

### Use Responsive Images
Use responsive images to serve appropriate sizes to different devices. This improves page load speed and user experience.

---

## Optimize Videos

- Give videos a descriptive title and description.
- Host videos on a page with relevant, related content.
- Use a thumbnail image that is clear and relevant.
- Use video structured data (VideoObject schema) to help Google understand video content.
- Consider providing a transcript — it adds crawlable text content.

---

## Promote Your Website

Effective promotion means building awareness and links naturally:
- Share content on social media and relevant communities.
- Engage with your audience (comment sections, forums, Q&A sites).
- Reach out to relevant site owners who might find your content link-worthy.
- Submit to relevant directories or resource pages where appropriate.
- Create genuinely useful, shareable content (tools, guides, original research).

**Avoid:**
- Buying links
- Participating in link schemes
- Spamming forums or comment sections with links

---

## Common Misconceptions and Things to Avoid

### Meta Keywords Tag
Google does **not** use the `<meta name="keywords">` tag for ranking. You can omit it entirely.

### Keyword Stuffing
Repeating keywords excessively (in body text, alt text, titles, etc.) does not help and can trigger spam filters. Write naturally.

### Keywords in Domain or TLD
Having keywords in your domain name (e.g., `best-seo-tips.com`) or using a keyword-specific TLD (e.g., `.photography`) is **not** a significant ranking factor. Focus on content quality.

### Optimal Content Length
There is **no magic content length** that Google rewards. Write as much as is genuinely useful — no more, no less.

### Subdomains vs. Subdirectories
Google can index content from both subdomains (`blog.example.com`) and subdirectories (`example.com/blog/`). Choose based on your site's needs; both work for SEO.

### PageRank Is Just One Signal
Google uses hundreds of signals to rank pages. PageRank (link authority) is important but not the only factor. Don't obsess over it.

### Duplicate Content Penalty
There is **no "duplicate content penalty"** per se. However, having duplicate content can dilute your signals across multiple URLs. Use canonical tags and redirects to consolidate.

### Heading Order
The order of heading tags (`<h1>`, `<h2>`, `<h3>`) matters for accessibility and clarity, but Google does **not** require a strict heading hierarchy for ranking purposes. Focus on logical, readable structure.

### E-E-A-T Is Not a Direct Ranking Factor
Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) is a framework used by Google's human quality raters to evaluate search quality. It is **not** a direct algorithmic ranking signal, but the principles behind it (quality, trustworthy content) do correlate with what Google's systems reward.
