import { contactStats, site } from '@advertaro/content'
import { Em, MonoLabel, SectionHeaderBar, StatsGrid } from '@advertaro/ui'
import type { Metadata } from 'next'
import { BriefForm } from '@/components/sections/shared/BriefForm'
import { PageHero } from '@/components/sections/shared/PageHero'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Advertaro. Tell us what you are building — we reply within one business day.',
  alternates: { canonical: '/contact' },
}

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
      <section className="booking-section">
        <div className="site-container">
          <div className="booking-grid">
            <div data-reveal>
              <h2 className="booking-headline">
                Tell us what you're
                <br />
                <Em>building</Em>
              </h2>
              <p className="about-bio">
                <strong>What happens next?</strong>
                <br />
                We read every brief, reply within one business day, and if it's a fit we set up a
                30-minute call to talk it through. No sales scripts.
              </p>
              <div className="contact-direct">
                <a href={`mailto:${site.email}`}>
                  {site.email} <span className="mono-label">EMAIL →</span>
                </a>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
                  {site.phone} <span className="mono-label">WHATSAPP →</span>
                </a>
              </div>
              <MonoLabel as="p" className="mt-8">
                {site.location}
              </MonoLabel>
            </div>
            <BriefForm extended />
          </div>
        </div>
        <StatsGrid stats={contactStats} />
      </section>
    </>
  )
}
