/**
 * Content types. These mirror the Sanity schemas planned in `scaffold.md`
 * (caseStudy, service, post, teamMember, testimonial) so the local content
 * module can be swapped for GROQ queries without touching page components.
 */

/** A palette for the procedural "film still" canvas that stands in for imagery. */
export type StillTheme = {
  /** Mid-tone of the base gradient. */
  base: string
  /** Glow / rim colour. */
  glow: string
  /** Mono caption burnt into the frame. */
  label: string
}

/** Rich text kept deliberately small: it maps to Portable Text block styles. */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }

export type ServiceSlug =
  | 'branding'
  | 'web-design'
  | 'mobile-apps'
  | 'automation'
  | 'digital-marketing'

export type Metric = {
  value: string
  label: string
  description?: string
}

export type Quote = {
  text: string
  authorName: string
  authorTitle: string
  authorCompany: string
}

export type CaseStudy = {
  slug: string
  title: string
  client: string
  industry: string
  services: ServiceSlug[]
  year: string
  /** Short deliverable line shown on cards, e.g. "Brand identity & booking site". */
  deliverable: string
  /** One-line outcome shown on cards. */
  outcome: string
  overview: string
  challenge: Block[]
  approach: Block[]
  results: Metric[]
  resultSummary: string
  quote?: Quote
  stack: string[]
  url?: string
  featured: boolean
  theme: StillTheme
  /** Gallery frames rendered as procedural stills until real screenshots exist. */
  gallery: StillTheme[]
  /** True while copy, metrics or quotes still need client sign-off. */
  draft: boolean
}

export type Faq = { question: string; answer: string }

export type Service = {
  slug: ServiceSlug
  index: string
  title: string
  shortTitle: string
  tagline: string
  summary: string
  description: Block[]
  whoFor: string
  included: string[]
  tags: string[]
  faq: Faq[]
  /** Visual mode for the procedural service frame. */
  visual: 'kinetic-wave' | 'timeline' | 'reels-trio' | 'nodes' | 'growth'
  theme: StillTheme
}

export type TeamMember = {
  name: string
  role: string
  bio: string
  linkedinUrl?: string
  theme: StillTheme
}

export type Testimonial = Quote & {
  project: string
  file: string
  theme: StillTheme
  draft: boolean
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: 'Design' | 'Development' | 'Strategy' | 'Hospitality' | 'Real Estate'
  publishedAt: string
  readingTime: number
  author: string
  body: Block[]
  theme: StillTheme
  draft: boolean
}

export type ProcessStep = {
  index: string
  title: string
  spec: string
  description: string
  deliverableLabel: string
  deliverable: string
}
