import { openSectors, sectors } from '@advertaro/content'
import { ArrowLink, CtaPill, cn, Em, SectionHeaderBar, SectionHeadline } from '@advertaro/ui'
import { FilmStill } from '@/components/ui/FilmStill'

export function Industries() {
  return (
    <section className="col-full grid grid-cols-subgrid">
      <SectionHeaderBar
        id="industries"
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="03"
        label="INDUSTRIES"
      />
      <div className="col-content pt-22 pb-26">
        {/* NOTE: draft copy throughout this section — confirm before launch. */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <SectionHeadline>
            Sectors we know
            <br />
            <Em>from the inside</Em>
          </SectionHeadline>
          <ArrowLink href="/work">See the work →</ArrowLink>
        </div>

        <ul className="border-t border-line" data-reveal="stagger">
          {sectors.map((sector) => (
            <li
              className="group/row grid grid-cols-[44px_1fr] items-center gap-x-5 gap-y-2 border-b border-line py-6 lg:grid-cols-[72px_1fr_minmax(0,280px)_auto] lg:gap-x-9 lg:py-6.5"
              key={sector.index}
            >
              <span className="font-sans text-[15px] font-bold tracking-[-0.02em] text-accent">
                {sector.index}
              </span>
              <h3 className="text-[length:clamp(22px,2.6vw,36px)] leading-[1.05] font-bold tracking-[-0.03em] text-ink-muted transition-colors duration-300 ease-out-expo group-hover/row:text-ink motion-reduce:transition-none">
                {sector.title}
              </h3>
              <p className="col-start-2 text-[15px] leading-normal text-ink-secondary motion-reduce:transition-none lg:col-start-auto lg:opacity-0 lg:transition-opacity lg:duration-300 lg:group-hover/row:opacity-100">
                {sector.tagline}
              </p>
              <div className="hidden gap-2.5 lg:flex" aria-hidden="true">
                {sector.stills.map((still, j) => (
                  <div
                    className="relative h-15 w-26 overflow-hidden rounded-[10px] border border-line bg-bg-card [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-500 ease-out-expo group-hover/row:[clip-path:inset(0_0_0_0_round_10px)] motion-reduce:transition-none"
                    key={still.label}
                    style={{ transitionDelay: `${j * 70}ms` }}
                  >
                    <FilmStill theme={still} width={208} height={120} />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {/* ponytail: CSS-only marquee keeps this a Server Component; add an IntersectionObserver pause (see ClientMarquee) if profiling shows cost. */}
        <div className="group/ticker mt-14">
          <div
            className="overflow-hidden border-y border-line py-4 mask-[linear-gradient(to_right,transparent,var(--color-ink)_12%,var(--color-ink)_88%,transparent)] motion-reduce:mask-none"
            aria-hidden="true"
          >
            <div className="flex w-max animate-client-marquee group-hover/ticker:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none">
              {[false, true].map((isDuplicate) => (
                <ul
                  className={cn('flex shrink-0', isDuplicate && 'motion-reduce:hidden')}
                  key={String(isDuplicate)}
                >
                  {[...openSectors, 'Yours?'].map((name) => (
                    <li
                      className={cn(
                        "pr-5.5 font-display text-[length:clamp(20px,2.2vw,30px)] font-bold tracking-[-0.02em] whitespace-nowrap after:ml-5.5 after:align-middle after:text-[0.7em] after:text-accent after:content-['✳']",
                        name === 'Yours?' ? 'text-accent' : 'text-ink-muted',
                      )}
                      key={name}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4.5">
            <p className="max-w-190 font-display text-[length:clamp(20px,2.1vw,28px)] leading-[1.25] font-semibold tracking-[-0.02em]">
              Don't see your industry?{' '}
              <span className="text-ink-muted">Good. We'd love a reason to add a fifth row.</span>
            </p>
            <CtaPill
              href="/contact"
              label="Pitch us your industry"
              rollLabel="Let's talk"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
