import { Questrial, Syne } from 'next/font/google'

/* Syne for titles, Questrial for body text. */
export const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
})

export const questrial = Questrial({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-questrial',
})
