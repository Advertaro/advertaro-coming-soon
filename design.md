# Advertaro design instructions

Current homepage reference — 15 November 2026.

This documents the current working tree, including existing uncommitted homepage changes. It records the design rather than proposing a redesign. Inspected with agent-browser at localhost:3000 at 390, 768, 1024, 1440 and 1920 CSS pixels. Main heading computed sizes were browser-verified; supporting recipes come from source. Pixel equivalents assume a 16px root.

## Design direction

Use a dark, cinematic editorial style: near-black surfaces, white headings, subdued supporting copy, orange actions and indices, numbered section dividers, oversized project names and media-led compositions. Align content to the shared page shell. Keep draft testimonials, outcomes and unverified metrics explicitly marked as drafts.

## Color tokens

Source of truth: tooling/tailwind/theme.css. Use semantic Tailwind utilities such as bg-bg, text-ink-secondary and border-line. This inventory includes all declared colors, including those not prominent on the homepage.

| Token | Hex |
| --- | --- |
| --color-bg | #0a0a0b |
| --color-bg-elevated | #111216 |
| --color-bg-card | #14151a |
| --color-bg-card-hover | #191b22 |
| --color-line | #22232a |
| --color-line-strong | #2f313a |
| --color-ink | #ffffff |
| --color-ink-secondary | #9899a1 |
| --color-ink-muted | #62646e |
| --color-ink-editorial | #d5d6dc |
| --color-accent | #ff4d00 |
| --color-accent-hover | #ff5914 |
| --color-accent-blue | #2d6cdf |
| --color-bg-deep | #08090d |
| --color-bg-input | #0e0f13 |
| --color-ink-wordmark | #a5a7b0 |
| --color-ink-bright | #f3f4f6 |
| --color-accent-soft | #ff9568 |
| --color-accent-pale | #ffb08a |
| --color-danger | #f87171 |
| --color-success | #16a34a |

Use bg for the page, bg-elevated for raised panels, bg-card for cards and bg-card-hover for hover surfaces. Use line and line-strong for borders. Ink is primary copy; ink-secondary supports it; ink-editorial emphasizes phrases; ink-muted is subdued metadata. Accent is primary orange and accent-hover its hover state. Blue supports artwork. Danger and success require accompanying status text.

Local opacity treatments are not additional tokens: hero overlay uses near-black at 74%; ghost CTA uses white at 6% with a 14% white border; metadata pills use elevated background at 75%. Project artwork colors belong to content, not the core palette.

## Font instructions

- Syne is the display font: --font-display resolves through --font-syne. All h1–h6 inherit it unless explicitly overridden.
- Questrial is the body/UI font: --font-sans resolves through --font-questrial. Paragraphs, controls, labels, statistics and review quotes use it.
- apps/web/src/styles/fonts.ts loads both through next/font/google with Latin subsets and display: swap.
- Questrial loads only weight 400. Other requested weights are synthesized by the browser, marked * below.
- There is no monospace font. MonoLabel and Tag use Questrial.
- Base body line-height is 1.45. Headings inherit it unless overridden.
- Em defaults to weight 700, tracking -.01em and ink-editorial. Hero emphasis uses ink-bright; reel emphasis overrides weight and tracking.
- The giant hero wordmark is SVG artwork, not live typography.

## Fluid type recipes

These are component recipes, not existing named global size tokens. Preserve the formula for each role. Values vary continuously with viewport width.

| Role | Font | Font-size | Weight / line-height / tracking |
| --- | --- | --- | --- |
| Hero H1 | Syne | clamp(28px, 3.5vw, 52px) | 500 / 1.22 / -.025em |
| Trusted by H2 | Syne | clamp(30px, 4.2vw, 56px) | 600 / 1.08 / -.035em |
| Work reel H2 | Syne | clamp(32px, 4.6vw, 64px) | 600 / 1 / -.035em |
| Reel outcome | Syne | clamp(26px, 3vw, 44px) | 600 / 1.1 / -.035em |
| Work marquee | Syne | clamp(44px, 7vw, 96px) | 800 / 1.45 / -.04em |
| Mobile First backdrop | Questrial | clamp(72px, 15vw, 220px) | 800* / .85 / -.05em |
| Service H3 | Syne | clamp(26px, 3vw, 40px) | 700 / 1.45 / -.03em |
| Service index | Questrial | clamp(32px, 4vw, 54px) | 700* / 1.45 / -.03em |
| About H2 | Syne | clamp(34px, 4.6vw, 64px) | 700 / 1.05 / -.035em |
| Process H2 | Syne | clamp(34px, 4.5vw, 62px) | 700 / 1.06 / -.035em |
| Review quote | Questrial | clamp(24px, 3vw, 38px) | 600* / 1.24 / -.025em |
| Contact H2 | Syne | clamp(36px, 4.8vw, 68px) | 700 / 1.04 / -.035em |
| Statistics | Questrial | clamp(40px, 5vw, 68px) | 800* / 1 / -.04em |

## Type sizes by viewport

CSS pixels; rounded to two decimals. Formulas above cover intermediate widths.

| Role | 390px | 768px | 1024px | 1440px | 1920px |
| --- | --- | --- | --- | --- | --- |
| Hero H1 | 28.00 | 28.00 | 35.84 | 50.40 | 52.00 |
| Trusted by H2 | 30.00 | 32.26 | 43.01 | 56.00 | 56.00 |
| Work reel H2 | 32.00 | 35.33 | 47.10 | 64.00 | 64.00 |
| Reel outcome | 26.00 | 26.00 | 30.72 | 43.20 | 44.00 |
| Work marquee | 44.00 | 53.76 | 71.68 | 96.00 | 96.00 |
| Mobile First backdrop | 72.00 | 115.20 | 153.60 | 216.00 | 220.00 |
| Service H3 | 26.00 | 26.00 | 30.72 | 40.00 | 40.00 |
| Service index | 32.00 | 32.00 | 40.96 | 54.00 | 54.00 |
| About H2 | 34.00 | 35.33 | 47.10 | 64.00 | 64.00 |
| Process H2 | 34.00 | 34.56 | 46.08 | 62.00 | 62.00 |
| Review quote | 24.00 | 24.00 | 30.72 | 38.00 | 38.00 |
| Contact H2 | 36.00 | 36.86 | 49.15 | 68.00 | 68.00 |
| Statistics | 40.00 | 40.00 | 51.20 | 68.00 | 68.00 |

## Fixed text sizes

These remain constant across widths unless noted. Line-height values are unitless unless expressed in px.

| Location | Font | Size / line-height | Weight / tracking |
| --- | --- | --- | --- |
| Hero eyebrow | Questrial | 11px / 1.45 | 400 / .16em |
| CTA pill | Questrial | 13px / 18px inner label | 600* |
| Section divider | Questrial | 10px below 640px; 11px from 640px / 1.45 | 600* / .14em |
| MonoLabel | Questrial | 11px / 1.45 | 500* / .12em |
| Tag | Questrial | 11px / 1.45 | 400 / .12em |
| Work deliverable H4 | Syne | 20px / 1.45 | 700 / -.02em |
| Service body | Questrial | 16px / 1.55 | 400 |
| About body | Questrial | 16px / 1.6 | 400 |
| Process card H3 | Syne | 30px / 1.45 | 700 / -.03em |
| Process body | Questrial | 15px / 1.5 | 400 |
| Process deliverable | Questrial | 26px / 1 | 800* / -.03em |
| Mobile caption | Questrial | 13px / 1.35 | 400 |
| Review author | Questrial | 15px / 1.45 | 700* / .04em |
| Review role | Questrial | 11.5px / 1.45 | 400 / .1em |
| Footer introduction | Questrial | 18px / 1.5 | 400 |

## Responsive placement

Tailwind layout breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px; custom 3xl 1920px.

| Viewport | Horizontal shell padding | Placement |
| --- | --- | --- |
| Below 640px | 16px | Hero centered; CTAs stacked; work cards 4:5; sections stacked |
| 640–767px | 16px | CTAs inline; work cards 16:9; divider text 11px |
| 768–1023px | 30px | Hero centered; most sections stacked |
| 1024–1279px | 30px | Hero left-aligned; alternating three-column service rows; About, Reviews and Contact two columns; Process three columns |
| 1280–1535px | 64px | Desktop structure retained |
| 1536–1919px | (100vw - 1280px) / 2 | 1280px content width |
| 1920px and up | (100vw - 1568px) / 2 | 1568px content width |

Hero copy has an 880px maximum width; Trusted-by heading 720px; reel outcomes 18ch; Services body 480px; About body 500px. Let text wrap naturally. Preserve explicit line breaks in About, Process and Contact rather than prescribing identical line counts across devices.

Mobile mockups use a horizontal strip below 1024px with minimum 220px card widths, then three equal columns. Stats use two columns below 1024px and four above. Selected Work and Services H2s are visually hidden; prominent titles appear inside their cards and rows. Decorative marquees and backdrops stay hidden from assistive technology.

The declared container-site token is 1440px, but the homepage uses the shell rules above. Do not substitute one for the other.

## Spacing, surfaces and motion

- Shared section-gap: 50px base, 64px from md, 120px from lg. Many homepage sections instead use explicit 88px top / 104px bottom padding.
- Cards generally use 14–20px radii; phone mockups 24px; CTA and metadata pills fully rounded.
- shadow-glow: 0 4px 20px rgb(255 77 0 / 0.35).
- shadow-glow-lg: 0 6px 26px rgb(255 77 0 / 0.55).
- ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1).
- ease-roll: cubic-bezier(0.22, 1, 0.36, 1).
- Marquee durations: 18s for project titles, 40s for clients.
- Preserve existing GSAP/Lenis reduced-motion behavior and shared reduced-motion CSS.
- spacing-nav is 69px; globals also declares nav-height as 4.125rem (66px). These are distinct current values.

## Rules for future work

Reuse the nearest existing recipe and shared component. Keep orange selective. Keep body copy readable instead of scaling every text role with viewport width. Do not infer visual size from heading level alone. Preserve package boundaries and public exports.

Check actual text/background contrast when using the palette. Muted gray and white-on-orange combinations are not automatically safe for small text. Preserve focus indicators, semantic labels and reduced motion. This document records existing styling; it is not an accessibility certification.

## Source map

- tooling/tailwind/theme.css: colors, font aliases, shadows, easing and layout tokens.
- packages/ui/src/styles.css: inheritance, grain, focus and reduced motion.
- apps/web/src/styles/fonts.ts and globals.css: fonts, shell and breakpoints.
- apps/web/src/components/sections/home/: section-specific recipes.
- apps/web/src/components/ui/SectionHeadline.tsx: About heading.
- apps/web/src/components/sections/shared/WorkCard.tsx: work titles and cards.
- packages/ui/src/: CTA, labels, section bars and statistics.

## Reusable heading API

Import these from @advertaro/ui. Implementations live in packages/ui/src/components/headings.

| Component | Native tag | Default size | Weight / line-height |
| --- | --- | --- | --- |
| PrimaryHeading | h1 | clamp(28px,3.5vw,52px) | 500 / 1.22 |
| SecondaryHeading | h2 | clamp(34px,4.6vw,64px) | 700 / 1.05 |
| TertiaryHeading | h3 | clamp(26px,3vw,40px) | 700 / inherited |
| QuaternaryHeading | h4 | 20px | 700 / inherited |
| QuinaryHeading | h5 | 18px | 700 / inherited |
| SenaryHeading | h6 | 16px | 700 / inherited |
| Eyebrow | span (default) | 11px | 500 / inherited |

H5/H6 sizes are proposed defaults, not observed homepage recipes. Names express semantic heading rank, not a descending visual scale. Distinct existing section recipes remain valid.

All six headings support native heading props, React 19 refs, children, className and these typed variants:
- color: inherit (default), primary, secondary, editorial, accent, muted, bright.
- align: inherit (default), left, center, right.

Colors map to the corresponding ink tokens, except accent maps to accent. Inherited alignment emits no alignment utility. Use className for responsive alignment. Caller classes merge last through cn(), overriding the fixed recipe and variant classes.

Eyebrow supports the same variants, defaults to secondary color, and accepts as="span", "div", "p" or "h2". It uses Questrial, uppercase and .12em tracking. Use h2 only when the label is a true section heading.

Example:
    <PrimaryHeading color="primary" align="center" className="lg:text-left">
      Build something worth showing
    </PrimaryHeading>
    <Eyebrow as="p" color="accent">Selected work</Eyebrow>

MonoLabel, Em and SectionHeadline remain compatible exports. MonoLabel preserves its existing as/bright API and shares Eyebrow's variant recipe; bright selects primary color. SectionHeadline preserves its optional as API and SecondaryHeading typography. Existing app-local and UI MonoLabel import paths remain compatibility re-exports.

Only matching Hero, Services and WorkCard headings and Hero/PageHero eyebrows were migrated. No size variant, font change or global heading normalization was introduced.
