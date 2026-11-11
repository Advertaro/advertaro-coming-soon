# Audit of "The Expert Guide to Next.js Performance Optimization (2025)"

Source: Blazity ebook, published May 2025 (written against Next.js 15.x, React 19.0).
Audited against Next.js 16.3 / React 19.3, verified against official release notes and docs as of September 2026.

Use this file when code follows a pattern the guide taught that is now outdated, so the finding
can say what changed and why. Everything the guide covers that is not listed here is still valid
and is folded into `checklist.md`.

## Outdated or incorrect in the guide

| # | Guide section | What the guide says | What to do now |
|---|---|---|---|
| 1 | 4.2.1, 4.3, 8.1.1, 9.1.3 | Use the `priority` prop on the LCP image | `priority` is deprecated in Next 16. Docs recommend `loading="eager"` or `fetchPriority="high"` in most cases, `preload` only for a single known LCP image. Leftover `priority` has been reported to emit nothing on 16, so check built HTML. |
| 2 | 4.2.5 | Set any `quality` from 0 to 100 (e.g. `quality={80}`) | Since 16, only values listed in `images.qualities` are honored (default `[75]`). Add the values you use to config. |
| 3 | 4.3 | "Always include sizes when using `layout="fill"`" | `layout` is the legacy `next/legacy/image` API. The current prop is `fill`. |
| 4 | 4.x (implied) | Image optimizer defaults | 16 changed defaults: `minimumCacheTTL` 4 h (was 60 s), `imageSizes` no longer includes 16, `images.domains` deprecated for `remotePatterns`, local images with query strings need `localPatterns`. |
| 5 | 7.2.1.2 Dynamic Rendering | `const headersList = headers(); cookies().get(...)`, `params.slug` used synchronously | Request APIs are async since 15 and sync access was removed in 16: `await headers()`, `await cookies()`, `const { slug } = await params`. |
| 6 | 7.2.1.2 PPR | Partial Prerendering presented as a standalone pattern (experimental flag at the time) | PPR is now delivered through **Cache Components** (`cacheComponents: true`). Uncached/request data must sit inside `<Suspense>` or be cached with `"use cache"`; `cacheLife` / `cacheTag` replace most segment config. The `experimental.ppr` flag and `experimental_ppr` export are gone. |
| 7 | 7.2.1.2 Static/ISR/Dynamic | `export const revalidate = 60`, `export const dynamic = "force-dynamic"` as the primary tools | Still work in the legacy model, but are not supported with Cache Components. Preferred: `"use cache"` + `cacheLife('minutes'/'hours'/...)`, invalidate with `revalidateTag(tag, 'max')`, `updateTag` (read-your-writes in Server Actions), `refresh()`. `unstable_cache` is superseded by `"use cache"`. |
| 8 | 7.2.3 Runtimes | Edge runtime recommended for "lowest latency" dynamic content | Edge runtime is deprecated as of Next.js 16.3 (Vercel no longer supports `runtime = 'edge'` from 16.3). Use Node.js, which also gets 16.3's faster native-stream SSR. `middleware.ts` became `proxy.ts` in 16 and is Node-only. |
| 9 | 9.1.3 Code reviews (item 4) | Wrap functions passed as props in `useCallback`, memoize to avoid re-renders | Enable the **React Compiler** (`reactCompiler: true`, stable support in 16). It memoizes automatically; hand-written `useCallback`/`useMemo`/`React.memo` is mostly unnecessary and adds noise. |
| 10 | 8.1.3 CLS | Use `babel-plugin-styled-components` + `ServerStyleSheet` | That is Pages Router era and the Babel plugin disables SWC. In App Router prefer zero-runtime CSS (Tailwind, CSS Modules). If keeping styled-components, use `compiler.styledComponents` + a registry with `useServerInsertedHTML`. |
| 11 | 8.1.2 INP definition | "Delay between interaction and the time the browser can begin processing event handlers" | That is the definition of FID. INP measures interaction to next paint: input delay + processing + presentation delay, across the whole page visit. Good ≤ 200 ms. |
| 12 | 8.1.4 TBT | "Service workers where you could offload heavy computations" | Should be **Web Workers**. Service workers handle network/caching, not computation. |
| 13 | 5.2.5 third-parties | Components "can be configured to use web workers" | The `worker` strategy (Partytown) is experimental and not supported in the App Router. Use `lazyOnload` or facades. |
| 14 | 5.2.1 / 5.2.4 Scripts | `beforeInteractive` shown in `_document` with `onLoad` callback | In App Router, `beforeInteractive` belongs in the root layout. `onLoad` does not fire for `beforeInteractive`; callbacks need a Client Component. |
| 15 | 8.1.1 / 8.1.3 | Add `<link rel="preload">` / preconnect manually | In App Router use React 19's `preload()`, `preconnect()`, `prefetchDNS()` from `react-dom`, which dedupe and hoist correctly. |
| 16 | 7.2.1.1 Server Components example | `await fetch('/api/posts/${id}')` inside a Server Component | Relative URLs fail on the server and the extra HTTP hop costs latency. Call the data layer directly. |
| 17 | 7.2.1.1 Client Components | `isHydrated` state set in `useEffect` to switch fallback to content | Causes a second render and often CLS. Use `useSyncExternalStore`, a client-only dynamic component, or `suppressHydrationWarning` for small text. |
| 18 | 2.2.3 | Disable code splitting "by modifying the webpack configuration" | Turbopack is the default bundler for dev and build in 16; custom webpack config fails the build unless migrated or run with `--webpack`. |
| 19 | 3.1 | Hydration errors are minified and "easy to miss" | React 19 reports hydration mismatches with a diff in development. Still important; just easier to find. |
| 21 | 4.2.3 | "AVIF has to be enabled explicitly" (implied: turn it on for smaller files) | Still opt-in, but only enable it on a patched release. An Aug 2026 libheif/sharp flaw allowed RCE via AVIF optimization; fixed and re-enabled in 16.3.4 / 15.5.25. Run the latest patch. |
| 22 | 2.2.3, 5.x | Prefetching is automatic; `prefetch` is all or nothing | 16.3 adds Partial Prefetching (`partialPrefetching: true`, with Cache Components): one reusable App Shell per route. `<Link prefetch={true}>` without it is a legacy full prefetch. |
| 20 | 10.2.5 | `useReportWebVitals` as the way to collect metrics | Still valid; `instrumentation-client.ts` (15.3+) is now the recommended place to initialize client analytics/monitoring before hydration. |

## Missing from the guide (added in checklist.md)

- `after()` for post-response work.
- `React.use()` with promises passed from Server to Client Components for streaming.
- `optimizePackageImports` (automatic for many popular libraries) and barrel-file costs.
- React 19.2 `<Activity>` for hidden UI; `useEffectEvent`.
- Streaming metadata (15.2+) and its effect on bots.
- `next/form` for prefetching search-style navigations.
- Proxy `matcher` scoping.
- Bundle analysis on Turbopack builds.
- N+1 query detection and RSC payload size.
- 16.3 Instant Navigations tooling: Instant Insights, Navigation Inspector, `@next/playwright` `instant()`.
- React 19.3 stable `<ViewTransition>` as a replacement for JS animation libraries on route/state transitions.
- Experimental Rust React Compiler (`experimental.turbopackRustReactCompiler`).

## Still valid (no change needed)

Route-based automatic code splitting; `next/dynamic` for heavy conditional UI; streaming with
Suspense and selective hydration; parallel fetching and waterfall avoidance; `React.cache`
request dedup; `next/image` `sizes`, dimensions, AVIF opt-in (WebP remains the default),
default quality 75; `next/font` self-hosting and variable fonts; `next/script` strategies;
Lighthouse weights (TBT 30, LCP 25, CLS 25, FCP 10, SI 10); performance budgets; library
evaluation (bundlephobia, native alternatives, tree-shakable ESM); Pages Router
SSG/ISR/SSR guidance for Pages apps; measurement toolset (Lighthouse, WebPageTest, PSI/CrUX,
Vercel Speed Insights, RUM).

## Confidence notes

Verified by web search in September 2026 against nextjs.org release posts (16.2, 16.3, the
Jul/Aug/Sep 2026 security releases), the next/image API reference, Vercel's Edge Runtime docs,
and the React 19.3 release post. Still unverified: the exact name of the experimental Turbopack
bundle analyzer command.
