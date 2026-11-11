# Google Search Essentials

> Source: https://developers.google.com/search/docs/essentials

Google Search Essentials (formerly the Webmaster Guidelines) outlines the key rules and best practices for getting your content to appear in Google Search.

---

## Overview

Google Search Essentials has three parts:
1. **Technical requirements** — what Google needs to crawl and index your page
2. **Spam policies** — practices that can lead to lower ranking or removal from Search
3. **Key best practices** — recommended actions to improve your presence in Google Search

---

## Technical Requirements

> Source: https://developers.google.com/search/docs/essentials/technical

For a page to be eligible to appear in Google Search, three conditions must be met:

### 1. Googlebot Must Not Be Blocked
Googlebot must be able to crawl the page. If Googlebot is blocked (via `robots.txt`, login walls, or other access restrictions), it cannot index the page.

- **Do not** block Googlebot in `robots.txt` for pages you want indexed.
- **Do not** require login to view content you want indexed.
- **Do not** use `noindex` in a `robots.txt`-disallowed page (robots.txt blocking prevents Google from seeing the noindex directive).

### 2. Page Must Return an HTTP 200 Status Code
The page must return a successful HTTP response. Pages returning 404, 301, 500, etc. will not be indexed (or will be removed from the index if they previously existed).

### 3. Page Must Have Indexable Content
The page must contain content that Google can index. This means:
- The page must have text content that is readable by Googlebot.
- The content must not be behind paywalls that prevent crawling.
- JavaScript-rendered content may be delayed in indexing (see JavaScript SEO section).

### Diagnostic Tools
- **Page Indexing report** — see which pages on your site are indexed and why others aren't
- **Crawl Stats report** — understand how Googlebot crawls your site
- **URL Inspection tool** — inspect a specific URL to see its crawl, index, and serving information

---

## Spam Policies

> Source: https://developers.google.com/search/docs/essentials/spam-policies

Google's spam policies define practices that are against its guidelines and can result in a manual action or algorithmic demotion. Violating spam policies can cause your pages to rank lower or be removed from Google Search entirely.

### Cloaking
Showing different content to search engines than to users. Examples:
- Showing a page of keywords to crawlers while users see a page of images or Flash.
- Inserting text or links into a page only when the User-agent is a search engine spider.

### Doorway Pages
Pages created to rank for specific queries that funnel users to a single destination. Characteristics:
- Multiple sites/pages targeting specific regions or cities with similar content
- Pages generated to funnel visitors to the actual usable portion of your site
- Substantially similar pages that are closer to search results than a clearly defined, organized hierarchy

### Hacked Content
Content placed on a site without the owner's permission due to security vulnerabilities. Types:
- **Hacked with malware** — attacker installs malicious code
- **Hacked with spam** — attacker adds spam links or pages
- **Hacked with gibberish** — auto-generated nonsensical content stuffed with keywords

### Hidden Text and Links
Hiding text or links from users while making it visible to search engines:
- White text on white background
- CSS positioning text off-screen
- Setting font-size to 0
- Hiding links in punctuation (e.g., a single hyphen)

### Keyword Stuffing
Filling a page with excessive or irrelevant keywords:
- Lists of phone numbers with no substantial added value
- Blocks of text listing cities for which a page is trying to rank
- Repeating the same word so often it sounds unnatural (e.g., "We sell custom framed photographs. Our custom framed photographs...")

### Link Spam
Links intended to manipulate PageRank or site ranking. Includes:
- Buying or selling links that pass PageRank (including paid link placements or advertorials)
- Excessive link exchanges ("Link to me and I'll link to you")
- Large-scale article marketing or guest posting with keyword-rich anchor text links
- Automated link building programs
- Requiring links as part of a Terms of Service or similar agreement

**Note:** Legitimate link practices are fine. Use `rel="nofollow"` or `rel="sponsored"` for paid/untrusted links.

### Automatically Generated Content (Spammy)
Content generated programmatically without adding value:
- Text translated by automated tools without human review
- Text generated through automated processes without regard for quality
- Text generated through automated synonymizing or obfuscation techniques
- Text generated from scraping search results or other sources
- Stitching/combining content from different web pages

### Scraped Content
Content copied from other reputable sites with no original value added, even with minor modifications.

### Sneaky Redirects
Redirecting users to a different page than what search engines index. This is different from legitimate redirects (e.g., mobile redirects or post-login redirects).

### Thin Affiliate Pages
Pages with little or no original content that merely replicate the affiliate program's product descriptions. Such pages add no value for users.

### User-Generated Spam
Spam added by users to otherwise legitimate sites (e.g., spam comments, spam forum posts, spammy profile pages). Site owners are responsible for preventing this.

### Malware and Malicious Behaviors
Sites that distribute malware or engage in unwanted behaviors like installing software, redirecting to malicious sites, etc.

---

## Key Best Practices

> Source: https://developers.google.com/search/docs/essentials

These are not requirements but strongly recommended actions:

### Create Helpful, Reliable, People-First Content
- Write content for people, not search engines.
- Demonstrate expertise, experience, authoritativeness, and trustworthiness (E-E-A-T).
- Ask: does the content provide original information, reporting, research, or analysis? Does it provide substantial value compared to other pages in search results?

### Use Descriptive, Accurate Keywords
- Use words that people would actually use to search for your content.
- Include keywords naturally in titles, headings, and body text.
- Avoid keyword stuffing.

### Make Links Crawlable
- Use `<a href="...">` tags for links Googlebot should follow.
- Avoid link-like elements that are not actual `<a>` elements (e.g., JavaScript onClick handlers without `href`).

### Tell Google About Your Site
- Submit a sitemap to Google Search Console.
- Use the URL Inspection tool to request indexing for important pages.

### Follow Best Practices for Images, Videos, and Structured Data
- Provide descriptive `alt` text for images.
- Use supported video markup.
- Implement structured data to enable rich results.

### Use the `robots.txt` and `noindex` Correctly
- Use `robots.txt` to control crawl budget, not to hide content (it doesn't guarantee non-indexing).
- Use `noindex` meta tag to prevent indexing of pages you don't want in Search.

### Secure Your Site
- Use HTTPS. Google gives a minor ranking boost to HTTPS pages.
- Keep your site secure to avoid being hacked.

### Promote Your Site Appropriately
- Build natural links from relevant sites.
- Engage on social media and relevant communities.
- Avoid link schemes that violate spam policies.
