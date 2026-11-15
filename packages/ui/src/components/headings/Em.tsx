import type { ReactNode } from 'react'
import { cn } from '../../cn'

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
