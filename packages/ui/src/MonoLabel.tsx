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

/** Serif-italic emphasis used inside display headlines. */
export function Em({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('serif-italic', className)}>{children}</span>
}
