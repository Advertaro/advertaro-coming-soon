import { cn } from './cn'

export type Stat = { value: string; label: string }

/** Full-bleed 4-column metrics bar with mono indices. */
export function StatsGrid({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 border-y border-line lg:grid-cols-4', className)}>
      {stats.map((stat, i) => (
        <div
          className="relative flex flex-col justify-between gap-[18px] border-r border-line px-7 py-9 last:border-r-0 max-lg:nth-2:border-r-0 max-lg:nth-[-n+2]:border-b"
          key={stat.label}
        >
          <span className="font-sans text-[11px] tracking-[0.12em] text-accent">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="text-[length:clamp(40px,5vw,68px)] font-extrabold leading-none tracking-[-0.04em] text-white">
            {stat.value}
          </div>
          <span className="font-sans text-[11.5px] uppercase tracking-[0.1em] text-ink-secondary">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
