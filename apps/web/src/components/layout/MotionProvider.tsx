'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Global motion: Lenis smooth scroll driven by the GSAP ticker, plus
 * scroll-entry reveals for every element marked `data-reveal`.
 * Everything is skipped when the user prefers reduced motion.
 */
export function MotionProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.2, anchors: { offset: -69 } })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run reveals on route change
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      for (const el of gsap.utils.toArray<HTMLElement>('[data-reveal]')) {
        const stagger = el.dataset.reveal === 'stagger'
        const targets = stagger ? Array.from(el.children) : el
        gsap.from(targets, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'expo.out',
          stagger: stagger ? 0.08 : 0,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      }
      for (const el of gsap.utils.toArray<HTMLElement>('[data-wipe]')) {
        gsap.from(el, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 1,
          ease: 'expo.out',
          clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      }
      gsap.from('[data-hero-in]', {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.15,
        clearProps: 'transform,opacity',
      })
    })
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [pathname])

  return null
}
