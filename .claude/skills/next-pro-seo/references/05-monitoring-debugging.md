# Monitoring & Debugging

> Source: https://developers.google.com/search/docs/monitor-debug

This section covers how to monitor your site's performance in Google Search, diagnose traffic drops, and use Google's tools to identify and fix issues.

---

## Google Search Console

> Source: https://developers.google.com/search/docs/monitor-debug/search-console-start

Google Search Console (GSC) is Google's free tool for monitoring and maintaining your site's presence in Google Search results. It provides data and alerts about indexing, crawling, search performance, and security.

### Getting Started — 4 Steps

#### Step 1: Verify Ownership
Before accessing data, prove you own the site. Methods:
- **HTML file upload** — upload a verification file to your site's root
- **HTML meta tag** — add a `<meta name="google-site-verification">` tag to your homepage
- **Google Analytics** — if you already have GA with the same Google account
- **Google Tag Manager** — if you use GTM
- **DNS record** — add a TXT record to your domain's DNS settings (best for full domain properties)

#### Step 2: Check Index Coverage Report
The **Index Coverage report** (now called **Page Indexing report**) shows:
- How many pages are indexed
- Why pages are NOT indexed (errors, excluded intentionally, warnings)
- Trends over time

Common issues surfaced here:
- `Crawl anomaly` — error fetching the page
- `Discovered - currently not indexed` — Google knows the page but hasn't crawled it
- `Crawled - currently not indexed` — Google crawled but chose not to index
- `Excluded by noindex tag` — page has `noindex` directive
- `Blocked by robots.txt` — page is blocked from crawling
- `404 error` — page not found
- `Redirect error` — redirect chain or loop

#### Step 3: Submit a Sitemap
Go to **Sitemaps** section → Enter your sitemap URL → Click Submit. Google will process it and report back errors or successes. This tells Google about your pages and their priority.

#### Step 4: Monitor Performance
The **Performance report** shows:
- **Total clicks** — how many times users clicked your result
- **Total impressions** — how many times your result was shown
- **Average CTR** — click-through rate (clicks / impressions)
- **Average position** — average ranking position across queries

Filter by:
- Date range
- Query
- Page
- Country
- Device
- Search type (Web, Image, Video, News, Discover, Google Maps)

### Key Reports for SEO

#### Performance Report
Use to identify:
- Top queries driving traffic
- Pages with high impressions but low CTR (opportunity to improve title/description)
- Position trends (are rankings improving or declining?)
- Queries you rank for that you didn't know about

#### Manual Actions Report
Lists pages (or the entire site) that have received a manual penalty from Google's spam team. If you have a manual action, your content won't rank until you fix the issue and submit a reconsideration request.

#### Removals Tool
For content you want temporarily or permanently removed from Google:
- Temporary removal (~6 months) — useful for urgent removal needs
- Permanent removal requires adding `noindex` and/or access restrictions

#### Change of Address Tool
Used when moving your site to a new domain. Tells Google about the move and expedites the update of its index.

#### Rich Result Status Reports
In the **Enhancements** section, see which pages have valid structured data, warnings, or errors for each rich result type you've implemented.

### Key Reports for Developers

#### URL Inspection Tool
Enter any URL on your site to see:
- Is this URL indexed?
- When was it last crawled?
- What did Googlebot see when it crawled?
- Is there a canonical issue?
- Are there AMP or structured data errors?
- Request indexing for a specific URL

#### Security Issues Report
Alerts you if Google detects:
- Malware on your site
- Phishing pages
- Hacked content

If you have a security issue, your site may be flagged with a warning in search results.

#### Core Web Vitals Report
Shows field data (real user data from Chrome users) for:
- LCP (Largest Contentful Paint)
- INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)

Pages are categorized as Good, Needs Improvement, or Poor. Fix Poor pages first.

---

## Debugging Search Traffic Drops

> Source: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops

A traffic drop is one of the most alarming events for a site owner. This guide helps you diagnose the cause systematically.

### Main Causes of Traffic Drops

#### 1. Algorithmic Update
Google updates its ranking algorithms regularly. Some updates affect many sites at once.

**Characteristics of an algorithmic drop:**
- Drop aligns with a confirmed Google update (check Google's search status dashboard)
- Traffic drops across many pages simultaneously
- Drop may be partial (some queries down, others fine)
- Typically affects a category of content (e.g., reviews, news, spam)

**Scale of drops:**
- **Small drop** (e.g., position 2 → position 4) — minor impact
- **Large drop** (e.g., position 4 → position 29) — significant impact; page falls to page 2 or 3

**What to do:**
- Analyze which pages/queries were affected.
- Align content with Google's quality guidelines.
- There's no "fix" to submit — address the quality or spam issues that caused the drop.

#### 2. Technical Issues
Sudden technical problems can abruptly drop traffic:

- **Server errors (5xx)** — Googlebot can't access your site; pages may be deindexed if errors persist
- **robots.txt change** — accidentally blocking Googlebot or large sections of your site
- **noindex accidentally added** — a site-wide `noindex` added in error (common after CMS/platform migrations)
- **404 errors** — pages removed without proper redirects
- **Login walls or paywalls** — content moved behind authentication

**How to check:**
- Search Console → Page Indexing report: sudden drop in indexed pages?
- Search Console → URL Inspection: is your homepage/key pages indexed?
- Check `robots.txt` changes in your version control
- Check for accidental noindex tags on key templates
- Check server logs for 5xx errors

#### 3. Security Issues
If your site has been hacked:
- Malware may be installed
- Spammy pages may be injected
- Cloaking may be occurring (serving different content to Google vs. users)
- Google may flag your site with a warning or manual action

**How to check:**
- Search Console → Security Issues report
- Do a `site:yourdomain.com` Google search and look for unfamiliar pages
- Check for unfamiliar files in your CMS or server

#### 4. Spam / Manual Actions
If Google's spam team issues a manual action:
- Individual pages or your entire site can be demoted
- You'll see a notification in Search Console → Manual Actions

**How to fix:**
- Address the specific issue listed in the manual action
- Submit a reconsideration request via Search Console
- Recovery can take weeks after approval

#### 5. Seasonality and Changing User Interests
Traffic can drop naturally because:
- Seasonal content (e.g., Christmas decorating tips drop in January)
- Topic popularity shifted (fewer people searching for your topic)
- Trending content faded

**How to check:**
- Compare year-over-year data in Search Console (change date range to 16 months)
- Check Google Trends for your target queries

#### 6. Site Moves
If you recently moved your site (new domain, HTTPS migration, URL restructure):
- Traffic drops are **expected** and temporary
- Recovery typically takes weeks to months
- Incomplete redirect implementations can cause permanent loss

### How to Analyze a Traffic Drop

#### Step 1: Identify the Date of the Drop
In Search Console Performance report:
- Change the date range to **Last 16 months** for context
- Look for the exact date the drop started
- Compare to known Google update dates

#### Step 2: Compare Periods
Use the **Compare** feature to compare:
- This week vs. last week
- This month vs. same month last year
- Before and after the drop date

#### Step 3: Segment Your Analysis
- **Search type** — Is the drop in Web, Image, Video, or Discover?
- **Country** — Is it global or specific to certain countries?
- **Device** — Desktop, mobile, or tablet?
- **Query** — Which specific queries lost clicks/impressions?
- **Page** — Which specific pages lost traffic?

#### Step 4: Look for Patterns
- Did clicks drop while impressions stayed the same? (CTR problem — check title/description)
- Did impressions and clicks both drop? (Rankings dropped or indexing issues)
- Is it concentrated on certain page templates? (Technical issue with that template)
- Is it spread across many unrelated pages? (Likely algorithmic)

#### Step 5: Check Average Position
In Search Console, monitor average position:
- Did positions drop simultaneously?
- Which queries moved from page 1 to page 2+?

### Google Trends for Traffic Analysis

Google Trends (https://trends.google.com) shows the relative popularity of search queries over time. Use it to:
- Determine if a traffic drop is due to reduced interest in your topic
- Identify seasonal patterns
- Find related queries that are rising
- Compare interest across regions

**Workflow:**
1. Export your top queries from Search Console
2. Check each in Google Trends
3. If Google Trends shows declining interest, it's an external factor, not a site issue
4. If Google Trends shows stable interest but your traffic dropped, the issue is with your site's ranking

---

## Monitoring Best Practices

### Set Up Alerts
- Use Search Console email alerts for:
  - Manual actions
  - Security issues
  - Coverage issues
  - Significant performance changes

### Regular Monitoring Schedule
- **Weekly**: Check Performance report for week-over-week trends
- **Monthly**: Review Page Indexing report for new errors; check Core Web Vitals
- **Quarterly**: Audit top landing pages; check for technical issues; review structured data

### Use Search Operators for Diagnostics
In Google Search, use these operators to check your site:
- `site:yourdomain.com` — see indexed pages; unexpected results indicate problems
- `site:yourdomain.com "keyword"` — find specific content
- `cache:example.com/page` — see Google's cached version (check what Google sees)
- `info:example.com/page` — basic information about a URL

### Monitor Crawl Budget
For large sites, monitor how Google is spending its crawl budget:
- Search Console → Settings → Crawl Stats
- Look for unusually high crawl rates or errors
- Identify and block unnecessary pages from crawling (via robots.txt) to focus Googlebot on important content
