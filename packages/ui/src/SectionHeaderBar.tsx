import { cn } from './cn'

type SectionHeaderBarProps = {
  /** Section index, rendered as "(02)". */
  num?: string
  label: string
  id?: string
  className?: string
}

/** A simple numbered section label. */
export function SectionHeaderBar({ num, label, id, className }: SectionHeaderBarProps) {
  return (
    <div id={id} className={cn('section-header-bar', className)}>
      <div className="left-tag">
        {num && <span className="num">({num})</span>}
        {num ? ` — ${label}` : label}
      </div>
    </div>
  )
}
