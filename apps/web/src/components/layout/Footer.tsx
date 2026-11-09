import { footerNavigation, site } from '@advertaro/content'
import { Em } from '@advertaro/ui'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-cols">
          <div>
            <span className="footer-col-label">(00) — STUDIO</span>
            <p className="footer-studio-desc">
              A <Em>from-scratch</Em> digital studio building brands, websites, apps and systems for{' '}
              <Em>businesses that know the difference</Em>.
            </p>
          </div>

          <div>
            <span className="footer-col-label">(01) — NAVIGATION</span>
            <ul className="footer-nav-list">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-visit">
            <span className="footer-col-label">(02) — VISIT US</span>
            <p className="city">{site.city}</p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
            <div className="footer-socials">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-header-bar">
        <div className="left-tag">+ EST. {site.founded}</div>
        <div className="center-cross">+ COLOMBO</div>
        <div className="right-tc">+ WORLDWIDE</div>
      </div>

      <div className="footer-giant-word" aria-hidden="true">
        Advertaro
      </div>

      <div className="footer-bottom-bar">
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
