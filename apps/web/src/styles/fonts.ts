import { Inter, JetBrains_Mono } from 'next/font/google'

/* Grotesk sans for UI and display, mono for technical labels. */
export const grotesk = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})
