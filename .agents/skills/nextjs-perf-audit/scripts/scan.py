#!/usr/bin/env python3
"""
Heuristic first-pass scanner for Next.js performance issues.

Usage:
  python scan.py <path> [--root <project_root>] [--format json|md] [--max 400]

<path> can be a single file, a feature folder, or a whole project. The scanner walks up from
<path> to find package.json / next.config.* for version and config context, unless --root is given.

Output is a list of CANDIDATE findings keyed to rule IDs in references/checklist.md.
Regex heuristics produce false positives and miss cross-file issues: always confirm by reading
the code before reporting. Stdlib only.
"""
import argparse
import json
import os
import re
import sys
from collections import defaultdict

SKIP_DIRS = {"node_modules", ".next", ".git", "dist", "build", "out", ".turbo", "coverage",
             ".vercel", ".cache", "storybook-static", "__snapshots__"}
CODE_EXT = (".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs", ".mdx")
STYLE_EXT = (".css", ".scss", ".sass")

HEAVY_CLIENT_LIBS = {
    "moment": "moment (~70 kB gz with locales)", "lodash": "full lodash (CommonJS, not tree-shakable)",
    "recharts": "recharts", "chart.js": "chart.js", "react-chartjs-2": "react-chartjs-2",
    "apexcharts": "apexcharts", "react-apexcharts": "react-apexcharts", "echarts": "echarts",
    "echarts-for-react": "echarts", "@nivo/": "nivo charts", "d3": "d3", "plotly": "plotly",
    "monaco-editor": "monaco", "@monaco-editor/react": "monaco", "react-quill": "quill",
    "quill": "quill", "@tiptap/": "tiptap", "slate": "slate", "draft-js": "draft-js",
    "@codemirror/": "codemirror", "react-markdown": "react-markdown", "marked": "marked",
    "remark": "remark", "rehype": "rehype", "prismjs": "prismjs", "shiki": "shiki",
    "highlight.js": "highlight.js", "react-syntax-highlighter": "react-syntax-highlighter",
    "mapbox-gl": "mapbox-gl", "leaflet": "leaflet", "react-leaflet": "react-leaflet",
    "@react-google-maps/api": "google maps", "three": "three.js", "@react-three/": "react-three",
    "jspdf": "jspdf", "pdfjs-dist": "pdf.js", "@react-pdf/renderer": "react-pdf", "xlsx": "xlsx",
    "framer-motion": "framer-motion", "gsap": "gsap", "lottie-web": "lottie", "lottie-react": "lottie",
    "@fullcalendar/": "fullcalendar", "emoji-mart": "emoji-mart", "swiper": "swiper",
    "firebase": "firebase (use modular subpath imports)", "aws-sdk": "aws-sdk v2",
}
CONDITIONAL_UI_NAMES = re.compile(
    r"\b(Modal|Dialog|Drawer|Sheet|Popover|Lightbox|Editor|RichText|Chart|Graph|Map|Calendar|"
    r"DatePicker|EmojiPicker|CommandPalette|CommandMenu|VideoPlayer|Checkout|Wizard)\w*\b")

SEV_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3, "Info": 4}


def read(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception:
        return ""


def find_root(start, explicit):
    if explicit:
        return os.path.abspath(explicit)
    cur = os.path.abspath(start if os.path.isdir(start) else os.path.dirname(start))
    fallback = None
    while True:
        if os.path.exists(os.path.join(cur, "package.json")):
            fallback = fallback or cur
            if any(os.path.exists(os.path.join(cur, f"next.config.{e}")) for e in ("js", "mjs", "ts", "cjs")):
                return cur
            pkg = read(os.path.join(cur, "package.json"))
            if '"next"' in pkg:
                return cur
        parent = os.path.dirname(cur)
        if parent == cur:
            return fallback or os.path.abspath(start if os.path.isdir(start) else os.path.dirname(start))
        cur = parent


def parse_version(v):
    m = re.search(r"(\d+)(?:\.(\d+))?(?:\.(\d+))?", v or "")
    return (int(m.group(1)), int(m.group(2) or 0), int(m.group(3) or 0)) if m else None


def project_context(root):
    ctx = {"root": root, "next_version": None, "react_version": None, "router": [], "config_file": None,
           "config": {}, "deps": [], "notes": []}
    pkg_txt = read(os.path.join(root, "package.json"))
    if pkg_txt:
        try:
            pkg = json.loads(pkg_txt)
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            ctx["deps"] = sorted(deps.keys())
            ctx["next_version"] = deps.get("next")
            ctx["react_version"] = deps.get("react")
        except Exception:
            ctx["notes"].append("package.json could not be parsed")
    for base in ("", "src"):
        if os.path.isdir(os.path.join(root, base, "app")):
            ctx["router"].append("app")
        if os.path.isdir(os.path.join(root, base, "pages")):
            ctx["router"].append("pages")
    ctx["router"] = sorted(set(ctx["router"]))
    for e in ("ts", "mjs", "js", "cjs"):
        p = os.path.join(root, f"next.config.{e}")
        if os.path.exists(p):
            ctx["config_file"] = p
            txt = read(p)
            c = ctx["config"]
            c["cacheComponents"] = bool(re.search(r"cacheComponents\s*:\s*true", txt))
            c["reactCompiler"] = bool(re.search(r"reactCompiler\s*:\s*(true|\{)", txt))
            c["ppr_flag"] = bool(re.search(r"\bppr\s*:", txt))
            c["dynamicIO_flag"] = "dynamicIO" in txt
            c["avif"] = "image/avif" in txt
            c["images_domains"] = bool(re.search(r"\bdomains\s*:\s*\[", txt))
            q = re.search(r"qualities\s*:\s*\[([^\]]*)\]", txt)
            c["qualities"] = [int(x) for x in re.findall(r"\d+", q.group(1))] if q else None
            c["custom_webpack"] = bool(re.search(r"\bwebpack\s*[:(]", txt))
            c["partialPrefetching"] = bool(re.search(r"partialPrefetching\s*:\s*true", txt))
            c["useCache_flag"] = bool(re.search(r"\buseCache\s*:", txt))
            c["optimizePackageImports"] = "optimizePackageImports" in txt
            c["prod_sourcemaps"] = bool(re.search(r"productionBrowserSourceMaps\s*:\s*true", txt))
            m = re.search(r"minimumCacheTTL\s*:\s*(\d+)", txt)
            c["minimumCacheTTL"] = int(m.group(1)) if m else None
            break
    return ctx


def iter_files(target):
    if os.path.isfile(target):
        yield os.path.abspath(target)
        return
    for d, dirs, files in os.walk(target):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS and not x.startswith(".")]
        for f in files:
            if f.endswith(CODE_EXT + STYLE_EXT) and not f.endswith(".d.ts"):
                yield os.path.join(d, f)


def is_client(src):
    head = src.lstrip()[:200]
    return bool(re.match(r"""(?:/\*.*?\*/\s*|//[^\n]*\n\s*)*['"]use client['"]""", head, re.S))


def line_of(src, idx):
    return src.count("\n", 0, idx) + 1


def snippet(src, idx, width=110):
    start = src.rfind("\n", 0, idx) + 1
    end = src.find("\n", idx)
    return src[start:end if end != -1 else None].strip()[:width]


class Findings:
    def __init__(self, root):
        self.root = root
        self.items = []
        self.seen = set()

    def add(self, rule, sev, path, line, msg, code="", confidence="medium"):
        rel = os.path.relpath(path, self.root) if path else "(project)"
        key = (rule, rel, line, msg)
        if key in self.seen:
            return
        self.seen.add(key)
        self.items.append({"rule": rule, "severity": sev, "file": rel, "line": line,
                           "message": msg, "code": code, "confidence": confidence})


def scan_file(path, src, ctx, F, font_calls, barrel_importers):
    name = os.path.basename(path)
    rel = path.replace("\\", "/")
    client = is_client(src)
    in_app = "/app/" in rel
    in_pages = "/pages/" in rel
    nv = parse_version(ctx["next_version"]) or (0, 0, 0)
    v16 = nv[0] >= 16
    v15 = nv[0] >= 15
    cfg = ctx["config"]
    is_jsx = path.endswith((".tsx", ".jsx", ".js"))

    if path.endswith(STYLE_EXT):
        for m in re.finditer(r"@import\s+url\([^)]*fonts\.(googleapis|bunny|gstatic)", src):
            F.add("FONT-01", "High", path, line_of(src, m.start()), "External font @import in CSS", snippet(src, m.start()))
        return

    # ---------- boundaries ----------
    if client and in_app and re.match(r"(page|layout|template)\.(t|j)sx?$", name):
        F.add("RSC-01", "High", path, 1, f"'use client' on a route {name.split('.')[0]}; whole subtree ships as client JS", "'use client'")

    imports = list(re.finditer(r"""^\s*import\s+(.+?)\s+from\s+['"]([^'"]+)['"]""", src, re.M))
    for m in imports:
        spec, mod = m.group(1), m.group(2)
        ln = line_of(src, m.start())
        for lib, label in HEAVY_CLIENT_LIBS.items():
            hit = mod == lib or (lib.endswith("/") and mod.startswith(lib)) or mod.startswith(lib + "/")
            if hit and client and "type " not in spec[:5]:
                sev = "Critical" if lib in ("moment", "lodash", "monaco-editor", "@monaco-editor/react", "three", "plotly") else "High"
                rule = "BND-06" if lib in ("framer-motion", "gsap") else "RSC-02"
                F.add(rule, sev if rule == "RSC-02" else "Medium", path, ln,
                      f"Client component statically imports {label}; render on server or lazy load", snippet(src, m.start()))
        if mod == "lodash" and not client:
            F.add("BND-01", "Low", path, ln, "Full lodash import (server-side, lower impact)", snippet(src, m.start()))
        if re.match(r"\*\s+as\s+\w+", spec) and client and not mod.startswith((".", "@/", "~/")) and mod not in ("react", "react-dom"):
            F.add("BND-01", "Medium", path, ln, f"Namespace import from '{mod}' in client code may defeat tree shaking", snippet(src, m.start()), "low")
        if client and CONDITIONAL_UI_NAMES.search(spec) and mod.startswith((".", "@/", "~/")):
            F.add("BND-03", "Medium", path, ln, "Statically imported conditional UI; check if it renders only after interaction and lazy load it",
                  snippet(src, m.start()), "low")
        if client and mod.startswith((".", "@/", "~/")):
            barrel_importers.append((path, ln, mod))
        if mod in ("styled-components", "@emotion/styled", "@emotion/react") and in_app:
            F.add("INP-07", "Medium", path, ln, "Runtime CSS-in-JS in App Router", snippet(src, m.start()))

    # font instances
    fm = re.search(r"""from\s+['"]next/font/(google|local)['"]""", src)
    if fm:
        for m in re.finditer(r"(?:const|let)\s+\w+\s*=\s*([A-Z][A-Za-z_]+|localFont)\s*\(", src):
            font_calls[m.group(1)].append((path, line_of(src, m.start())))

    # ---------- data ----------
    if client:
        for m in re.finditer(r"useEffect\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*\{", src):
            depth, j = 1, m.end()
            while j < len(src) and depth and j - m.end() < 2000:
                depth += {"{": 1, "}": -1}.get(src[j], 0)
                j += 1
            body = src[m.end(): j]
            if re.search(r"\bfetch\s*\(|axios\.|\.get\(\s*['\"`]/api", body):
                F.add("RSC-03", "High", path, line_of(src, m.start()), "Data fetched in useEffect on mount; consider server fetch or use() with a passed promise",
                      snippet(src, m.start()))
    else:
        for m in re.finditer(r"""fetch\s*\(\s*[`'"](?:\$\{[^}]+\})?/api/""", src):
            if in_app or in_pages:
                F.add("RSC-04", "Medium", path, line_of(src, m.start()), "Server code fetching its own Route Handler; call the data function directly",
                      snippet(src, m.start()))

    lines = src.split("\n")
    await_re = re.compile(r"^\s*(?:const|let|var)\s+(\{[^}]*\}|\[[^\]]*\]|\w+)\s*=\s*await\s+(.+)")
    prev = None
    for i, ln_txt in enumerate(lines):
        m = await_re.match(ln_txt)
        if m:
            names = re.findall(r"\w+", m.group(1))
            rhs = m.group(2)
            if prev and i - prev[0] <= 2:
                if not any(re.search(rf"\b{re.escape(n)}\b", rhs) for n in prev[1]) and "Promise.all" not in rhs:
                    F.add("DATA-01", "High", path, i + 1, "Sequential awaits that look independent (possible waterfall)", ln_txt.strip()[:110])
            prev = (i, names)
        elif ln_txt.strip() and not ln_txt.strip().startswith("//"):
            if prev and i - prev[0] > 2:
                prev = None
    for m in re.finditer(r"for\s*\((?:const|let)\s+\w+\s+of[^)]*\)\s*\{[^}]{0,200}?\bawait\b", src):
        F.add("DATA-05", "High", path, line_of(src, m.start()), "await inside a loop (serial requests / possible N+1)", snippet(src, m.start()))
    for m in re.finditer(r"\.map\(\s*async\b", src):
        body = src[m.start() - 60: m.start()]
        if "Promise.all" not in body:
            F.add("DATA-05", "Medium", path, line_of(src, m.start()), ".map(async ...) not wrapped in Promise.all, or per-item queries", snippet(src, m.start()), "low")

    # ---------- caching / request APIs ----------
    if not client and (in_app or in_pages):
        for m in re.finditer(r"""export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]""", src):
            F.add("CACHE-03", "High", path, line_of(src, m.start()), "Route forced fully dynamic", snippet(src, m.start()))
        if cfg.get("cacheComponents"):
            for m in re.finditer(r"export\s+const\s+(revalidate|dynamic|fetchCache|experimental_ppr)\s*=", src):
                F.add("CACHE-04", "Medium", path, line_of(src, m.start()), f"Segment config '{m.group(1)}' is not supported with Cache Components", snippet(src, m.start()))
        if re.match(r"layout\.(t|j)sx?$", name):
            for m in re.finditer(r"\b(cookies|headers)\s*\(\s*\)", src):
                F.add("CACHE-03", "High", path, line_of(src, m.start()), f"{m.group(1)}() read in a layout makes every child route dynamic", snippet(src, m.start()))
    if v15:
        for m in re.finditer(r"\b(cookies|headers|draftMode)\s*\(\s*\)\s*\.", src):
            F.add("CACHE-08", "Critical" if v16 else "Medium", path, line_of(src, m.start()),
                  f"Synchronous {m.group(1)}() access (async since 15, removed in 16)", snippet(src, m.start()))
        if in_app and re.match(r"(page|layout|route|default|template)\.(t|j)sx?$", name) or "generateMetadata" in src:
            if re.search(r"\b(params|searchParams)\.\w", src) and not re.search(r"await\s+(props\.)?(params|searchParams)|use\(\s*(props\.)?(params|searchParams)", src):
                m = re.search(r"\b(params|searchParams)\.\w", src)
                F.add("CACHE-08", "Critical" if v16 else "Medium", path, line_of(src, m.start()),
                      f"{m.group(1)} accessed synchronously; it is a Promise since 15", snippet(src, m.start()))
    if v16:
        for m in re.finditer(r"\bunstable_cache\s*\(", src):
            F.add("CACHE-05", "Low", path, line_of(src, m.start()), "unstable_cache is superseded by 'use cache'", snippet(src, m.start()))
        for m in re.finditer(r"revalidateTag\(\s*[^,()]+\)", src):
            F.add("CACHE-07", "Low", path, line_of(src, m.start()), "Single-argument revalidateTag is deprecated in 16", snippet(src, m.start()))

    # ---------- images ----------
    if is_jsx:
        for m in re.finditer(r"<img\b[^>]*>", src, re.S):
            tag = m.group(0)
            if re.search(r"""src=\{?['"`][^'"`]*\.svg""", tag):
                continue
            F.add("IMG-01", "High", path, line_of(src, m.start()), "Raw <img>; use next/image or verify manual srcset/dimensions/priority", snippet(src, m.start()))
        uses_image = re.search(r"""from\s+['"]next/(legacy/)?image['"]""", src)
        if uses_image:
            if "next/legacy/image" in src:
                F.add("IMG-01", "Medium", path, 1, "next/legacy/image in use; migrate to next/image", "next/legacy/image")
            tags = list(re.finditer(r"<Image\b(.*?)/?>", src, re.S))
            prio = [t for t in tags if re.search(r"\bpriority\b", t.group(1))]
            for t in tags:
                attrs = t.group(1)
                ln = line_of(src, t.start())
                if re.search(r"\bfill\b", attrs) and "sizes" not in attrs:
                    F.add("IMG-04", "High", path, ln, "<Image fill> without sizes; browser assumes 100vw", snippet(src, t.start()))
                if re.search(r"""src=\{?\s*['"`]https?://""", attrs) and not re.search(r"\b(width|fill)\b", attrs):
                    F.add("IMG-05", "High", path, ln, "Remote image without width/height or fill (CLS)", snippet(src, t.start()))
                if re.search(r"\bpriority\b", attrs) and v16:
                    F.add("IMG-02", "High", path, ln, "priority is deprecated in 16 (reported to emit no preload); use loading='eager'/fetchPriority='high', or preload for a single LCP image", snippet(src, t.start()))
                q = re.search(r"quality=\{?\s*(\d+)", attrs)
                if q and v16:
                    allowed = cfg.get("qualities") or [75]
                    if int(q.group(1)) not in allowed:
                        F.add("IMG-07", "Medium", path, ln, f"quality={q.group(1)} not in images.qualities {allowed}; it will be coerced", snippet(src, t.start()))
                if re.search(r"""placeholder=['"{]\s*['"]?blur""", attrs) and re.search(r"""src=\{?\s*['"`]https?://""", attrs) and "blurDataURL" not in attrs:
                    F.add("IMG-10", "Low", path, ln, "Remote blur placeholder without blurDataURL", snippet(src, t.start()))
                if re.search(r"layout=['\"]", attrs):
                    F.add("IMG-04", "Low", path, ln, "Legacy layout prop on Image; use fill/sizes", snippet(src, t.start()))
            if len(prio) > 2 or any(re.search(r"\.map\(", src[max(0, t.start() - 300): t.start()]) for t in prio):
                F.add("IMG-03", "Medium", path, line_of(src, prio[0].start()) if prio else 1,
                      f"{len(prio)} prioritized images in file or priority inside a list; prioritize only the LCP image", "")
        for m in re.finditer(r"<iframe\b[^>]*>", src, re.S):
            if "loading=" not in m.group(0):
                F.add("SCR-05", "High", path, line_of(src, m.start()), "Iframe without loading='lazy' (or use a facade)", snippet(src, m.start()))

    # ---------- fonts / scripts ----------
    for m in re.finditer(r"fonts\.googleapis\.com|use\.typekit\.net|fonts\.bunny\.net", src):
        F.add("FONT-01", "High", path, line_of(src, m.start()), "External font stylesheet; use next/font", snippet(src, m.start()))
    if is_jsx:
        for m in re.finditer(r"<script\b[^>]*\bsrc=", src):
            F.add("SCR-01", "High", path, line_of(src, m.start()), "Raw <script src>; use next/script with an explicit strategy", snippet(src, m.start()))
        for m in re.finditer(r"<Script\b(.*?)/?>", src, re.S):
            a = m.group(1)
            ln = line_of(src, m.start())
            if 'strategy="worker"' in a or "strategy='worker'" in a:
                F.add("SCR-04", "Low", path, ln, "worker strategy is experimental and unsupported in App Router", snippet(src, m.start()))
            if "beforeInteractive" in a:
                if "onLoad" in a:
                    F.add("SCR-03", "Medium", path, ln, "onLoad does not fire for beforeInteractive scripts", snippet(src, m.start()))
                if in_app and not re.search(r"app/layout\.(t|j)sx?$", rel) and in_app:
                    F.add("SCR-03", "Medium", path, ln, "beforeInteractive outside the root layout", snippet(src, m.start()))
            if re.search(r"afterInteractive", a) and re.search(r"(intercom|drift|crisp|tawk|hotjar|zendesk|hubspot|facebook|twitter|disqus|livechat|clarity)", a, re.I):
                F.add("SCR-02", "Medium", path, ln, "Non-critical widget on afterInteractive; use lazyOnload or a facade", snippet(src, m.start()))

    # ---------- dynamic import misuse ----------
    if not client:
        for m in re.finditer(r"dynamic\s*\([^;]*?ssr\s*:\s*false", src, re.S):
            F.add("BND-04", "High", path, line_of(src, m.start()), "next/dynamic with ssr:false in a Server Component (error since 15)", snippet(src, m.start()))

    # ---------- INP / hydration ----------
    if client:
        for m in re.finditer(r"set(Is)?(Mounted|Hydrated|Client)\s*\(\s*true\s*\)", src):
            F.add("HYD-02", "Medium", path, line_of(src, m.start()), "isMounted/isHydrated pattern (second render, possible CLS)", snippet(src, m.start()))
        body_no_effects = re.sub(r"useEffect\s*\(.*?\n\s*\}\s*,", "", src, flags=re.S)
        for m in re.finditer(r"\b(Math\.random\(\)|Date\.now\(\)|new Date\(\)\.toLocale\w*\()", body_no_effects):
            F.add("HYD-01", "Medium", path, None, f"{m.group(1)} in a client component may cause a hydration mismatch if used during render",
                  snippet(body_no_effects, m.start()), "low")
        for m in re.finditer(r"addEventListener\(\s*['\"](scroll|resize|mousemove|pointermove)['\"]", src):
            ctxwin = src[m.start(): m.start() + 200]
            if "passive" not in ctxwin and "throttle" not in src and "requestAnimationFrame" not in src:
                F.add("INP-05", "Medium", path, line_of(src, m.start()), f"Unthrottled {m.group(1)} listener", snippet(src, m.start()))
    if is_jsx and cfg.get("cacheComponents") and not cfg.get("partialPrefetching") and nv[:2] >= (16, 3):
        for m in re.finditer(r"<Link\b[^>]*prefetch=\{\s*true\s*\}", src, re.S):
            F.add("NAV-04", "Medium", path, line_of(src, m.start()), "prefetch={true} with Cache Components but no partialPrefetching is a legacy full prefetch", snippet(src, m.start()))
    if is_jsx:
        for m in re.finditer(r"""<a\s[^>]*href=['"{]\s*['"]?/(?!/)""", src):
            F.add("NAV-01", "Medium", path, line_of(src, m.start()), "Internal <a href>; use next/link", snippet(src, m.start()))

    # ---------- runtime / middleware ----------
    for m in re.finditer(r"""export\s+const\s+runtime\s*=\s*['"]edge['"]""", src):
        F.add("RT-03", "High" if nv[:2] >= (16, 3) else "Medium", path, line_of(src, m.start()),
              "Edge runtime: deprecated in Next 16.3 (unsupported on Vercel from 16.3); move to Node.js", snippet(src, m.start()))
    if re.match(r"(middleware|proxy)\.(t|j)s$", name):
        if name.startswith("middleware") and v16:
            F.add("RT-01", "Low", path, 1, "middleware.ts is deprecated in 16; rename to proxy.ts", name)
        if "matcher" not in src:
            F.add("RT-02", "High", path, 1, "No matcher: runs on every request including assets", name)
        if re.search(r"\bawait\s+(fetch|db\.|prisma\.|sql`|drizzle)", src):
            F.add("RT-02", "High", path, 1, "Network/DB work inside middleware/proxy on every matched request", "")

    # ---------- pages router ----------
    if in_pages:
        for m in re.finditer(r"export\s+(?:const|async function)\s+getServerSideProps", src):
            F.add("PR-01", "Medium", path, line_of(src, m.start()), "getServerSideProps: confirm content is per-request; otherwise SSG/ISR", snippet(src, m.start()), "low")
        for m in re.finditer(r"^(?:const|let)\s+\w+\s*=\s*new\s+Map\(\)", src, re.M):
            F.add("PR-02", "Medium", path, line_of(src, m.start()), "Module-level Map used as cache (per-instance, unbounded in serverless)", snippet(src, m.start()), "low")
        if re.match(r"_app\.(t|j)sx?$", name):
            n = len(imports)
            if n > 12:
                F.add("PR-04", "High", path, 1, f"_app has {n} imports; everything here ships on every page", "")

    # ---------- memoization density (for compiler recommendation) ----------
    return len(re.findall(r"\b(useCallback|useMemo|React\.memo|memo)\s*\(", src))


def check_barrels(barrel_importers, root, F):
    cache = {}

    def resolve(from_file, mod):
        if mod.startswith(("@/", "~/")):
            for base in ("src", ""):
                cand = os.path.join(root, base, mod[2:])
                if os.path.exists(cand) or any(os.path.exists(cand + e) for e in CODE_EXT):
                    return cand
            return None
        return os.path.normpath(os.path.join(os.path.dirname(from_file), mod))

    for path, ln, mod in barrel_importers:
        target = resolve(path, mod)
        if not target or not os.path.isdir(target):
            continue
        idx = next((os.path.join(target, f"index{e}") for e in (".ts", ".tsx", ".js", ".jsx") if os.path.exists(os.path.join(target, f"index{e}"))), None)
        if not idx:
            continue
        if idx not in cache:
            cache[idx] = len(re.findall(r"^\s*export\s+(\*|\{)", read(idx), re.M))
        if cache[idx] >= 8:
            F.add("BND-02", "Medium", path, ln, f"Client file imports barrel '{mod}' re-exporting {cache[idx]} modules", "", "medium")


def project_checks(ctx, F, memo_count, font_calls, scanned_whole_project):
    nv = parse_version(ctx["next_version"])
    cfg = ctx["config"]
    root = ctx["root"]
    if nv and nv[0] < 15:
        F.add("CFG-01", "High", None, None, f"Next.js {ctx['next_version']}: upgrading to 16 unlocks async APIs, Turbopack builds, Cache Components, React Compiler support")
    if nv and nv[0] >= 16 and "app" in ctx["router"] and cfg and not cfg.get("cacheComponents"):
        F.add("CACHE-01", "Medium", None, None, "Cache Components not enabled (PPR, 'use cache')", "", "low")
    if cfg.get("ppr_flag") or cfg.get("dynamicIO_flag") or cfg.get("useCache_flag"):
        F.add("CFG-05", "Low", ctx["config_file"], None, "experimental ppr/dynamicIO/useCache flags; use cacheComponents: true")
    if nv and nv[:2] >= (16, 3) and cfg.get("cacheComponents") and not cfg.get("partialPrefetching"):
        F.add("NAV-04", "Medium", ctx["config_file"], None, "Cache Components on without partialPrefetching (Instant Navigations)")
    if cfg.get("avif") and nv and ((nv[0] == 16 and nv < (16, 3, 4)) or (nv[0] == 15 and nv < (15, 5, 25)) or nv[0] < 15):
        F.add("IMG-11", "Critical", ctx["config_file"], None, f"AVIF enabled on next {ctx['next_version']}: vulnerable to the Aug 2026 libheif RCE; upgrade to latest patch")
    if nv and ((nv[0] == 16 and nv < (16, 3, 6)) or (nv[0] == 15 and nv < (15, 5, 26))):
        F.add("CFG-01", "High", None, None, f"next {ctx['next_version']} is below the latest security patch (16.3.6 / 15.5.26 as of 2026-09-22)", "", "medium")
    if nv and nv[0] >= 16 and cfg is not None and not cfg.get("reactCompiler"):
        sev = "Medium" if memo_count >= 15 else "Low"
        F.add("INP-01", sev, None, None, f"React Compiler not enabled ({memo_count} manual memo calls found)")
    if cfg and not cfg.get("avif") and ctx["config_file"]:
        F.add("IMG-06", "Low", ctx["config_file"], None, "images.formats does not include AVIF", "", "low")
    if cfg.get("images_domains"):
        F.add("IMG-08", "Low", ctx["config_file"], None, "images.domains is deprecated; use remotePatterns")
    if cfg.get("custom_webpack") and nv and nv[0] >= 16:
        F.add("CFG-02", "Low", ctx["config_file"], None, "Custom webpack config with Turbopack as default bundler")
    if cfg.get("prod_sourcemaps"):
        F.add("CFG-04", "Low", ctx["config_file"], None, "productionBrowserSourceMaps enabled")
    if cfg.get("minimumCacheTTL") is not None and cfg["minimumCacheTTL"] < 3600:
        F.add("IMG-09", "Low", ctx["config_file"], None, f"minimumCacheTTL={cfg['minimumCacheTTL']}s is short")
    if os.path.exists(os.path.join(root, ".babelrc")) or os.path.exists(os.path.join(root, "babel.config.js")):
        F.add("CFG-03", "Medium", None, None, "Babel config present; disables SWC transforms")
    deps = set(ctx["deps"])
    groups = [("date", {"moment", "dayjs", "date-fns", "luxon"}), ("animation", {"framer-motion", "motion", "gsap", "react-spring"}),
              ("icons", {"react-icons", "lucide-react", "@heroicons/react", "@tabler/icons-react", "@fortawesome/react-fontawesome"}),
              ("data fetching", {"swr", "@tanstack/react-query", "react-query", "@apollo/client", "urql"}),
              ("charts", {"recharts", "chart.js", "apexcharts", "echarts", "@nivo/core", "victory"})]
    for label, g in groups:
        both = sorted(deps & g)
        if len(both) > 1:
            F.add("BND-05", "Medium", None, None, f"Multiple {label} libraries: {', '.join(both)}")
    for fn, calls in font_calls.items():
        files = {c[0] for c in calls}
        if len(files) > 1:
            F.add("FONT-02", "Medium", calls[0][0], calls[0][1], f"Font '{fn}' instantiated in {len(files)} files; define once and share")


def check_loading_states(target, root, F):
    app_dirs = [os.path.join(root, b, "app") for b in ("", "src") if os.path.isdir(os.path.join(root, b, "app"))]
    for app in app_dirs:
        for d, dirs, files in os.walk(app):
            dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
            page = next((f for f in files if re.match(r"page\.(t|j)sx?$", f)), None)
            if not page or not os.path.abspath(d).startswith(os.path.abspath(target) if os.path.isdir(target) else os.path.dirname(os.path.abspath(target))):
                continue
            src = read(os.path.join(d, page))
            if "await" not in src or "Suspense" in src:
                continue
            has_loading = False
            cur = d
            while cur.startswith(app):
                if any(re.match(r"loading\.(t|j)sx?$", f) for f in os.listdir(cur)):
                    has_loading = True
                    break
                cur = os.path.dirname(cur)
            if not has_loading:
                F.add("STR-01", "Medium", os.path.join(d, page), None, "Async page with no loading.tsx or Suspense boundary", "", "low")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--root")
    ap.add_argument("--format", default="json", choices=["json", "md"])
    ap.add_argument("--max", type=int, default=400)
    a = ap.parse_args()
    target = os.path.abspath(a.path)
    if not os.path.exists(target):
        print(json.dumps({"error": f"path not found: {target}"}))
        sys.exit(1)
    root = find_root(target, a.root)
    ctx = project_context(root)
    F = Findings(root)
    font_calls = defaultdict(list)
    barrels = []
    memo = 0
    nfiles = 0
    for p in iter_files(target):
        nfiles += 1
        memo += scan_file(p, read(p), ctx, F, font_calls, barrels) or 0
    check_barrels(barrels, root, F)
    whole = os.path.abspath(target) == os.path.abspath(root)
    project_notes = []
    PF = Findings(root)
    project_checks(ctx, PF, memo, font_calls, whole)
    if whole:
        F.items.extend(PF.items)
    else:
        # Narrow scope: keep file-anchored project findings, park config-level ones as notes.
        F.items.extend(i for i in PF.items if i["rule"] == "FONT-02")
        project_notes = [i for i in PF.items if i["rule"] != "FONT-02"]
    check_loading_states(target, root, F)
    items = sorted(F.items, key=lambda x: (SEV_ORDER[x["severity"]], x["rule"], x["file"], x["line"] or 0))
    out = {"context": {k: v for k, v in ctx.items() if k != "deps"}, "files_scanned": nfiles,
           "scope": os.path.relpath(target, root), "finding_count": len(items),
           "by_rule": {}, "findings": items[: a.max],
           "project_notes": project_notes,
           "reminder": "Candidates only. Confirm each by reading code; add issues regex cannot see."}
    for it in items:
        out["by_rule"][it["rule"]] = out["by_rule"].get(it["rule"], 0) + 1
    if a.format == "json":
        print(json.dumps(out, indent=1))
    else:
        c = out["context"]
        print(f"# Scan: {out['scope']}  ({nfiles} files)\nnext={c['next_version']} react={c['react_version']} router={c['router']} config={c['config']}\n")
        for it in out["findings"]:
            loc = f"{it['file']}:{it['line']}" if it["line"] else it["file"]
            print(f"- [{it['severity']}] {it['rule']} {loc} :: {it['message']} ({it['confidence']})")
            if it["code"]:
                print(f"    `{it['code']}`")
        if out["project_notes"]:
            print("\n## Project-level notes (outside requested scope)")
            for it in out["project_notes"]:
                print(f"- [{it['severity']}] {it['rule']} :: {it['message']}")


if __name__ == "__main__":
    main()
