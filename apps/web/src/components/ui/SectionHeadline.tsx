import { cn } from '@advertaro/ui'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

type SectionHeadlineProps = ComponentPropsWithoutRef<'h2'> & { as?: ElementType }

export function SectionHeadline({ as: Tag = 'h2', className, ...props }: SectionHeadlineProps) {
  return (
    <Tag
      className={cn(
        'text-[length:clamp(34px,4.6vw,64px)] leading-[1.05] font-bold tracking-[-0.035em]',
        className,
      )}
      {...props}
    />
  )
}
