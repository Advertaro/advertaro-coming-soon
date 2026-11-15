import type { CaseStudy } from '@advertaro/content'
import { cn, QuaternaryHeading, Tag } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'

type WorkCardProps = {
  study: CaseStudy
  index: number
  /** Marquee direction alternates per card. */
  reverse?: boolean
  showOutcome?: boolean
  /** Compact grid-cell sizing (4/3.4 card, smaller marquee). Defaults to `showOutcome`, which only the /work and service grids set. */
  grid?: boolean
  className?: string
}

/** Large project card with a scrolling marquee title — the prototype's "Selected Work" card. */
export function WorkCard({
  study,
  index,
  reverse,
  showOutcome,
  grid = showOutcome,
  className,
}: WorkCardProps) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        'group relative flex max-h-170 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[18px] border border-line bg-bg-card',
        grid
          ? 'aspect-4/5 px-6 py-5.5 md:aspect-[4/3.4]'
          : 'aspect-4/5 p-5 sm:aspect-video sm:px-8 sm:py-7',
        className,
      )}
      data-wipe
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FilmStill
          theme={study.theme}
          className="transition-[scale] duration-650 ease-out-expo group-hover:scale-[1.035]"
        />
      </div>
      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(10,10,11,0.72)_0%,rgba(10,10,11,0.18)_45%,rgba(10,10,11,0.86)_100%)]" />

      <div className="relative z-3 flex items-center justify-between gap-4">
        <Tag num={num}>{study.industry}</Tag>
        <Tag>{study.year}</Tag>
      </div>

      <div
        className="relative z-3 flex items-center justify-center overflow-hidden py-4"
        aria-hidden="true"
      >
        <div
          className={cn(
            'flex animate-marquee items-center gap-12 whitespace-nowrap',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {[0, 1, 2, 3].map((n) => (
            <span
              className={cn(
                "inline-flex items-center gap-12 font-display font-extrabold tracking-[-0.04em] text-white [text-shadow:0_10px_30px_rgba(0,0,0,0.5)] after:text-[0.35em] after:text-accent after:content-['•']",
                grid ? 'text-[length:clamp(36px,5vw,72px)]' : 'text-[length:clamp(44px,7vw,96px)]',
              )}
              key={n}
            >
              {study.title}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-3 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="sr-only">{study.client}</h3>
          <QuaternaryHeading color="primary">{study.deliverable}</QuaternaryHeading>
          {showOutcome && (
            <p className="mt-1.5 max-w-105 text-sm/[inherit] text-ink-editorial">{study.outcome}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 [&>:not(:first-child)]:hidden sm:[&>:not(:first-child)]:block">
          <Tag>{study.slug.replaceAll('-', '_')}_live · View case</Tag>
          {study.stack[0] && <Tag>{study.stack[0]}</Tag>}
          <Tag>{study.year}</Tag>
        </div>
      </div>
    </Link>
  )
}
