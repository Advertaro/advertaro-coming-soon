# Ranking & Search Appearance

> Source: https://developers.google.com/search/docs/appearance

This section covers how Google ranks content and how to optimize for various search appearance features including rich results, featured snippets, and more.

---

## Structured Data

> Source: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

### What Is Structured Data?
Structured data is a standardized format for providing information about a page and classifying its content. You add code to your pages using one of the supported formats, and Google uses it to understand the content and potentially display it as a **rich result** in Search.

Rich results can include visual enhancements like star ratings, images, pricing, FAQ dropdowns, and more — making your listing stand out in search results.

### Why Use Structured Data?

**Case Studies from Google:**
- **Rotten Tomatoes** added structured data to 100,000 unique pages → **25% higher click-through rate** on pages with structured data vs. without
- **Food Network** converted 80% of their site to structured data → **35% increase in visits**
- **Rakuten** implemented structured data → users spent **1.5× more time** on pages and had a **3.6× higher visit rate** from rich results

### Supported Formats

#### JSON-LD (Recommended)
A JavaScript notation embedded in a `<script>` tag. Google recommends this format because it's easy to add and doesn't intermix with HTML content:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": "Party Coffee Cake",
  "author": {
    "@type": "Person",
    "name": "Mary Stone"
  },
  "datePublished": "2018-03-10",
  "description": "This coffee cake is awesome and perfect for parties.",
  "prepTime": "PT20M",
  "cookTime": "PT30M",
  "totalTime": "PT50M",
  "keywords": "cake for a party, coffee",
  "recipeYield": "10",
  "recipeCategory": "Dessert",
  "recipeCuisine": "American",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "270 calories"
  },
  "recipeIngredient": [
    "2 cups of flour",
    "3/4 cup white sugar"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "name": "Preheat",
      "text": "Preheat the oven to 350 degrees F.",
      "url": "https://example.com/coffee-cake#step1",
      "image": "https://example.com/photos/coffee-cake/step1.jpg"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "18"
  }
}
</script>
```

#### Microdata
HTML attributes added directly to HTML elements. More complex to implement and maintain:
```html
<div itemscope itemtype="https://schema.org/Recipe">
  <span itemprop="name">Party Coffee Cake</span>
  <span itemprop="author">Mary Stone</span>
</div>
```

#### RDFa
Another HTML attribute-based format. Supported but less commonly used:
```html
<div vocab="https://schema.org/" typeof="Recipe">
  <span property="name">Party Coffee Cake</span>
</div>
```

### Structured Data Guidelines
- Use structured data to describe the actual content of the page — don't use it to describe content not visible to users.
- Only use the relevant schema types for your content.
- Follow the specific guidelines for each rich result type.
- Test with the **Rich Results Test** tool.
- Monitor rich result performance in **Search Console → Enhancements**.

### Common Structured Data Types
- **Article** — news, blog posts
- **Breadcrumb** — navigation path shown in results
- **Event** — concerts, conferences, workshops
- **FAQ** — frequently asked question pages
- **HowTo** — step-by-step instructions
- **Job Posting** — job listings
- **Local Business** — businesses with physical locations
- **Product** — e-commerce products (price, availability, ratings)
- **Recipe** — cooking recipes
- **Review / AggregateRating** — reviews and ratings
- **Video** — video content
- **Sitelinks Searchbox** — search box shown under your sitelinks

### Measuring the Effect of Structured Data
Track changes in impressions, clicks, and CTR in Google Search Console for pages with structured data. Compare before/after implementation periods.

---

## Google Search Ranking Systems

> Source: https://developers.google.com/search/docs/appearance/ranking-systems-guide

Google uses multiple automated ranking systems to deliver relevant, high-quality results. Understanding these systems helps you align your content with what Google rewards.

### BERT (Bidirectional Encoder Representations from Transformers)
BERT helps Google understand the nuance of word combinations and user intent. It's particularly useful for:
- Conversational, natural language queries
- Queries with prepositions (e.g., "parking on a hill with no curb")
- Understanding context within sentences

**Implication:** Write naturally for people. Avoid forced keyword insertions; write content that reads naturally.

### Crisis Information Systems
- **Personal crisis system** — surfaces local emergency resources for queries about self-harm or mental health crises
- **SOS Alerts** — surfaces emergency information for natural disasters, safety events

These are specialized systems for sensitive queries and not directly relevant to standard SEO optimization.

### Deduplication Systems
Ensures that very similar content from different sources isn't shown multiple times in a single search results page. If your content is largely identical to another site, you may compete for the same single slot.

### Exact Match Domain (EMD) System
Prevents low-quality sites from ranking well just because their domain name matches a search query. Having keywords in your domain name is **not** a significant ranking advantage, and a keyword-exact domain with thin content will not rank.

### Freshness Systems
For queries where fresh content is relevant (news, recent events, etc.), Google boosts newer content. For evergreen content, freshness is less important. Types of queries that benefit from freshness:
- Recent events and news
- Recurring events (e.g., elections, award shows)
- Frequently changing information (e.g., product reviews, stock prices)

### Link Analysis / PageRank
Google uses links between pages as a signal of importance and authority. **PageRank** is the original algorithm that quantifies this:
- Links from high-authority, relevant pages pass more value.
- The more quality links pointing to a page, the more trust Google assigns to it.
- Internal links also distribute PageRank within your site.

**Note:** PageRank is just one of many signals. Building natural, high-quality backlinks through great content is the recommended approach.

### Local News Systems
Surfaces local news sources for queries with local relevance. Relevant for publishers covering specific geographic areas.

### MUM (Multitask Unified Model)
MUM is a powerful AI model used for specific Google applications:
- Understanding complex, multi-step queries
- Understanding information across languages and modalities (text, images)
- Power features like the "About this result" panel and some search features in Google Lens

MUM is applied to specific use cases rather than all queries.

### Neural Matching
Neural matching connects concepts and meanings even when the exact words in a query don't appear on a page. It understands synonyms, related concepts, and the broader meaning of search queries.

**Implication:** You don't need to use exact keyword phrases. Cover topics comprehensively and naturally; neural matching will connect your content to related queries.

### Original Content Systems
Google tries to identify and prioritize the **original source** of breaking news or new information. If you are the first to publish on a topic, Google attempts to surface your content, not just the aggregators who republish it.

**Best practices:**
- Publish original reporting, research, and analysis.
- Include timestamps and author information.
- Use News sitemaps if you're a news publisher.

### Removal-Based Demotion Systems
Content that has been the subject of many valid removal requests (legal removals, personal information removal requests) may be demoted in rankings. This protects users from content that has been identified as problematic.

### Passage Ranking
Google can index individual **passages** within a page, not just the page as a whole. This means a long page can rank for many different queries based on the specific sections it covers.

**Implication:**
- Well-structured pages with distinct sections can rank for passage-level queries.
- Clear headings and organized content help Google understand passage boundaries.
- This doesn't require any special markup.

### RankBrain
RankBrain is a machine learning algorithm that helps Google interpret new or unusual queries that don't match previously seen patterns. It uses AI to:
- Understand the meaning of unknown queries
- Determine the most relevant results even without historical data
- Learn from user behavior (which results get clicked)

**Implication:** Content that genuinely satisfies user intent will naturally perform better as RankBrain learns from user behavior.

### Reliable Information Systems
Google surfaces authoritative, factual information for queries about health, civic, and scientific topics. These systems promote:
- Content from recognized authoritative sources (e.g., government health agencies, established medical institutions)
- Consensus-based scientific information over fringe claims

**Implication:** For YMYL (Your Money or Your Life) topics, demonstrated expertise and authority are especially important.

### Reviews System
Google evaluates the quality of **review content** — product reviews, service reviews, recommendations. The system rewards:
- Reviews written from actual first-hand experience
- Reviews that provide insightful, in-depth analysis
- Reviews that include evidence (images, audio, video) of direct experience
- Reviews that compare multiple products in a category
- Reviews that discuss performance across multiple criteria (pros/cons)

**What to avoid:**
- Thin reviews that just confirm a product is good
- Reviews that don't reflect actual experience with the product
- Reviews written purely for affiliate commissions without genuine evaluation

### Site Diversity System
Google generally shows **no more than 2 results from the same domain** on a single search results page. This ensures diversity of sources for searchers.

**Implication:** You can rank multiple pages, but saturating one SERP is unlikely. Focus on ranking for different queries rather than multiple positions on a single SERP.

### Spam Detection (SpamBrain)
**SpamBrain** is Google's AI-based spam detection system. It:
- Detects and nullifies artificial links
- Identifies spammy content automatically
- Is used alongside manual spam reviews

SpamBrain evolves continuously to detect new spam patterns.

---

## Retired Ranking Systems

These systems are no longer in use as standalone systems; their functions have been integrated into Google's core ranking systems:

| System | Originally Launched | Retired |
|--------|--------------------|---------| 
| **Helpful Content System** | August 2022 | March 2024 (integrated into core) |
| **Hummingbird** | 2013 | Now part of core systems |
| **Panda** | February 2011 | 2015 (integrated into core) |
| **Penguin** | April 2012 | September 2016 (integrated into core) |

---

## Search Appearance Features

> Source: https://developers.google.com/search/docs/appearance

### Featured Snippets
Featured snippets show a summary answer to a query directly in the search results, above the regular organic results. They're drawn from web pages.

- You **cannot** opt in to featured snippets.
- Google selects them automatically based on relevance and quality.
- Format your content clearly: direct answers, tables, lists, and step-by-step instructions are more likely to be featured.
- You can opt out with `<meta name="googlebot" content="nosnippet">`.

### Core Web Vitals
Core Web Vitals are a set of user experience metrics that Google uses as a ranking signal:

- **LCP (Largest Contentful Paint)** — how long it takes for the main content to load. Good: ≤2.5s
- **INP (Interaction to Next Paint)** — responsiveness to user interactions. Good: ≤200ms
- **CLS (Cumulative Layout Shift)** — visual stability (unexpected layout shifts). Good: ≤0.1

Improving Core Web Vitals can improve ranking (it's a minor signal) and most importantly improves user experience.

Tools: PageSpeed Insights, Search Console Core Web Vitals report, Lighthouse.

### Sitelinks
Sitelinks are links to subsections of your site that appear below the main result for branded queries:
```
[Your Brand] › About › Products › Contact › Blog
```
- Google generates sitelinks automatically — you cannot manually set them.
- Ensure your site has clear navigation structure, descriptive page titles, and a well-organized hierarchy.

### Favicons
Favicons appear next to your site name in mobile search results.
- Provide a favicon using standard `<link rel="icon">` in your HTML.
- The favicon should be a multiple of 48px square.
- Avoid logo/icon violations of Google's favicon guidelines.

### Title Links
The clickable headline in a search result. Google generates this primarily from `<title>` tags but may use other on-page text.
- Write descriptive, unique `<title>` tags for every page.
- Google may rewrite titles it finds misleading or unhelpful.

### Google Discover
Google Discover shows content to users on the Google app and mobile home screen based on their interests (not a search query). To be eligible:
- Content must be indexed by Google.
- Meet Google's content policies.
- Use high-quality images (at least 1200px wide) with `max-image-preview:large` or AMP.
- Write compelling, evergreen content on topics of broad interest.

### Web Stories
Web Stories are visual, full-screen stories (similar to social media stories) that can appear in Google Search and Discover.
- Built with the Web Stories format (based on AMP).
- Require hosting on your own domain.
- Must meet Google's Web Stories content policies.
