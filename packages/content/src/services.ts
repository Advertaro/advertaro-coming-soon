import type { Service, ServiceSlug } from './types'

export const services: Service[] = [
  {
    slug: 'branding',
    index: '01',
    title: 'Branding & Identity',
    shortTitle: 'Brand Identity',
    tagline: 'A brand people remember after they close the tab.',
    summary:
      'Names, marks, type and voice built as one system — so every touchpoint looks like it came from the same confident place.',
    description: [
      {
        type: 'p',
        text: 'A logo is the smallest part of a brand. We design the whole system around it: the mark, a type and colour palette, a voice, and the rules that keep them consistent when your team, your printer and your developer all touch it.',
      },
      {
        type: 'p',
        text: 'Every identity starts with positioning. Who are you for, who are you not for, and what should someone feel in the first three seconds? The visual work follows from those answers, not the other way round.',
      },
      {
        type: 'p',
        text: 'You leave with a brand book your team can actually use, production-ready assets, and an identity that is ready for the web from day one — because we usually build that next.',
      },
    ],
    whoFor:
      'New ventures that need to look established on launch day, and growing businesses that have outgrown the logo they made in year one.',
    included: [
      'Positioning workshop and brand strategy',
      'Logo system, typography and colour palette',
      'Voice and messaging guidelines',
      'Brand book and production-ready asset kit',
    ],
    tags: ['STRATEGY', 'IDENTITY SYSTEMS', 'BRAND BOOKS'],
    faq: [
      {
        question: 'How long does a brand identity take?',
        answer:
          'Most identities take four to six weeks from workshop to final asset kit. Naming adds two to three weeks.',
      },
      {
        question: 'Can you refresh our existing brand instead of starting over?',
        answer:
          'Yes. If your brand has equity worth keeping, we evolve it. We will tell you honestly which one you need.',
      },
      {
        question: 'Do we own the final files?',
        answer: 'Yes. You own the full rights to the final identity and every source file.',
      },
    ],
    visual: 'kinetic-wave',
    theme: { base: '#2b1d14', glow: '#ff4d00', label: 'BRAND // IDENTITY SYSTEM' },
  },
  {
    slug: 'web-design',
    index: '02',
    title: 'Web Design & Development',
    shortTitle: 'Websites',
    tagline: 'Bespoke websites, designed and engineered from scratch.',
    summary:
      'Fast, custom-built sites on Next.js and a headless CMS. No themes, no page builders — just a site that is entirely yours.',
    description: [
      {
        type: 'p',
        text: 'We design every page for the job it has to do — book a room, sell a unit, start a conversation — and then engineer it to load fast and rank well. Your team gets a headless CMS that makes editing content simple without letting anyone break the design.',
      },
      {
        type: 'p',
        text: 'We build on Next.js and React because it gives us full control over performance, accessibility and SEO. It also means your site can grow into booking engines, customer portals and integrations without a rebuild.',
      },
      {
        type: 'p',
        text: 'Motion, interaction and detail are part of the design, not decoration added at the end. The aim is a site you are proud to send to anyone.',
      },
    ],
    whoFor:
      'Hospitality brands, property developers and ambitious companies whose website is the first impression that matters most.',
    included: [
      'UX, content structure and interface design',
      'Custom Next.js development and headless CMS',
      'Performance, accessibility and technical SEO',
      'Hosting setup, analytics and post-launch support',
    ],
    tags: ['NEXT.JS', 'HEADLESS CMS', 'PERFORMANCE'],
    faq: [
      {
        question: 'Why not WordPress?',
        answer:
          'Themes and plugins trade speed, security and originality for convenience. A custom build costs a little more up front and much less over the life of the site.',
      },
      {
        question: 'Can our team edit the content ourselves?',
        answer:
          'Yes. Every site comes with a headless CMS set up for your content, plus a short training session.',
      },
      {
        question: 'How long does a website take?',
        answer:
          'A focused marketing site usually takes six to ten weeks. Larger builds with integrations are scoped individually.',
      },
      {
        question: 'Do you offer hosting and maintenance?',
        answer:
          'Yes. We deploy on Vercel and offer monthly support plans for updates, monitoring and new features.',
      },
    ],
    visual: 'timeline',
    theme: { base: '#14243b', glow: '#ff4d00', label: 'WEB // NEXT.JS BUILD' },
  },
  {
    slug: 'mobile-apps',
    index: '03',
    title: 'Mobile App Development',
    shortTitle: 'Mobile Apps',
    tagline: 'Apps people keep on their home screen.',
    summary:
      'Native-feeling iOS and Android apps from one codebase — designed around the three things your users open it to do.',
    description: [
      {
        type: 'p',
        text: 'Good apps do a few things exceptionally well. We start by finding those few things, then design and build around them — fast launch, clear flows, and nothing your users have to think about.',
      },
      {
        type: 'p',
        text: 'We build cross-platform with React Native so you ship to iOS and Android together, with one team and one codebase. Where a feature needs native code, we write it.',
      },
      {
        type: 'p',
        text: 'We handle store submission, analytics and the backend services your app needs, and we stay on for releases after launch.',
      },
    ],
    whoFor:
      'Businesses that need a direct channel to their customers, and startups shipping their first product.',
    included: [
      'Product scoping and UX flows',
      'iOS and Android app from one codebase',
      'APIs, authentication and backend services',
      'App Store and Play Store release',
    ],
    tags: ['REACT NATIVE', 'iOS · ANDROID', 'PRODUCT DESIGN'],
    faq: [
      {
        question: 'Native or cross-platform?',
        answer:
          'For most products, cross-platform React Native gives you native performance at a much lower cost. We recommend fully native only when the product needs it.',
      },
      {
        question: 'Can you work with our existing backend?',
        answer: 'Yes. We integrate with existing APIs, or design and build the backend for you.',
      },
      {
        question: 'Who owns the code?',
        answer: 'You do. The repository and store accounts are yours from day one.',
      },
    ],
    visual: 'reels-trio',
    theme: { base: '#241917', glow: '#fb923c', label: 'MOBILE // iOS · ANDROID' },
  },
  {
    slug: 'automation',
    index: '04',
    title: 'Systems & Automation',
    shortTitle: 'Automation',
    tagline: 'The systems that make the rest of your business run.',
    summary:
      'Internal tools, integrations and workflows that remove the repetitive work — so your team spends time on what matters.',
    description: [
      {
        type: 'p',
        text: 'Most businesses run on spreadsheets, copy-paste and good intentions. We map how work actually moves through your team, then build the tools and integrations that take the repetitive parts away.',
      },
      {
        type: 'p',
        text: 'That can be a custom dashboard, a booking or inventory system, a CRM integration, or a set of automations that connect the tools you already pay for. We pick the simplest thing that will hold up.',
      },
      {
        type: 'p',
        text: 'Every system ships with documentation and a clear owner on your side, so it keeps working long after we hand it over.',
      },
    ],
    whoFor:
      'Operations-heavy businesses — hotels, dealerships, property and service companies — where time lost to admin is time lost to customers.',
    included: [
      'Workflow audit and system design',
      'Custom dashboards and internal tools',
      'Integrations between your existing platforms',
      'Documentation, training and support',
    ],
    tags: ['WORKFLOWS', 'INTEGRATIONS', 'INTERNAL TOOLS'],
    faq: [
      {
        question: 'Do we need to replace our current tools?',
        answer:
          'Usually not. Most of the value comes from connecting the tools you already use properly.',
      },
      {
        question: 'How do you measure success?',
        answer:
          'We agree on a measure up front — hours saved per week, errors removed, response time — and report against it.',
      },
      {
        question: 'Is our data safe?',
        answer:
          'We follow least-privilege access, keep data in your accounts wherever possible, and document every integration.',
      },
    ],
    visual: 'nodes',
    theme: { base: '#0c2448', glow: '#3b82f6', label: 'SYSTEMS // WORKFLOW MAP' },
  },
  {
    slug: 'digital-marketing',
    index: '05',
    title: 'Digital Marketing',
    shortTitle: 'Marketing',
    tagline: 'The right people, finding you on purpose.',
    summary:
      'Search, social and performance campaigns tied to real numbers — bookings, leads and sales, not likes.',
    description: [
      {
        type: 'p',
        text: 'A great website does nothing if the right people never see it. We plan and run campaigns across search, Meta and LinkedIn, aimed at the customers who are actually worth reaching.',
      },
      {
        type: 'p',
        text: 'Every campaign is measured against a business result — direct bookings, qualified leads, sales — and we report on those, not on vanity metrics.',
      },
      {
        type: 'p',
        text: 'Because we build the sites too, tracking, landing pages and creative all come from one team and work together from the start.',
      },
    ],
    whoFor:
      'Businesses with a strong product and a site that converts, who are ready to put budget behind growth.',
    included: [
      'Channel strategy and audience planning',
      'Search, Meta and LinkedIn campaigns',
      'Landing pages and campaign creative',
      'Tracking setup and monthly reporting',
    ],
    tags: ['SEARCH', 'PAID SOCIAL', 'ANALYTICS'],
    faq: [
      {
        question: 'What budget do we need?',
        answer:
          'Most campaigns start testing at USD 300–500 per month in ad spend, then scale what works.',
      },
      {
        question: 'How quickly will we see results?',
        answer:
          'Paid campaigns show signal in two to four weeks. Search engine optimisation compounds over three to six months.',
      },
      {
        question: 'Do you lock us into long contracts?',
        answer: 'No. Marketing retainers run month to month after an initial three-month test.',
      },
    ],
    visual: 'growth',
    theme: { base: '#13292a', glow: '#f59e0b', label: 'GROWTH // CAMPAIGN DATA' },
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

export function getServiceTitle(slug: ServiceSlug) {
  return getService(slug)?.shortTitle ?? slug
}
