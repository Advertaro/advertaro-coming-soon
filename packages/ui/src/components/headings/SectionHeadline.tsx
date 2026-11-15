import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../cn'
import { headingVariants, secondaryHeadingType } from './heading-variants'

type SectionHeadlineProps = ComponentPropsWithoutRef<'h2'> & { as?: ElementType }

export function SectionHeadline({ as: Tag = 'h2', className, ...props }: SectionHeadlineProps) {
  return <Tag className={cn(headingVariants(), secondaryHeadingType, className)} {...props} />
}
