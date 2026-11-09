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
    <span className={cn('work-tag-pill', className)}>
      {num && <span className="num">({num})</span>}
      {num ? ' — ' : null}
      {children}
    </span>
  )
}
