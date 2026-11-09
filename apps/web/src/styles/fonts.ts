import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google'

/* Grotesk sans for UI and display, serif italic for editorial emphasis, mono for technical labels. */
export const grotesk = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
})

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})
