import { caseStudies } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { WorkIndex } from '@/components/sections/shared/WorkIndex'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Case studies from Advertaro — bespoke websites, brand identities, apps and systems for hospitality, real estate and ambitious businesses.',
  alternates: { canonical: '/work' },
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="(01) — WORK"
        title={
          <>
            Projects we're <Em>proud of</Em>
          </>
        }
        intro="Brands, websites, apps and systems — each one built from scratch for a business that needed more than a template."
        meta={<Tag>{String(caseStudies.length).padStart(2, '0')} CASE STUDIES</Tag>}
      />
      <SectionHeaderBar num="02" label="SELECTED WORK" timecode="00:02:00:00" />
      <section className="page-section">
        <div className="site-container">
          <WorkIndex studies={caseStudies} />
        </div>
      </section>
      <CtaBand
        num="03"
        title={
          <>
            Working on something? <Em>Tell us about it.</Em>
          </>
        }
      />
    </>
  )
}
