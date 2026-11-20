import type { Testimonial } from '@advertaro/content'

/** Author caption for a review card: company monogram, name, title and company. */
export function ReviewAuthor({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.authorCompany
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  return (
    <figcaption className="flex items-center gap-3.5">
      <span
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong font-display text-sm font-bold"
        style={{
          background: `radial-gradient(circle at 30% 25%, ${testimonial.theme.glow} 0%, ${testimonial.theme.base} 62%)`,
        }}
        aria-hidden="true"
      >
        {initials}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] text-ink">{testimonial.authorName}</span>
        <span className="block text-[13px] text-ink-secondary">
          {testimonial.authorTitle}, {testimonial.authorCompany}
        </span>
      </span>
    </figcaption>
  )
}
