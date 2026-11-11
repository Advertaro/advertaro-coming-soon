# React and Next.js specifics

Contents: [Per-frame values never live in state](#per-frame-values-never-live-in-state) · [Transitions and deferred values](#transitions-and-deferred-values) · [High-frequency external data](#high-frequency-external-data) · [Long lists](#long-lists) · [Effect cleanup](#effect-cleanup) · [Animation libraries](#animation-libraries) · [Next.js](#nextjs) · [Memoization](#memoization)

React's scheduler already implements much of the general advice: it yields via `MessageChannel` and orders work with a priority queue. Use its primitives rather than rebuilding them, and keep the things React cannot see (raw event handlers, rAF loops, sockets) disciplined yourself.

## Per-frame values never live in state

A `setState` per frame means a full render, reconciliation and commit per frame, for a value that only needs to reach one style property. Write to a ref and mutate the style directly, or use a library's motion value.

```tsx
// Bad: renders the subtree 60 times a second
const [y, setY] = useState(0);
useEffect(() => {
  const onScroll = () => setY(window.scrollY);
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);
return <div style={{ transform: `translateY(${y * 0.3}px)` }} />;
```

```tsx
// Good: no renders, one composited property, one write per frame
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
return <div ref={ref} />;
```

The same applies to drag, cursor-following effects, mouse parallax, audio visualizers and progress readouts driven by rAF. State is for values the UI structure depends on. Per-frame numbers are not that.

## Transitions and deferred values

`useDeferredValue` keeps the input responsive while an expensive derived view lags behind by a render:

```tsx
const [query, setQuery] = useState('');
const deferred = useDeferredValue(query);          // React 19 accepts an initial value too
const results = useMemo(() => search(deferred), [deferred]);

return (
  <>
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    <div style={{ opacity: query !== deferred ? 0.6 : 1 }}>
      <Results items={results} />
    </div>
  </>
);
```

`startTransition` / `useTransition` marks an update as interruptible, so urgent updates (typing, clicking) can cut in front of it. Use it for tab switches, filter application, route-level state changes and anything that rerenders a large tree.

Neither one makes the work smaller. They change its priority and let React interrupt it. If a single synchronous computation takes 200ms, a transition will not save you: shrink the computation, memoize it, or move it to a worker.

For anything genuinely expensive and DOM-free, the worker still wins. `useSyncExternalStore` or a simple `useState` set from the worker's `onmessage` is the bridge.

## High-frequency external data

Do not call `setState` per socket message. Buffer outside React and flush once per frame.

```tsx
function useStreamedRows(socket: Socket) {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    const pending = new Map<string, Row>();      // merge: last write per id wins
    let scheduled = false;

    const flush = () => {
      setRows((prev) => merge(prev, pending));   // one render per frame, at most
      pending.clear();
      scheduled = false;
    };

    const onMsg = (row: Row) => {
      pending.set(row.id, row);
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(flush);
    };

    socket.on('row', onMsg);
    return () => { socket.off('row', onMsg); };
  }, [socket]);
  return rows;
}
```

If the panel is off screen or the tab is hidden, skip the flush entirely and let the merge map absorb the updates.

## Long lists

Past a few hundred rows, virtualize. `@tanstack/react-virtual` is the usual choice and works with dynamic heights. The alternative for card feeds is the `IntersectionObserver` shell pattern from `scheduling.md`, which keeps real DOM for what is near the viewport and empty spacers elsewhere.

Watch for: stable `key`s (index keys force remounts on reorder), row components wrapped in `memo`, no inline object or arrow props into rows, and `contain: layout paint` on the row container. Also confirm that in-page search, deep links to items and print views still behave, since virtualization breaks all three by default.

## Effect cleanup

Every rAF loop, `setInterval`, observer, socket subscription and event listener returns a teardown. Missing cleanup is the standard cause of "it gets slower the longer I use it", and in development Strict Mode double-invokes effects, so a missing cleanup means two loops immediately.

```tsx
useEffect(() => {
  let raf = 0;
  const loop = () => { draw(); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}, []);
```

Pause when hidden as well as when unmounted:

```tsx
useEffect(() => {
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  return () => document.removeEventListener('visibilitychange', onVis);
}, []);
```

## Animation libraries

Motion (Framer Motion) layout animations are FLIP underneath, so prefer `layout` and `<AnimatePresence>` over hand-rolled measurement. `MotionValue` and `useMotionValue`/`useTransform` keep values out of React's render cycle, which is exactly the ref pattern above with better ergonomics. `useReducedMotion()` covers the accessibility rule.

GSAP is fine and fast, but the same property rules apply: animate `x`/`y`/`scale` (which compile to `transform`), not `left`/`width`. ScrollTrigger already batches to rAF; do not add your own scroll listener next to it.

For simple state-driven motion, a CSS transition on `transform`/`opacity` triggered by a class or data attribute costs nothing on the main thread and needs no library at all. Reach for a library when you need orchestration, interruption or layout animation, not for a fade.

## Next.js

- `next/dynamic` with `ssr: false` for heavy client-only widgets: editors, charts, maps, video players, canvas scenes. Everything imported at the top of a `'use client'` file parses and executes during hydration.
- Push `'use client'` as deep as possible. Every client component's JavaScript is shipped, parsed and hydrated on the main thread. A page that is mostly server components has far less to execute up front, which is a direct TBT and INP win.
- Third-party scripts go through `next/script` with `strategy="lazyOnload"` or `afterInteractive`. Analytics, chat widgets and tag managers are a common main-thread tax that nobody profiles.
- `next/image` and `next/font` are mostly about layout shift, but they also keep the main thread out of image decode and font swap work.
- Check bundle composition with `@next/bundle-analyzer` before assuming the problem is your own code. A date library, an icon set imported wholesale or a moment-style locale bundle often dominates parse time.

## Memoization

`memo`, `useMemo` and `useCallback` are not free: each adds comparison and allocation. Apply them where a profile shows a real cost, typically expensive derived computation and stable props into large memoized subtrees. Blanket memoization adds noise and occasionally slows things down.

If the project uses the React Compiler, much of this is handled automatically and hand-written memoization should be removed rather than layered on top. Check `babel-plugin-react-compiler` or the `experimental.reactCompiler` flag before adding any.
