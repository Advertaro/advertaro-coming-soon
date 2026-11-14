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
    <div
      id={id}
      className={cn(
        'relative flex scroll-mt-nav items-center border-y border-line bg-bg/90 px-5 py-3.5 font-sans text-[10px] uppercase tracking-[0.14em] text-ink-secondary sm:px-8 sm:py-4 sm:text-[11px]',
        className,
      )}
    >
      <div className="flex items-center gap-2 font-semibold text-ink">
        {num && <span className="text-accent">({num})</span>}
        {num ? ` — ${label}` : label}
      </div>
    </div>
  )
}
