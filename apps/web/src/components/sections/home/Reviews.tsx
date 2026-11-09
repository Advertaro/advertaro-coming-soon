'use client'

import { testimonials } from '@advertaro/content'
import { SectionHeaderBar } from '@advertaro/ui'
import { useState } from 'react'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'

const pad = (n: number) => String(n).padStart(2, '0')

/** Manual (never auto-rotating) testimonial carousel from the prototype. */
export function Reviews() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length
  const item = testimonials[index]
  if (!item) return null

  const go = (next: number) => setIndex((next + count) % count)

  return (
    <>
      <SectionHeaderBar num="07" label="CLIENT REVIEWS" timecode="00:07:00:00" />
      <section
        className="reviews-section"
        aria-roledescription="carousel"
        aria-label="Client reviews"
      >
        <div className="site-container">
          {item.draft && (
            <DraftBanner>Draft quotes — pending client approval before launch</DraftBanner>
          )}
          <div className="reviews-carousel mt-4" data-reveal>
            <div>
              <div className="review-controls-row">
                <span className="review-counter">
                  {pad(index + 1)} / {pad(count)}
                </span>
                <div className="review-nav-btns">
                  <button
                    type="button"
                    className="review-arrow"
                    onClick={() => go(index - 1)}
                    aria-label="Previous review"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="review-arrow"
                    onClick={() => go(index + 1)}
                    aria-label="Next review"
                  >
                    →
                  </button>
                </div>
              </div>

              <div aria-live="polite">
                <blockquote className="review-quote">“{item.text}”</blockquote>
                <div>
                  <div className="review-author-name">{item.authorName}</div>
                  <div className="review-author-role">
                    {item.authorTitle.toUpperCase()} — {item.authorCompany.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="review-media-frame">
              <FilmStill theme={item.theme} width={720} height={480} />
              <div className="review-media-bar">
                <span>{item.file}</span>
                <span>LIVE · {item.authorCompany.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="review-tabs" role="tablist" aria-label="Choose a review">
            {testimonials.map((t, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`review-tab-card text-left ${i === index ? 'active' : ''}`}
                key={t.project}
                onClick={() => setIndex(i)}
              >
                <div className="t-name">
                  {pad(i + 1)} · {t.authorCompany.toUpperCase()}
                </div>
                <div className="t-role">{t.authorTitle.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
