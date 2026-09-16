import { Rethink_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const lilGrotesk = localFont({
  src: './fonts/lil-grotesk-variable.woff2',
  variable: '--font-lil-grotesk',
  display: 'swap',
})

export const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rethink-sans',
})
