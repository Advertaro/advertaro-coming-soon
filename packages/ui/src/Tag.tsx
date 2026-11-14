import type { ReactNode } from 'react'
import { cn } from './cn'

type TagProps = {
  children: ReactNode
  /** Orange index prefix, rendered as "(01)". */
  num?: string
  className?: string
}

/** Mono, uppercase glass pill used for metadata (file names, years, specs). */
export function Tag({ children, num, className }: TagProps) {
  return (
    <span
      className={cn(
        'rounded-full border border-white/12 bg-bg-elevated/75 px-3 py-1.5 font-sans text-[11px] whitespace-nowrap uppercase tracking-[0.12em] text-white backdrop-blur-sm',
        className,
      )}
    >
      {num && <span className="text-accent">({num})</span>}
      {num ? ' — ' : null}
      {children}
    </span>
  )
}
