import { Em } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'
import { HeroVideo } from '@/components/ui/HeroVideo'

const avatarTheme = { base: '#1b2838', glow: '#ff4d00', label: '' }

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden border-b border-line bg-bg-deep pt-nav">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideo />
        {/* Keeps even small hero text readable over a pure-white video frame. */}
        <div className="absolute inset-0 z-3 bg-[linear-gradient(rgba(10,10,11,0.74),rgba(10,10,11,0.74)),radial-gradient(ellipse_at_50%_35%,transparent_20%,var(--color-bg)_100%),linear-gradient(180deg,transparent_55%,var(--color-bg)_100%)]" />
      </div>

      <div className="relative z-5 mx-auto grid w-full max-w-site flex-1 grid-cols-1 items-center gap-6 px-5 pt-8 pb-3 text-center sm:px-8 sm:pt-20 sm:pb-14 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-16 lg:text-left">
        {/* Studio value proposition */}
        <div className="mx-auto max-w-220 py-5 text-center lg:mx-0 lg:text-left">
          <div
            className="mb-4.5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-sans text-[11px] tracking-[0.16em] text-white/72 uppercase"
            data-hero-in
          >
            ADVERTARO STUDIO — COLOMBO &amp; REMOTE
          </div>
          <h1
            className="text-[length:clamp(28px,3.5vw,52px)] leading-[1.22] font-medium tracking-tight text-white text-shadow-[0_12px_36px_rgba(0,0,0,0.65)] [&_[data-emphasis]]:text-ink-bright"
            data-hero-in
          >
            We build <Em>digital products worth showing</Em> — <Em>bespoke websites</Em>, mobile
            apps and brand systems for businesses that <Em>know the difference</Em>.
          </h1>
        </div>

        {/* Right studio card */}
        <aside
          className="mx-auto flex w-full max-w-90 flex-col gap-3.5 rounded-2xl border border-white/12 bg-bg-elevated/82 p-4.5 text-left shadow-[0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-lg lg:mx-0 lg:w-auto lg:max-w-none"
          aria-label="About Advertaro"
          data-hero-in
        >
          <div className="flex items-center gap-3.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-white/18 bg-bg-card-hover">
              <FilmStill theme={avatarTheme} width={240} height={240} />
              <svg
                viewBox="0 0 56 56"
                className="absolute inset-0 z-1 size-full p-3"
                aria-hidden="true"
              >
                <path d="M28 10 L44 46 H37 L28 24 L19 46 H12 Z" fill="#ffffff" />
                <path d="M21 38 H35" stroke="#ff4d00" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-base/[inherit] font-bold tracking-[-0.02em] text-white">
                Hey, we're Advertaro
              </h3>
              <p className="mt-0.5 text-[12.5px] text-ink-secondary">
                Brand · Web · Mobile · Systems
              </p>
            </div>
          </div>
          <Link
            href="/work"
            className="flex items-center justify-between border-t border-white/16 pt-3 text-[13px] font-semibold text-white transition-colors duration-200 ease-[ease] hover:text-accent-soft"
          >
            <span>See our work</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>

      {/* Giant full-width wordmark */}
      <div className="relative z-5 select-none px-6 pb-6.5 text-center" aria-hidden="true">
        <div className="inline-flex items-start font-display text-[length:clamp(40px,11vw,212px)] leading-[0.92] font-extrabold tracking-[-0.055em] text-white">
          Advertaro
          <sup className="mt-[0.12em] ml-1.5 text-[0.16em] font-bold tracking-normal text-accent">
            ™
          </sup>
        </div>
      </div>
    </section>
  )
}
