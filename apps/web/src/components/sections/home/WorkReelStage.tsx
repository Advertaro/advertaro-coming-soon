'use client'

import { cn, Tag } from '@advertaro/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

export type ReelProject = {
  slug: string
  client: string
  outcome: string
  deliverable: string
  /** Path without extension; `.webm`, `.mp4` and `.jpg` are appended. */
  bg: string
  fg: string
}

type WorkReelStageProps = {
  projects: ReelProject[]
  /** Intro headline, centred over the small video window of the first panel. */
  children: ReactNode
}

const ghostButton =
  'flex size-11 items-center justify-center rounded-full border border-white/14 bg-white/6 text-ink hover:border-accent hover:bg-accent/15 disabled:pointer-events-none disabled:opacity-35 transition-[background-color,border-color,opacity] duration-200'

function ReelVideo({
  src,
  index,
  shouldLoad,
}: {
  src: string
  index: number
  shouldLoad: boolean
}) {
  return (
    <video
      className="absolute inset-0 size-full object-cover"
      data-index={index}
      muted
      playsInline
      loop
      preload={shouldLoad ? 'auto' : 'none'}
      poster={`${src}.jpg`}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  )
}

function ReelPanel({
  project,
  index,
  shouldLoad,
  children,
}: {
  project: ReelProject
  index: number
  shouldLoad: boolean
  /** Intro headline; only the first panel has one. */
  children?: ReactNode
}) {
  // Only the first panel animates; the rest just scroll up over it.
  const firstOnly = index === 0 ? '' : undefined
  const headingId = `reel-${project.slug}`

  return (
    <article aria-labelledby={headingId} className="sticky top-0 h-svh overflow-hidden bg-bg">
      <div className="absolute inset-0" data-reel-media={firstOnly}>
        <ReelVideo src={project.bg} index={index} shouldLoad={shouldLoad} />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.55)_0%,rgba(10,10,11,0.25)_45%,rgba(10,10,11,0.88)_100%),linear-gradient(90deg,rgba(10,10,11,0.7)_0%,transparent_60%)]"
          data-reel-dim={firstOnly}
        />
      </div>

      {index === 0 && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-shell text-center text-ink opacity-0 mix-blend-difference"
          data-reel-intro
        >
          {children}
        </div>
      )}

      <div className="absolute inset-0 flex flex-col px-shell pt-nav pb-6 md:pb-10">
        <div className="mt-8 mb-auto md:my-auto md:max-w-[40vw]" data-reel-ui={firstOnly}>
          <Tag num={String(index + 1).padStart(2, '0')}>Case / {project.client}</Tag>
          <p
            id={headingId}
            className="mt-5 max-w-[18ch] font-display text-[clamp(26px,3vw,44px)] leading-[1.1] font-semibold tracking-[-0.035em] text-ink"
          >
            {project.outcome}
          </p>
        </div>

        <div
          className="absolute inset-y-0 right-shell my-auto hidden aspect-video h-fit w-[42vw] overflow-hidden rounded-[18px] border border-line md:block"
          data-reel-ui={firstOnly}
        >
          <ReelVideo src={project.fg} index={index} shouldLoad={shouldLoad} />
          <Link
            href={`/work/${project.slug}`}
            aria-label={`View ${project.client} case study`}
            className="absolute right-4 bottom-4 flex size-14 items-center justify-center rounded-full bg-accent text-xl text-white shadow-glow transition-[background-color,box-shadow] duration-200 hover:bg-accent-hover hover:shadow-glow-lg"
          >
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

function measureReel(section: HTMLElement) {
  return {
    h: section.querySelector<HTMLElement>('article')?.offsetHeight ?? 0,
    top: section.getBoundingClientRect().top + window.scrollY,
  }
}

/** Work reel: a small video window expands full-bleed, then case-study panels stack over it. */
export function WorkReelStage({ projects, children }: WorkReelStageProps) {
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)
  const last = projects.length - 1

  useEffect(() => {
    const el = section.current
    if (!el) return

    // Layout assumes h-svh panels plus one h-svh dwell spacer after the first, so panel k >= 1
    // rests at (k + 1) * h. Rects/offsetTop of stuck sticky panels report the stuck position,
    // so the active panel is derived from scroll offset instead.
    const tracker = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => {
        const { h, top } = measureReel(el)
        if (!h) return
        setActive(Math.min(Math.max(Math.floor((window.scrollY - top) / h - 0.5), 0), last))
      },
    })

    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // Reduced-motion users never reach here: they keep posters and the final layout.
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom+=100%',
          once: true,
          onEnter: () => setShouldLoad(true),
        })

        gsap.set('[data-reel-dim]', { opacity: 0 })
        gsap.set('[data-reel-ui]', { autoAlpha: 0, y: 24 })
        gsap.set('[data-reel-intro]', { autoAlpha: 1 })

        // clip-path is a paint property, accepted here: one element in a one-shot
        // 1.3s timeline, not per-scroll-frame. Width/height would force layout.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top -40%',
              toggleActions: 'play none none reverse',
            },
          })
          // fromTo with explicit 4-value insets: the browser shortens a set clip-path to
          // `inset(36% 44.5%)`, and GSAP then pairs mismatched values, growing from a corner.
          .fromTo(
            '[data-reel-media]',
            { clipPath: 'inset(36% 44.5% 36% 44.5%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' },
          )
          .to('[data-reel-intro]', { autoAlpha: 0, duration: 0.4 }, 0)
          .to('[data-reel-dim]', { opacity: 1, duration: 0.8 }, 0.5)
          .to(
            '[data-reel-ui]',
            { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' },
            0.8,
          )
      },
      el,
    )

    return () => {
      tracker.kill()
      mm.revert()
    }
  }, [last])

  useEffect(() => {
    const el = section.current
    if (!el) return
    // Off-screen video still decodes every frame; pause them all when the reel is not visible.
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry?.isIntersecting ?? false),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return
    // ponytail: previous panel shows a paused frame while still partly visible; widen to active - 1 if noticeable.
    for (const video of section.current?.querySelectorAll<HTMLVideoElement>('video[data-index]') ??
      []) {
      const index = Number(video.dataset.index)
      if (inView && (index === active || index === active + 1)) {
        // play() rejects when autoplay is blocked; the poster stays, which is harmless.
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }
  }, [active, shouldLoad, inView])

  const scrollToPanel = (index: number) => {
    const el = section.current
    if (!el) return
    const { h, top } = measureReel(el)
    window.scrollTo({
      // 0.5 * h puts the first panel past the 40% threshold so its expansion has played.
      top: top + (index === 0 ? 0.5 : index + 1) * h,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <section ref={section} aria-label="Selected projects" className="relative col-full">
      {projects.map((project, i) => (
        <Fragment key={project.slug}>
          <ReelPanel project={project} index={i} shouldLoad={shouldLoad}>
            {children}
          </ReelPanel>
          {/* Keeps the first panel stuck while its intro and expansion play. */}
          {i === 0 && <div aria-hidden="true" className="h-svh" />}
        </Fragment>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="sticky top-0 flex h-svh items-end px-shell pb-6 md:pb-10">
          <nav
            aria-label="Projects"
            className="pointer-events-auto flex w-full items-end gap-4 md:w-auto"
            data-reel-ui
          >
            <ul className="min-w-0 flex-1 md:w-xl md:flex-none">
              {projects.map((p, i) => (
                <li key={p.slug} className="border-t border-line">
                  <button
                    type="button"
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => scrollToPanel(i)}
                    className={cn(
                      'grid min-h-11 w-full cursor-pointer grid-cols-1 items-center gap-4 text-left font-sans text-[13px] transition-colors duration-200 sm:grid-cols-[13rem_1fr]',
                      i === active ? 'text-ink' : 'text-ink-muted hover:text-ink-secondary',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'size-1.5 shrink-0 rounded-full bg-accent transition-opacity duration-200',
                          i === active ? 'opacity-100' : 'opacity-0',
                        )}
                        aria-hidden="true"
                      />
                      {p.client}
                    </span>
                    <span className="hidden sm:block">{p.deliverable}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Previous project"
                disabled={active === 0}
                onClick={() => scrollToPanel(active - 1)}
                className={ghostButton}
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                aria-label="Next project"
                disabled={active === last}
                onClick={() => scrollToPanel(active + 1)}
                className={ghostButton}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}
