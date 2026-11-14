import { caseStudies, getCaseStudy, getNextCaseStudy, getServiceTitle } from '@advertaro/content'
import { MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { Container } from '@/components/ui/Container'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'

const chapterClass =
  'grid grid-cols-1 gap-4 border-b border-line py-12 first:border-t lg:grid-cols-[220px_1fr] lg:gap-10'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return {
    title: `${study.client} — ${study.deliverable}`,
    description: study.overview,
    alternates: { canonical: `/work/${study.slug}` },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()
  const next = getNextCaseStudy(study.slug)

  return (
    <>
      <PageHero
        eyebrow={`(${study.industry.toUpperCase()}) — CASE STUDY`}
        title={study.title}
        intro={study.overview}
        theme={study.theme}
        meta={
          <>
            {study.services.map((slug) => (
              <Tag key={slug}>{getServiceTitle(slug)}</Tag>
            ))}
            <Tag>{study.year}</Tag>
          </>
        }
      />
      {study.draft && (
        <DraftBanner>
          Draft case study — copy, metrics and quote pending client sign-off
        </DraftBanner>
      )}

      <Section tight>
        <Container>
          <div
            className="relative aspect-21/9 overflow-hidden rounded-[14px] border border-line bg-bg-card"
            data-wipe
          >
            <FilmStill theme={study.theme} width={1600} height={686} />
          </div>
        </Container>
      </Section>

      <SectionHeaderBar num="01" label="OVERVIEW" />
      <Section>
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <dl className="border-t border-line" data-reveal>
            {[
              ['Client', study.client],
              ['Industry', study.industry],
              ['Services', study.services.map(getServiceTitle).join(', ')],
              ['Stack', study.stack.join(', ')],
              ['Year', study.year],
            ].map(([k, v]) => (
              <div
                className="flex justify-between gap-6 border-b border-line py-3.5 text-sm/[inherit]"
                key={k}
              >
                <dt className="shrink-0 font-sans text-[11.5px] tracking-[0.14em] text-ink-secondary uppercase">
                  {k}
                </dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <div className={chapterClass}>
              <h2 className="font-sans text-[11.5px] tracking-[0.14em] text-white uppercase">
                <span className="mr-2 text-accent">01</span>The challenge
              </h2>
              <Prose>
                <Blocks blocks={study.challenge} />
              </Prose>
            </div>
            <div className={chapterClass}>
              <h2 className="font-sans text-[11.5px] tracking-[0.14em] text-white uppercase">
                <span className="mr-2 text-accent">02</span>Our approach
              </h2>
              <Prose>
                <Blocks blocks={study.approach} />
              </Prose>
            </div>
          </div>
        </Container>
      </Section>

      <SectionHeaderBar num="02" label="THE RESULT" />
      <section>
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-y border-line"
          data-reveal="stagger"
        >
          {study.results.map((metric) => (
            <div
              className="flex flex-col gap-3.5 border-b border-line px-7 py-9 md:border-r md:border-b-0 md:last:border-r-0"
              key={metric.label}
            >
              <span className="font-sans text-[11.5px] tracking-[0.12em] text-accent uppercase">
                {metric.label}
              </span>
              <span className="text-[length:clamp(56px,7vw,104px)] leading-[0.9] font-extrabold tracking-tighter">
                {metric.value}
              </span>
              {metric.description && (
                <span className="text-sm/[inherit] text-ink-secondary">{metric.description}</span>
              )}
            </div>
          ))}
        </div>
        <Container className="py-10">
          <Prose as="p">{study.resultSummary}</Prose>
        </Container>
      </section>

      <SectionHeaderBar num="03" label="VISUALS" />
      <Section>
        <Container className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {study.gallery.map((frame) => (
            <div
              className="relative aspect-16/10 overflow-hidden rounded-[14px] border border-line bg-bg-card first:col-span-full md:first:aspect-21/9"
              key={frame.label}
              data-wipe
            >
              <FilmStill theme={frame} width={1280} height={800} />
            </div>
          ))}
        </Container>
      </Section>

      {study.quote && (
        <>
          <SectionHeaderBar num="04" label="CLIENT" />
          <Container as="section" className="px-0 py-14 text-center sm:px-0" data-reveal>
            <blockquote className="mx-auto mb-7 max-w-260 text-[length:clamp(30px,4.2vw,58px)] leading-[1.15] tracking-[-0.02em] text-white before:text-accent before:content-['“'] after:text-accent after:content-['”']">
              {study.quote.text}
            </blockquote>
            <MonoLabel bright>
              {study.quote.authorName} — {study.quote.authorTitle}, {study.quote.authorCompany}
            </MonoLabel>
          </Container>
        </>
      )}

      {next && next.slug !== study.slug && (
        <Container>
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col items-start justify-between gap-6 border-t border-line py-14 md:flex-row md:items-end"
          >
            <div>
              <MonoLabel>NEXT CASE STUDY →</MonoLabel>
              <div className="mt-4 font-display text-[length:clamp(44px,8vw,120px)] leading-[0.92] font-extrabold tracking-tighter group-hover:text-accent">
                {next.title}
              </div>
            </div>
            <Tag>{next.deliverable}</Tag>
          </Link>
        </Container>
      )}

      <CtaBand />
    </>
  )
}
