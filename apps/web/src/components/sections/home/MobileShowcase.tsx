import { MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import { Container } from '@/components/ui/Container'
import { FilmStill } from '@/components/ui/FilmStill'
import { Section } from '@/components/ui/Section'

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
      <SectionHeaderBar id="mobile" num="03" label="MOBILE FIRST" />
      <Section className="relative overflow-hidden">
        <div
          className="pointer-events-none -mb-10 text-center text-[length:clamp(72px,15vw,220px)] leading-[0.85] font-extrabold tracking-[-0.05em] text-white/4 select-none"
          aria-hidden="true"
        >
          Mobile First
        </div>
        <Container>
          <div className="mb-9 flex items-center justify-between">
            <MonoLabel as="h2">IN THE POCKET — WHERE YOUR CUSTOMERS DECIDE</MonoLabel>
            <Tag>RATIO — 9:16</Tag>
          </div>

          <div
            className="grid snap-x snap-mandatory grid-cols-[repeat(3,minmax(220px,1fr))] gap-7 overflow-x-auto pb-2 lg:snap-none lg:grid-cols-3 lg:overflow-x-visible lg:pb-0"
            data-reveal="stagger"
          >
            {screens.map((screen) => (
              <figure
                className="flex snap-start flex-col gap-3 lg:snap-align-none"
                key={screen.client}
              >
                <div className="relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-3xl border border-white/12 bg-bg-elevated p-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                  <FilmStill theme={screen.theme} width={540} height={960} className="z-0" />
                  <div className="pointer-events-none absolute inset-0 z-2 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,transparent_28%,transparent_58%,rgba(0,0,0,0.88)_100%)]" />

                  <div className="relative z-3 flex items-center justify-between text-[13px] font-semibold">
                    <div className="flex gap-3.5">
                      <span>Live</span>
                      <span className="font-medium text-white/50">Preview</span>
                    </div>
                    <span className="rounded-md border border-white/16 bg-white/12 px-2 py-1 font-sans text-[10px] tracking-[0.12em] uppercase">
                      9:16
                    </span>
                  </div>

                  <div className="relative z-3 flex items-end justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[14px] font-bold text-white before:inline-block before:size-[22px] before:rounded-full before:bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-blue))] before:content-['']">
                        {screen.client}
                      </div>
                      <p className="text-[13px] leading-[1.35] text-white/86">{screen.caption}</p>
                      <span
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-[9px] text-[12px] font-bold"
                        aria-hidden="true"
                      >
                        {screen.cta} →
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3.5" aria-hidden="true">
                      {actions.map((action) => (
                        <div
                          className="flex flex-col items-center gap-[3px] font-sans text-[11px] text-white"
                          key={action.label}
                        >
                          <span className="flex size-[34px] items-center justify-center rounded-full bg-white/12 text-[14px] backdrop-blur-[6px]">
                            {action.icon}
                          </span>
                          <span>{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <figcaption className="flex items-center justify-between px-1.5 py-1 font-sans text-[10.5px] tracking-[0.1em] text-ink-secondary">
                  <span>DESIGN · BUILD</span>
                  <span>{screen.platform}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
