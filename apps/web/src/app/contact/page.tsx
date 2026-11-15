import { contactStats, site } from '@advertaro/content'
import { Em, MonoLabel, SecondaryHeading, SectionHeaderBar, StatsGrid } from '@advertaro/ui'
import type { Metadata } from 'next'
import { BriefForm } from '@/components/sections/shared/BriefForm'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Advertaro. Tell us what you are building — we reply within one business day.',
  alternates: { canonical: '/contact' },
}

const directLinkClass =
  'flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-card px-5 py-4.5 text-base/[inherit] font-semibold transition-[border-color,background-color] duration-200 ease-[ease] hover:border-accent hover:bg-accent/8'

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="(05) — CONTACT"
        title={
          <>
            Let's <Em>talk</Em>
          </>
        }
        intro="We take on brand, web, app and systems projects for businesses that want them done properly. Send us a brief and you'll hear from a real person within one business day."
      />
      <SectionHeaderBar num="01" label="THE BRIEF" />
      <Section className="pb-0">
        <Container>
          <div className="grid grid-cols-1 gap-14 pb-21 lg:grid-cols-[0.95fr_1.05fr]">
            <div data-reveal>
              <SecondaryHeading className="mb-7 text-[length:clamp(36px,4.8vw,68px)] leading-[1.04] font-bold tracking-[-0.035em]">
                Tell us what you're
                <br />
                <Em>building</Em>
              </SecondaryHeading>
              <p className="max-w-125 text-base leading-[1.6] text-ink-secondary">
                <strong className="font-semibold text-white">What happens next?</strong>
                <br />
                We read every brief, reply within one business day, and if it's a fit we set up a
                30-minute call to talk it through. No sales scripts.
              </p>
              <div className="mt-10 flex flex-col gap-3">
                <a href={`mailto:${site.email}`} className={directLinkClass}>
                  {site.email} <MonoLabel>EMAIL →</MonoLabel>
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={directLinkClass}
                >
                  {site.phone} <MonoLabel>WHATSAPP →</MonoLabel>
                </a>
              </div>
              <MonoLabel as="p" className="mt-8">
                {site.location}
              </MonoLabel>
            </div>
            <BriefForm extended />
          </div>
        </Container>
        <StatsGrid stats={contactStats} />
      </Section>
    </>
  )
}
