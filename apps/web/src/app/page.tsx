import { site } from '@advertaro/content'
import type { Metadata } from 'next'
import { About } from '@/components/sections/home/About'
import { Clients } from '@/components/sections/home/Clients'
import { Contact } from '@/components/sections/home/Contact'
import { Hero } from '@/components/sections/home/Hero'
import { MobileShowcase } from '@/components/sections/home/MobileShowcase'
import { Process } from '@/components/sections/home/Process'
import { Reviews } from '@/components/sections/home/Reviews'
import { SelectedWork } from '@/components/sections/home/SelectedWork'
import { Services } from '@/components/sections/home/Services'

export const metadata: Metadata = {
  title: { absolute: 'Advertaro — Bespoke websites, apps & brands from Colombo, Sri Lanka' },
  description: site.description,
  alternates: { canonical: '/' },
  keywords: [
    'bespoke website design Sri Lanka',
    'custom website development Sri Lanka',
    'digital creative agency Sri Lanka',
    'web design agency Colombo',
    'mobile app development Sri Lanka',
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'Organization'],
  '@id': `${site.url}/#organization`,
  name: 'Advertaro Creative Studio',
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/advertaro-logo.svg`,
  email: site.email,
  telephone: '+94716880657',
  foundingDate: site.founded,
  address: { '@type': 'PostalAddress', addressLocality: 'Colombo', addressCountry: 'LK' },
  award: site.awards,
  sameAs: site.socials.map((s) => s.href),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Clients />
      <SelectedWork />
      <MobileShowcase />
      <Services />
      <About />
      <Process />
      <Reviews />
      <Contact />
    </>
  )
}
