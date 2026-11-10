import { processSteps } from '@advertaro/content'
import { Em, SectionHeaderBar } from '@advertaro/ui'
import Link from 'next/link'

/** The prototype's rate-card section, used for the engagement process. */
export function Process({ num = '06' }: { num?: string }) {
  return (
    <>
      <SectionHeaderBar id="process" num={num} label="PROCESS" />
      <section className="rates-section">
        <div className="site-container">
          <div className="rates-top" data-reveal>
            <h2 className="rates-headline">
              A clear process up front
              <br />
              <Em>no surprises later</Em>
            </h2>
            <div className="text-right">
              <div className="mono-label text-white">HOW WE WORK — 2026</div>
              <div className="mono-label">DISCOVER · BUILD · GROW</div>
            </div>
          </div>

          <div className="rates-grid" data-reveal="stagger">
            {processSteps.map((step, i) => (
              <div className={`rate-card${i === 1 ? ' featured' : ''}`} key={step.index}>
                <div>
                  <div className="rate-card-head">
                    <span className="rate-idx">{step.index}</span>
                    <span className="rate-spec-badge">{step.spec}</span>
                  </div>
                  <h3 className="rate-title mt-6">{step.title}</h3>
                  <p className="rate-desc">{step.description}</p>
                </div>
                <div className="rate-price-block">
                  <div>
                    <span className="rate-from-label">{step.deliverableLabel}</span>
                    <div className="rate-price text-[26px]! tracking-[-0.03em]!">
                      {step.deliverable}
                    </div>
                  </div>
                  <Link href="/contact" className="rate-book-btn">
                    START →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
