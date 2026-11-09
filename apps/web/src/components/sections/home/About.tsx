import { credits, site } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'

const portraitTheme = { base: '#172334', glow: '#ff4d00', label: 'ADVERTARO // STUDIO, COLOMBO' }

export function About() {
  return (
    <>
      <SectionHeaderBar id="about" num="05" label="ABOUT" timecode="00:05:00:00" />
      <section className="about-section">
        <div className="site-container">
          <div className="about-grid">
            <div data-reveal>
              <h2 className="about-headline">
                Every pixel handled
                <br />
                <Em>by the same team</Em>
              </h2>

              <dl className="credits-table">
                {credits.map((credit) => (
                  <div
                    className={`credit-row${credit.highlight ? ' highlight' : ''}`}
                    key={credit.role}
                  >
                    <dt className="credit-role">{credit.role}</dt>
                    <dd className="credit-person">{credit.person}</dd>
                  </div>
                ))}
              </dl>

              <p className="about-bio">
                <strong>Same name on every credit. That's just how we work.</strong>
                <br />
                Designers, developers and strategists in Colombo, building for hospitality, real
                estate and ambitious businesses since {site.founded}.
              </p>
              <Link href="/about" className="arrow-link mt-8">
                About us →
              </Link>
            </div>

            <div className="about-portrait-card" data-wipe>
              <FilmStill theme={portraitTheme} width={800} height={880} className="portrait-bg" />
              <div className="about-portrait-shade" />

              <div className="about-portrait-top">
                <Tag>advertaro_studio.mov</Tag>
                <Tag>COLOMBO · LK</Tag>
              </div>

              <div className="about-portrait-bottom">
                <div>
                  <div className="mono-label text-white">ADVERTARO STUDIO</div>
                  <div className="mono-label">DESIGN &amp; ENGINEERING</div>
                </div>
                <div className="signature-wrap" aria-hidden="true">
                  <svg
                    aria-hidden="true"
                    className="signature-svg-fallback"
                    viewBox="0 0 180 64"
                    fill="none"
                  >
                    <path
                      d="M16 48 C26 16, 34 14, 38 42 C42 22, 54 12, 62 36 C70 26, 82 24, 90 36 C100 22, 118 20, 128 34 C138 14, 152 10, 166 28"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 52 Q95 42 162 46"
                      stroke="#ff4d00"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
