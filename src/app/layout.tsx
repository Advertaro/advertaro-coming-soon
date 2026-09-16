import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { lilGrotesk, rethinkSans } from '@/styles/fonts'

export const metadata: Metadata = {
  metadataBase: new URL('https://advertaro.lk'),
  title: {
    default: 'Advertaro Creative Studio — Award-Winning Web Development & Digital Experiences',
    template: '%s | Advertaro Creative Studio',
  },
  description:
    'Advertaro (Private) Limited is an award-winning creative digital studio and software engineering firm based in Colombo, Sri Lanka. Best Web Developer Silver (2023) and Bronze (2022) winner at BestWeb.LK.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${rethinkSans.variable} ${lilGrotesk.variable}`}>
      <body className={`${rethinkSans.className} antialiased w-full`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
