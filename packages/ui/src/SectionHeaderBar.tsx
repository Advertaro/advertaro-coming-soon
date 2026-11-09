import { cn } from './cn'

type SectionHeaderBarProps = {
  /** Section index, rendered as "(02)". */
  num?: string
  label: string
  /** Right-hand timecode, e.g. "00:02:00:00". */
  timecode?: string
  center?: string
  id?: string
  className?: string
  /** Render the ruler-ticks strip underneath. */
  ticks?: boolean
}

/** Technical timecode strip that opens every section. */
export function SectionHeaderBar({
  num,
  label,
  timecode,
  center = '+',
  id,
  className,
  ticks = true,
}: SectionHeaderBarProps) {
  return (
    <>
      <div id={id} className={cn('section-header-bar', className)}>
        <div className="left-tag">
          {num && <span className="num">({num})</span>}
          {num ? ` — ${label}` : label}
        </div>
        <div className="center-cross" aria-hidden="true">
          {center}
        </div>
        <div className="right-tc">{timecode}</div>
      </div>
      {ticks && <RulerTicks />}
    </>
  )
}

export function RulerTicks({ className }: { className?: string }) {
  return <div className={cn('ruler-ticks', className)} aria-hidden="true" />
}
