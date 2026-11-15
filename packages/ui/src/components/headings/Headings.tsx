import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../cn'
import { type HeadingVariants, headingVariants, secondaryHeadingType } from './heading-variants'

export type PrimaryHeadingProps = Omit<ComponentPropsWithRef<'h1'>, 'color'> & HeadingVariants

export function PrimaryHeading({ color, align, className, ...props }: PrimaryHeadingProps) {
  return (
    <h1
      className={cn(
        headingVariants({ color, align }),
        'text-[length:clamp(28px,3.5vw,52px)] leading-[1.22] font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

export type SecondaryHeadingProps = Omit<ComponentPropsWithRef<'h2'>, 'color'> & HeadingVariants

export function SecondaryHeading({ color, align, className, ...props }: SecondaryHeadingProps) {
  return (
    <h2
      className={cn(headingVariants({ color, align }), secondaryHeadingType, className)}
      {...props}
    />
  )
}

export type TertiaryHeadingProps = Omit<ComponentPropsWithRef<'h3'>, 'color'> & HeadingVariants

export function TertiaryHeading({ color, align, className, ...props }: TertiaryHeadingProps) {
  return (
    <h3
      className={cn(
        headingVariants({ color, align }),
        'text-[length:clamp(26px,3vw,40px)] leading-[inherit] font-bold tracking-[-0.03em]',
        className,
      )}
      {...props}
    />
  )
}

export type QuaternaryHeadingProps = Omit<ComponentPropsWithRef<'h4'>, 'color'> & HeadingVariants

export function QuaternaryHeading({ color, align, className, ...props }: QuaternaryHeadingProps) {
  return (
    <h4
      className={cn(
        headingVariants({ color, align }),
        'text-xl/[inherit] font-bold tracking-[-0.02em]',
        className,
      )}
      {...props}
    />
  )
}

export type QuinaryHeadingProps = Omit<ComponentPropsWithRef<'h5'>, 'color'> & HeadingVariants

export function QuinaryHeading({ color, align, className, ...props }: QuinaryHeadingProps) {
  return (
    <h5
      className={cn(
        headingVariants({ color, align }),
        'text-lg/[inherit] font-bold tracking-normal',
        className,
      )}
      {...props}
    />
  )
}

export type SenaryHeadingProps = Omit<ComponentPropsWithRef<'h6'>, 'color'> & HeadingVariants

export function SenaryHeading({ color, align, className, ...props }: SenaryHeadingProps) {
  return (
    <h6
      className={cn(
        headingVariants({ color, align }),
        'text-base/[inherit] font-bold tracking-normal',
        className,
      )}
      {...props}
    />
  )
}
