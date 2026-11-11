# Next.js Performance Checklist (rule catalog)

Baseline: Next.js 16.3 with React 19.2/19.3, verified against official docs and release notes as of September 2026. Each rule has an ID,
a default severity, how to spot it, and the fix. Rules marked **[v16]** or **[v15+]** only
apply when the detected version matches; give the older-version fix otherwise.

Severity scale used in reports:
- **Critical**: clearly hurts a Core Web Vital or ships large amounts of unnecessary JS/data on a hot path.
- **High**: measurable cost on a common route, or blocks a newer optimization (e.g. forces a whole route dynamic).
- **Medium**: real but localized cost, or a pattern that will degrade as the app grows.
- **Low**: hygiene, small wins, or legacy patterns that still work.

Raise or lower severity based on where the code lives (root layout and landing pages weigh more
than an admin settings page) and how often it runs.

## Contents
1. Server/Client boundaries (RSC)
2. Data fetching
3. Caching and rendering mode
4. Streaming and Suspense
5. Bundle size and code splitting
6. Images
7. Fonts
8. Third-party scripts
9. Interactivity (INP) and client runtime
10. Hydration
11. Navigation
12. Proxy (middleware) and runtimes
13. Metadata
14. Config and build
15. Pages Router specifics
16. Measurement

---

## 1. Server/Client boundaries (RSC)

**RSC-01 Client boundary placed too high** (High)
Spot: `'use client'` at the top of a `page.tsx`, `layout.tsx`, or a large section component where only a button, toggle, or form field actually needs state or handlers.
Fix: keep the page/section as a Server Component and extract only the interactive leaf into its own `'use client'` file. Pass Server Components into client wrappers through `children` or other JSX props.

**RSC-02 Heavy library inside a Client Component** (Critical if on first load)
Spot: client files importing charting (recharts, chart.js), editors (tiptap, quill, monaco), maps, markdown/MDX renderers, syntax highlighters (prismjs, shiki), `moment`, full `lodash`, PDF libs, date-heavy libs.
Fix: if the output is static for the request, render it in a Server Component (the library never ships). If it must be interactive, lazy load it with `next/dynamic` or `import()` on interaction.

**RSC-03 Initial data fetched in `useEffect`** (High)
Spot: `useEffect(() => { fetch(...).then(setState) }, [])` for data needed on first render.
Fix: fetch in a Server Component. If a Client Component needs it, pass the data as props, or pass the unresolved promise and read it with React's `use()` inside a `<Suspense>` boundary so streaming still works. Keep SWR/TanStack Query for client-driven refetching, polling, and mutations.

**RSC-04 Server Component calling its own Route Handler** (Medium)
Spot: `await fetch('/api/...')` or `fetch(`${process.env.URL}/api/...`)` inside a Server Component or Server Action.
Fix: call the underlying data function directly. The HTTP hop adds latency, and relative URLs do not work on the server.

**RSC-05 Oversized props crossing the boundary** (Medium)
Spot: whole DB rows, full CMS documents, or large arrays passed from a Server Component to a Client Component when the client uses a few fields.
Fix: select only the fields the client needs. Everything passed is serialized into the RSC payload and inlined in the HTML.

**RSC-06 Refetching on the client what the server already had** (Medium)
Spot: Server Component passes `initialData`, client immediately refetches the same resource on mount.
Fix: seed the client cache with the server data (e.g. `initialData` / hydration boundary) and only refetch on real staleness.

## 2. Data fetching

**DATA-01 Sequential awaits of independent work (waterfall)** (High)
Spot: `const a = await x(); const b = await y();` where `y` does not depend on `a`. Also parent awaiting data, then child awaiting more data, when the child's request did not need the parent's result.
Fix: start requests together with `Promise.all` / `Promise.allSettled`, or kick them off early and await later. When sections have different speeds, give each its own async component and `<Suspense>` so the fast one is not held by the slow one.

**DATA-02 Same data fetched repeatedly in one request** (Medium)
Spot: `getUser()` / DB query called in layout, page, and `generateMetadata` for the same id.
Fix: wrap non-`fetch` data functions in `React.cache` for per-request deduplication. For cross-request reuse, see CACHE rules.

**DATA-03 Slow non-critical data awaited at the top of the page** (High)
Spot: page component awaits recommendations/reviews/analytics before returning any JSX.
Fix: move that await into a child async component wrapped in `<Suspense>`, so the shell and critical content stream immediately.

**DATA-04 Post-response work on the critical path** (Medium) **[v15+]**
Spot: logging, analytics writes, cache warming, emails awaited before returning from a page, Server Action, or Route Handler.
Fix: use `after()` from `next/server` to run it once the response is sent.

**DATA-05 N+1 queries** (High)
Spot: awaiting a query inside `.map` or a loop, or per-item components each querying the DB.
Fix: batch (`WHERE id IN (...)`, ORM `with`/`include` relations, a DataLoader-style batcher), or a single joined query.

## 3. Caching and rendering mode

First determine which caching model the project uses:
- **Cache Components mode** [v16]: `cacheComponents: true` in `next.config`. Rendering is Partial Prerendering by default. Data is dynamic unless marked with `"use cache"`; `cacheLife` and `cacheTag` control lifetime and invalidation.
- **Legacy model**: route segment config (`export const revalidate`, `export const dynamic`, `fetchCache`), `fetch(..., { next: { revalidate, tags } })`, `unstable_cache`. Still supported in 16 when `cacheComponents` is off.

**CACHE-01 Cache Components not enabled on a new or upgradeable v16 app** (Medium) **[v16]**
Spot: Next 16, App Router, no `cacheComponents: true`, pages mixing static and dynamic content.
Fix: suggest enabling Cache Components. It gives a prerendered static shell per route with dynamic holes streamed in (what the 2025 guide called PPR). On 16.3+, pair it with `partialPrefetching: true` to get **Instant Navigations** (see NAV-04). Next.js has said these behaviors will become the default in a future major ("dynamic by default, no implicit caching"), so adopting now is also upgrade preparation. Flag as a migration, not a quick fix; the official migration guide is "Migrating to Cache Components". Known 16.3 caveats: Partial Prefetching does not work with static exports.

**CACHE-02 Uncached dynamic data outside a Suspense boundary** (High) **[v16 + cacheComponents]**
Spot: an async component reads uncached data or request APIs (`cookies()`, `headers()`, `searchParams`, `connection()`) with no `<Suspense>` above it and no `"use cache"`.
Fix: either wrap in `<Suspense>` with a size-matched fallback (dynamic hole), or add `"use cache"` to the data function/component with an appropriate `cacheLife` profile. Next reports this at build or dev time; treat it as a design decision about what belongs in the shell.

**CACHE-03 Whole route forced dynamic** (High)
Spot: `export const dynamic = 'force-dynamic'`; `cookies()`/`headers()` read in a root or shared layout; auth check at the top of a layout that wraps mostly public content.
Fix: read request data as deep as possible, inside a Suspense boundary, in the component that needs it. Keep auth for public-heavy layouts in proxy or in the specific protected segments. In Cache Components mode, remove `dynamic` segment config (not supported) and structure with Suspense instead.

**CACHE-04 Legacy segment config in Cache Components mode** (Medium) **[v16]**
Spot: `export const revalidate`, `export const dynamic`, `export const fetchCache`, `experimental_ppr` in a project with `cacheComponents: true`.
Fix: replace with `"use cache"` + `cacheLife('hours' | 'days' | custom)`; tag with `cacheTag` and invalidate with `revalidateTag`/`updateTag`.

**CACHE-05 `unstable_cache` usage** (Low) **[v16]**
Fix: migrate to a `"use cache"` function with `cacheTag`/`cacheLife`.

**CACHE-06 Code assumes `fetch` is cached** (High) **[v15+]**
Spot: `fetch()` in Server Components with no cache options, on a project upgraded from 14, relying on old default caching. Since 15, `fetch` and GET Route Handlers are not cached by default.
Fix: decide explicitly: `"use cache"` (Cache Components), or `{ cache: 'force-cache' }` / `{ next: { revalidate: N, tags: [...] } }` (legacy model).

**CACHE-07 Invalidation APIs** (Low) **[v16]**
Spot: single-argument `revalidateTag('x')`.
Fix: `revalidateTag('x', 'max')` (stale-while-revalidate) for background refresh; `updateTag('x')` inside Server Actions when the user must see their own write immediately; `refresh()` to refresh uncached data.

**CACHE-08 Synchronous request APIs** (Critical, it breaks builds) **[v15+ deprecated, v16 removed]**
Spot: `cookies().get`, `headers().get`, `params.slug`, `searchParams.q` without `await`; `draftMode()` sync.
Fix: `const { slug } = await params;` and `(await cookies()).get(...)`. In Client Components use `use(params)`. Not a pure perf issue but blocks upgrading, so report it first when present.

**CACHE-09 Static routes that could be static but are not** (Medium)
Spot: dynamic route segments with no `generateStaticParams` serving content that is identical for all users (blog, docs, product pages).
Fix: add `generateStaticParams` for the popular or full set, and let the rest generate on demand.

## 4. Streaming and Suspense

**STR-01 Slow segment with no loading state** (Medium)
Spot: dynamic route folder with slow data and no `loading.tsx` or Suspense boundaries.
Fix: add `loading.tsx` (also makes client navigations feel instant because the loading UI is prefetched) or targeted `<Suspense>` boundaries.

**STR-02 LCP content inside a Suspense boundary** (High)
Spot: hero heading/image or main product info rendered by a component that suspends on slow data.
Fix: keep LCP content in the static shell or fetch its data first and fast. Stream secondary content (reviews, related items).

**STR-03 Fallbacks that do not match final size** (Medium, CLS)
Spot: spinners or tiny skeletons replaced by tall content.
Fix: skeletons with the same dimensions as the resolved UI; reserve space with `min-height` or aspect ratio.

**STR-04 One giant boundary** (Low)
Spot: a single Suspense around the entire page body.
Fix: separate independent sections into their own boundaries so each streams when ready.

## 5. Bundle size and code splitting

**BND-01 Whole-library imports** (High on client, Low on server)
Spot: `import _ from 'lodash'`, `import moment from 'moment'`, `import * as Icons from '...'`, default imports of large utility libs in client code.
Fix: named imports from ESM packages (`lodash-es`, or native JS), `date-fns`/`dayjs`/`Intl` instead of `moment`. Many popular packages (lucide-react, date-fns, lodash-es, @mui/*, react-icons, etc.) are already optimized automatically; add others to `experimental.optimizePackageImports`.

**BND-02 Internal barrel files in client code** (Medium)
Spot: `components/index.ts` re-exporting dozens of modules, imported from `'use client'` files.
Fix: import from the specific module path, or list the internal package in `optimizePackageImports` (useful for monorepo UI packages).

**BND-03 Conditional heavy UI imported statically** (High)
Spot: modals, drawers, editors, maps, charts, emoji pickers, command palettes, rendered only after interaction or on some tabs, imported at the top of a client file.
Fix: `next/dynamic(() => import('./X'))` with a size-matched `loading` fallback, or `await import()` inside the handler. Warm it on intent (hover/focus) if the delay is noticeable.

**BND-04 Misused `next/dynamic`** (Medium)
Spot: dynamic import of above-the-fold or tiny components (adds a request and CLS); `ssr: false` inside a Server Component (error since 15).
Fix: import statically; for client-only components, call `next/dynamic` with `ssr: false` from a `'use client'` file.

**BND-05 Duplicate or overlapping dependencies** (Medium)
Spot: two date libs, two animation libs, two icon sets, two data-fetching libs in `package.json`.
Fix: consolidate. Check size with bundlephobia/pkg-size before adding libraries.

**BND-06 Heavy animation library for simple effects** (Medium)
Spot: `framer-motion`/`motion` used for fades, hovers, simple enter transitions.
Fix: CSS transitions/animations, React's `<ViewTransition>` (stable since React 19.3, Sep 2026; uses the browser View Transition API with no JS animation library, and the Next.js App Router already bundles a React canary that includes it), or `motion`'s reduced bundle (`LazyMotion` + `m`).

## 6. Images

**IMG-01 Raw `<img>` for content images** (High if LCP or many images)
Fix: `next/image`, or if cost/hosting is a concern, a custom `loader` pointing to an image CDN. A raw `<img>` is acceptable for SVG icons and when the user deliberately handles `srcset`, `width/height`, `loading`, `fetchpriority` themselves.

**IMG-02 LCP image not prioritized** (Critical)
Fix **[v16]**: the `priority` prop is deprecated. The docs recommend `loading="eager"` or `fetchPriority="high"` in most cases, and `preload` only when a single known image is the LCP on every viewport (do not combine `preload` with `loading`/`fetchPriority`). **[≤v15]**: `priority`.
Treat leftover `priority` on a v16 hero as High, not Low: at least one real project found it emitted no preload and no fetchpriority on 16, so verify in the built HTML.

**IMG-03 Too many prioritized images** (Medium)
Spot: `priority`/`preload` on images inside lists, carousels, or below the fold.
Fix: prioritize only the LCP candidate per viewport (at most one or two).

**IMG-04 Missing or wrong `sizes`** (High)
Spot: `fill` without `sizes`; responsive layouts where `sizes` is absent so the browser assumes `100vw`.
Fix: set `sizes` to the actual rendered width at each breakpoint, e.g. `sizes="(max-width: 768px) 100vw, 33vw"`.

**IMG-05 Missing dimensions** (High, CLS)
Spot: remote `src` without `width`/`height` and without `fill`.
Fix: provide dimensions, statically import local images, or use `fill` in a sized parent.

**IMG-06 AVIF not enabled** (Low)
Spot: `images.formats` missing. Default is WebP only.
Fix: `images: { formats: ['image/avif', 'image/webp'] }` when first-request encode time and cache storage are acceptable, **and only on a patched version** (see IMG-11).

**IMG-11 AVIF enabled on a vulnerable version** (Critical, security)
August 2026: a libheif flaw reached through sharp allowed unauthenticated RCE via the image optimizer when AVIF is involved (GHSA-2xp9-vwfh-vxw4). 16.3.3 / 15.5.24 disabled AVIF optimization; 16.3.4 / 15.5.25 re-enabled it with sharp ≥ 0.35.4 (16.3) or a libheif version guard (15.5).
Spot: `image/avif` in `images.formats` with `next` below 16.3.4 (16.x) or 15.5.25 (15.x).
Fix: upgrade to the latest patch (16.3.6 / 15.5.26 as of 22 Sep 2026) before recommending AVIF.

**IMG-07 `quality` not allowed by config** (Medium) **[v16]**
Spot: `quality={80}` etc. without `images.qualities` including that value. In 16 the default allowed list is `[75]` and other values are coerced to the nearest allowed one, so the intended quality silently does not apply.
Fix: `images: { qualities: [60, 75, 90] }` listing every value in use.

**IMG-08 Deprecated image config** (Low) **[v16]**
Spot: `images.domains`; local `src` with query strings and no `images.localPatterns`.
Fix: `remotePatterns`; add `localPatterns` with `search` when needed.

**IMG-09 Short optimizer cache for stable assets** (Low)
Spot: explicit low `minimumCacheTTL`. In 16 the default is 4 hours (was 60 seconds).
Fix: raise for rarely-changing remote images to cut re-optimization cost.

**IMG-10 Blur placeholders on remote images without data** (Low)
Spot: `placeholder="blur"` on a remote `src` without `blurDataURL`.
Fix: provide `blurDataURL` (tiny base64 or CMS-provided LQIP), or use `placeholder="empty"`.

Note: `loading="lazy"` is already the default on `next/image`; setting it is redundant, not wrong.

## 7. Fonts

**FONT-01 Fonts loaded from external CSS** (High)
Spot: `<link href="https://fonts.googleapis.com/...">`, `@import url(...)` in CSS, font files from third-party CDNs.
Fix: `next/font/google` or `next/font/local`. It self-hosts at build time, preloads, and applies fallback metric adjustments to limit CLS.

**FONT-02 Same font instantiated in several files** (Medium)
Spot: `Inter({...})` called in more than one module. Each call is hosted as a separate instance.
Fix: define fonts once in a shared module (e.g. `app/fonts.ts`), export, and apply via `className` or CSS variable (fits Tailwind v4 `@theme` with `--font-*`).

**FONT-03 Unneeded weights, styles, or subsets** (Medium)
Fix: prefer variable fonts; request only the weights and subsets used; set `preload: false` for fonts not used above the fold.

## 8. Third-party scripts

**SCR-01 Raw `<script>` tags for third parties** (High)
Fix: `next/script` with the right `strategy`. `@next/third-parties` provides `GoogleTagManager`, `GoogleAnalytics`, `YouTubeEmbed`, `GoogleMapsEmbed` (package is still labeled experimental).

**SCR-02 Wrong strategy** (Medium)
Spot: chat widgets, social embeds, ads, heatmaps on `afterInteractive`.
Fix: `lazyOnload`, or load on interaction / when scrolled into view (facade pattern: render a static preview, load the real widget on click).

**SCR-03 `beforeInteractive` misuse** (Medium)
Spot: many `beforeInteractive` scripts, or placed outside the root layout (App Router) / `_document` (Pages Router); `onLoad` attached to a `beforeInteractive` script (it does not fire there).
Fix: reserve for truly critical scripts (bot detection, consent managers that must run first). Event callbacks require a Client Component.

**SCR-04 `strategy="worker"` in App Router** (Low)
It relies on Partytown, is experimental, and is not supported in the App Router. Replace with `lazyOnload` or a facade.

**SCR-05 Eager heavy iframes** (High)
Spot: YouTube/Vimeo/Maps iframes above or below the fold without lazy loading.
Fix: `loading="lazy"` on iframes, `YouTubeEmbed` (lite-youtube facade), or a click-to-load thumbnail.

## 9. Interactivity (INP) and client runtime

INP measures the time from a user interaction until the next frame is painted, covering input delay, handler processing time, and presentation delay, across all interactions in the page's lifetime (the page's worst-ish interaction is reported). Good is 200 ms or less at p75.

**INP-01 React Compiler not enabled** (Medium) **[v16]**
(16.3 adds an experimental Rust port that runs inside Turbopack, `experimental.turbopackRustReactCompiler: true`, which removes most of the Babel build-time cost; gains are smaller if Babel is still used for other transforms.)
Spot: no `reactCompiler: true` in `next.config`; codebase full of hand-written `useMemo`/`useCallback`/`React.memo`, or re-render issues from unstable props.
Fix: enable `reactCompiler: true` (stable support in 16; requires `babel-plugin-react-compiler`, which adds some build time since it runs through Babel). It memoizes automatically, so manual memoization becomes mostly unnecessary. Do not recommend wrapping everything in `useCallback` as the 2025-era advice did.

**INP-02 Expensive work in handlers or render** (High)
Spot: filtering/sorting large arrays on every keystroke, synchronous JSON parsing of big payloads, heavy computations inside `onChange`/`onClick`.
Fix: `useDeferredValue` or `startTransition` for non-urgent updates; move heavy computation to a Web Worker; break long tasks and yield (`scheduler.yield()` where supported, fall back to `setTimeout`); precompute on the server.

**INP-03 Wide re-renders from context or root state** (High)
Spot: one context holding frequently changing values (form state, mouse position, timers) provided at the root; global stores selected without selectors.
Fix: split contexts by update frequency, colocate state near where it is used, use selector-based stores (Zustand/Jotai), pass Server Components as `children` so they are not re-rendered.

**INP-04 Large unvirtualized lists** (High)
Spot: mapping hundreds or thousands of rows/cards.
Fix: virtualize (`@tanstack/react-virtual`), paginate, or use CSS `content-visibility: auto` with `contain-intrinsic-size` for long static content.

**INP-05 Unthrottled scroll/resize/pointer handlers** (Medium)
Fix: `IntersectionObserver`/`ResizeObserver` instead of scroll math; passive listeners; throttle with `requestAnimationFrame`.

**INP-06 Hidden-but-mounted heavy UI** (Medium)
Spot: all tabs or panels rendered and kept updating, hidden with CSS.
Fix: mount lazily, or use React 19.2 `<Activity mode="hidden">` to keep state while deprioritizing and unmounting effects of hidden UI.

**INP-07 Runtime CSS-in-JS in App Router** (Medium)
Spot: `styled-components`, `@emotion/styled` in App Router client components.
Fix: prefer zero-runtime styling (Tailwind CSS, CSS Modules, vanilla-extract). If staying, use the SWC `compiler.styledComponents` option and a style registry with `useServerInsertedHTML`; do not use `.babelrc` + `babel-plugin-styled-components` (disables SWC).

**INP-08 Layout thrashing and DOM size** (Medium)
Spot: reading layout (`offsetHeight`, `getBoundingClientRect`) then writing styles in loops; very deep/large DOM.
Fix: batch reads and writes; simplify markup; animate `transform`/`opacity` only.

## 10. Hydration

**HYD-01 Hydration mismatch sources** (High)
Spot: `Date.now()`, `new Date().toLocaleString()`, `Math.random()`, `typeof window !== 'undefined'` branches, `localStorage` reads during render.
Fix: render time-sensitive or client-only values after mount via `useSyncExternalStore`, a client-only component (`next/dynamic` with `ssr: false` from a client file), or `suppressHydrationWarning` for simple text like timestamps. A mismatch makes React re-render that tree on the client.

**HYD-02 `isMounted` pattern for whole sections** (Medium)
Spot: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])` gating large content.
Fix: it causes a second render and often CLS. Scope it to the smallest element, or use the options in HYD-01.

## 11. Navigation

**NAV-01 `<a>` for internal routes** (Medium)
Fix: `next/link` for prefetching and client navigation. Use `next/form` (`<Form>`) for search-style GET forms to get prefetching and client navigation.

**NAV-02 Prefetch disabled broadly** (Low)
Spot: `prefetch={false}` on most links.
Fix: keep default prefetching for likely next routes; disable only for huge link lists where it creates excessive requests.

**NAV-03 `router.push` into slow dynamic routes without loading UI** (Medium)
Fix: add `loading.tsx` so the transition shows immediate feedback. On 16.3 with Cache Components, prefer Suspense or `"use cache"` inside the route so Next can extract the loading shell (NAV-04).

**NAV-04 Partial Prefetching not adopted** (Medium) **[v16.3+ with cacheComponents]**
Spot: `cacheComponents: true` without `partialPrefetching: true`; or `<Link prefetch={true}>` used widely in that setup. With Cache Components, `prefetch={true}` without Partial Prefetching is a legacy full prefetch that pulls dynamic data too, which is slower and more expensive.
Fix: enable `partialPrefetching: true` so each route prefetches one reusable App Shell shared by every link to it; keep `prefetch={true}` only on links that should also resolve URL-specific cached content. Move static content above dynamic boundaries so the shell has something to show. Validate with the Instant Insights and Navigation Inspector devtools, and lock it in with the `instant()` helper from `@next/playwright`.

## 12. Proxy (middleware) and runtimes

**RT-01 `middleware.ts` on v16** (Low) **[v16]**
It is deprecated in favor of `proxy.ts` (export `proxy`), which runs on the Node.js runtime. Rename with the codemod.

**RT-02 Heavy or broad proxy/middleware** (High)
Spot: DB calls, large imports, or fetches in middleware/proxy; `matcher` missing or matching static assets and `_next`.
Fix: narrow `matcher`; keep proxy to redirects, rewrites, header and cookie checks; do full auth checks near the data (Server Components, Server Actions, Route Handlers).

**RT-03 `runtime = 'edge'`** (High on 16.3+, Medium before)
Spot: `export const runtime = 'edge'` on routes that talk to a single-region database or need Node APIs.
Fix: move to Node.js. The edge runtime is deprecated as of Next.js 16.3, and Vercel's docs state that from 16.3 `runtime = 'edge'` is no longer supported on their platform (routes run on Node.js). Node also benefits from 16.3's native Node.js streams rendering (up to 22% more SSR throughput). Latency to the database usually dominates anyway, so colocate compute with data. `proxy.ts` is Node-only and Cache Components needs Node.

## 13. Metadata

**META-01 Duplicate fetches in `generateMetadata`** (Medium)
Fix: share a `React.cache`-wrapped (or `"use cache"`) fetcher between `generateMetadata` and the page. Since 15.2 metadata streams for regular browsers, but bots still wait for it, so slow metadata hurts SEO crawl time.

## 14. Config and build

**CFG-01 Old Next.js version** (Medium to High)
Spot: `next` < 15 in `package.json`; on 16.0 to 16.2, suggest 16.3 (no breaking changes: native Node.js streams for SSR, prefetch inlining that bundles small prefetches, Turbopack build cache, immutable static assets reusable across deploys). Also check the patch level: several critical security releases shipped Jul to Sep 2026 (latest 16.3.6 / 15.5.26 as of 22 Sep 2026).
Fix: summarize concrete wins from upgrading (React 19, async request APIs, Turbopack builds, Cache Components, React Compiler support, image defaults). Provide it as a migration item, not a one-line fix.

**CFG-02 Custom webpack config** (Low) **[v16]**
Turbopack is the default for `next dev` and `next build`. Custom `webpack()` config causes the build to fail unless you migrate the config or opt out with `--webpack`. Flag loaders that need Turbopack equivalents.

**CFG-03 `.babelrc` present** (Medium)
It disables SWC transforms and slows builds. Remove unless required; use `compiler` options in `next.config`.

**CFG-05 Deprecated experimental flags** (Low)
Spot: `experimental.useCache` (formally deprecated in 16.3), `experimental.ppr`, `experimental.dynamicIO`.
Fix: `cacheComponents: true`.

**CFG-04 Production source maps and debug flags** (Low)
Spot: `productionBrowserSourceMaps: true` without need.

## 15. Pages Router specifics

**PR-01 `getServerSideProps` for content that is the same for everyone** (High)
Fix: `getStaticProps` with `revalidate` (ISR) and `getStaticPaths` with `fallback: 'blocking'`.

**PR-02 In-memory caches in serverless functions** (Medium)
Spot: module-level `Map` used as cache with `setTimeout` expiry.
Fix: per-instance and unbounded; use an external KV/Redis or CDN caching headers (`s-maxage`, `stale-while-revalidate`).

**PR-03 Large page props** (High)
Spot: returning whole documents from data functions (all serialized into `__NEXT_DATA__`, Next warns over 128 kB).
Fix: trim fields; paginate.

**PR-04 Heavy imports in `_app`** (High)
Spot: global providers, UI kits, analytics SDKs imported in `_app` for every page.
Fix: move to the pages that need them, or lazy load.

**PR-05 No selective hydration** (Info)
Pages Router hydrates the whole page at once. For interaction-heavy pages, suggest incremental migration of those routes to the App Router.

## 16. Measurement (recommend, do not just assert)

- Navigation speed (16.3+): Instant Insights in Next.js DevTools flags non-instant navigations; Navigation Inspector pauses at the loading shell; `instant()` from `@next/playwright` guards against regressions.
- Field data first: CrUX / PageSpeed Insights, Vercel Speed Insights, or custom RUM via `useReportWebVitals` (`next/web-vitals`) or the `web-vitals` library's attribution build. Initialize client-side monitoring in `instrumentation-client.ts` (15.3+).
- Lab: Lighthouse (CLI or CI for consistency), WebPageTest for filmstrips and multi-location tests, Chrome DevTools Performance panel for INP attribution and long tasks.
- Bundles: `@next/bundle-analyzer` works with webpack builds (`next build --webpack` on 16). Next 16.1 added an experimental Turbopack analyzer (`next experimental-analyze`); verify availability for the installed version.
- Lighthouse weights (v10 to v13): TBT 30%, LCP 25%, CLS 25%, FCP 10%, Speed Index 10%. Lighthouse is a lab proxy; INP is only measurable in the field.
- Core Web Vitals "good" thresholds at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
