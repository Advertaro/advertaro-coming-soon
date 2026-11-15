import { processSteps } from '@advertaro/content'
import {
  cn,
  Em,
  MonoLabel,
  SecondaryHeading,
  SectionHeaderBar,
  TertiaryHeading,
} from '@advertaro/ui'
import Link from 'next/link'

/** The prototype's rate-card section, used for the engagement process. */
export function Process({ num = '07' }: { num?: string }) {
  return (
    <section className="col-full grid grid-cols-subgrid">
      <SectionHeaderBar
        id="process"
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num={num}
        label="PROCESS"
      />
      <div className="col-content pt-22 pb-26">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <SecondaryHeading className="text-[length:clamp(34px,4.5vw,62px)] leading-[1.06] font-bold tracking-[-0.035em]">
            A clear process up front
            <br />
            <Em>no surprises later</Em>
          </SecondaryHeading>
          <div className="text-right">
            <MonoLabel as="div" bright>
              HOW WE WORK — 2026
            </MonoLabel>
            <MonoLabel as="div">DISCOVER · BUILD · GROW</MonoLabel>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" data-reveal="stagger">
          {processSteps.map((step, i) => {
            const featured = i === 1
            return (
              <div
                className={cn(
                  'relative flex flex-col justify-between gap-7 rounded-[18px] border px-5.5 py-6.5 transition-[translate,border-color] duration-250 ease-[ease] hover:-translate-y-1 hover:border-line-strong sm:px-7.5 sm:py-8.5',
                  featured
                    ? 'border-accent/55 bg-[linear-gradient(180deg,rgba(255,77,0,0.07)_0%,var(--color-bg-card)_45%)]'
                    : 'border-line bg-bg-card',
                )}
                key={step.index}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs/[inherit] font-semibold text-accent">
                      {step.index}
                    </span>
                    <span className="rounded-md border border-line bg-white/5 px-2.5 py-1.25 font-sans text-[10.5px] tracking-widest text-ink-secondary">
                      {step.spec}
                    </span>
                  </div>
                  <TertiaryHeading className="mt-6 mb-2.5 text-3xl/[inherit] font-bold tracking-[-0.03em]">
                    {step.title}
                  </TertiaryHeading>
                  <p className="text-[15px] leading-normal text-ink-secondary">
                    {step.description}
                  </p>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-6">
                  <div>
                    <span className="mb-1.5 block font-sans text-[10.5px] tracking-[0.12em] text-ink-muted">
                      {step.deliverableLabel}
                    </span>
                    <div className="text-[26px] leading-none font-extrabold tracking-[-0.03em]">
                      {step.deliverable}
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 font-sans text-xs/[inherit] font-semibold tracking-widest text-white transition-colors duration-200 ease-[ease] hover:border-accent hover:bg-accent',
                      featured ? 'border-accent bg-accent' : 'border-white/14 bg-white/8',
                    )}
                  >
                    START →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
