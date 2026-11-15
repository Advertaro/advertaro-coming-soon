import { tv, type VariantProps } from 'tailwind-variants/lite'

export const headingVariants = tv({
  base: 'font-display',
  variants: {
    color: {
      inherit: 'text-inherit',
      primary: 'text-ink',
      secondary: 'text-ink-secondary',
      editorial: 'text-ink-editorial',
      accent: 'text-accent',
      muted: 'text-ink-muted',
      bright: 'text-ink-bright',
    },
    align: {
      inherit: '',
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: { color: 'inherit', align: 'inherit' },
})

export type HeadingVariants = VariantProps<typeof headingVariants>

export const secondaryHeadingType =
  'text-[length:clamp(34px,4.6vw,64px)] leading-[1.05] font-bold tracking-[-0.035em]'

export const eyebrowVariants = tv({
  extend: headingVariants,
  base: 'font-sans text-[11px] font-medium uppercase tracking-[0.12em]',
  defaultVariants: { color: 'secondary', align: 'inherit' },
})
