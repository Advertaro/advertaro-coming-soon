'use client'

import { getCalApi } from '@calcom/embed-react'
import { ArrowUpRight, Check, Mail, Phone } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { MeteorShower } from '@/components/meteor-shower'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { MorphingText } from '@/components/ui/morphing-text'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { cn } from '@/lib/utils'

const TITLES = [
  { line1: "We're shaping", line2: "what's next." },
  { line1: 'Crafting bold', line2: 'digital experiences.' },
  { line1: 'Designing for', line2: "tomorrow's web." },
  { line1: 'Engineering with', line2: 'limitless vision.' },
]

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/advertaro-creative-agency',
    icon: '/logos/linkedin-logo.svg',
    ariaLabel: 'Advertaro on LinkedIn',
  },
  {
    name: 'X',
    href: 'https://x.com/WeAreAdvertaro',
    icon: '/logos/x-icon.svg',
    ariaLabel: 'Advertaro on X',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/WeAreAdvertaro/',
    icon: '/logos/facebook-logo.svg',
    ariaLabel: 'Advertaro on Facebook',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/weareadvertaro/',
    icon: '/logos/instagram-logo.svg',
    ariaLabel: 'Advertaro on Instagram',
  },
]

export function ComingSoonContent() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({ namespace: '30min' })
      cal('ui', {
        theme: 'light',
        cssVarsPerTheme: { light: { 'cal-brand': '#DA4516' }, dark: { 'cal-brand': '#DA4516' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setSubmitted(true)
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505] text-white">
      <WebGLShader className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div
        className="pointer-events-none backdrop-blur-lg bg-[oklch(0.1_0.0197_36/50%)] absolute inset-0 z-10"
        aria-hidden="true"
      />
      <div className="grain" aria-hidden="true" />
      <header className="relative z-20 flex w-[min(75rem,calc(100vw-2rem))] mx-auto items-center justify-between py-10 ">
        <MeteorShower />
        {/** biome-ignore lint/performance/noImgElement: Logo */}
        <img src="/advertaro-logo.svg" alt="Advertaro" className="h-7 w-auto sm:h-8" />
        <button
          type="button"
          data-cal-namespace="30min"
          data-cal-link="advertaro/30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}'
          className="group relative inline-flex cursor-pointer overflow-hidden rounded-full bg-white/15 p-px text-xs font-medium text-white/80 transition sm:text-sm"
        >
          <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#DA4516_20%,#F37417_38%,#ffd0a8_48%,#b895ff_60%,#7c3aed_72%,transparent_88%)]" />
          <span className="relative inline-flex h-full w-full items-center justify-center font-semibold text-base rounded-full bg-[oklch(0.2359_0.0123_16.94)] px-4 py-2 text-white/90 transition-colors duration-300 group-hover:bg-[#14121a] group-hover:text-white sm:px-5">
            Let&apos;s talk <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
          </span>
        </button>
      </header>
      <section className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center sm:pb-24">
        <div className="group relative slide-in mb-7 inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-md shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] sm:mb-9">
          <span
            className={cn(
              'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-white/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px',
            )}
            style={{
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'subtract',
              WebkitClipPath: 'padding-box',
            }}
          />
          <span className="relative mr-0.5 flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff9b54] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff9b54] shadow-[0_0_12px_#ff9b54]" />
          </span>
          <hr className="mx-2.5 h-3.5 w-px shrink-0 border-none bg-white/20" />
          <AnimatedGradientText className="text-xs font-medium uppercase tracking-[0.2em]">
            New chapter is loading
          </AnimatedGradientText>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center">
          <MorphingText
            as="h1"
            items={TITLES}
            className="slide-in relative z-10 flex min-h-[2.3em] max-w-4xl leading-tight! items-center justify-center text-center font-heading text-4xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-8xl"
            line1ClassName="text-white"
            line2ClassName="morph-gradient"
            morphTime={1.5}
            cooldownTime={7.5}
          />
        </div>
        <p className="slide-in-delayed mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
          Unleashing creativity through bold visuals, seamless interfaces, and limitless
          possibilities.
        </p>
        <div className="slide-in-delayed-2 glass-effect mt-10 w-full max-w-xl rounded-[2rem] p-6 text-left shadow-2xl shadow-black/30 sm:mt-12 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8a3d]/20 text-[#ffb27b]">
                <Check />
              </div>
              <h2 className="text-xl font-medium">You&apos;re on the list.</h2>
              <p className="mt-2 text-sm text-white/60">
                We&apos;ll be in touch when Advertaro is ready.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Be the first to know.
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Sign up for occasional updates from our studio. No noise, just good things.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-h-12 flex-1 rounded-full border border-white/15 bg-black/20 px-5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#ff9b54]/70 focus:ring-2 focus:ring-[#ff9b54]/20"
                />
                <button
                  type="submit"
                  className="min-h-12 rounded-full bg-white px-6 text-sm font-semibold text-[#191427] transition hover:bg-[#ffd3b1] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                >
                  Join waitlist
                </button>
              </form>
            </>
          )}
        </div>
        <div className="flex flex-col items-center mt-10 gap-y-4">
          <span className="uppercase tracking-widest font-light slide-in-delayed text-xs">
            Contact us
          </span>
          <div className="slide-in-delayed-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+94716880657"
              aria-label="Call Advertaro"
              className="glass-effect flex items-center gap-x-2 rounded-full min-w-44 p-3 text-white/65 transition hover:text-white"
            >
              <Phone className="size-5" />
              <span className="font-semibold text-sm">+94 71 688 0657</span>
            </a>
            <a
              href="mailto:hello@advertaro.lk"
              aria-label="Email Advertaro"
              className="glass-effect rounded-full flex items-center gap-x-2  min-w-44 p-3 text-white/65 transition hover:text-white"
            >
              <Mail className="size-5" />
              <span className="font-semibold text-sm">hello@advertaro.lk</span>
            </a>
          </div>
          <nav aria-label="Social links" className="slide-in-delayed-2 flex items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="group glass-effect flex size-9 items-center justify-center rounded-full text-white/65 transition hover:text-white"
              >
                {/** biome-ignore lint/performance/noImgElement: Social icon */}
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="size-4 opacity-65 transition-opacity group-hover:opacity-100"
                />
              </a>
            ))}
          </nav>
        </div>
      </section>
      <footer className="relative z-20 flex items-center justify-center gap-2 px-6 py-6 text-center text-xs text-white/40 sm:flex-row sm:px-10 lg:px-16">
        <span>© 2026 Advertaro Creative Studio</span>
      </footer>
    </main>
  )
}
