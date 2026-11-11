---
name: main-thread-performance
description: Browser main-thread budget discipline for animation, interaction and frontend performance work. Use this skill whenever the task touches animations, transitions, scroll or drag interactions, parallax, canvas or WebGL, real-time streams (WebSocket, SSE, polling), long lists and feeds, virtualization, image or video processing in the browser, or whenever the user mentions jank, stutter, lag, freezing, dropped frames, "feels slow", FPS, INP, TBT, LCP, CLS, Core Web Vitals, Lighthouse, or "optimize performance". Also use it before writing or reviewing any code that runs every frame, on every keystroke, on scroll, resize or mousemove, or on every socket message, even when the user never says the word "performance". When in doubt on any frontend task that produces motion or reacts to continuous input, load this skill.
---

# Main-Thread Performance

## The model

Almost everything you control in a browser runs on one thread. Your JavaScript, framework internals, event handlers, timer and network callbacks, style calculation, layout and paint all queue up on the main thread. It runs one task at a time and **nothing can interrupt a task that has already started**, including the rendering pipeline that produces the next frame.

At 60Hz a frame is 16.6ms. After the browser's own overhead the practical budget is around **10ms**, and on a 120Hz display it is half that. A single task over **50ms** is a long task: dropped frames, ignored clicks, laggy typing. INP and TBT are essentially measurements of how long the main thread was held.

So the question is never "is this code fast". It is **"how long does this code hold the main thread, and does it need to be on the main thread at all"**.

Frames only render *between* tasks. That single fact explains most of what follows.

## Classify before you write

Ask these in order and stop at the first yes.

**1. Can this work not happen at all?**
Drop stale items, merge updates where only the latest value matters, memoize repeated pure computation, lazy-load what is off screen, skip work for elements outside the viewport. Removing work beats optimizing it every time.

**2. Can it run off the main thread?**
Animation of position, size, rotation or fade becomes `transform` and `opacity`, which the compositor thread runs on its own and which keep moving even when the main thread is blocked. Pure computation with no DOM access goes to a Web Worker.

**3. It genuinely has to be on the main thread.**
Then shape it, using the four moves below.

| Move | Problem it solves | Tool |
|---|---|---|
| **Split** | One task runs too long | yield every N items or every ~5ms |
| **Batch** | Task runs too often | rAF coalescing, debounce, throttle |
| **Prioritize** | Urgent work stuck behind bulk work | priority queue, `startTransition` |
| **Defer** | Work that does not need to happen now | code splitting, `IntersectionObserver` |

Split and batch decide *size*. Prioritize and defer decide *timing*. Split is the foundation: without task boundaries there is nowhere for a frame or an input event to slip in.

## Hard rules

Apply these whether or not the user asked for performance. Flag the violation and write the correct version.

1. **Animate only `transform` and `opacity`.** Never animate `left`, `top`, `width`, `height`, `margin`, `padding` or `font-size` in a transition, keyframe or JS loop. Use `translate` instead of `left/top`, `scale` instead of `width/height`.
2. **Layout that genuinely changes uses FLIP**, not animated layout properties. One layout pass, then hand the motion to `transform`. See `references/compositor.md`.
3. **Never write `style.left = ...` inside a `requestAnimationFrame` loop.** Per-frame JS that touches layout properties is the worst case: main-thread work every frame that also invalidates layout.
4. **Group reads, then writes.** Reading `getBoundingClientRect`, `offsetWidth`, `scrollTop` right after a style write forces a synchronous layout. Inside a loop that is layout thrashing. Collect all reads, then apply all writes.
5. **Scroll, `touchmove`, `wheel` and `mousemove` handlers stay tiny and passive.** `{ passive: true }` unless you actually call `preventDefault`. Do no DOM writing in the handler itself: record the value, do the work in one `requestAnimationFrame`.
6. **Coalesce high-frequency updates to one per frame.** A socket at 1,000 msg/s must not trigger 1,000 renders. Accumulate into a buffer, flush once per rAF. Keep every data point, draw once.
7. **Debounce expensive derived work on input** (search, preview, parse, validation) at 150 to 300ms. Throttle continuous streams.
8. **Loops over hundreds of items that touch the DOM must yield.** Every ~20 items, or better, check `performance.now()` and yield when 5ms of the frame is gone.
9. **Anything over roughly 10ms of pure computation goes to a Worker** when it does not need the DOM. Transfer `ArrayBuffer` rather than copying it.
10. **Long lists are virtualized or lazily filled.** Hundreds of DOM nodes off screen still cost style and layout every time they are revalidated. `IntersectionObserver` with `rootMargin` is the predictable option.
11. **Stop off-screen work.** Carousels, tickers, marquees, canvas loops and video get paused when they leave the viewport or when `document.hidden` is true. Always clean up rAF loops, intervals and observers on unmount.
12. **Respect `prefers-reduced-motion`.** Every non-essential animation needs a reduced variant, in CSS or via `useReducedMotion`.
13. **`will-change` is targeted and temporary.** Applied to a handful of elements that are about to animate, not sprayed across a stylesheet. Each promoted layer costs memory.
14. **Never block the main thread on parsing.** `JSON.parse` of a multi-megabyte payload is atomic and cannot be split. Page it, stream it, or parse it in a Worker.

## Workflow for an optimization request

1. **Locate before optimizing.** Ask for or reason from concrete evidence: which interaction, which device, what the Performance panel shows. If nothing is available, add the long-task and LoAF observers from `references/diagnose.md` and say what to look for. Do not guess at random micro-optimizations.
2. **Name the cause in main-thread terms.** "This handler runs 200 times per second and each run writes to the DOM, so no frame can be produced between them" beats "this is inefficient".
3. **Apply the smallest fix from the ladder.** Eliminate, then move off-thread, then shape. Prefer one structural change over five micro-optimizations.
4. **State the cost.** Yielding adds total wall-clock time. Debouncing adds latency. Workers add serialization cost and complexity. Virtualization breaks in-page find and naive anchor links. Say the trade-off out loud rather than presenting a change as free.
5. **Verify.** Re-measure the same interaction, or give the user the exact steps and numbers to check (long tasks before/after, FPS under load, INP).

## Common fixes

| Symptom | Cause | Fix |
|---|---|---|
| Animation stutters when app is busy | Animating layout properties on the main thread | `transform`/`opacity`, or FLIP |
| Typing lags in a search or editor | Expensive work on every keystroke | Debounce, `useDeferredValue` |
| Page freezes on data burst | Rendering every message on arrival | Buffer, flush once per rAF |
| Scroll stutters | Non-passive or heavy scroll handler | `{ passive: true }` plus rAF |
| Tab return freezes for a second | Hundreds of off-screen nodes revalidating | `IntersectionObserver` lazy fill or virtualization |
| One interaction freezes everything | A single long synchronous task | Split with yielding, or move to a Worker |
| Steady FPS loss over time | rAF loops and listeners never cleaned up | Teardown on unmount, pause when hidden |
| First load slow, low TBT score | Everything shipped and executed up front | Code splitting, defer non-critical work |

## Reference files

Load the one that matches the task. Do not read all of them.

- `references/scheduling.md` : yielding, time-sliced loops, rAF coalescing, debounce/throttle, priority queues, `scheduler.yield`/`postTask`, idle-until-urgent. Read when the work has to stay on the main thread.
- `references/compositor.md` : which properties are composited, FLIP with the Web Animations API, layout thrashing, `will-change`, `content-visibility`, scroll-driven animations, View Transitions. Read for anything that moves on screen.
- `references/offload.md` : Web Workers, transferable objects, `OffscreenCanvas`, and the eliminate strategies (drop, merge, memoize). Read for heavy computation, image/video work or backpressure.
- `references/react-next.md` : React and Next.js specifics. `startTransition`, `useDeferredValue`, rAF-batched state, virtualization, effect cleanup, `next/dynamic`, RSC boundaries. Read on any React or Next.js codebase.
- `references/diagnose.md` : measuring. Long task and LoAF observers, `performance.measure`, INP/TBT targets, what to look for in a profile. Read before claiming something is or is not the bottleneck.

## Audit script

To sweep an existing codebase for the anti-patterns above:

```bash
node <skill-dir>/scripts/scan-main-thread-risks.mjs <dir>     # human readable
node <skill-dir>/scripts/scan-main-thread-risks.mjs <dir> --json
```

It is a heuristic grep, not a type-aware linter, so verify each hit before changing code. Treat the output as a list of places to look, ranked by severity.

## Source

Distilled from "The Browser's Main Thread Is Expensive" by Sunhyoup Lee (kciter.so), extended with framework-specific guidance.
