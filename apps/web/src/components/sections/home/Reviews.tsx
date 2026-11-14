'use client'

import { testimonials } from '@advertaro/content'
import { cn, SectionHeaderBar } from '@advertaro/ui'
import { useState } from 'react'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'

const pad = (n: number) => String(n).padStart(2, '0')

const arrowButton =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-bg-elevated text-white transition-colors duration-200 ease-[ease] hover:border-accent hover:bg-accent/15'

/** Manual (never auto-rotating) testimonial carousel from the prototype. */
export function Reviews() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length
  const item = testimonials[index]
  if (!item) return null

  const go = (next: number) => setIndex((next + count) % count)

  return (
    <section
      className="col-full grid grid-cols-subgrid"
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <SectionHeaderBar
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="07"
        label="CLIENT REVIEWS"
      />
      <div className="col-content pt-22 pb-26">
        {item.draft && (
          <DraftBanner>Draft quotes — pending client approval before launch</DraftBanner>
        )}
        <div
          className="mt-4 grid grid-cols-1 items-center gap-11 rounded-[20px] border border-line bg-bg-card p-6 sm:p-11 lg:grid-cols-[1.05fr_0.95fr]"
          data-reveal
        >
          <div>
            <div className="mb-7 flex items-center justify-between">
              <span className="font-sans text-xs/[inherit] tracking-[0.14em] text-accent">
                {pad(index + 1)} / {pad(count)}
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className={arrowButton}
                  onClick={() => go(index - 1)}
                  aria-label="Previous review"
                >
                  ←
                </button>
                <button
                  type="button"
                  className={arrowButton}
                  onClick={() => go(index + 1)}
                  aria-label="Next review"
                >
                  →
                </button>
              </div>
            </div>

            <div aria-live="polite">
              <blockquote className="mb-7 min-h-34.5 text-[length:clamp(24px,3vw,38px)] leading-[1.24] font-semibold tracking-tight">
                “{item.text}”
              </blockquote>
              <div>
                <div className="text-[15px] font-bold tracking-[0.04em] uppercase">
                  {item.authorName}
                </div>
                <div className="mt-1 font-sans text-[11.5px] tracking-widest text-ink-secondary">
                  {item.authorTitle.toUpperCase()} — {item.authorCompany.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex aspect-3/2 items-end overflow-hidden rounded-[14px] border border-line bg-bg-elevated p-4.5">
            <FilmStill theme={item.theme} width={720} height={480} />
            <div className="relative z-2 flex w-full items-center justify-between rounded-lg border border-white/12 bg-bg/78 px-3.5 py-2.5 font-sans text-[11px] text-ink-editorial backdrop-blur-sm">
              <span>{item.file}</span>
              <span>LIVE · {item.authorCompany.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div
          className="mt-5 grid grid-cols-1 gap-3.5 lg:grid-cols-3"
          role="tablist"
          aria-label="Choose a review"
        >
          {testimonials.map((t, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={i === index}
              className={cn(
                'cursor-pointer rounded-xl border px-5 py-4 text-left transition-colors duration-200 ease-[ease]',
                i === index ? 'border-accent bg-accent/8' : 'border-line bg-bg-elevated',
              )}
              key={t.project}
              onClick={() => setIndex(i)}
            >
              <div className="text-[12.5px] font-bold text-white">
                {pad(i + 1)} · {t.authorCompany.toUpperCase()}
              </div>
              <div className="mt-0.5 font-sans text-[10.5px] text-ink-secondary">
                {t.authorTitle.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
