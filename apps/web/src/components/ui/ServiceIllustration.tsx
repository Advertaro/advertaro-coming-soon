import type { ServiceSlug } from '@advertaro/content'
import { cn } from '@advertaro/ui'
import type { CSSProperties, ReactNode } from 'react'

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

const line = 'fill-none stroke-line-strong'
const ink = 'fill-none stroke-ink'
const accent = 'fill-none stroke-accent'

const draw = 'animate-illo-draw'
const pulse = 'origin-center animate-illo-pulse [transform-box:fill-box]'
const ping = 'origin-center animate-illo-ping [transform-box:fill-box]'

const branding = (
  <>
    <path d="M130 20V160M60 90H200" className={line} strokeWidth="0.75" />
    <circle
      cx="130"
      cy="90"
      r="58"
      className={`${line} origin-center animate-illo-spin [transform-box:fill-box]`}
      strokeDasharray="3 5"
    />
    <circle cx="130" cy="90" r="26" className={line} strokeDasharray="2 4" />
    <circle
      cx="130"
      cy="90"
      r="42"
      pathLength={1}
      className={`${accent} ${draw}`}
      strokeDasharray={1}
      strokeWidth="2"
    />
    <path
      d="M106 114L130 60L154 114M116 96H144"
      pathLength={1}
      className={`${ink} ${draw}`}
      strokeDasharray={1}
      strokeWidth="3"
      strokeLinejoin="round"
      style={delay(0.5)}
    />
    {['fill-accent', 'fill-accent-soft', 'fill-ink'].map((fill, i) => (
      <rect
        key={fill}
        x={222 + i * 26}
        y="52"
        width="20"
        height="20"
        rx="4"
        className={`${fill} ${pulse}`}
        style={delay(i * 0.4)}
      />
    ))}
    <text x="221" y="112" className="fill-ink font-display text-[30px] font-bold">
      Aa
    </text>
    <path d="M222 122H296M222 132H276" className={line} strokeWidth="2" />
  </>
)

const webDesign = (
  <>
    <rect x="40" y="22" width="240" height="136" rx="8" className={line} strokeWidth="1.5" />
    <path d="M40 42H280" className={line} strokeWidth="1.5" />
    {[52, 62, 72].map((cx) => (
      <circle key={cx} cx={cx} cy="32" r="2.5" className="fill-line-strong" />
    ))}
    <path
      d="M56 64H150"
      pathLength={1}
      className={`${ink} ${draw}`}
      strokeDasharray={1}
      strokeWidth="5"
    />
    <path
      d="M56 78H124"
      pathLength={1}
      className={`${ink} ${draw}`}
      strokeDasharray={1}
      strokeWidth="5"
      style={delay(0.25)}
    />
    <path d="M56 91H140" className={line} strokeWidth="2" />
    <rect x="56" y="100" width="46" height="14" rx="7" className={`fill-accent ${pulse}`} />
    <rect
      x="176"
      y="56"
      width="88"
      height="58"
      rx="4"
      pathLength={1}
      className={`${accent} ${draw}`}
      strokeDasharray={1}
      strokeWidth="1.5"
      style={delay(0.5)}
    />
    <path
      d="M176 100L204 78L226 96L242 84L264 104"
      pathLength={1}
      className={`${accent} ${draw}`}
      strokeDasharray={1}
      style={delay(0.9)}
    />
    {[56, 132, 208].map((x, i) => (
      <rect
        key={x}
        x={x}
        y="126"
        width="56"
        height="20"
        rx="4"
        pathLength={1}
        className={`${line} ${draw}`}
        strokeDasharray={1}
        strokeWidth="1.5"
        style={delay(1 + i * 0.2)}
      />
    ))}
    <path
      d="M84 108l0 14 4-4 3 7 3-1-3-7 6 0z"
      className="animate-illo-cursor fill-ink stroke-bg"
      strokeWidth="1"
    />
  </>
)

const mobileApps = (
  <>
    <clipPath id="illo-screen">
      <rect x="123" y="28" width="74" height="128" />
    </clipPath>
    <g clipPath="url(#illo-screen)">
      <g className="animate-illo-scroll">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(0 ${30 + i * 36})`}>
            <rect x="129" width="62" height="28" rx="6" className={line} strokeWidth="1.5" />
            <circle cx="141" cy="14" r="5" className={i % 2 ? 'fill-accent-soft' : 'fill-accent'} />
            <path d="M152 10H182M152 18H172" className={line} strokeWidth="2" />
          </g>
        ))}
      </g>
    </g>
    <rect x="117" y="12" width="86" height="156" rx="14" className={ink} strokeWidth="2" />
    <path d="M150 21H170" className={ink} strokeWidth="3" strokeLinecap="round" />
    <circle cx="206" cy="24" r="6" className="fill-accent" />
    <circle cx="206" cy="24" r="6" className={`${accent} ${ping}`} />
    <g className="animate-illo-float">
      <rect x="28" y="56" width="70" height="26" rx="7" className={line} strokeWidth="1.5" />
      <circle cx="42" cy="69" r="4" className="fill-accent" />
      <path d="M52 65H88M52 73H76" className={line} strokeWidth="2" />
    </g>
    <g className="animate-illo-float" style={delay(1.5)}>
      <rect x="222" y="104" width="70" height="26" rx="7" className={line} strokeWidth="1.5" />
      <path d="M233 117l4 4 8-9" className={accent} strokeWidth="2" />
      <path d="M254 113H282M254 121H272" className={line} strokeWidth="2" />
    </g>
  </>
)

const AUTOMATION_PATHS = [
  'M76 90C108 90 106 43 138 43',
  'M76 90C108 90 106 137 138 137',
  'M184 43C216 43 214 90 246 90',
  'M184 137C216 137 214 90 246 90',
]

const automation = (
  <>
    {AUTOMATION_PATHS.map((d, i) => (
      <g key={d}>
        <path d={d} className={line} strokeWidth="1.5" strokeDasharray="3 4" />
        <circle
          r="3.5"
          className="animate-illo-travel fill-accent"
          style={{ offsetPath: `path("${d}")`, ...delay(i < 2 ? i * 0.5 : 1.3 + i * 0.3) }}
        />
      </g>
    ))}
    {[
      [30, 77],
      [138, 30],
      [138, 124],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
        <rect width="46" height="26" rx="6" className="fill-bg-card stroke-line-strong" />
        <circle cx="12" cy="13" r="3" className="fill-ink-muted" />
        <path d="M20 13H38" className={line} strokeWidth="2" />
      </g>
    ))}
    <rect x="246" y="72" width="46" height="36" rx="8" className="fill-bg-card stroke-accent" />
    <rect x="246" y="72" width="46" height="36" rx="8" className={`${accent} ${pulse}`} />
    <path
      d="M260 90l6 6 12-13"
      pathLength={1}
      className={`${accent} ${draw}`}
      strokeDasharray={1}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </>
)

const BARS = [24, 38, 32, 56, 68, 92]

const digitalMarketing = (
  <>
    <path d="M48 24V150H288" className={line} strokeWidth="1.5" />
    {[60, 90, 120].map((y) => (
      <path key={y} d={`M48 ${y}H288`} className={line} strokeWidth="0.75" strokeDasharray="2 5" />
    ))}
    {BARS.map((height, i) => (
      <rect
        key={height}
        x={62 + i * 36}
        y={150 - height}
        width="20"
        height={height}
        rx="2"
        className={cn(
          'origin-bottom animate-illo-grow [transform-box:fill-box]',
          i === BARS.length - 1 ? 'fill-accent' : 'fill-bg-card-hover stroke-line-strong',
        )}
        style={delay(i * 0.12)}
      />
    ))}
    <path
      d={`M${BARS.map((height, i) => `${72 + i * 36} ${136 - height}`).join('L')}`}
      pathLength={1}
      className={`${accent} ${draw}`}
      strokeDasharray={1}
      strokeWidth="2"
      strokeLinejoin="round"
      style={delay(0.8)}
    />
    <circle cx="252" cy="44" r="4" className={`fill-accent ${pulse}`} />
    <circle cx="252" cy="44" r="4" className={`${accent} ${ping}`} />
    <path d="M266 40l8-8m0 0h-6m6 0v6" className={ink} strokeWidth="1.5" />
  </>
)

const SCENES: Record<ServiceSlug, ReactNode> = {
  branding,
  'web-design': webDesign,
  'mobile-apps': mobileApps,
  automation,
  'digital-marketing': digitalMarketing,
}

/** Animated line illustration for each service. Decorative. */
export function ServiceIllustration({ slug }: { slug: ServiceSlug }) {
  const gridId = `illo-grid-${slug}`
  return (
    // ponytail: always-on CSS animation; pause off-screen with an IntersectionObserver if profiling shows paint cost.
    <svg
      viewBox="0 0 320 180"
      className="absolute inset-0 size-full motion-reduce:**:animate-none"
      aria-hidden="true"
    >
      <pattern id={gridId} width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.6" className="fill-line-strong" />
      </pattern>
      <rect width="320" height="180" fill={`url(#${gridId})`} />
      {SCENES[slug]}
    </svg>
  )
}
