import type { Metadata } from 'next'
import { ComingSoonContent } from '@/components/coming-soon-content'

export const metadata: Metadata = {
  title: "Advertaro Creative Studio — Shaping What's Next",
  description:
    'Advertaro (Private) Limited is an award-winning creative technology and web development studio from Colombo, Sri Lanka. Best Web Developer Silver (2023) and Bronze (2022) winner at BestWeb.LK.',
  keywords: [
    'Advertaro',
    'Advertaro Creative Studio',
    'Advertaro Private Limited',
    'Advertaro Pvt Ltd',
    'Best Web Developer Sri Lanka',
    'BestWeb LK Winner',
    'Creative Web Development Colombo',
    'UI UX Design Studio',
    'Next.js Web Studio',
  ],
  authors: [{ name: 'Advertaro Creative Studio', url: 'https://advertaro.lk' }],
  creator: 'Advertaro (Private) Limited',
  publisher: 'Advertaro (Private) Limited',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Advertaro Creative Studio — Shaping What's Next",
    description:
      'Unleashing creativity through bold visuals, seamless interfaces, and limitless possibilities. Award-winning web development from Colombo, Sri Lanka.',
    url: 'https://advertaro.lk',
    siteName: 'Advertaro Creative Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/advertaro-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Advertaro Creative Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertaro Creative Studio',
    description:
      'Award-winning web development and creative engineering studio from Colombo, Sri Lanka.',
    creator: '@WeAreAdvertaro',
    site: '@WeAreAdvertaro',
    images: ['/advertaro-logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['ProfessionalService', 'Organization'],
      '@id': 'https://advertaro.lk/#organization',
      name: 'Advertaro Creative Studio',
      legalName: 'Advertaro (Private) Limited',
      alternateName: [
        'Advertaro',
        'Advertaro (Pvt) Ltd',
        'Advertaro Private Limited',
        'Advertaro Creative Agency',
      ],
      url: 'https://advertaro.lk',
      logo: 'https://advertaro.lk/advertaro-logo.svg',
      email: 'hello@advertaro.lk',
      telephone: '+94716880657',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Colombo',
        addressCountry: 'LK',
      },
      founder: {
        '@type': 'Person',
        name: 'Madushan Sooriyarathne',
        jobTitle: 'Co-Founder & Director',
        sameAs: 'https://github.com/advertaro',
      },
      award: [
        'Best Web Developer - Silver Winner, BestWeb.LK (2023)',
        'Best Web Developer - Bronze Winner, BestWeb.LK (2022)',
        'Multiple Best Website Gold and Category Awards, BestWeb.LK',
      ],
      knowsAbout: [
        'Web Development',
        'Creative Web Engineering',
        'WebGL & 3D Interactive Design',
        'UI/UX Design Systems',
        'Next.js & React Applications',
        'Brand Identity & Creative Direction',
      ],
      sameAs: [
        'https://linkedin.com/company/advertaro-creative-agency',
        'https://x.com/WeAreAdvertaro',
        'https://www.facebook.com/WeAreAdvertaro/',
        'https://www.instagram.com/weareadvertaro/',
        'https://github.com/advertaro',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+94716880657',
          contactType: 'customer service',
          email: 'hello@advertaro.lk',
          areaServed: ['LK', 'Worldwide'],
          availableLanguage: ['English', 'Sinhala'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://advertaro.lk/#website',
      url: 'https://advertaro.lk',
      name: 'Advertaro Creative Studio',
      description:
        'Award-winning creative technology and web development studio based in Colombo, Sri Lanka.',
      publisher: {
        '@id': 'https://advertaro.lk/#organization',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://advertaro.lk/#webpage',
      url: 'https://advertaro.lk',
      name: "Advertaro Creative Studio — Shaping What's Next",
      isPartOf: {
        '@id': 'https://advertaro.lk/#website',
      },
      about: {
        '@id': 'https://advertaro.lk/#organization',
      },
      description:
        'Unleashing creativity through bold visuals, seamless interfaces, and limitless possibilities.',
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <ComingSoonContent />
    </>
  )
}
