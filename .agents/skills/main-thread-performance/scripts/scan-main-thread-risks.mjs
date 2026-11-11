#!/usr/bin/env node
/**
 * scan-main-thread-risks.mjs
 *
 * Heuristic scanner for browser main-thread anti-patterns: layout-property
 * animation, non-passive high-frequency listeners, layout thrashing,
 * per-frame state updates, unbatched stream handlers, missing teardown.
 *
 * Usage:
 *   node scan-main-thread-risks.mjs [dir] [--json] [--strict]
 *
 * No dependencies. Regex heuristics, not a type-aware linter: verify every hit
 * before changing code. Treat the output as a ranked list of places to look.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? '.';
const asJson = args.includes('--json');
const strict = args.includes('--strict');

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', '.turbo', '.vercel', '.cache',
  'dist', 'build', 'out', 'coverage', '.output', '.svelte-kit', 'vendor',
]);
const CODE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue', '.svelte', '.astro']);
const STYLE_EXT = new Set(['.css', '.scss', '.sass', '.less', '.styl']);

const LAYOUT_PROPS = 'left|top|right|bottom|width|height|margin|margin-top|margin-left|padding|font-size|inset';
const LAYOUT_READ = /\b(getBoundingClientRect\(|getClientRects\(|offsetWidth|offsetHeight|offsetTop|offsetLeft|clientWidth|clientHeight|scrollTop|scrollLeft|scrollWidth|scrollHeight|getComputedStyle\()/;
const STYLE_WRITE = /(\.style\.[A-Za-z]+\s*=|\.style\.setProperty\(|\.classList\.(add|remove|toggle)\()/;
const LOOP_START = /\b(for\s*\(|while\s*\(|\.forEach\(|\.map\(|for\s+(const|let|var)\s)/;
const SETTER = /\bset(?!Interval|Timeout|Immediate|Attribute|Property|Item|Date|Hours|Minutes|Seconds|Milliseconds|Month|FullYear|PointerCapture|SelectionRange|LineDash|Transform|RequestHeader|Custom)[A-Z]\w*\(/;
const HOT_EVENTS = /'(scroll|wheel|mousewheel|touchmove|touchstart|pointermove|mousemove)'|"(scroll|wheel|mousewheel|touchmove|touchstart|pointermove|mousemove)"/;

const findings = [];

function add(sev, rule, file, line, text, message, fix) {
  findings.push({ severity: sev, rule, file, line, snippet: text.trim().slice(0, 120), message, fix });
}

function nearby(lines, i, radius) {
  return lines.slice(Math.max(0, i - radius), Math.min(lines.length, i + radius + 1)).join('\n');
}

function scanCode(file, src) {
  const lines = src.split('\n');
  const hasRaf = /requestAnimationFrame/.test(src);
  const hasCancelRaf = /cancelAnimationFrame/.test(src);
  const hasAdd = /addEventListener\(/.test(src);
  const hasRemove = /removeEventListener\(/.test(src);

  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

    // 1. Animating or writing layout properties from JS
    const styleWrite = line.match(new RegExp(`\\.style\\.(left|top|right|bottom|width|height|marginTop|marginLeft|padding|fontSize)\\s*=`));
    if (styleWrite) {
      const inFrameLoop = /requestAnimationFrame|onScroll|onMouseMove|onPointerMove|onDrag/.test(nearby(lines, i, 12));
      add(
        inFrameLoop ? 'high' : 'medium',
        'layout-prop-write',
        file, n, line,
        `Writes layout property "${styleWrite[1]}"${inFrameLoop ? ' inside a per-frame or pointer path' : ''}, which forces layout on the main thread.`,
        'Use transform: translate3d() or scale() instead. For real layout changes, use FLIP.'
      );
    }

    // 2. Web Animations API on layout properties
    if (/\.animate\(\s*\[/.test(line) && new RegExp(`(${LAYOUT_PROPS})\\s*:`).test(nearby(lines, i, 4))) {
      add('high', 'waapi-layout-prop', file, n, line,
        'Web Animations keyframes appear to animate layout properties.',
        'Animate transform and opacity only. Use FLIP when the layout genuinely changes.');
    }

    // 3. Non-passive high-frequency listeners
    if (/addEventListener\(/.test(line) && HOT_EVENTS.test(line)) {
      const window3 = nearby(lines, i, 3);
      if (!/passive\s*:\s*true/.test(window3)) {
        add('high', 'non-passive-listener', file, n, line,
          'High-frequency listener registered without { passive: true }, so the browser must wait for it before scrolling.',
          "Add { passive: true } unless you call preventDefault().");
      }
      if (!/requestAnimationFrame|throttle|debounce|rafThrottle|ticking/.test(nearby(lines, i, 14))) {
        add('medium', 'unbatched-hot-handler', file, n, line,
          'High-frequency handler with no visible rAF coalescing or throttling nearby.',
          'Record the value in the handler, do all reads and writes in one requestAnimationFrame.');
      }
    }

    // 4. Layout thrashing: read and write interleaved in a loop
    if (LOOP_START.test(line)) {
      const body = nearby(lines, i, 12);
      if (LAYOUT_READ.test(body) && STYLE_WRITE.test(body)) {
        add('high', 'layout-thrash', file, n, line,
          'Layout read and style write appear inside the same loop, forcing synchronous layout each iteration.',
          'Collect all reads first, then apply all writes.');
      }
    }

    // 5. setState per frame
    if (/requestAnimationFrame\(/.test(line)) {
      const body = nearby(lines, i, 6);
      if (SETTER.test(body)) {
        add('high', 'state-per-frame', file, n, line,
          'State setter called from a requestAnimationFrame callback, causing a full render every frame.',
          'Write to a ref and mutate style directly, or use a motion value.');
      }
    }

    // 6. Unbatched stream handlers
    if (/(onmessage\s*=|\.on\(\s*['"](message|tick|update|data|quote|trade|row)['"]|addEventListener\(\s*['"]message['"])/.test(line)) {
      const body = nearby(lines, i, 6);
      if ((SETTER.test(body) || /\.update\(|render\w*\(|draw\w*\(|innerHTML|appendChild/.test(body))
        && !/requestAnimationFrame|scheduled|pending|buffer|queueFlush/.test(body)) {
        add('high', 'unbatched-stream', file, n, line,
          'Stream handler renders or sets state per message, with no visible per-frame coalescing.',
          'Buffer or merge into a map, then flush once per requestAnimationFrame.');
      }
    }

    // 7. setInterval used for animation
    const interval = line.match(/setInterval\([^,]+,\s*(\d+)\s*\)/);
    if (interval && Number(interval[1]) <= 50) {
      add('medium', 'interval-animation', file, n, line,
        `setInterval at ${interval[1]}ms drifts against the frame cycle and runs while the tab is hidden.`,
        'Use requestAnimationFrame, and stop the loop when the element leaves the viewport.');
    }

    // 8. setTimeout(0) as a yield
    if (/setTimeout\(\s*(resolve|\(\)\s*=>)/.test(line) && /,\s*0\s*\)/.test(line)) {
      add('low', 'settimeout-yield', file, n, line,
        'setTimeout(0) clamps to 4ms once nested past five levels, so each chunk idles.',
        'Prefer scheduler.yield() with a MessageChannel fallback.');
    }

    // 9. Microtask mistaken for a yield
    if (/queueMicrotask\(|await\s+Promise\.resolve\(\)/.test(line) && /for\s*\(|while\s*\(|\.forEach\(/.test(nearby(lines, i, 6))) {
      add('medium', 'microtask-yield', file, n, line,
        'Microtasks do not let the browser render, so this does not yield the main thread.',
        'Use scheduler.yield(), MessageChannel or requestAnimationFrame.');
    }

    // 10. Large synchronous parse
    if (/JSON\.parse\(\s*(await|.*\.text\(\)|.*responseText)/.test(line)) {
      add('medium', 'sync-parse', file, n, line,
        'JSON.parse is atomic and cannot be split, so a large payload blocks the thread outright.',
        'Parse in a Worker, or page the response.');
    }

    // 11. Scroll effect in React state
    if (/\bset[A-Z]\w*\(\s*window\.(scrollY|scrollX|pageYOffset)/.test(line)) {
      add('high', 'scroll-into-state', file, n, line,
        'Scroll position stored in component state re-renders the subtree on every scroll event.',
        'Keep it in a ref and write transform directly, or use a scroll-driven CSS animation.');
    }
  });

  if (hasRaf && !hasCancelRaf) {
    add('medium', 'raf-no-cleanup', file, 0, 'requestAnimationFrame',
      'File starts an animation frame loop but never calls cancelAnimationFrame.',
      'Cancel on unmount and pause on visibilitychange, or the loop leaks.');
  }
  if (hasAdd && !hasRemove && /useEffect|onMounted|connectedCallback/.test(src)) {
    add('medium', 'listener-no-cleanup', file, 0, 'addEventListener',
      'Listener registered in a lifecycle hook with no matching removeEventListener.',
      'Return a teardown that removes it.');
  }
}

function scanStyles(file, src) {
  const lines = src.split('\n');
  let kfDepth = 0;
  let inKeyframes = false;
  let willChangeCount = 0;

  lines.forEach((line, i) => {
    const n = i + 1;

    if (/@keyframes/.test(line)) { inKeyframes = true; kfDepth = 0; }
    if (inKeyframes) {
      kfDepth += (line.match(/\{/g) ?? []).length;
      kfDepth -= (line.match(/\}/g) ?? []).length;
      if (new RegExp(`(^|[{;\\s])(${LAYOUT_PROPS})\\s*:`).test(line) && !/@keyframes/.test(line)) {
        add('high', 'keyframe-layout-prop', file, n, line,
          'Keyframe animates a layout property, so layout runs on the main thread every frame.',
          'Animate transform and opacity instead.');
      }
      if (kfDepth <= 0 && /\}/.test(line)) inKeyframes = false;
    }

    const trans = line.match(new RegExp(`transition(-property)?\\s*:\\s*([^;]*)`));
    if (trans) {
      const value = trans[2];
      if (new RegExp(`\\b(${LAYOUT_PROPS})\\b`).test(value)) {
        add('high', 'transition-layout-prop', file, n, line,
          'Transition on a layout property runs layout on the main thread for its whole duration.',
          'Transition transform and opacity instead, or use FLIP.');
      } else if (/\ball\b/.test(value)) {
        add('medium', 'transition-all', file, n, line,
          'transition: all animates whatever changes, including layout properties.',
          'List the properties explicitly, normally transform and opacity.');
      }
    }

    if (/will-change\s*:/.test(line)) {
      willChangeCount += 1;
      if (/^\s*\*/.test(line) || /will-change\s*:\s*(auto\s*,|.*,.*,)/.test(line)) {
        add('medium', 'will-change-broad', file, n, line,
          'will-change applied broadly promotes many layers and wastes memory.',
          'Apply it to the few elements about to animate, and remove it afterwards.');
      }
    }
  });

  if (willChangeCount > 6) {
    add('low', 'will-change-count', file, 0, 'will-change',
      `${willChangeCount} will-change declarations in one file suggests layer over-promotion.`,
      'Keep it targeted and temporary.');
  }
}

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.') {
      if (SKIP_DIRS.has(e.name)) continue;
    }
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full);
    } else if (e.isFile()) {
      const ext = extname(e.name);
      if (!CODE_EXT.has(ext) && !STYLE_EXT.has(ext)) continue;
      let src;
      try { src = readFileSync(full, 'utf8'); } catch { continue; }
      if (src.length > 2_000_000) continue;
      const relPath = relative(process.cwd(), full);
      const rel = !relPath || relPath.startsWith('..') ? full : relPath;
      if (CODE_EXT.has(ext)) scanCode(rel, src);
      if (STYLE_EXT.has(ext) || ext === '.vue' || ext === '.svelte' || ext === '.astro') scanStyles(rel, src);
    }
  }
}

try { statSync(root); } catch {
  console.error(`Path not found: ${root}`);
  process.exit(2);
}

walk(root);

const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);

if (asJson) {
  console.log(JSON.stringify({ root, count: findings.length, findings }, null, 2));
} else if (findings.length === 0) {
  console.log('No main-thread risks matched. Heuristics only, so profile before concluding.');
} else {
  let current = '';
  for (const f of findings) {
    if (f.severity !== current) {
      current = f.severity;
      console.log(`\n${current.toUpperCase()}`);
    }
    console.log(`  ${f.file}:${f.line || '-'}  [${f.rule}]`);
    console.log(`    ${f.message}`);
    console.log(`    fix: ${f.fix}`);
    if (f.line) console.log(`    > ${f.snippet}`);
  }
  const counts = findings.reduce((acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] ?? 0) + 1 }), {});
  console.log(`\n${findings.length} findings (high: ${counts.high ?? 0}, medium: ${counts.medium ?? 0}, low: ${counts.low ?? 0})`);
  console.log('Heuristic matches. Verify each one and profile before changing code.');
}

if (strict && findings.some((f) => f.severity === 'high')) process.exit(1);
