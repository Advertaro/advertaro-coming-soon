import type { Faq, ProcessStep, Sector } from './types'

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

// NOTE: draft copy — client-average metrics; confirm the source data before launch.
export const heroStats = [
  { value: '+52%', label: 'Average increase in conversion rate' },
  { value: '+63%', label: 'Average increase in leads' },
  { value: '+48%', label: 'Average increase in organic traffic' },
]

export const heroRotatingWords = [
  'websites',
  'mobile apps',
  'brand identities',
  'web systems',
] as const

export const budgets = ['Under $5K', '$5K–$15K', '$15K–$30K', '$30K+', 'Not sure'] as const

// NOTE: draft copy — confirm sector list and taglines before launch.
export const sectors: Sector[] = [
  {
    index: '01',
    title: 'Hospitality',
    tagline: 'Direct bookings for boutique hotels and villas.',
    stills: [
      { base: '#102a45', glow: '#ff5500', label: 'HOSPITALITY // 01' },
      { base: '#1b2838', glow: '#f97316', label: 'HOSPITALITY // 02' },
      { base: '#241917', glow: '#fb923c', label: 'HOSPITALITY // 03' },
    ],
  },
  {
    index: '02',
    title: 'Real Estate',
    tagline: 'Project sites that sell units before handover.',
    stills: [
      { base: '#172334', glow: '#ff4d00', label: 'REAL ESTATE // 01' },
      { base: '#13292a', glow: '#f59e0b', label: 'REAL ESTATE // 02' },
      { base: '#0f2547', glow: '#ff4d00', label: 'REAL ESTATE // 03' },
    ],
  },
  {
    index: '03',
    title: 'Tourism & Travel',
    tagline: 'Experiences people can book in a few taps.',
    stills: [
      { base: '#13292a', glow: '#f59e0b', label: 'TOURISM // 01' },
      { base: '#0f1c2e', glow: '#38bdf8', label: 'TOURISM // 02' },
      { base: '#2b1d14', glow: '#f97316', label: 'TOURISM // 03' },
    ],
  },
  {
    index: '04',
    title: 'Automotive',
    tagline: 'Inventory platforms that keep stock moving.',
    stills: [
      { base: '#0c223b', glow: '#38bdf8', label: 'AUTOMOTIVE // 01' },
      { base: '#0c2448', glow: '#3b82f6', label: 'AUTOMOTIVE // 02' },
      { base: '#162636', glow: '#60a5fa', label: 'AUTOMOTIVE // 03' },
    ],
  },
]

/** Sectors we have not worked in yet, scrolled in the Industries invite marquee. Draft list. */
export const openSectors = [
  'Healthcare',
  'Education',
  'Retail',
  'Fintech',
  'Food & Beverage',
  'Logistics',
  'Wellness',
  'Manufacturing',
] as const

// NOTE: draft copy — confirm process steps before launch.
export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    spec: 'WEEK 01 — 02',
    description:
      'We start by asking why. Goals, audience, constraints and the one number that tells us it worked.',
    deliverableLabel: 'YOU GET',
    deliverable: 'A clear plan',
  },
  {
    index: '02',
    title: 'Create',
    spec: 'SCOPED PER PROJECT',
    description:
      'Brand, product or campaign, one team does the work. You review real progress every week, not a big reveal at the end.',
    deliverableLabel: 'YOU GET',
    deliverable: 'Weekly check-ins',
  },
  {
    index: '03',
    title: 'Launch & Grow',
    spec: 'LIVE — ONGOING',
    description: 'We ship, measure against that number and keep improving what works.',
    deliverableLabel: 'YOU GET',
    deliverable: 'Results you can measure',
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

/** Home FAQ (section 09). Draft answers grounded in site and services copy — confirm before launch. */
export const homeFaqs: Faq[] = [
  {
    question: 'What does Advertaro build?',
    answer:
      'Brand identities, bespoke websites, mobile apps and the automation that runs behind them. Every project is designed and built from scratch. We never start from a template.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A brand identity usually takes four to six weeks from workshop to final asset kit. Website and app timelines depend on scope, and we fix the schedule in the proposal before work starts.',
  },
  {
    question: 'Do you work with clients outside Sri Lanka?',
    answer:
      'Yes. We are based in Colombo and work with clients worldwide, with calls arranged around your time zone.',
  },
  {
    question: 'Do we own the final files and code?',
    answer: 'Yes. You own the full rights to the final identity, the source files and the code.',
  },
  {
    question: 'What do you need from me to get started?',
    answer:
      'A short brief: what you are building, who it is for, your timeline and a rough budget range. Send it through the form below and a real person replies within one business day.',
  },
]

/** Example questions rotated through the FAQ ask field's placeholder. */
export const faqAskExamples = [
  'What budget do we need?',
  'Do you work with startups?',
  'Can our team edit the site later?',
  'Can you redesign our existing website?',
  'Do you build apps for iOS and Android?',
] as const
