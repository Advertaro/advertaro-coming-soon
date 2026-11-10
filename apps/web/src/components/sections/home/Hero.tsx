import { Em } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'
import { HeroVideo } from '@/components/ui/HeroVideo'

const avatarTheme = { base: '#1b2838', glow: '#ff4d00', label: '' }

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-media-wrap">
        <HeroVideo />
        <div className="hero-vignette" />
      </div>

      <div className="hero-body">
        {/* Studio value proposition */}
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
              <FilmStill theme={avatarTheme} width={240} height={240} />
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
          <Link href="/work" className="studio-work-link">
            <span>See our work</span>
            <span aria-hidden="true">↗</span>
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
