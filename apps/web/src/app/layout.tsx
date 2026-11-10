import { site } from '@advertaro/content'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { Footer } from '@/components/layout/Footer'
import { MotionProvider } from '@/components/layout/MotionProvider'
import { Navbar } from '@/components/layout/Navbar'
import { grotesk, jetbrainsMono } from '@/styles/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Advertaro — Digital products worth showing',
    template: '%s | Advertaro',
  },
  description: site.description,
  applicationName: 'Advertaro',
  authors: [{ name: 'Advertaro Creative Studio', url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  openGraph: {
    siteName: 'Advertaro Creative Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@WeAreAdvertaro',
    site: '@WeAreAdvertaro',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0b',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrainsMono.variable}`}>
      <body id="top">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[2000] cta-pill"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MotionProvider />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
