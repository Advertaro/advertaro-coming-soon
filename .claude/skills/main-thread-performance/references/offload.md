# Offloading and eliminating work

Contents: [When a worker pays](#when-a-worker-pays) · [Worker basics](#worker-basics) · [Transferables](#transferables) · [OffscreenCanvas](#offscreencanvas) · [WASM and libraries](#wasm-and-libraries) · [Eliminating work](#eliminating-work) · [Backpressure](#backpressure)

## When a worker pays

A worker runs JavaScript on its own thread, fully separated from the main one. It cannot touch the DOM. It can only compute and post results back, and `postMessage` serializes (copies) whatever it sends unless you transfer ownership.

So a worker pays off when the computation is **heavy enough to outweigh the messaging cost** and **does not need the DOM**. Sending a short, light job to a worker loses: the communication costs more than the work.

Good candidates:
- Parsing or transforming large payloads (multi-megabyte JSON, CSV, GeoJSON, protobuf).
- Image and video pixel work: resize, filters, thumbnails, seam carving, OCR preprocessing.
- Search indexing, fuzzy matching, large sorts, diffing.
- Compression, encryption, hashing, PDF generation.
- Physics, pathfinding, simulation steps.
- Anything currently causing a visible freeze of more than roughly 50ms that is pure computation.

Bad candidates: DOM measurement, small array mapping, anything under a few milliseconds, work that needs to be synchronous with a paint.

A bonus that is easy to miss: because the worker can report progress, you get intermediate frames for free. Work on the main thread has no task boundaries for paint to slip into, so you cannot show progress even if you want to.

## Worker basics

```ts
// main thread
const worker = new Worker(new URL('./parser.worker.ts', import.meta.url), { type: 'module' });
worker.postMessage(rawPayload);
worker.onmessage = (e: MessageEvent<Parsed>) => render(e.data);

// later
worker.terminate();
```

```ts
// parser.worker.ts
self.onmessage = (e: MessageEvent<string>) => {
  const parsed = expensiveParse(e.data);
  (self as unknown as Worker).postMessage(parsed);
};
```

`new URL('./x.worker.ts', import.meta.url)` is the bundler-friendly form and works in Vite, webpack 5 and Next.js. Always terminate on unmount or the thread leaks.

For anything beyond one message in and one out, use [Comlink](https://github.com/GoogleChromeLabs/comlink) rather than hand-rolling correlation IDs. For repeated jobs, keep a small pool (typically `navigator.hardwareConcurrency - 1`, capped) rather than spawning per task: worker startup is not free.

Note that a huge `JSON.parse` inside a worker still blocks *that* worker, but the main thread stays free, which is the point.

## Transferables

`postMessage` copies by default, and for multi-megabyte buffers the copy itself becomes the bottleneck. Transferable objects move by reference:

```ts
worker.postMessage({ buf: pixels.buffer, width, height }, [pixels.buffer]);
// pixels.buffer is now detached on this side and unusable
```

Transferable: `ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, `ReadableStream`/`WritableStream`. Cost is close to zero regardless of size, in exchange for losing access on the sending side. For a ping-pong pipeline, transfer the buffer back with each result so it can be reused.

`SharedArrayBuffer` avoids transfer entirely but requires cross-origin isolation headers (COOP/COEP), which usually breaks third-party embeds. Do not reach for it without a concrete reason.

## OffscreenCanvas

Canvas rendering can move off the main thread completely:

```ts
// main thread
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

```ts
// worker
self.onmessage = ({ data }) => {
  const ctx = data.canvas.getContext('2d');
  const loop = () => { draw(ctx); requestAnimationFrame(loop); };   // rAF exists in workers
  loop();
};
```

Supported in Chromium, Firefox and Safari 17+. Feature-detect `HTMLCanvasElement.prototype.transferControlToOffscreen` and fall back to main-thread rendering. Once transferred the main thread cannot draw to that canvas, so all input has to be forwarded by message. Worth it for charts updating at high frequency, particle fields, image editors and games. Not worth it for a static chart that redraws on resize.

`createImageBitmap()` also decodes off the main thread and returns a transferable, which is the right way to prepare large images before drawing.

## WASM and libraries

Compute-heavy WASM belongs in a worker for the same reason as JavaScript: the module's execution holds whichever thread it runs on. When adding an image, video, crypto or ML library, check whether it ships a worker entry point and use it. A convenient synchronous API is usually a main-thread freeze in disguise.

## Eliminating work

The best optimization is the work that never happens. Three strategies:

**Drop.** For data that just flows past (live logs, telemetry, chat in a fast room), discard the oldest entries once processing falls behind. Keeping up with the present matters more than showing everything. Cap the buffer and let the excess go.

```ts
buffer.push(msg);
if (buffer.length > MAX) buffer.splice(0, buffer.length - MAX);
```

**Merge.** For data where only the latest value means anything (prices, rankings, presence, cursor positions), collapse the backlog and apply the final value per key. The amount of work is then pinned to what the screen can digest, however fast the inflow.

```ts
const pending = new Map<string, Quote>();
socket.on('quote', (q: Quote) => { pending.set(q.symbol, q); schedule(); });  // last write wins
```

**Skip.** Same input, same output, so do not compute twice. Memoize pure derivations, cache measured layout values until something invalidates them, and skip rendering for anything not visible. Debounce is skipping. Virtualization is skipping. A large part of this whole subject is skipping.

Before making a task faster, ask whether it has to happen at all, now, here.

## Backpressure

When inflow exceeds maximum throughput, the backlog grows without limit and what reaches the screen gets older and older. Batching raises throughput but does not create a ceiling. The browser has no good way to tell the server to slow down, so the client has to give up on processing everything.

A practical pattern for a high-rate socket:

```ts
const pending = new Map<string, Update>();   // merge by key
let scheduled = false;

socket.onmessage = (e) => {
  const u = JSON.parse(e.data) as Update;
  pending.set(u.id, u);                      // merge: only the latest per id survives
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    applyUpdates(pending);                   // batch: one paint per frame
    pending.clear();
    scheduled = false;
  });
};
```

Merge plus one flush per frame gives a hard upper bound on main-thread work no matter what the server does. Add a drop policy for append-only streams, and if messages are large, move `JSON.parse` into a worker as well.

Also negotiate at the protocol level where you can: ask the server for deltas rather than full snapshots, subscribe only to visible symbols or rows, and unsubscribe when a panel scrolls away. Not receiving the data is cheaper than every technique on this page.
