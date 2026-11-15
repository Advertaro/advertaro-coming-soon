import type { HTMLAttributes } from 'react'
import { cn } from '../../cn'
import { eyebrowVariants, type HeadingVariants } from './heading-variants'

export type EyebrowProps = Omit<HTMLAttributes<HTMLElement>, 'color'> &
  HeadingVariants & {
    as?: 'span' | 'div' | 'p' | 'h2'
  }

export function Eyebrow({ as: Tag = 'span', color, align, className, ...props }: EyebrowProps) {
  return <Tag className={cn(eyebrowVariants({ color, align }), className)} {...props} />
}
