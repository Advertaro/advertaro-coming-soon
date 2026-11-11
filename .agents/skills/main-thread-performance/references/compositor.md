# Compositor animation and layout cost

Contents: [Thread map](#thread-map) · [Composited properties](#composited-properties) · [FLIP](#flip) · [Layout thrashing](#layout-thrashing) · [will-change](#will-change) · [Off-screen rendering](#off-screen-rendering) · [Scroll-driven animation](#scroll-driven-animation) · [View Transitions](#view-transitions) · [Reduced motion](#reduced-motion)

## Thread map

- **Main thread**: JavaScript, DOM, style calculation, layout, paint, event handling.
- **Compositor thread**: composites already-painted layers, handles scrolling and certain animations.
- **Raster threads**: turn paint commands into pixels.
- **Workers**: JavaScript you explicitly spawn, no DOM access.

You cannot give the compositor or raster threads direct orders. What you can do is express work in a form they already handle. That is the whole game: a CSS animation on `transform` keeps running smoothly while JavaScript blocks the main thread for two seconds, because it was never on the main thread to begin with.

## Composited properties

`transform` and `opacity` do not change an element's position, size or colour in the document. They move or fade an already-painted layer, so no layout and no paint is needed and the browser can run them entirely on the compositor.

| Want | Use | Never |
|---|---|---|
| Move | `transform: translate3d(x, y, 0)` | `left`, `top`, `margin` |
| Resize | `transform: scale(...)` | `width`, `height`, `padding`, `font-size` |
| Fade | `opacity` | `visibility` toggling in a loop, `background-color` for fades |
| Rotate, skew | `transform` | anything else |

Treat this as the single highest-value rule in the whole subject. The same "slide sideways" lands on a completely different thread depending on which property you animate, and the layout-property version stutters the moment anything else is happening.

Notes on the edges:
- `filter` and `backdrop-filter` are composited in most engines but are expensive to raster, especially `blur` over large areas. Use sparingly and keep the area small.
- `box-shadow`, `border-radius` and `background-color` transitions repaint. Cheap on a small element, costly across a full-bleed hero.
- Animating `clip-path` or `height` for accordions repaints and relayouts. Prefer `transform: scaleY` with a transform-origin, or `grid-template-rows: 0fr -> 1fr` where the repaint area is small, and measure.
- Layout-inducing properties are not forbidden in one-off transitions on small elements. They are forbidden in anything running per frame or on many elements at once.

## FLIP

For motion where the layout genuinely changes (list reorder, item removal, card expanding into a detail view), you still want exactly one layout pass, with the movement handed to `transform`.

- **First**: measure where it is now.
- **Last**: make the real layout change and measure where it ended up. Layout happens once, here.
- **Invert**: apply a transform so it appears to still be in the old position.
- **Play**: animate that transform away. This part is the compositor's.

```ts
function flip(el: HTMLElement, mutate: () => void, duration = 300): Animation {
  const first = el.getBoundingClientRect();
  mutate();                                    // the one and only layout change
  const last = el.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top - last.top;

  return el.animate(
    [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
    { duration, easing: 'ease-in-out' }
  );
}
```

The element has already arrived at its destination. The transform briefly drags it back and then releases it, so per frame the only work is the compositor interpolating a transform. Vue's `TransitionGroup` and Motion (Framer Motion) layout animations are FLIP underneath, so on those stacks use the built-in rather than hand-rolling.

For many elements, batch: read all `first` rects, apply the mutation once, read all `last` rects, then start all animations. Reading and writing per element reintroduces thrashing.

## Layout thrashing

Reading a layout value right after writing a style forces the browser to recompute layout immediately so it can give you a current answer. In a loop, that is dozens of layout passes in one frame.

```ts
// Bad: read and write interleaved, forced layout every iteration
for (const el of elements) {
  const width = el.offsetWidth;
  el.style.width = `${width + 10}px`;
}

// Good: all reads, then all writes
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, i) => { el.style.width = `${widths[i] + 10}px`; });
```

Properties that force layout when read after a write include `offsetTop/Left/Width/Height`, `clientTop/Left/Width/Height`, `scrollTop/Left/Width/Height`, `getBoundingClientRect()`, `getComputedStyle()` on layout values, `scrollIntoView()`, and `focus()`. Habitually grouping reads with reads and writes with writes is enough to avoid the problem.

## will-change

`will-change: transform` hints that an element should be promoted to its own layer in advance, which smooths the first frame of an animation. Overused, layer count and memory balloon and things get slower.

Rules: apply it to the few elements actually about to animate, ideally added on hover or interaction start and removed when the animation ends. Never put it on a shared utility class or on a list of many items. If an animation is already smooth, it is not needed.

## Off-screen rendering

`content-visibility: auto` with `contain-intrinsic-size` skips rendering work for off-screen subtrees in one line:

```css
.feed-item {
  content-visibility: auto;
  contain-intrinsic-size: auto 320px;   /* placeholder height, avoids scrollbar jumping */
}
```

Implementation quality varies between engines, and Safari has had a bug where returning to the page is slower rather than faster. Where predictable behaviour across browsers matters, use `IntersectionObserver` (see `scheduling.md`) or a virtualization library, and treat `content-visibility` as a progressive enhancement.

## Scroll-driven animation

Chromium supports CSS scroll-driven animations, which run off the main thread entirely:

```css
@keyframes reveal { from { opacity: 0; transform: translateY(24px); } }

.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

Where supported this beats any scroll-listener implementation because there is no main-thread involvement at all. Feature-detect with `CSS.supports('animation-timeline: view()')` and fall back to a passive `IntersectionObserver` reveal rather than a scroll handler.

If a scroll listener is unavoidable: `{ passive: true }`, store the value, do all work in one rAF (see `scheduling.md`).

## View Transitions

`document.startViewTransition()` handles cross-state and cross-document morphs with compositor-driven animation and no manual FLIP. Support is good in Chromium and Safari 18+, absent in older browsers, so always run the mutation unconditionally:

```ts
if (!document.startViewTransition) { update(); }
else document.startViewTransition(() => update());
```

Keep `view-transition-name` unique per visible element. Duplicates silently break the transition.

## Reduced motion

Every non-essential animation needs a reduced variant. This is an accessibility requirement, not a nicety, and it also cuts main-thread work for the users who opt in.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In JS, gate on `matchMedia('(prefers-reduced-motion: reduce)').matches`, or `useReducedMotion()` in Motion. Prefer replacing movement with a fade rather than removing feedback entirely, so state changes stay perceivable.
