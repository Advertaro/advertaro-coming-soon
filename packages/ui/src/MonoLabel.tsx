import type { ElementType, ReactNode } from 'react'
import { cn } from './cn'

type MonoLabelProps = {
  children: ReactNode
  as?: ElementType
  /** Use the primary (white) text colour instead of secondary grey. */
  bright?: boolean
  className?: string
}

export function MonoLabel({ children, as: Tag = 'span', bright, className }: MonoLabelProps) {
  return (
    <Tag
      className={cn(
        'font-sans text-[11px] font-medium uppercase tracking-[0.12em]',
        bright ? 'text-white' : 'text-ink-secondary',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** Colour and weight emphasis used inside display headlines. */
export function Em({ children, className }: { children: ReactNode; className?: string }) {
  return (
    // NOTE: data-emphasis lets a parent restyle emphasis without matching every span.
    <span
      data-emphasis
      className={cn('font-bold tracking-[-0.01em] text-ink-editorial', className)}
    >
      {children}
    </span>
  )
}
