import { footerNavigation, site } from '@advertaro/content'
import { Em } from '@advertaro/ui'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg pt-[72px]">
      <Container>
        <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-[1.3fr_0.8fr_1fr]">
          <div>
            <span className="mb-4.5 block font-sans text-[11px] tracking-[0.14em] text-accent">
              (00) — STUDIO
            </span>
            <p className="max-w-[380px] text-[18px] leading-[1.5] text-ink-editorial">
              A <Em>from-scratch</Em> digital studio building brands, websites, apps and systems for{' '}
              <Em>businesses that know the difference</Em>.
            </p>
          </div>

          <div>
            <span className="mb-4.5 block font-sans text-[11px] tracking-[0.14em] text-accent">
              (01) — NAVIGATION
            </span>
            <ul className="flex list-none flex-col gap-2.5">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-ink-secondary transition-colors duration-200 ease-[ease] hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="mb-4.5 block font-sans text-[11px] tracking-[0.14em] text-accent">
              (02) — VISIT US
            </span>
            <p className="mb-3 text-[16px] font-semibold text-white">{site.city}</p>
            <p className="mb-1.5 text-[14.5px] text-ink-secondary">
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="mb-1.5 text-[14.5px] text-ink-secondary">
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
            <div className="mt-[18px] flex gap-3">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-3.5 py-[7px] font-sans text-[11px] text-ink-secondary transition-colors duration-200 ease-[ease] hover:border-accent hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="relative flex scroll-mt-nav flex-wrap items-center justify-between gap-3 border-y border-line bg-bg/90 px-5 py-3.5 font-sans text-[10px] tracking-[0.14em] text-ink-secondary uppercase sm:px-8 sm:py-4 sm:text-[11px]">
        <div className="flex items-center gap-2 font-semibold text-ink">+ EST. {site.founded}</div>
        <div>+ COLOMBO</div>
        <div>+ WORLDWIDE</div>
      </div>

      <div
        className="select-none pt-7 pb-6 text-center font-display text-[13vw] leading-[0.88] font-extrabold tracking-[-0.055em] text-white/94 sm:text-[length:clamp(72px,13vw,195px)]"
        aria-hidden="true"
      >
        Advertaro
      </div>

      <div className="flex flex-col flex-wrap items-start justify-between gap-4 border-t border-line px-5 py-5 font-sans text-[11px] text-ink-muted sm:flex-row sm:items-center sm:px-8 [&_a]:text-ink-secondary [&_a]:hover:text-accent">
        <div>
          <Link href="/privacy">Privacy Policy</Link> &nbsp;·&nbsp;{' '}
          <Link href="/terms">Terms of Use</Link>
        </div>
        <div>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
        <div>
          <a href="#top">Back To Top ↑</a>
        </div>
      </div>
    </footer>
  )
}
