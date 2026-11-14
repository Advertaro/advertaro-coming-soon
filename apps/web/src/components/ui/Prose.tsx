import { cn } from '@advertaro/ui'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

type ProseProps = ComponentPropsWithoutRef<'div'> & { as?: ElementType }

// NOTE: `[&>*+*]` (not `*:not-first`) keeps specificity below the h2/h3/blockquote
// margin-top overrides, as in the legacy `.prose > * + *` rule.
export function Prose({ as: Tag = 'div', className, ...props }: ProseProps) {
  return (
    <Tag
      className={cn(
        'max-w-180 text-[17px] leading-[1.7] text-ink-secondary [&>*+*]:mt-[1.1em]',
        '[&_h2]:mt-[1.8em] [&_h2]:text-[length:clamp(26px,3vw,36px)] [&_h2]:leading-[1.15] [&_h2]:font-bold [&_h2]:tracking-[-0.03em] [&_h2]:text-white',
        '[&_h3]:mt-[1.6em] [&_h3]:text-[22px] [&_h3]:font-bold [&_h3]:tracking-[-0.02em] [&_h3]:text-white',
        '[&_strong]:text-white',
        '[&_ul]:list-none [&_ul]:border-t [&_ul]:border-line',
        '[&_li]:relative [&_li]:border-b [&_li]:border-line [&_li]:py-3 [&_li]:pr-0 [&_li]:pl-7',
        "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:font-sans [&_li]:before:text-accent [&_li]:before:content-['→']",
        '[&_blockquote]:my-[1.8em] [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:py-1 [&_blockquote]:pr-0 [&_blockquote]:pl-6 [&_blockquote]:text-[length:clamp(26px,3vw,36px)] [&_blockquote]:leading-tight [&_blockquote]:text-ink-editorial',
        className,
      )}
      {...props}
    />
  )
}
