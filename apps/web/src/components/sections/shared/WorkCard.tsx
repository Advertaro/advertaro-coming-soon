import type { CaseStudy } from '@advertaro/content'
import { cn, Tag } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'

type WorkCardProps = {
  study: CaseStudy
  index: number
  /** Marquee direction alternates per card. */
  reverse?: boolean
  showOutcome?: boolean
  className?: string
}

/** Large project card with a scrolling marquee title — the prototype's "Selected Work" card. */
export function WorkCard({ study, index, reverse, showOutcome, className }: WorkCardProps) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <Link href={`/work/${study.slug}`} className={cn('work-card', className)} data-wipe>
      <div className="work-card-media">
        <FilmStill theme={study.theme} />
      </div>
      <div className="work-card-shade" />

      <div className="work-card-top">
        <Tag num={num}>{study.industry}</Tag>
        <Tag>{study.year}</Tag>
      </div>

      <div className="work-card-center" aria-hidden="true">
        <div
          className="work-marquee-track"
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {[0, 1, 2, 3].map((n) => (
            <span className="work-title-word" key={n}>
              {study.title}
            </span>
          ))}
        </div>
      </div>

      <div className="work-card-bottom">
        <div className="work-meta-left">
          <h3 className="sr-only">{study.client}</h3>
          <h4>{study.deliverable}</h4>
          {showOutcome && <p className="work-outcome">{study.outcome}</p>}
        </div>
        <div className="work-meta-right">
          <Tag>{study.slug.replaceAll('-', '_')}_live · View case</Tag>
          {study.stack[0] && <Tag>{study.stack[0]}</Tag>}
          <Tag>{study.year}</Tag>
        </div>
      </div>
    </Link>
  )
}
