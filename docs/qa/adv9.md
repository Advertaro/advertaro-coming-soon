# ADV-9 verification and remaining browser checks

## Implementation

The homepage uses the final 16-second ADV-8 reel. The server sends the poster first. Video sources mount after hydration only when motion is allowed. The video is muted, loops, plays inline, and uses metadata preload. A live reduced-motion preference change removes the video. A media error leaves the poster visible. The particle layer and its unused components are removed.

Shared section headers now show only the section number and label. Recording counters, ruler strips, crosshairs, frame codes, camera-style play controls, and canvas captions/frame guides are removed throughout the site. Emphasis uses color and weight. Instrument Serif and its font token are removed. The homepage services panel is removed; the hero uses two columns on desktop and one column below 1024px.

The hero overlay has a minimum dark opacity of 74%. Over a hypothetical pure-white frame, the small eyebrow text has a calculated contrast ratio of 4.94:1, including its translucent badge. This is a conservative color calculation, not a browser accessibility audit.

## Completed checks

- Production build: passed, including TypeScript and generation of all 25 static outputs.
- Lint: passed in web, UI, and content packages. Biome format/import checks also passed.
- Type checks: passed in web, UI, and content packages.
- Production HTTP checks: all 24 page/content/missing routes returned the expected 200 or 404, one h1, and no removed camera markup. This covers all five service pages, five work pages, two blog posts, the index pages, contact, legal pages, and missing-page cases.
- Media HTTP checks: WebM, MP4, and poster returned successfully. FFprobe confirms VP9/H.264, 1920×1080, 16 seconds, no audio, and files below 4 MB each.
- Happy DOM checks: poster-only server render and reduced-motion mount; video attributes and both source types when motion is allowed; live preference change; media-error fallback; listener cleanup. These checks do not decode video or verify physical layout.
- Source scan: zero matches for the removed camera names, italic rules/classes/font import, and hero services-panel selectors in `apps/web/src` and `packages/ui/src`.

Bun 1.4.0 was staged in the ignored `.paperclip-inbound/bun/package/bin` directory because Bun is absent from the runner PATH. The root scripts ran with `bun run --shell=bun build`, `bun run --shell=bun lint --env-mode=loose`, and `bun run --shell=bun type-check --env-mode=loose`. Loose environment mode preserves `OPENSSL_CONF=/dev/null` for Node-based lint/type tools under this runner policy. No package scripts or dependency manifests were changed.

## Open acceptance checks

A real browser cannot launch under the current runner filesystem policy. Both the installed browser and a workspace-local Chrome headless shell were attempted. The latter reports: `Critical error: required built-in appearance SystemAppearance not found`. The policy does not permit granting access to the required macOS system resources.

No before/after screenshots were captured. Autoplay, a full loop, real media-error behavior, mobile layout, computed font styles, contrast over decoded frames, and visual checks across routes remain unverified. LCP has not been measured.

Use a browser-enabled environment to capture the original hero from baseline commit `82539de48412f54560c8c8ad7ee8613ec3b5e3f3` and this branch's revised hero at 1440×900 and 390×844. On the revised site, confirm playback advances without interaction and wraps after 16 seconds; confirm poster-only reduced motion with no media requests, including when changed live; block both video sources to inspect fallback. Inspect every route listed above at both sizes for overflow, camera remnants, and italic computed styles. Attach the screenshots and browser results to ADV-9 before closing acceptance.
