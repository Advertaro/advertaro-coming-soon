'use client'

import { navigation } from '@advertaro/content'
import { CtaPill } from '@advertaro/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
      <header className="navbar">
        <Link href="/" className="brand-logo" aria-label="Advertaro — home">
          Advertaro<sup>™</sup>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label} <sup>{item.index}</sup>
            </Link>
          ))}
        </nav>

        <CtaPill href="/contact" label="Start a project" rollLabel="Let's talk" />

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="mobile-menu" className={`mobile-menu${open ? ' open' : ''}`} inert={!open}>
        <ul className="mobile-menu-links">
          {[...navigation, { label: 'Contact', href: '/contact', index: '05' }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} tabIndex={open ? 0 : -1}>
                {item.label} <sup>({item.index})</sup>
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
