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
  const isGhost = variant === 'ghost'

  return (
    <Link
      className={cn(
        'group relative inline-flex cursor-pointer items-center gap-[9px] overflow-hidden whitespace-nowrap rounded-full px-[18px] py-2.5 text-[13px] font-semibold text-white transition-[translate,box-shadow,background-color] duration-200 ease-[ease] hover:-translate-y-px',
        isGhost
          ? 'border border-white/14 bg-white/6 hover:border-accent hover:bg-accent/15'
          : 'bg-accent shadow-glow hover:bg-accent-hover hover:shadow-glow-lg',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          isGhost
            ? 'bg-accent shadow-[0_0_6px_var(--color-accent)]'
            : 'bg-white shadow-[0_0_6px_var(--color-ink)]',
        )}
        aria-hidden="true"
      />
      <span className="inline-block h-[18px] overflow-hidden leading-[18px]">
        <span className="flex flex-col transition-[translate] duration-[280ms] ease-roll group-hover:-translate-y-[18px] group-focus-visible:-translate-y-[18px]">
          <span>{label}</span>
          <span aria-hidden="true">{rollLabel ?? label}</span>
        </span>
      </span>
    </Link>
  )
}
