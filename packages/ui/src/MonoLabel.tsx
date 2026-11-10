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
  return <Tag className={cn('mono-label', bright && 'text-white', className)}>{children}</Tag>
}

/** Colour and weight emphasis used inside display headlines. */
export function Em({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-emphasis', className)}>{children}</span>
}
