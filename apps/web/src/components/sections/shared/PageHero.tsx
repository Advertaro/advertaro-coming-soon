import type { StillTheme } from '@advertaro/content'
import type { ReactNode } from 'react'
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
    <section className="page-hero">
      <div className="page-hero-media">
        <FilmStill theme={theme} width={1600} height={900} />
      </div>
      <div className="site-container page-hero-inner">
        <div className="page-hero-eyebrow hero-eyebrow" data-hero-in>
          {eyebrow}
        </div>
        <h1 className="page-hero-title" data-hero-in>
          {title}
        </h1>
        {intro && (
          <p className="page-hero-intro" data-hero-in>
            {intro}
          </p>
        )}
        {meta && (
          <div className="page-hero-meta" data-hero-in>
            {meta}
          </div>
        )}
      </div>
    </section>
  )
}
