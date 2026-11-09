import { services, site } from '@advertaro/content'
import { Em } from '@advertaro/ui'
import Link from 'next/link'
import { HeroParticles } from '@/components/three/HeroParticles'
import { FilmStill } from '@/components/ui/FilmStill'
import { LiveTimecode } from '@/components/ui/LiveTimecode'

const heroTheme = { base: '#0f2547', glow: '#ff4d00', label: 'ADVERTARO // SHOWREEL MASTER 4K' }
const avatarTheme = { base: '#1b2838', glow: '#ff4d00', label: '' }

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-media-wrap">
        <FilmStill theme={heroTheme} width={1600} height={900} />
        <HeroParticles />
        <div className="hero-vignette" />
      </div>

      {/* Top timecode strip */}
      <div className="hero-ruler" aria-hidden="true">
        <div className="rec-badge">
          <span className="rec-dot" />
          <LiveTimecode />
        </div>
        <span>00:00</span>
        <span>+</span>
        <span>01:00</span>
        <span>+</span>
        <span>02:00</span>
      </div>

      <div className="hero-body">
        {/* Left capabilities panel */}
        <aside className="hero-left-panel" aria-label="Services" data-hero-in>
          <span className="panel-heading">(01) — SERVICES</span>
          <ul className="hero-service-list">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.shortTitle}</Link>
                <span className="idx">{service.index}</span>
              </li>
            ))}
          </ul>
          <div className="est-tag">(EST. {site.founded} — COLOMBO, LK)</div>
        </aside>

        {/* Centre value proposition */}
        <div className="hero-center">
          <div className="hero-eyebrow" data-hero-in>
            ADVERTARO STUDIO — COLOMBO &amp; REMOTE
          </div>
          <h1 className="hero-statement" data-hero-in>
            We build <Em>digital products worth showing</Em> — <Em>bespoke websites</Em>, mobile
            apps and brand systems for businesses that <Em>know the difference</Em>.
          </h1>
        </div>

        {/* Right studio card */}
        <aside className="hero-noah-card" aria-label="About Advertaro" data-hero-in>
          <div className="noah-card-top">
            <div className="noah-avatar-wrap">
              <FilmStill theme={avatarTheme} width={240} height={240} hideLabel />
              <svg
                viewBox="0 0 56 56"
                className="media-fill p-3"
                aria-hidden="true"
                style={{ zIndex: 1 }}
              >
                <path d="M28 10 L44 46 H37 L28 24 L19 46 H12 Z" fill="#ffffff" />
                <path d="M21 38 H35" stroke="#ff4d00" strokeWidth="3" />
              </svg>
            </div>
            <div className="noah-meta">
              <h3>Hey, we're Advertaro</h3>
              <p>Brand · Web · Mobile · Systems</p>
            </div>
          </div>
          <Link href="/work" className="noah-reel-btn">
            <span className="frame-code">REEL {site.founded}—2026</span>
            <span className="play-pill">
              <span>See our work</span>
              <span className="play-icon" aria-hidden="true">
                ▶
              </span>
            </span>
          </Link>
        </aside>
      </div>

      {/* Giant full-width wordmark */}
      <div className="hero-giant-title-wrap" aria-hidden="true">
        <div className="hero-giant-title">
          Advertaro<sup>™</sup>
        </div>
      </div>
    </section>
  )
}
