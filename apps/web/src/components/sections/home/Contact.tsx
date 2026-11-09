import { contactStats } from '@advertaro/content'
import { Em, SectionHeaderBar, StatsGrid } from '@advertaro/ui'
import { BriefForm } from '@/components/sections/shared/BriefForm'

export function Contact() {
  return (
    <>
      <SectionHeaderBar
        id="contact"
        num="08"
        label="START A PROJECT"
        timecode="END OF REEL — 00:08:00:00"
      />
      <section className="booking-section">
        <div className="site-container">
          <div className="booking-grid">
            <div data-reveal>
              <h2 className="booking-headline">
                Have a project in mind?
                <br />
                <Em>Let's build it properly</Em>
              </h2>
              <div className="slots-badge">
                <span>REPLY WITHIN:</span>
                <span className="slot-bars" aria-hidden="true">
                  <span className="slot-bar" />
                  <span className="slot-bar" />
                  <span className="slot-bar" />
                  <span className="slot-bar" />
                  <span className="slot-bar empty" />
                  <span className="slot-bar empty" />
                </span>
                <span className="font-bold text-accent">1 BUSINESS DAY</span>
              </div>
            </div>

            <BriefForm />
          </div>
        </div>

        <StatsGrid stats={contactStats} />
      </section>
    </>
  )
}
