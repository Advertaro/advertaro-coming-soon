import type { StillTheme } from '@advertaro/content'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { FilmStill } from '@/components/ui/FilmStill'

type PageHeroProps = {
  /** Mono eyebrow, e.g. "(01) — WORK". */
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  meta?: ReactNode
  theme?: StillTheme
}

const defaultTheme: StillTheme = { base: '#0f2547', glow: '#ff4d00', label: '' }

/** Inner-page opener: giant display title, same DNA as the landing hero. */
export function PageHero({ eyebrow, title, intro, meta, theme = defaultTheme }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-bg-deep pt-nav">
      <div className="absolute inset-0 z-0 opacity-[0.55] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_30%,rgba(255,77,0,0.1)_0%,rgba(10,10,11,0.6)_55%,#0a0a0b_100%),linear-gradient(180deg,rgba(10,10,11,0.5)_0%,#0a0a0b_100%)] after:content-['']">
        <FilmStill theme={theme} width={1600} height={900} />
      </div>
      <Container className="relative z-[2] pt-18 pb-14">
        <div
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-sans text-[11px] tracking-[0.16em] text-white/72 uppercase"
          data-hero-in
        >
          {eyebrow}
        </div>
        <h1
          className="max-w-[1100px] text-[length:clamp(48px,9vw,136px)] leading-[0.95] font-extrabold tracking-[-0.05em] [&_[data-emphasis]]:font-semibold [&_[data-emphasis]]:tracking-[-0.03em]"
          data-hero-in
        >
          {title}
        </h1>
        {intro && (
          <p
            className="mt-8 max-w-[620px] text-[length:clamp(17px,1.6vw,21px)] leading-[1.5] text-ink-secondary"
            data-hero-in
          >
            {intro}
          </p>
        )}
        {meta && (
          <div className="mt-9 flex flex-wrap gap-2.5" data-hero-in>
            {meta}
          </div>
        )}
      </Container>
    </section>
  )
}
