import { faqAskExamples, homeFaqs, team } from '@advertaro/content'
import { CtaPill, Em, Eyebrow, SecondaryHeading, SectionHeaderBar } from '@advertaro/ui'
import { FaqThread } from './FaqThread'

export function Faq() {
  const founderProfile = team[0]
  if (!founderProfile) return null

  const founder = {
    initials: founderProfile.name
      .split(' ')
      .map((word) => word[0])
      .join(''),
    background: `radial-gradient(circle at 30% 25%, ${founderProfile.theme.glow} 0%, ${founderProfile.theme.base} 62%)`,
  }

  return (
    <section className="col-full grid grid-cols-subgrid">
      <SectionHeaderBar
        id="faq"
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="09"
        label="FAQ"
      />
      <div className="col-content grid grid-cols-1 gap-12 pt-22 pb-26 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--spacing-nav)+2rem)]" data-reveal>
          <Eyebrow className="inline-flex items-center gap-2.5">
            <span
              className="size-2 rounded-full bg-accent ring-4 ring-accent/18"
              aria-hidden="true"
            />
            FAQs
          </Eyebrow>
          <SecondaryHeading className="mt-5">
            Frequently asked <Em>questions</Em>
          </SecondaryHeading>

          <div className="mt-10 rounded-[20px] border border-line bg-bg-card bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_60%)] p-8">
            <div
              className="grid size-18 place-items-center rounded-full border-2 border-line-strong font-display text-[22px] font-bold shadow-glow"
              style={{ background: founder.background }}
              aria-hidden="true"
            >
              {founder.initials}
            </div>
            <h3 className="mt-6 text-[28px] font-semibold tracking-[-0.02em]">
              Book a 15 min call
            </h3>
            <p className="mt-3 mb-7 leading-[1.6] text-ink-secondary">
              Still deciding? Talk it through with our founder before you send a brief. No pitch,
              just answers.
            </p>
            <CtaPill
              href="#contact"
              label="Book a free call"
              className="w-full justify-center py-3.75 text-sm"
            />
          </div>
        </div>

        <FaqThread items={homeFaqs} examples={faqAskExamples} founder={founder} />
      </div>
    </section>
  )
}
