import { heroStats } from '@advertaro/content'
import { ArrowLink, CtaPill, cn, Em, MonoLabel, PrimaryHeading } from '@advertaro/ui'
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
      <div className="relative z-5 col-content grid grid-cols-1 items-center gap-10 py-8 text-center sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-x-[clamp(64px,9vw,180px)] lg:text-left">
        {/* Studio value proposition */}
        <PrimaryHeading className="mx-auto max-w-220 text-white text-shadow-[0_12px_36px_rgba(0,0,0,0.65)] **:data-emphasis:text-ink-bright lg:mx-0 motion-safe:animate-hero-in motion-safe:[animation-delay:150ms]">
          We build <Em>digital products worth showing</Em> — <Em>bespoke websites</Em>, mobile apps
          and brand systems for businesses that <Em>know the difference</Em>.
        </PrimaryHeading>

        {/* Client results and CTAs */}
        <div className="mx-auto flex w-full max-w-95 flex-col gap-8 text-left lg:mx-0 lg:max-w-none">
          <div className="motion-safe:animate-hero-in motion-safe:[animation-delay:270ms]">
            <MonoLabel
              as="p"
              className="mb-4.5 flex items-center gap-3 before:h-px before:w-7 before:bg-accent"
            >
              Client experience
            </MonoLabel>
            <ul className="flex flex-col gap-3.5">
              {heroStats.map((stat, i) => (
                <li key={stat.label} className="grid grid-cols-[76px_1fr] items-baseline gap-3.5">
                  <span
                    className={cn(
                      'font-sans text-[28px] leading-none tracking-[-0.02em] text-white',
                      i === 0 && 'text-accent',
                    )}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[13px] leading-[1.45] text-ink-secondary">
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4.5 motion-safe:animate-hero-in motion-safe:[animation-delay:390ms]">
            <CtaPill
              href="/contact"
              label="Book a call"
              className="min-h-11 w-full justify-center"
            />
            <ArrowLink href="/work">
              See our case studies <span aria-hidden="true">↗</span>
            </ArrowLink>
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
