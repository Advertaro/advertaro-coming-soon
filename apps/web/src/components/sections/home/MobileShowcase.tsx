import { SectionHeaderBar, Tag } from '@advertaro/ui'
import { FilmStill } from '@/components/ui/FilmStill'

const screens = [
  {
    client: 'Ishq Villas',
    caption: 'Pick a villa, check dates, book direct.',
    cta: 'Book direct',
    platform: 'WEB · iOS',
    theme: { base: '#281915', glow: '#ff4d00', label: '' },
  },
  {
    client: 'Debug Auto',
    caption: 'Every car in stock, live, in your pocket.',
    cta: 'View stock',
    platform: 'WEB · PWA',
    theme: { base: '#162636', glow: '#60a5fa', label: '' },
  },
  {
    client: 'Rapid Adventures',
    caption: "Tomorrow's tour, booked from the trailhead.",
    cta: 'Book a tour',
    platform: 'WEB · ANDROID',
    theme: { base: '#121829', glow: '#a78bfa', label: '' },
  },
]

const actions = [
  { icon: '⌂', label: 'Home' },
  { icon: '◎', label: 'Explore' },
  { icon: '↗', label: 'Share' },
]

/** The prototype's vertical "reels" section, re-cast as mobile-first product screens. */
export function MobileShowcase() {
  return (
    <>
      <SectionHeaderBar id="mobile" num="03" label="MOBILE FIRST" timecode="00:03:00:00" />
      <section className="reels-section">
        <div className="reels-watermark" aria-hidden="true">
          Mobile First
        </div>
        <div className="site-container">
          <div className="reels-subbar">
            <h2 className="mono-label">IN THE POCKET — WHERE YOUR CUSTOMERS DECIDE</h2>
            <Tag>RATIO — 9:16</Tag>
          </div>

          <div className="reels-grid" data-reveal="stagger">
            {screens.map((screen) => (
              <figure className="reel-card-wrap" key={screen.client}>
                <div className="reel-phone">
                  <FilmStill theme={screen.theme} width={540} height={960} hideLabel />
                  <div className="reel-phone-shade" />

                  <div className="reel-ui-top">
                    <div className="reel-ui-tabs">
                      <span>Live</span>
                      <span className="muted">Preview</span>
                    </div>
                    <span className="reel-app-chip">9:16</span>
                  </div>

                  <div className="reel-ui-bottom">
                    <div className="reel-caption-box">
                      <div className="reel-handle">{screen.client}</div>
                      <p className="reel-caption">{screen.caption}</p>
                      <span className="reel-app-cta" aria-hidden="true">
                        {screen.cta} →
                      </span>
                    </div>
                    <div className="reel-actions" aria-hidden="true">
                      {actions.map((action) => (
                        <div className="reel-action-item" key={action.label}>
                          <span className="reel-action-icon">{action.icon}</span>
                          <span>{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <figcaption className="reel-footer-meta">
                  <span>DESIGN · BUILD</span>
                  <span>{screen.platform}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
