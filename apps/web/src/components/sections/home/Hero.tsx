import { CtaPill, Em } from '@advertaro/ui'
import Image from 'next/image'
import { HeroVideo } from '@/components/ui/HeroVideo'

export function Hero() {
  return (
    <section className="relative col-full grid min-h-screen grid-cols-subgrid grid-rows-[1fr_auto] overflow-hidden  pt-nav">
      {/*Background Video*/}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideo />
        {/* Keeps even small hero text readable over a pure-white video frame. */}
        <div className="absolute inset-0 z-3 bg-[linear-gradient(rgba(10,10,11,0.74),rgba(10,10,11,0.74)),radial-gradient(ellipse_at_50%_35%,transparent_20%,var(--color-bg)_100%),linear-gradient(180deg,transparent_55%,var(--color-bg)_100%)]" />
      </div>

      {/*Text*/}
      <div className="relative z-5 col-content grid grid-cols-1 items-center gap-6 py-8 text-center sm:py-20 lg:text-left">
        {/* Studio value proposition */}
        <div className="mx-auto max-w-220 py-5 text-center lg:mx-0 lg:text-left">
          <div
            className="mb-4.5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-sans text-[11px] tracking-[0.16em] text-white/72 uppercase"
            data-hero-in
          >
            ADVERTARO STUDIO — COLOMBO &amp; REMOTE
          </div>
          <h1
            className="text-[clamp(28px,3.5vw,52px)] leading-[1.22] font-medium tracking-tight text-white text-shadow-[0_12px_36px_rgba(0,0,0,0.65)] **:data-emphasis:text-ink-bright"
            data-hero-in
          >
            We build <Em>digital products worth showing</Em> — <Em>bespoke websites</Em>, mobile
            apps and brand systems for businesses that <Em>know the difference</Em>.
          </h1>
          <div
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            data-hero-in
          >
            <CtaPill href="/contact" label="Book a call" className="min-h-11" />
            <CtaPill
              href="/work"
              label="See our case studies"
              variant="ghost"
              className="min-h-11"
            />
          </div>
        </div>
      </div>

      {/* Giant full-width wordmark */}
      <div className="relative z-5 col-content select-none pb-6.5 text-center" aria-hidden="true">
        <Image
          src="/advertaro-logo-outline.svg"
          alt=""
          width={1000}
          height={138}
          loading="eager"
          className="mx-auto h-auto w-[min(85vw,1630px)] opacity-20"
        />
      </div>
    </section>
  )
}
