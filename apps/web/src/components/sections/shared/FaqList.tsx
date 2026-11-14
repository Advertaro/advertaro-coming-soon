import type { Faq } from '@advertaro/content'

/** Native <details> accordion — keyboard accessible without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details className="group border-b border-line" key={item.question} name="faq">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[length:clamp(18px,1.8vw,22px)] font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              className="shrink-0 font-sans text-xl/[inherit] text-accent transition-[rotate] duration-250 ease-[ease] group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="max-w-180 pb-6 text-base leading-[1.6] text-ink-secondary">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
