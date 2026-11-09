import { getCaseStudiesForService, getService, services } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { FaqList } from '@/components/sections/shared/FaqList'
import { PageHero } from '@/components/sections/shared/PageHero'
import { WorkCard } from '@/components/sections/shared/WorkCard'
import { Blocks } from '@/components/ui/Blocks'
import { FilmStill } from '@/components/ui/FilmStill'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug)
  if (!service) return {}
  return {
    title: service.title,
    description: `${service.tagline} ${service.summary}`,
    alternates: { canonical: `/services/${service.slug}` },
  }
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug)
  if (!service) notFound()
  const related = getCaseStudiesForService(service.slug).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={`(${service.index}) — ${service.shortTitle.toUpperCase()}`}
        title={service.title}
        intro={service.tagline}
        theme={service.theme}
        meta={service.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      />

      <SectionHeaderBar num="01" label="IN PRACTICE" timecode="00:01:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <div className="service-media-box" data-wipe>
            <FilmStill theme={service.theme} mode={service.visual} width={960} height={540} />
          </div>
          <div className="prose" data-reveal>
            <Blocks blocks={service.description} />
          </div>
        </div>
      </section>

      <SectionHeaderBar num="02" label="SCOPE" timecode="00:02:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <div data-reveal>
            <h2 className="section-headline">
              Who it's <Em>for</Em>
            </h2>
            <p className="page-hero-intro">{service.whoFor}</p>
          </div>
          <div data-reveal>
            <span className="mono-label mb-4 block">WHAT'S INCLUDED</span>
            <ul className="included-list">
              {service.included.map((item, i) => (
                <li key={item}>
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <>
          <SectionHeaderBar num="03" label="RELEVANT WORK" timecode="00:03:00:00" />
          <section className="page-section">
            <div className="site-container work-grid">
              {related.map((study, i) => (
                <WorkCard
                  key={study.slug}
                  study={study}
                  index={i}
                  reverse={i % 2 === 1}
                  showOutcome
                />
              ))}
            </div>
          </section>
        </>
      )}

      <SectionHeaderBar num={related.length > 0 ? '04' : '03'} label="FAQ" timecode="00:04:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <h2 className="section-headline" data-reveal>
            Questions <Em>we hear a lot</Em>
          </h2>
          <FaqList items={service.faq} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
