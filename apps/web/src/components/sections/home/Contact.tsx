import { contactStats } from '@advertaro/content'
import { Em, SectionHeaderBar, StatsGrid } from '@advertaro/ui'
import { BriefForm } from '@/components/sections/shared/BriefForm'
import { Container } from '@/components/ui/Container'

export function Contact() {
  return (
    <>
      <SectionHeaderBar id="contact" num="08" label="START A PROJECT" />
      <section className="pt-[88px]">
        <Container>
          <div className="grid grid-cols-1 gap-14 pb-[84px] lg:grid-cols-[0.95fr_1.05fr]">
            <div data-reveal>
              <h2 className="mb-7 text-[length:clamp(36px,4.8vw,68px)] leading-[1.04] font-bold tracking-[-0.035em]">
                Have a project in mind?
                <br />
                <Em>Let's build it properly</Em>
              </h2>
              <div className="inline-flex items-center gap-3 rounded-[10px] border border-line bg-bg-card px-4 py-2.5 font-sans text-[11.5px] tracking-[0.1em]">
                <span>REPLY WITHIN:</span>
                <span className="inline-flex gap-1" aria-hidden="true">
                  <span className="h-3.5 w-2 rounded-xs bg-accent" />
                  <span className="h-3.5 w-2 rounded-xs bg-accent" />
                  <span className="h-3.5 w-2 rounded-xs bg-accent" />
                  <span className="h-3.5 w-2 rounded-xs bg-accent" />
                  <span className="h-3.5 w-2 rounded-xs bg-line-strong" />
                  <span className="h-3.5 w-2 rounded-xs bg-line-strong" />
                </span>
                <span className="font-bold text-accent">1 BUSINESS DAY</span>
              </div>
            </div>

            <BriefForm />
          </div>
        </Container>

        <StatsGrid stats={contactStats} />
      </section>
    </>
  )
}
