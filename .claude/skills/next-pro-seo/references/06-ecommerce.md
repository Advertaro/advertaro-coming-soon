# Ecommerce SEO

> Source: https://developers.google.com/search/docs/specialty/ecommerce

This section covers SEO strategies and best practices specifically for ecommerce sites — from product data sharing and structured data to site structure and multi-surface visibility.

---

## Where Ecommerce Content Appears on Google

> Source: https://developers.google.com/search/docs/specialty/ecommerce/where-ecommerce-data-can-appear-on-google

Ecommerce businesses can appear across multiple Google surfaces. Each has its own eligibility criteria and optimization strategies.

### Google Search (Web Results)
**What it shows:** Standard organic web results including product pages, category pages, blog posts, guides.

**How to optimize:**
- Standard SEO (structured URLs, quality content, internal linking)
- Implement **Product structured data** for rich results (price, availability, ratings)
- Well-written product titles and descriptions
- Fast-loading pages (Core Web Vitals)

### Google Images
**What it shows:** Product images that appear in image search results.

**How to optimize:**
- Use high-quality, original product images
- Write descriptive `alt` text for all product images
- Use descriptive file names (e.g., `red-wool-scarf-winter.jpg`, not `IMG_1234.jpg`)
- Ensure images are hosted on the product page and near relevant text content
- Implement Product structured data — this can add product context to image results

### Google Lens
**What it shows:** Visual search results — users can photograph a product and find where to buy it.

**How to be found:**
- Upload your product catalog to **Google Merchant Center**
- High-quality, clear product images (no obstructions, good lighting, multiple angles)
- Google Lens connects the visual match to your Merchant Center listings

### Google Shopping Tab
**What it shows:** A dedicated shopping search results tab with product listings including image, price, store, and reviews.

**Requirements:**
- A **Google Merchant Center** account with your product feed
- Products must comply with Google's Shopping policies
- Must have a return policy and secure checkout

**How to optimize:**
- Keep product titles, descriptions, and pricing accurate and up-to-date
- Use high-quality images (white background preferred for Shopping)
- Ensure GTINs (Global Trade Item Numbers / barcodes) are provided where applicable
- Competitive pricing helps visibility in Shopping

### Google Business Profile (Google Maps)
**What it shows:** Business information in Google Maps and local search results.

**How to set up:**
- Claim and verify your Google Business Profile
- Link your Business Profile to your Merchant Center account
- Keep business hours, address, and phone number accurate

**For local inventory:**
- Use Merchant Center's **local inventory ads** feature to show which products are available in-store
- This enables "in stock nearby" visibility in search results

### Google Maps
**What it shows:** Physical store location, hours, reviews, local inventory.

**How to optimize:**
- Complete your Business Profile fully
- Encourage customer reviews
- Keep inventory data updated via Merchant Center local feeds

---

## Types of Ecommerce Content

Beyond product listings, ecommerce sites can benefit from these content types:

- **Company story** — About Us pages that build brand trust
- **Special offers** — Promotions, discounts, sales events
- **Product reviews** — Expert or editorial reviews of your products
- **Customer reviews** — User-generated reviews and ratings
- **Catalog descriptions** — Detailed, unique product descriptions
- **Educational content** — Buying guides, how-to content, FAQs
- **Live streams** — Product demos, unboxings, shopping events
- **Customer service touchpoints** — Policies, FAQ pages, support articles

---

## Sharing Product Data with Google

> Source: https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google

Getting your product data to Google involves two main approaches that are **complementary** — most sites benefit from using both.

### Method 1: Structured Data on Product Pages
Adding **Product schema** (structured data) directly to your product pages.

**Benefits:**
- Makes product pages eligible for **Product rich results** in Google Search
- Improves accuracy of price, availability, and shipping data shown in search results
- Helps Google understand product information even if page content is complex

**What to implement:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Executive Anvil",
  "image": "https://example.com/photos/executive-anvil.jpg",
  "description": "Comes in three sizes — Small, Medium, and Large.",
  "sku": "0446310786",
  "mpn": "925872",
  "brand": {
    "@type": "Brand",
    "name": "ACME"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product/executive-anvil",
    "priceCurrency": "USD",
    "price": "119.99",
    "priceValidUntil": "2024-11-05",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.4",
    "reviewCount": "89"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Fred Benson"
    }
  }
}
</script>
```

**Keep it accurate:** Structured data pricing and availability must match what's displayed on the page and what's available for purchase.

### Method 2: Google Merchant Center Feed
A Google Merchant Center account allows you to directly submit your product catalog to Google.

**Why use Merchant Center?**
- Gives Google confidence that it knows **all** your products (structured data only covers individual pages you add it to)
- Gives you **timing control** — push updates immediately rather than waiting for Googlebot to recrawl
- Share data that isn't on your website (e.g., GTIN/barcode, shipping cost matrices, tax info)
- Required for Google Shopping tab visibility

**Feed options:**

#### Automated Feed (small sites)
Google automatically discovers product data from your website. Good for sites with fewer than a few hundred products and up-to-date, well-structured pages.

#### Uploaded Feed (larger sites)
Manually create and upload a product data file (spreadsheet, XML, or TXT format) on a schedule. Good for sites that want more control.

#### Content API (immediate updates)
Use the Content API to push product updates to Merchant Center in real time. Best for:
- Large catalogs (thousands of products)
- Frequently changing prices and inventory
- Automated, developer-driven workflows

### Resolving Product Data Update Delays
If Google is showing outdated pricing or availability for your products:

1. **Enable automatic updates** in Merchant Center → this lets Google pull data from your pages automatically between feed uploads
2. **Increase feed upload frequency** — switch from weekly to daily uploads
3. **Use the Content API** for real-time updates
4. **Implement structured data** on product pages — helps Google validate data faster

---

## Site Structure for Ecommerce

A well-organized site structure helps both users and Google navigate and understand your catalog.

### URL Structure
```
example.com/                                  (homepage)
example.com/category-name/                   (category page)
example.com/category-name/subcategory/       (subcategory page)
example.com/category-name/subcategory/product-name/  (product page)
```

Best practices:
- Include keywords naturally in URLs (e.g., `/shoes/mens-running-shoes/` not `/category/12345/`)
- Use hyphens to separate words, not underscores
- Avoid session IDs and tracking parameters in URLs that should be indexed
- Use consistent URL patterns across your entire catalog

### Category and Subcategory Pages
- Create dedicated pages for each product category and subcategory
- Write unique, useful introductory text (not just a product grid) — this helps Google understand the page's topic
- Implement breadcrumb navigation and breadcrumb structured data
- Use **pagination** for large categories (don't put all 500 products on one page)

### Product Pages
Each product page should have:
- **Unique title** — brand + product name + key attributes (e.g., "ACME Executive Anvil — Stainless Steel, 15kg")
- **Unique description** — don't just copy manufacturer descriptions; add original value
- **High-quality images** — multiple angles, zoom capability
- **Clear availability and pricing** — keep these accurate
- **Customer reviews** — user-generated content adds unique, fresh text

### Handling Out-of-Stock Products
- **Temporarily out of stock:** Keep the page live, update availability in structured data, show expected restock date
- **Discontinued permanently:** Return 404 or 301 redirect to the next most relevant page (similar product or category)
- **Seasonal products:** Keep pages during off-season with reduced crawl priority rather than deleting them

### Pagination
For paginated category pages:
- Each page should be self-contained and canonicalize to itself
- Do NOT use `rel="next"` / `rel="prev"` — Google deprecated support for this
- Ensure page 2+ can be reached via links (don't rely on JavaScript-only pagination)
- Consider "Load More" with proper URL changes via History API rather than infinite scroll

---

## High-Quality Reviews for Ecommerce

Google's Reviews system specifically evaluates product and service review content. To rank well for review-type queries:

### What Google Rewards
- **First-hand experience** — reviews from people who actually used the product
- **Depth and analysis** — not just "this is great" but specific observations about performance, durability, value
- **Evidence of experience** — photos or videos taken by the reviewer, comparison with similar products
- **Balanced assessment** — pros and cons, noting who the product is best (and worst) for

### What to Avoid
- Thin reviews that merely confirm the product exists
- Reviews clearly written for SEO/affiliate purposes without genuine product evaluation
- Aggregated reviews without original analysis

### Implementation
- Collect authentic customer reviews via post-purchase emails
- Implement `AggregateRating` and `Review` structured data
- Display reviews prominently on product pages
- Respond to reviews to show engagement

---

## Google Merchant Center Setup

### Account Setup
1. Go to merchants.google.com
2. Create a Merchant Center account
3. Verify and claim your website URL
4. Set up shipping settings
5. Set up tax settings (required for US merchants)
6. Link your Merchant Center to Google Ads (if running Shopping ads)

### Feed Requirements
Your product feed must include:
- `id` — unique product identifier
- `title` — product name
- `description` — product description
- `link` — product URL
- `image_link` — primary product image URL
- `availability` — `in stock`, `out of stock`, or `preorder`
- `price` — price with currency (e.g., `19.99 USD`)
- `brand` — product brand
- `gtin` — barcode (required for most products; increases eligibility)
- `condition` — `new`, `used`, or `refurbished`

### Feed Quality Best Practices
- Keep titles specific and descriptive (include size, color, material)
- Use the same URL in the feed as on your website (no redirects)
- Keep prices in sync with your website prices
- Ensure all images meet minimum quality standards (800×800px minimum for Shopping)
- Use GTINs wherever possible — products with GTINs have better Shopping visibility
