import { cn } from './cn'

export type Stat = { value: string; label: string }

/** Full-bleed 4-column metrics bar with mono indices. */
export function StatsGrid({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div className={cn('stats-grid', className)}>
      {stats.map((stat, i) => (
        <div className="stat-cell" key={stat.label}>
          <span className="stat-idx">{String(i + 1).padStart(2, '0')}</span>
          <div className="stat-value">{stat.value}</div>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
