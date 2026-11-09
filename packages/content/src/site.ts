import type { ProcessStep } from './types'

export const site = {
  name: 'Advertaro',
  legalName: 'Advertaro (Private) Limited',
  url: 'https://advertaro.lk',
  email: 'hello@advertaro.lk',
  phone: '+94 71 688 0657',
  phoneHref: 'tel:+94716880657',
  whatsappHref: 'https://wa.me/94716880657',
  city: 'Colombo, Sri Lanka',
  location: 'Based in Colombo, Sri Lanka. Working with clients worldwide.',
  hours: ['Mon–Fri: 09:00 – 18:00', 'Sat: By appointment'],
  founded: '2019',
  tagline: 'We build digital products worth showing.',
  description:
    'Advertaro is a digital creative studio in Colombo, Sri Lanka. We design and build brand identities, bespoke websites, mobile apps and the systems that run them — from scratch, every time.',
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/advertaro-creative-agency' },
    { label: 'Instagram', href: 'https://www.instagram.com/weareadvertaro/' },
    { label: 'X', href: 'https://x.com/WeAreAdvertaro' },
    { label: 'Facebook', href: 'https://www.facebook.com/WeAreAdvertaro/' },
  ],
  awards: [
    'Best Web Developer — Silver, BestWeb.LK 2023',
    'Best Web Developer — Bronze, BestWeb.LK 2022',
  ],
} as const

export const navigation = [
  { label: 'Work', href: '/work', index: '01' },
  { label: 'Services', href: '/services', index: '02' },
  { label: 'About', href: '/about', index: '03' },
  { label: 'Blog', href: '/blog', index: '04' },
] as const

export const footerNavigation = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const

/**
 * Studio-level numbers. "Brands served" is the working figure from the
 * research docs — confirm before launch.
 */
export const studioStats = [
  { value: '50+', label: 'Brands Served' },
  { value: '07', label: 'Years Building' },
  { value: '02', label: 'BestWeb.LK Awards' },
  { value: '1D', label: 'Reply Time' },
]

export const contactStats = [
  { value: '1D', label: 'Reply Time' },
  { value: '02', label: 'Revision Rounds' },
  { value: '100%', label: 'Built From Scratch' },
  { value: '0', label: 'Templates Used' },
]

export const budgets = ['Under $5K', '$5K–$15K', '$15K–$30K', '$30K+', 'Not sure'] as const

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    spec: 'WEEK 01 — 02',
    description:
      'We start by asking why. Goals, audience, constraints and the one number that tells us it worked.',
    deliverableLabel: 'YOU GET',
    deliverable: 'Brief & sitemap',
  },
  {
    index: '02',
    title: 'Design & Build',
    spec: 'WEEK 03 — 10',
    description:
      'Brand, interface and engineering run as one team. You see real work every week, not a big reveal at the end.',
    deliverableLabel: 'YOU GET',
    deliverable: 'Weekly builds',
  },
  {
    index: '03',
    title: 'Launch & Grow',
    spec: 'LIVE — ONGOING',
    description:
      'We ship, measure and keep improving. Content editing, performance and new features stay in reach.',
    deliverableLabel: 'YOU GET',
    deliverable: 'A product that works',
  },
]

export const credits = [
  { role: 'STRATEGY', person: 'Advertaro' },
  { role: 'BRAND', person: 'Advertaro' },
  { role: 'DESIGN', person: 'Advertaro' },
  { role: 'ENGINEERING', person: 'Advertaro' },
  { role: 'AUTOMATION', person: 'Advertaro' },
  { role: 'TEMPLATES', person: 'Never', highlight: true },
]

export const beliefs = [
  {
    title: 'We ask why before we build.',
    text: 'Most agencies will build whatever you ask for. We would rather understand the problem first — then build the right thing.',
  },
  {
    title: 'From scratch, every time.',
    text: 'No WordPress, no themes, no page builders. Custom work is the only way to build something your competitors cannot copy.',
  },
  {
    title: 'We say no more than we say yes.',
    text: 'We only take projects we can do exceptionally. Saying no early is kinder than delivering something mediocre late.',
  },
  {
    title: 'One team, start to finish.',
    text: 'The people who scope your project are the people who design, build and support it. Nothing gets lost in a handover.',
  },
]
