import type { ElementType, ReactNode } from 'react'
import { cn } from '../../cn'
import { eyebrowVariants } from './heading-variants'

type MonoLabelProps = {
  children: ReactNode
  as?: ElementType
  /** Use the primary (white) text colour instead of secondary grey. */
  bright?: boolean
  className?: string
}

export function MonoLabel({ children, as: Tag = 'span', bright, className }: MonoLabelProps) {
  return (
    <Tag className={cn(eyebrowVariants({ color: bright ? 'primary' : 'secondary' }), className)}>
      {children}
    </Tag>
  )
}
