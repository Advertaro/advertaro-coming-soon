import { getCaseStudiesForService, getService, services } from '@advertaro/content'
import { Em, MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { FaqList } from '@/components/sections/shared/FaqList'
import { PageHero } from '@/components/sections/shared/PageHero'
import { WorkCard } from '@/components/sections/shared/WorkCard'
import { Blocks } from '@/components/ui/Blocks'
import { Container } from '@/components/ui/Container'
import { FilmStill } from '@/components/ui/FilmStill'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'
import { SectionHeadline } from '@/components/ui/SectionHeadline'

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

      <SectionHeaderBar num="01" label="IN PRACTICE" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="relative aspect-video overflow-hidden rounded-[14px] border border-line bg-bg-card"
            data-wipe
          >
            <FilmStill theme={service.theme} mode={service.visual} width={960} height={540} />
          </div>
          <Prose data-reveal>
            <Blocks blocks={service.description} />
          </Prose>
        </Container>
      </Section>

      <SectionHeaderBar num="02" label="SCOPE" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <SectionHeadline>
              Who it's <Em>for</Em>
            </SectionHeadline>
            <p className="mt-8 max-w-[620px] text-[length:clamp(17px,1.6vw,21px)] leading-[1.5] text-ink-secondary">
              {service.whoFor}
            </p>
          </div>
          <div data-reveal>
            <MonoLabel className="mb-4 block">WHAT'S INCLUDED</MonoLabel>
            <ul className="list-none border-t border-line">
              {service.included.map((item, i) => (
                <li className="flex gap-5 border-b border-line py-4 text-[16px]" key={item}>
                  <span className="pt-1 font-sans text-[11px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <>
          <SectionHeaderBar num="03" label="RELEVANT WORK" />
          <Section>
            <Container className="grid grid-cols-[1fr] gap-7 md:grid-cols-[repeat(2,1fr)]">
              {related.map((study, i) => (
                <WorkCard
                  key={study.slug}
                  study={study}
                  index={i}
                  reverse={i % 2 === 1}
                  showOutcome
                />
              ))}
            </Container>
          </Section>
        </>
      )}

      <SectionHeaderBar num={related.length > 0 ? '04' : '03'} label="FAQ" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeadline data-reveal>
            Questions <Em>we hear a lot</Em>
          </SectionHeadline>
          <FaqList items={service.faq} />
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
