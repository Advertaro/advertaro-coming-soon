import { cn } from '@advertaro/ui'
import type { ComponentPropsWithoutRef } from 'react'

export function PageContainer({ className, ...props }: ComponentPropsWithoutRef<'main'>) {
  return (
    <main
      id="main"
      className={cn(
        'mb-(--section-gap) grid auto-rows-min grid-cols-shell gap-y-(--section-gap)',
        className,
      )}
      {...props}
    />
  )
}
