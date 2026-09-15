'use client'

import { getCalApi } from '@calcom/embed-react'
import { ArrowUpRight, Check, Globe, Mail, Phone } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'

export default function Page() {
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
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="blob blob-orange absolute left-[4%] top-[14%] h-[25rem] w-[25rem] bg-[#DA4516]/65 blur-3xl lg:h-[38rem] lg:w-[38rem]" />
        <div className="blob blob-brand absolute right-[4%] top-[22%] h-[28rem] w-[28rem] bg-gradient-to-br from-[#25133f]/90 via-[#5a2d7d]/65 to-[#f0a06c]/65 blur-3xl lg:h-[42rem] lg:w-[42rem]" />
        <div className="blob blob-amber absolute bottom-[2%] left-[36%] h-[24rem] w-[24rem] bg-[#ed8c4a]/45 blur-3xl lg:h-[34rem] lg:w-[34rem]" />
      </div>
      <div className="glass-veil pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <img src="/advertaro-logo.svg" alt="Advertaro" className="h-9 w-auto sm:h-11" />
        <button
          type="button"
          data-cal-namespace="30min"
          data-cal-link="advertaro/30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}'
          className="glass-effect rounded-full px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/15 sm:px-5 sm:text-sm"
        >
          Let&apos;s talk <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
        </button>
      </header>
      <section className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center sm:pb-24">
        <div className="slide-in mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-md sm:mb-9">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff9b54] shadow-[0_0_12px_#ff9b54]" />
          New chapter loading
        </div>
        <h1 className="slide-in max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
          We&apos;re shaping
          <br />
          <span className="bg-gradient-to-r from-[#ffd0a8] via-white to-[#b895ff] bg-clip-text text-transparent">
            what&apos;s next.
          </span>
        </h1>
        <p className="slide-in-delayed mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
          Advertaro is a software development studio from Colombo, Sri Lanka. Thoughtful digital
          products are on their way.
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
        <nav aria-label="Social links" className="slide-in-delayed-2 mt-8 flex items-center gap-3">
          <a
            href="tel:+94716880657"
            aria-label="Call Advertaro"
            className="glass-effect rounded-full p-3 text-white/65 transition hover:text-white"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Advertaro on LinkedIn"
            className="glass-effect rounded-full p-3 text-white/65 transition hover:text-white"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Advertaro on Instagram"
            className="glass-effect rounded-full p-3 text-white/65 transition hover:text-white"
          >
            <Globe className="h-4 w-4" />
          </a>
        </nav>
      </section>
      <footer className="relative z-20 flex flex-col items-center gap-2 px-6 py-6 text-center text-xs text-white/40 sm:flex-row sm:justify-between sm:px-10 lg:px-16">
        <span>© 2026 Advertaro Studio</span>
        <span>
          <a href="tel:+94716880657" className="transition hover:text-white">
            +94 71 688 0657
          </a>
          <span className="mx-2">·</span>
          <a href="mailto:hello@advertaro.lk" className="transition hover:text-white">
            hello@advertaro.lk
          </a>
        </span>
      </footer>
    </main>
  )
}
