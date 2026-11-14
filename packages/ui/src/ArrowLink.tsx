import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from './cn'

/** Mono uppercase link with an orange underline. */
export function ArrowLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-2 border-b border-accent pb-0.75 font-sans text-xs/[inherit] uppercase tracking-[0.12em] text-white transition-colors duration-200 ease-[ease] hover:text-accent',
        className,
      )}
      {...props}
    />
  )
}
