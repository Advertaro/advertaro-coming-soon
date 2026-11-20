import { testimonials } from '@advertaro/content'
import { CtaPill, cn, Em, Eyebrow, SecondaryHeading, SectionHeaderBar } from '@advertaro/ui'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { ReviewAuthor } from './ReviewAuthor'

const card =
  'rounded-[20px] border border-line bg-bg-card transition-colors duration-200 hover:border-line-strong hover:bg-bg-card-hover'

const quoteMark = 'block font-display leading-[0.6] font-bold text-accent'

const industryLabel =
  'hidden font-sans text-[11px] tracking-[0.12em] text-ink-muted uppercase sm:block'

/** Results bento: each client quote sits next to the project result it produced. */
export function Reviews() {
  const [featured, wide, compact] = testimonials
  if (!featured || !wide || !compact) return null

  return (
    <section className="col-full grid grid-cols-subgrid" aria-label="Client reviews">
      <SectionHeaderBar
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="08"
        label="CLIENT REVIEWS"
      />
      {testimonials.some((t) => t.draft) && (
        <div className="col-content mt-4">
          <DraftBanner>
            Draft quotes and metrics — pending client approval before launch
          </DraftBanner>
        </div>
      )}
      <div className="col-content pt-22 pb-26">
        <header className="mx-auto max-w-2xl text-center" data-reveal>
          <Eyebrow className="inline-flex items-center gap-2.5">
            <span
              className="size-2 rounded-full bg-accent ring-4 ring-accent/18"
              aria-hidden="true"
            />
            Testimonials
          </Eyebrow>
          <SecondaryHeading className="mt-5">
            Results that speak
            <br />
            <Em>for themselves</Em>
          </SecondaryHeading>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-secondary">
            Outcomes from launches we shipped, in our clients&apos; own words.
          </p>
        </header>

        <div className="mt-16 grid gap-4 lg:grid-cols-2" data-reveal>
          <figure className={cn(card, 'flex flex-col p-7 sm:p-10 lg:row-span-2')}>
            <div className="font-display text-[length:clamp(64px,8vw,120px)] leading-[0.95] font-bold tracking-[-0.04em]">
              {featured.result.value}
            </div>
            <div className="mt-3 font-display text-xl font-semibold text-ink-editorial">
              {featured.result.label}
            </div>
            <span className={cn(quoteMark, 'mt-10 text-5xl')} aria-hidden="true">
              “
            </span>
            <blockquote className="mt-5 text-[length:clamp(18px,1.6vw,22px)] leading-[1.55] text-ink-editorial">
              “{featured.text}”
            </blockquote>
            <div className="mt-auto flex items-end justify-between gap-4 pt-12">
              <ReviewAuthor testimonial={featured} />
              <span className={industryLabel}>{featured.industry}</span>
            </div>
          </figure>

          <figure className={cn(card, 'flex flex-col p-7 sm:p-9')}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-[length:clamp(40px,4vw,56px)] leading-none font-bold tracking-[-0.04em]">
                {wide.result.value}
              </span>
              <span className="font-display text-lg font-semibold text-ink-editorial">
                {wide.result.label}
              </span>
            </div>
            <span className={cn(quoteMark, 'mt-8 text-4xl')} aria-hidden="true">
              “
            </span>
            <blockquote className="mt-4 text-[17px] leading-[1.6] text-ink-editorial">
              “{wide.text}”
            </blockquote>
            <div className="mt-8 flex items-end justify-between gap-4">
              <ReviewAuthor testimonial={wide} />
              <span className={industryLabel}>{wide.industry}</span>
            </div>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            <figure className={cn(card, 'flex flex-col p-7')}>
              <span className="inline-flex w-fit items-baseline gap-2 rounded-full border border-line-strong bg-bg-elevated px-3.5 py-1.5">
                <span className="font-display text-lg font-bold">{compact.result.value}</span>
                <span className="text-[13px] text-ink-secondary">{compact.result.label}</span>
              </span>
              <span className={cn(quoteMark, 'mt-7 text-4xl')} aria-hidden="true">
                “
              </span>
              <blockquote className="mt-4 text-[15.5px] leading-[1.6] text-ink-editorial">
                “{compact.text}”
              </blockquote>
              <div className="mt-auto pt-8">
                <ReviewAuthor testimonial={compact} />
              </div>
            </figure>

            <div className="flex flex-col rounded-[20px] border border-accent/30 bg-bg-card bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_65%)] p-7">
              <span className="font-sans text-[11px] font-medium tracking-[0.12em] text-accent-pale uppercase">
                Your project
              </span>
              <h3 className="mt-4 text-[28px] leading-[1.1] font-bold tracking-[-0.02em]">
                Want numbers like these?
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-secondary">
                Tell us the result you need. We plan the launch backwards from it.
              </p>
              <div className="mt-auto pt-8">
                <CtaPill href="#contact" label="Book a free call" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-[15px] text-ink-secondary">
            Trusted by hospitality, real estate and automotive brands.
          </p>
          <span className="hidden h-8 w-px bg-line-strong sm:block" aria-hidden="true" />
          {/* NOTE: no verified rating source yet; keep the placeholder marked as draft until one exists. */}
          <div className="flex items-center gap-3">
            <span
              className="grid size-11 place-items-center rounded-full border border-line-strong bg-bg-elevated text-accent"
              aria-hidden="true"
            >
              ★
            </span>
            <div>
              <div className="flex items-center gap-2 text-[15px]">
                <span className="text-accent" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="sr-only">Rating pending:</span>
                X.X
                <span className="rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 font-sans text-[10px] tracking-widest text-accent-pale uppercase">
                  Draft
                </span>
              </div>
              <div className="text-[13px] text-ink-secondary">Based on XX Google reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
