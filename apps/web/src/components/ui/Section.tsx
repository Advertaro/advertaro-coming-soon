import { cn } from '@advertaro/ui'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  as?: ElementType
  /** Shorter vertical padding (64px / 72px instead of 88px / 104px). */
  tight?: boolean
}

export function Section({ as: Tag = 'section', tight, className, ...props }: SectionProps) {
  return (
    <Tag className={cn(tight ? 'pt-16 pb-[72px]' : 'pt-[88px] pb-[104px]', className)} {...props} />
  )
}
