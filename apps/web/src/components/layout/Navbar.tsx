'use client'

import { navigation } from '@advertaro/content'
import { CtaPill, cn } from '@advertaro/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const toggleBar =
  'block h-[1.5px] w-4 bg-white transition-[translate,rotate] duration-250 ease-[ease]'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu on navigation
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className="fixed inset-x-0 h-(--nav-height) top-0 z-100 flex items-center justify-between border-b  border-white/6 bg-[linear-gradient(180deg,rgba(10,10,11,0.88)_0%,rgba(10,10,11,0.45)_75%,transparent_100%)] px-5 py-3.5 backdrop-blur-[10px] sm:px-8 sm:py-[18px]">
        <Link
          href="/"
          className="inline-flex items-start font-display text-[19px] font-extrabold tracking-[-0.03em] text-ink"
          aria-label="Advertaro — home"
        >
          Advertaro<sup className="ml-0.5 text-[10px] font-semibold text-ink-secondary">™</sup>
        </Link>

        <nav className="hidden items-center gap-[34px] lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-baseline gap-1 text-[13px] font-medium text-white/84 transition-colors duration-200 ease-[ease] hover:text-accent aria-[current=page]:text-accent"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label} <sup className="font-sans text-[9px] text-ink-muted">{item.index}</sup>
            </Link>
          ))}
        </nav>

        <CtaPill
          href="/contact"
          label="Start a project"
          rollLabel="Let's talk"
          className="hidden lg:inline-flex"
        />

        <button
          type="button"
          className="group inline-flex size-10 flex-col items-center justify-center gap-[5px] rounded-full border border-white/14 bg-white/6 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              toggleBar,
              'group-aria-expanded:translate-y-[3.25px] group-aria-expanded:rotate-45',
            )}
          />
          <span
            className={cn(
              toggleBar,
              'group-aria-expanded:-translate-y-[3.25px] group-aria-expanded:-rotate-45',
            )}
          />
        </button>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          'invisible fixed inset-0 z-999 flex flex-col justify-between bg-[rgba(8,8,10,0.97)] px-6 pt-[calc(var(--spacing-nav)+32px)] pb-8 opacity-0 backdrop-blur-[14px] transition-[opacity,visibility] duration-250 ease-[ease]',
          open && 'visible opacity-100',
        )}
        inert={!open}
      >
        <ul className="flex list-none flex-col border-t border-line">
          {[...navigation, { label: 'Contact', href: '/contact', index: '05' }].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline justify-between border-b border-line py-4.5 text-[34px] font-bold tracking-[-0.03em]"
              >
                {item.label}{' '}
                <sup className="font-sans text-[11px] tracking-[0.1em] text-accent">
                  ({item.index})
                </sup>
              </Link>
            </li>
          ))}
        </ul>
        <CtaPill
          href="/contact"
          label="Start a project"
          rollLabel="Let's talk"
          tabIndex={open ? 0 : -1}
          className="self-start"
        />
      </div>
    </>
  )
}
