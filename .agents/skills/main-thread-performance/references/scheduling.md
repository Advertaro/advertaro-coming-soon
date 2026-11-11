# Scheduling on the main thread

Contents: [Yielding](#yielding) · [Time-sliced loops](#time-sliced-loops) · [Batching](#batching) · [Debounce and throttle](#debounce-and-throttle) · [Priority queues](#priority-queues) · [Deferring](#deferring) · [Picking a tool](#picking-a-tool)

The rendering pipeline can only run between tasks. Every technique here exists to create or shape those gaps.

## Yielding

Yielding does not make work faster. Total wall-clock time goes up slightly. What it buys is task boundaries, so queued input and frame production get a turn. That is what the user perceives as speed.

```ts
// Draw a burst of items without holding the thread in one piece
async function renderBurst(items: Item[]): Promise<void> {
  let count = 0;
  for (const item of items) {
    appendNode(item);
    if (++count % 20 === 0) await yieldToMain();
  }
}
```

```ts
// Best available yield, in order of preference
export function yieldToMain(): Promise<void> {
  const s = (globalThis as any).scheduler;
  if (s?.yield) return s.yield();            // resumes ahead of other queued tasks
  return new Promise<void>((resolve) => {    // MessageChannel avoids setTimeout clamping
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => { port1.close(); resolve(); };
    port2.postMessage(null);
  });
}
```

Why not `setTimeout(resolve, 0)`: once `setTimeout` calls nest more than five levels deep the HTML spec clamps the delay to 4ms, which a yielding loop trips almost immediately. Every chunk then waits at least 4ms for nothing. `MessageChannel` has no clamp, which is why React's scheduler uses it. `scheduler.yield()` is the standard answer and additionally resumes your work ahead of other queued tasks, but browser support is still uneven, so feature-detect.

Do not split too finely. Each yield costs something, and chunks smaller than roughly a millisecond of work spend more on overhead than on the work.

## Time-sliced loops

When an animation is already running or the user is scrolling, splitting by item count is not enough. Split by time, and resume in step with the frame.

```ts
async function processDuringAnimation(items: Item[]): Promise<void> {
  let i = 0;
  let frameStart = performance.now();
  while (i < items.length) {
    // Work only until 5ms of this frame is gone
    while (i < items.length && performance.now() - frameStart < 5) {
      doWork(items[i++]);
    }
    frameStart = await new Promise<number>(requestAnimationFrame);
  }
}
```

Two details matter. `requestAnimationFrame` resumes just before the next frame is produced, so the work stays in rhythm with rendering, which `setTimeout` and `scheduler.yield` do not. And anchoring the budget to the frame's own start timestamp (the value rAF passes in) means the slice shrinks automatically when other animation callbacks ran earlier in the same frame, instead of blowing the budget.

5ms is a heuristic: about half of the practical 10ms budget, leaving the rest for animation callbacks, style, layout and paint. Shrink it when animations are heavy.

## Batching

For visual updates, coalesce to one render per frame. The screen is only drawn once per frame, so no matter how many updates arrive, drawing once is enough. Keep every data point, draw once.

```ts
let scheduled = false;

socket.on('tick', (tick: Tick) => {
  buffer.push(tick);          // nothing is thrown away
  if (scheduled) return;      // this frame's draw is already booked
  scheduled = true;
  requestAnimationFrame(() => {
    flush(buffer);
    buffer.length = 0;
    scheduled = false;
  });
});
```

This is the fix for the single most common real-time mistake: calling a chart library's `update()` or a `setState` on every socket message.

The same shape works for scroll and resize:

```ts
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    applyScrollEffect(window.scrollY);   // all reads and writes here, once per frame
    ticking = false;
  });
}, { passive: true });
```

Batching raises throughput by folding the per-item fixed cost together. Splitting lowers latency by creating gaps. They are not in conflict: both are about trimming tasks to the right size. Use batching when the task is too frequent, splitting when it is too long, and often both.

## Debounce and throttle

Debounce runs once after things go quiet. Throttle runs at most once per interval.

```ts
function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
```

Use debounce for expensive derived work on typing: markdown preview, full-document parse, search request, heavy validation. 150 to 300ms is the usual range. Use throttle or rAF coalescing for continuous streams where you want steady updates rather than a final one.

Trade-off: debounce adds latency by design. Never debounce the input's own visual feedback, only the expensive downstream work.

## Priority queues

Order is the responsiveness the user feels, because a busy main thread cannot be interrupted. Priority is not a fixed property: a background job becomes urgent the moment the user looks at its result.

```ts
type Job = (() => void) & { id?: string };

const queue: Job[] = [];
const channel = new MessageChannel();

channel.port1.onmessage = () => {
  const job = queue.shift();
  if (!job) return;
  job();
  if (queue.length > 0) channel.port2.postMessage(null);
};

export function postJob(job: Job, urgent = false): void {
  if (urgent) queue.unshift(job);
  else queue.push(job);
  if (queue.length === 1) channel.port2.postMessage(null);
}

// Promote a queued job when the user asks for its result
export function promote(id: string): void {
  const i = queue.findIndex((j) => j.id === id);
  if (i > 0) queue.unshift(queue.splice(i, 1)[0]);
}
```

This is the idle-until-urgent pattern: get ahead on the work while idle, rush it when it becomes needed. Classic use is generating previews or thumbnails in order, then jumping the one the user just clicked to the front.

The standard API for this is `scheduler.postTask(fn, { priority })` with `'user-blocking' | 'user-visible' | 'background'`, plus `TaskController` for changing priority after the fact. Chromium-only at time of writing, so feature-detect or keep the hand-built queue.

```ts
const s = (globalThis as any).scheduler;
if (s?.postTask) s.postTask(work, { priority: 'background' });
else postJob(work);
```

## Deferring

The most reliable saving is not doing the work now.

**Load**: code-split so only the current screen's JavaScript parses and executes up front. Route-level splitting first, then heavy widgets (editors, charts, maps, video players).

**Render**: leave off-screen content as empty shells that hold their height and fill as they approach the viewport.

```ts
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) fill(entry.target as HTMLElement);
      else empty(entry.target as HTMLElement);   // keeps its place, drops its DOM
    }
  },
  { rootMargin: '400px' }   // headroom so filling finishes before the scroll arrives
);

document.querySelectorAll('.feed-item').forEach((el) => io.observe(el));
```

This defers DOM construction as well as style and layout. The payoff is largest on the return path: coming back to a feed with hundreds of accumulated posts otherwise forces style and layout for all of them at once.

Heavy widget initialization can hang off the same observer.

**Continuous work**: carousels, promo banners, tickers and live charts are pure waste off screen. Start on enter, stop on leave, and also stop on `document.hidden`.

## Picking a tool

| Tool | Resumes | Use for |
|---|---|---|
| `requestAnimationFrame` | Just before next frame | Anything that must stay in rhythm with rendering, per-frame coalescing |
| `scheduler.yield()` | Next task, ahead of the queue | Splitting a long job while staying responsive (feature-detect) |
| `MessageChannel` | Next task, no clamping | Portable yield, custom priority queues |
| `setTimeout(fn, 0)` | Next task, min 4ms when nested | Coarse deferral where a few ms does not matter |
| `requestIdleCallback` | Browser idle period | Genuinely optional background work, never anything user-visible soon |
| `queueMicrotask` | Before the next render | Not a yield. Microtasks do not let frames through |

`queueMicrotask` and bare `await Promise.resolve()` are the classic mistake: they do not give the browser a chance to render, so they will not fix jank.
