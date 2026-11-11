# Diagnosing main-thread problems

Contents: [Targets](#targets) · [Find the long tasks](#find-the-long-tasks) · [Attribute the cost](#attribute-the-cost) · [Measure your own code](#measure-your-own-code) · [Reading a profile](#reading-a-profile) · [Frame rate under load](#frame-rate-under-load) · [Reproducing](#reproducing) · [Reporting](#reporting)

Measure before changing anything. Most guesses about what is slow are wrong, and the fixes in this skill all have costs, so applying them blind makes code worse.

## Targets

| Metric | Good | Poor | Means |
|---|---|---|---|
| INP | ≤ 200ms | > 500ms | Time from interaction to next paint. Field metric |
| TBT | < 200ms | > 600ms | Blocked time during load. Lab proxy for INP |
| Long task | none | any > 50ms | A task that holds the thread |
| Frame budget | ~10ms of work | > 16.6ms | At 60Hz. Halve at 120Hz |
| LCP | ≤ 2.5s | > 4s | Largest contentful paint |
| CLS | ≤ 0.1 | > 0.25 | Layout shift, not main-thread but same audits |

Always test on a mid-range device or with CPU throttling at 4x or 6x in DevTools. A problem invisible on a development machine is routine on the hardware most users have.

## Find the long tasks

Drop this in during development to get a console list of everything that held the thread:

```ts
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn(`long task ${entry.duration.toFixed(1)}ms`, entry);
  }
}).observe({ type: 'longtask', buffered: true });
```

`longtask` tells you a task was long but not what was in it. Long Animation Frames (Chromium) attribute it:

```ts
new PerformanceObserver((list) => {
  for (const entry of list.getEntries() as any[]) {
    console.warn(`LoAF ${entry.duration.toFixed(1)}ms`, {
      blocking: entry.blockingDuration,
      styleAndLayout: entry.styleAndLayoutStart,
      scripts: entry.scripts?.map((s: any) => ({
        source: s.sourceURL,
        fn: s.sourceFunctionName,
        duration: s.duration,
      })),
    });
  }
}).observe({ type: 'long-animation-frame', buffered: true });
```

`entry.scripts` gives you file, function name and duration, which is usually enough to name the culprit without opening a profile. Feature-detect with `PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')`.

For INP in the field, use the `web-vitals` library's `onINP` with attribution rather than rolling your own.

## Attribute the cost

Once you have a candidate, decide which category it is in, because the fix follows from the category:

- **Script execution**: one function running too long. Split, memoize or move to a worker.
- **Style and layout**: large `styleAndLayout` durations, or "Recalculate Style" / "Layout" bars in the profile. Look for layout thrashing, animating layout properties, or a large DOM being revalidated (often on tab return).
- **Paint and raster**: large repaint areas, expensive shadows, blurs or filters. Reduce the painted area, avoid full-bleed effects, check for unnecessary layer count.
- **Many small tasks**: a handler firing per event or per message. Batch or debounce.
- **Load-time**: parse and execute of your own bundle plus third-party scripts. Code split and defer.

## Measure your own code

```ts
performance.mark('parse:start');
const result = parse(payload);
performance.mark('parse:end');
performance.measure('parse', 'parse:start', 'parse:end');
```

Measures show up as named bars in the DevTools performance timeline, which is far easier to read than hunting through anonymous frames. In React, the Profiler tab plus `<Profiler onRender>` covers render cost specifically.

For a quick before/after on a synchronous block, `performance.now()` deltas are enough. Run it several times: the first pass includes JIT warm-up and cold caches.

## Reading a profile

In the DevTools Performance panel, record the specific interaction, then:

1. Look at the **frames track** for red long-frame bars, and the **main track** for wide tasks. Anything wider than 50ms is the target.
2. Expand the wide task. The flame chart's widest bottom bar is where the time actually goes, not the deepest.
3. Check for **purple Layout / Recalculate Style bars repeating inside one task**. That is layout thrashing, and DevTools marks forced synchronous layout with a warning triangle.
4. Check whether the animation you care about appears on the main track at all. If it does, it is not composited, and that is the whole bug.
5. Use **Bottom-Up** filtered to the selected task range to find the single function responsible.

## Frame rate under load

Smoothness claims need a load test, since most jank only appears when something else is happening. Add artificial pressure while the animation runs:

```ts
// dev only: hold the main thread for ms
function block(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}
```

Run the animation, call `block(500)`, and watch. A composited animation keeps moving. A main-thread animation freezes. This is a two-second test that answers "did this actually move off the main thread" more reliably than reading the code.

DevTools also has a **Rendering** panel with "Frame Rendering Stats", "Paint flashing" (shows repaint areas) and "Layer borders" (shows what is composited).

## Reproducing

State the exact repro before fixing: which interaction, which device or throttle level, what data volume, what was already running. Jank is load-dependent, so "scroll the feed after loading 500 items with 4x CPU throttle" is a bug report and "scrolling is slow" is not.

For real-time features, reproduce at realistic message rates. A socket at 5 msg/s hides every problem that appears at 500.

## Reporting

When presenting an optimization, give the numbers that changed: longest task before and after, frames dropped during the interaction, INP or the measured duration of the specific block. State the trade-off too, since none of these techniques is free. If the change is unmeasurable, say so rather than claiming an improvement.
