# Output templates

## Stage 1: TL;DR (always first)

Keep it scannable in under 30 seconds. At most 7 numbered issues; group repeats of the same
rule into one line with a count. One line of problem, one line of fix.

```
## Next.js performance audit: TL;DR

**Scope:** <snippet | file path | feature folder | whole project> · Next <version or "unknown, assumed 16"> · <App Router / Pages Router / both>
**Found:** <n> issues (<c> critical, <h> high, <m> medium, <l> low)

**Top issues**
1. **[Critical] <Short problem>** in `path/file.tsx:12`
   Fix: <one-line direction>
2. **[High] <Short problem>** (<k> places, e.g. `a.tsx:4`, `b.tsx:9`)
   Fix: <one-line direction>
...

**Quick wins:** <1 to 3 low-effort items, if any, comma separated>
**Biggest likely impact:** <which Core Web Vital or cost this mostly affects, one sentence>

Want the detailed report? It includes evidence for each finding, why it matters, the code
change, and an ordered fix plan.
```

Then stop and wait for the answer. Do not append the detailed report.

If nothing meaningful is found, say so plainly, list what was checked in one line, and mention
anything that could not be assessed statically (e.g. real LCP element, INP in the field).

## Stage 2: Detailed report (only after the user says yes)

Default: render in chat. If it would exceed roughly 250 lines, or the user asks for a file,
write it to `nextjs-perf-report.md` and share it.

```
# Next.js performance audit

## Summary
<2 to 4 sentences: overall state, the one or two themes behind most findings, expected payoff.>

**Context:** Next <v>, React <v>, <router>, caching model: <Cache Components | legacy segment config | unknown>, React Compiler: <on/off>, scope: <...>

## Fix plan (ordered by impact ÷ effort)
| # | Finding | Severity | Effort | Affects |
|---|---|---|---|---|
| 1 | <RULE-ID short name> | Critical | S | LCP |
...

## Findings

### 1. <Short title> · <RULE-ID> · <Severity>
**Where:** `path/file.tsx:line` (+ other locations)
**Evidence:**
```tsx
<the offending lines, trimmed>
```
**Why it matters:** <mechanism and which metric/cost it hits, 1 to 3 sentences.>
**Fix:**
```tsx
<minimal corrected code, same names as the user's code>
```
**Effort:** S / M / L · **Confidence:** high / medium / low <say why if not high>
<If the pattern came from pre-2026 advice, add: "Changed in Next <v>: ...">

(repeat per finding; group identical-pattern findings into one section listing all locations)

## Checked and fine
<One short line per area that looked good, so the user knows it was covered.>

## Not assessable statically
<Items needing runtime data, and how to measure: Lighthouse CLI, PageSpeed/CrUX, useReportWebVitals / instrumentation-client.ts, DevTools Performance panel, bundle analyzer.>
```

Effort guide: **S** under an hour, a few lines; **M** a few hours, touches several files;
**L** architectural (boundary restructuring, Cache Components migration, router migration).
