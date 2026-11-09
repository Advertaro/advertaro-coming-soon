import type { CaseStudy } from './types'

/*
 * DRAFT CONTENT — every case study below is `draft: true`.
 * Client names and the services delivered come from the research docs.
 * Years, narrative detail, metrics ("+XX%") and quotes are placeholders
 * waiting for P7-01 / P7-02 (collect metrics, client sign-off).
 * Do not launch until each entry is confirmed and `draft` is set to false.
 */

export const caseStudies: CaseStudy[] = [
  {
    slug: 'ishq-villas',
    title: 'Ishq Villas',
    client: 'Ishq Villas',
    industry: 'Hospitality',
    services: ['web-design', 'branding', 'digital-marketing'],
    year: '2025',
    deliverable: 'Digital launch & direct booking site',
    outcome: 'A villa brand that books direct instead of through OTAs.',
    overview:
      'Ishq Villas needed to launch digitally with a presence that matched the quality of the stay — and a booking path guests would actually use.',
    challenge: [
      {
        type: 'p',
        text: 'The villas were beautiful, but online they were one listing among hundreds on booking platforms. Every reservation came through an OTA, with commission on every night and no relationship with the guest.',
      },
      {
        type: 'p',
        text: 'The brief was simple: give guests a reason to book direct, and make doing so easier than going back to the platform.',
      },
    ],
    approach: [
      {
        type: 'p',
        text: 'We designed the site around the stay rather than the property list. Full-bleed photography and short, specific copy lead each villa page, with availability and rates one tap away on every screen.',
      },
      {
        type: 'p',
        text: 'The booking flow was cut to the fewest possible steps, with the direct-booking benefits stated plainly at the moment of decision. A headless CMS lets the team update rates, offers and seasonal content without a developer.',
      },
      {
        type: 'p',
        text: 'Search and social campaigns went live alongside the site so the new direct channel had traffic from day one.',
      },
    ],
    results: [
      {
        value: '+XX%',
        label: 'Direct bookings',
        description: 'Placeholder — awaiting client figures.',
      },
      {
        value: '−XX%',
        label: 'OTA dependency',
        description: 'Placeholder — awaiting client figures.',
      },
    ],
    resultSummary:
      'Result figures are being collected from the client and will be published once approved.',
    quote: {
      text: 'The old site was something we avoided sharing. The new one is the first thing we send to guests.',
      authorName: 'Name pending approval',
      authorTitle: 'Owner',
      authorCompany: 'Ishq Villas',
    },
    stack: ['Next.js', 'Sanity CMS', 'Vercel', 'Meta Ads'],
    featured: true,
    theme: { base: '#102a45', glow: '#ff5500', label: 'ISHQ VILLAS // DIRECT BOOKING' },
    gallery: [
      { base: '#102a45', glow: '#ff5500', label: 'ISHQ // HOME' },
      { base: '#1b2838', glow: '#f97316', label: 'ISHQ // VILLA DETAIL' },
      { base: '#0f1c2e', glow: '#38bdf8', label: 'ISHQ // BOOKING FLOW' },
      { base: '#241917', glow: '#fb923c', label: 'ISHQ // MOBILE' },
    ],
    draft: true,
  },
  {
    slug: 'w15-collection',
    title: 'W15 Collection',
    client: 'W15 Collection',
    industry: 'Hospitality',
    services: ['branding', 'web-design'],
    year: '2025',
    deliverable: 'Brand identity & collection website',
    outcome: 'One brand system across a collection of distinct properties.',
    overview:
      'W15 Collection brings together several properties with their own character. They needed a brand that held them together without flattening what makes each one different.',
    challenge: [
      {
        type: 'p',
        text: 'Each property had grown its own look over time. Guests could not tell the properties belonged to one collection, and cross-selling between them was almost impossible.',
      },
    ],
    approach: [
      {
        type: 'p',
        text: 'We built a parent identity with a flexible system underneath: one wordmark, one type family, and a palette that shifts per property while staying recognisably W15.',
      },
      {
        type: 'p',
        text: 'The website follows the same logic — a single collection site where each property gets its own world, with shared booking and navigation that make moving between them natural.',
      },
    ],
    results: [
      {
        value: '+XX%',
        label: 'Cross-property stays',
        description: 'Placeholder — awaiting client figures.',
      },
      {
        value: 'XX',
        label: 'Properties unified',
        description: 'Placeholder — confirm with client.',
      },
    ],
    resultSummary:
      'Result figures are being collected from the client and will be published once approved.',
    quote: {
      text: 'For the first time, guests see us as one collection rather than separate hotels.',
      authorName: 'Name pending approval',
      authorTitle: 'Director',
      authorCompany: 'W15 Collection',
    },
    stack: ['Brand system', 'Next.js', 'Sanity CMS'],
    featured: true,
    theme: { base: '#2b1d14', glow: '#f97316', label: 'W15 COLLECTION // BRAND SYSTEM' },
    gallery: [
      { base: '#2b1d14', glow: '#f97316', label: 'W15 // IDENTITY' },
      { base: '#281915', glow: '#ff4d00', label: 'W15 // PROPERTY PAGES' },
      { base: '#13292a', glow: '#f59e0b', label: 'W15 // PRINT' },
      { base: '#172334', glow: '#ff4d00', label: 'W15 // MOBILE' },
    ],
    draft: true,
  },
  {
    slug: 'debug-auto-exclusives',
    title: 'Debug Auto',
    client: 'Debug Auto Exclusives',
    industry: 'Automotive',
    services: ['web-design', 'automation'],
    year: '2025',
    deliverable: 'Inventory platform & dealer tools',
    outcome: 'Stock listed once, published everywhere, updated in real time.',
    overview:
      'Debug Auto Exclusives sells premium vehicles. They needed a platform that showed their stock properly and took the manual work out of keeping listings up to date.',
    challenge: [
      {
        type: 'p',
        text: 'Every vehicle was photographed, written up and posted by hand across several channels. Sold cars stayed listed for days, and enquiries arrived in too many inboxes to track.',
      },
    ],
    approach: [
      {
        type: 'p',
        text: 'We built a custom inventory system where each vehicle is entered once and published to the website automatically. Status changes — reserved, sold — update everywhere at the same time.',
      },
      {
        type: 'p',
        text: 'Enquiries from every channel land in one dashboard with the vehicle attached, so the sales team always knows which car a buyer is asking about.',
      },
    ],
    results: [
      {
        value: 'XXh',
        label: 'Saved per week',
        description: 'Placeholder — awaiting client figures.',
      },
      {
        value: '+XX%',
        label: 'Qualified enquiries',
        description: 'Placeholder — awaiting client figures.',
      },
    ],
    resultSummary:
      'Result figures are being collected from the client and will be published once approved.',
    quote: {
      text: 'We list a car once and it is everywhere. That alone changed how the team works.',
      authorName: 'Name pending approval',
      authorTitle: 'Founder',
      authorCompany: 'Debug Auto Exclusives',
    },
    stack: ['Next.js', 'Custom CMS', 'Automation workflows'],
    featured: true,
    theme: { base: '#0c223b', glow: '#38bdf8', label: 'DEBUG AUTO // INVENTORY PLATFORM' },
    gallery: [
      { base: '#0c223b', glow: '#38bdf8', label: 'DEBUG // LISTINGS' },
      { base: '#0c2448', glow: '#3b82f6', label: 'DEBUG // DASHBOARD' },
      { base: '#121829', glow: '#a78bfa', label: 'DEBUG // VEHICLE DETAIL' },
      { base: '#162636', glow: '#60a5fa', label: 'DEBUG // MOBILE' },
    ],
    draft: true,
  },
  {
    slug: 'global-housing',
    title: 'Global Housing',
    client: 'Global Housing Real Estate',
    industry: 'Real Estate',
    services: ['web-design', 'digital-marketing'],
    year: '2024',
    deliverable: 'Project marketing website',
    outcome: 'A development sold on its story, not just its floor plans.',
    overview:
      'Global Housing Real Estate needed a project marketing site that could sell units before completion and qualify buyers before they reached the sales team.',
    challenge: [
      {
        type: 'p',
        text: 'Off-plan buyers make large decisions from very little. Brochures and listings showed the floor plans but not the life around them, and the sales team spent most of their time on unqualified leads.',
      },
    ],
    approach: [
      {
        type: 'p',
        text: 'We built a site that tells the story of the development — location, lifestyle, finishes — before it shows a single plan. Unit availability and pricing sit behind a short enquiry flow that captures what buyers are actually looking for.',
      },
    ],
    results: [
      {
        value: '+XX%',
        label: 'Qualified leads',
        description: 'Placeholder — awaiting client figures.',
      },
    ],
    resultSummary:
      'Result figures are being collected from the client and will be published once approved.',
    stack: ['Next.js', 'Sanity CMS', 'Google Ads'],
    featured: false,
    theme: { base: '#172334', glow: '#ff4d00', label: 'GLOBAL HOUSING // PROJECT SITE' },
    gallery: [
      { base: '#172334', glow: '#ff4d00', label: 'GLOBAL HOUSING // HOME' },
      { base: '#13292a', glow: '#f59e0b', label: 'GLOBAL HOUSING // UNITS' },
      { base: '#0f2547', glow: '#ff4d00', label: 'GLOBAL HOUSING // LOCATION' },
    ],
    draft: true,
  },
  {
    slug: 'rapid-adventures',
    title: 'Rapid Adventures',
    client: 'Rapid Adventures',
    industry: 'Tourism',
    services: ['web-design', 'digital-marketing'],
    year: '2024',
    deliverable: 'Experience booking website',
    outcome: 'Adventure tours that sell themselves on mobile.',
    overview:
      'Rapid Adventures runs outdoor experiences for travellers. Most of their customers find them on a phone, often the day before they want to go.',
    challenge: [
      {
        type: 'p',
        text: 'The old booking process relied on messages back and forth. Travellers on the move gave up before a booking was confirmed.',
      },
    ],
    approach: [
      {
        type: 'p',
        text: 'We designed mobile-first: every experience has a short video, a clear price and a two-step booking flow. Campaigns target travellers already in the area.',
      },
    ],
    results: [
      {
        value: '+XX%',
        label: 'Mobile bookings',
        description: 'Placeholder — awaiting client figures.',
      },
    ],
    resultSummary:
      'Result figures are being collected from the client and will be published once approved.',
    stack: ['Next.js', 'Booking integration', 'Meta Ads'],
    featured: false,
    theme: { base: '#13292a', glow: '#f59e0b', label: 'RAPID ADVENTURES // BOOKINGS' },
    gallery: [
      { base: '#13292a', glow: '#f59e0b', label: 'RAPID // EXPERIENCES' },
      { base: '#241917', glow: '#fb923c', label: 'RAPID // BOOKING' },
      { base: '#0f1c2e', glow: '#38bdf8', label: 'RAPID // MOBILE' },
    ],
    draft: true,
  },
]

export const featuredCaseStudies = caseStudies.filter((study) => study.featured)

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}

export function getNextCaseStudy(slug: string) {
  const index = caseStudies.findIndex((study) => study.slug === slug)
  return caseStudies[(index + 1) % caseStudies.length]
}

export function getCaseStudiesForService(slug: string) {
  return caseStudies.filter((study) => study.services.some((service) => service === slug))
}
