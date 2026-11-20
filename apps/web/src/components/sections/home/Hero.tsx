import { heroRotatingWords, heroStats } from '@advertaro/content'
import { CtaPill, cn, Em, MonoLabel, PrimaryHeading } from '@advertaro/ui'
import { HeroMorphFilter } from '@/components/ui/HeroMorphFilter'
import { HeroVideo } from '@/components/ui/HeroVideo'
import { HeroWordmark } from '@/components/ui/HeroWordmark'

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
          Bespoke{' '}
          <span className="sr-only">
            {new Intl.ListFormat('en', { type: 'conjunction' }).format(heroRotatingWords)}{' '}
          </span>
          <span
            aria-hidden="true"
            className="grid justify-items-center text-shadow-none motion-safe:animate-hero-morph-filter lg:inline-grid lg:justify-items-start"
          >
            {heroRotatingWords.map((word, i) => (
              <span
                key={word}
                className="opacity-0 [grid-area:1/1] motion-safe:animate-hero-morph motion-reduce:first:opacity-100"
                style={{ animationDelay: `${i * 2.5}s` }}
              >
                {/* NOTE: `!` beats the heading's `**:data-emphasis:text-ink-bright`, which is more specific. */}
                <Em className="text-accent!">{word}</Em>
              </span>
            ))}
          </span>
          <span className="block">
            for businesses that <Em>know the difference</Em>.
          </span>
        </PrimaryHeading>
        <HeroMorphFilter />

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
            <CtaPill
              href="/work"
              label="See our case studies"
              variant="ghost"
              className="min-h-11 w-full justify-center"
            />
          </div>
        </div>
      </div>

      {/* Giant full-width wordmark */}
      <div className="relative z-5 col-content select-none pb-6.5 text-center" aria-hidden="true">
        <HeroWordmark />
      </div>
    </section>
  )
}
