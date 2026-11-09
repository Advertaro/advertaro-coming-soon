import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from './cn'

type CtaPillProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  label: string
  /** Text revealed by the roll animation on hover. Defaults to `label`. */
  rollLabel?: string
  variant?: 'primary' | 'ghost'
}

/** Orange pill CTA with the vertical text-roll hover from the prototype navbar. */
export function CtaPill({
  label,
  rollLabel,
  variant = 'primary',
  className,
  ...props
}: CtaPillProps) {
  return (
    <Link className={cn('cta-pill', variant === 'ghost' && 'ghost', className)} {...props}>
      <span className="dot" aria-hidden="true" />
      <span className="roll-wrap">
        <span className="roll-inner">
          <span>{label}</span>
          <span aria-hidden="true">{rollLabel ?? label}</span>
        </span>
      </span>
    </Link>
  )
}
