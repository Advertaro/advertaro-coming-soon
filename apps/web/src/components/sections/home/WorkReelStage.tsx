'use client'

import type { Quote } from '@advertaro/content'
import { CtaPill, cn, Tag } from '@advertaro/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'

import { getLenis } from '@/components/layout/MotionProvider'

gsap.registerPlugin(ScrollTrigger)

export type ReelProject = {
  slug: string
  client: string
  outcome: string
  quote?: Quote
  /** Path without extension; `.webm`, `.mp4` and `.jpg` are appended. */
  bg: string
  fg: string
}

type WorkReelStageProps = {
  projects: ReelProject[]
  /** Intro headline, centred over the small video window of the first panel. */
  children: ReactNode
}

// ponytail: hand-tuned feel values (px of accumulated input before a locked panel moves); retune on real devices.
const WHEEL_THRESHOLD = 170
const TOUCH_THRESHOLD = 60
/** Input must arrive within this window to count towards the same gesture. */
const GESTURE_GAP_MS = 200
/**
 * Silence required after a panel locks before input counts again. Longer than GESTURE_GAP_MS so
 * the slowing tail of a free-spinning wheel or trackpad inertia can re-arm but never accumulate.
 */
const REARM_QUIET_MS = 280
/** Px of jitter tolerated before a larger delta counts as speeding up. */
const SPEED_UP_MARGIN = 4

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
          <CtaPill
            href={`/work/${project.slug}`}
            label="View case study"
            aria-label={`View ${project.client} case study`}
            // The video box that carries this link from md up is hidden on phones.
            className="mt-6 min-h-11 md:hidden"
          />
          {project.quote && (
            <figure className="mt-8 max-w-[44ch] border-t border-line pt-5">
              <blockquote className="line-clamp-4 text-[15px] leading-[1.5] text-ink">
                {project.quote.text}
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-3 text-[13px] text-ink-secondary">
                {project.quote.avatar && (
                  <Image
                    src={project.quote.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                )}
                <span>
                  {project.quote.authorName} — {project.quote.authorTitle},{' '}
                  {project.quote.authorCompany}
                </span>
              </figcaption>
            </figure>
          )}
        </div>

        <div
          className="absolute inset-y-0 right-shell my-auto hidden aspect-video h-fit w-[42vw] overflow-hidden rounded-[18px] border border-line md:block"
          data-reel-ui={firstOnly}
        >
          <ReelVideo src={project.fg} index={index} shouldLoad={shouldLoad} />
          <CtaPill
            href={`/work/${project.slug}`}
            label="View case study"
            aria-label={`View ${project.client} case study`}
            className="absolute right-4 bottom-4 min-h-11"
          />
        </div>
      </div>
    </article>
  )
}

// Layout assumes h-svh panels plus one h-svh dwell spacer after the first, so panel k >= 1
// rests at (k + 1) * h. Rects/offsetTop of stuck sticky panels report the stuck position,
// so everything is derived from scroll offset instead.
function measureReel(section: HTMLElement, last: number) {
  const h = section.querySelector<HTMLElement>('article')?.offsetHeight ?? 0
  const top = section.getBoundingClientRect().top + window.scrollY
  return {
    h,
    // 0.5 * h puts the first panel past the 40% threshold so its expansion has played.
    restOf: (index: number) => Math.round(top + (index === 0 ? 0.5 : index + 1) * h),
    active: h ? Math.min(Math.max(Math.floor((window.scrollY - top) / h - 0.5), 0), last) : 0,
  }
}

/** Work reel: a small video window expands full-bleed, then case-study panels stack over it. */
export function WorkReelStage({ projects, children }: WorkReelStageProps) {
  const section = useRef<HTMLElement>(null)
  /** Set by the scroll effect; returns false when Lenis is absent. */
  const lockToPanel = useRef<((index: number) => boolean) | null>(null)
  const [active, setActive] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)
  const last = projects.length - 1

  useEffect(() => {
    const el = section.current
    if (!el) return

    // Scroll friction: between the first and last rest positions Lenis is stopped, so the page
    // ignores wheel and touch. Input accumulates instead, and one deliberate gesture moves one panel.
    let isLocked = false
    let wasInside = false
    let isArmed = false
    let accumulated = 0
    let lastInputAt = 0
    let lastSize = 0
    let removeInputListener: (() => void) | undefined

    const unlock = () => {
      isLocked = false
      removeInputListener?.()
      getLenis()?.start()
    }

    const onInput = ({ deltaY, event }: { deltaY: number; event: Event }) => {
      const lenis = getLenis()
      if (!lenis) return
      const now = performance.now()
      const gap = now - lastInputAt
      const size = Math.abs(deltaY)
      // Momentum only ever decays, so input that speeds up is a new gesture even without a pause.
      const isSpeedingUp = size > lastSize * 1.5 + SPEED_UP_MARGIN
      lastInputAt = now
      lastSize = size
      if (gap > GESTURE_GAP_MS) accumulated = 0
      // The gesture that moved the panel is still running while it slides; never re-arm on it.
      if (lenis.isScrolling) return
      if (gap > REARM_QUIET_MS || isSpeedingUp) isArmed = true
      if (!isArmed) return
      if (Math.sign(deltaY) !== Math.sign(accumulated)) accumulated = 0
      accumulated += deltaY
      if (Math.abs(accumulated) < (event.type === 'wheel' ? WHEEL_THRESHOLD : TOUCH_THRESHOLD))
        return

      const { h, restOf, active: current } = measureReel(el, last)
      const direction = Math.sign(accumulated)
      const target = current + direction
      if (target >= 0 && target <= last) {
        lockTo(target)
        return
      }
      // Past either end: hand control back and move clear of the lock zone.
      unlock()
      lenis.scrollTo(restOf(current) + direction * 0.25 * h, { lock: true, duration: 0.6 })
    }

    const lockTo = (index: number) => {
      const lenis = getLenis()
      if (!lenis) return false
      isArmed = false
      lastInputAt = performance.now()
      if (!isLocked) {
        isLocked = true
        lenis.stop()
        removeInputListener = lenis.on('virtual-scroll', onInput)
      }
      lenis.scrollTo(measureReel(el, last).restOf(index), {
        force: true,
        duration: 1.2,
        // Same curve as the first panel's video expansion.
        easing: gsap.parseEase('expo.inOut'),
      })
      return true
    }
    lockToPanel.current = lockTo

    const tracker = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      // Runs past the last rest position so leaving the lock zone downwards is still observed.
      end: 'bottom top',
      onUpdate: () => {
        const { h, restOf, active: current } = measureReel(el, last)
        if (!h) return
        setActive(current)

        // 1px tolerance: rest positions are rounded and scrollY can be fractional.
        const isInside = window.scrollY >= restOf(0) - 1 && window.scrollY <= restOf(last) + 1
        if (isInside && !wasInside && !isLocked) lockTo(current)
        // Keyboard and scrollbar still scroll natively; never leave the page frozen outside the reel.
        else if (!isInside && isLocked && getLenis()?.isScrolling !== 'smooth') unlock()
        wasInside = isInside
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
      lockToPanel.current = null
      if (isLocked) unlock()
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
    if (lockToPanel.current?.(index)) return
    // No Lenis under reduced motion, so no friction either: jump natively.
    window.scrollTo({ top: measureReel(el, last).restOf(index), behavior: 'auto' })
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
            className="pointer-events-auto max-w-full overflow-x-auto border-t border-line"
            data-reel-ui
          >
            <ul className="flex gap-6">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => scrollToPanel(i)}
                    className={cn(
                      'flex min-h-11 cursor-pointer items-center gap-2.5 font-sans text-[13px] whitespace-nowrap transition-colors duration-200',
                      i === active ? 'text-ink' : 'text-ink-muted hover:text-ink-secondary',
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 shrink-0 rounded-full bg-accent transition-opacity duration-200',
                        i === active ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden="true"
                    />
                    {p.client}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
