import { caseStudies, getCaseStudy, getNextCaseStudy, getServiceTitle } from '@advertaro/content'
import { MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'

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

      <section className="page-section tight">
        <div className="site-container">
          <div className="gallery-frame aspect-[21/9]!" data-wipe>
            <FilmStill theme={study.theme} width={1600} height={686} />
          </div>
        </div>
      </section>

      <SectionHeaderBar num="01" label="OVERVIEW" timecode="00:01:00:00" />
      <section className="page-section">
        <div className="site-container overview-grid">
          <dl className="spec-table" data-reveal>
            {[
              ['Client', study.client],
              ['Industry', study.industry],
              ['Services', study.services.map(getServiceTitle).join(', ')],
              ['Stack', study.stack.join(', ')],
              ['Year', study.year],
            ].map(([k, v]) => (
              <div className="spec-row" key={k}>
                <dt className="k">{k}</dt>
                <dd className="v">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <div className="chapter">
              <h2 className="chapter-label">
                <span className="num">01</span>The challenge
              </h2>
              <div className="prose">
                <Blocks blocks={study.challenge} />
              </div>
            </div>
            <div className="chapter">
              <h2 className="chapter-label">
                <span className="num">02</span>Our approach
              </h2>
              <div className="prose">
                <Blocks blocks={study.approach} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionHeaderBar num="02" label="THE RESULT" timecode="00:02:00:00" />
      <section>
        <div className="metric-callouts" data-reveal="stagger">
          {study.results.map((metric) => (
            <div className="metric-callout" key={metric.label}>
              <span className="label">{metric.label}</span>
              <span className="value">{metric.value}</span>
              {metric.description && <span className="desc">{metric.description}</span>}
            </div>
          ))}
        </div>
        <div className="site-container py-10">
          <p className="prose">{study.resultSummary}</p>
        </div>
      </section>

      <SectionHeaderBar num="03" label="VISUALS" timecode="00:03:00:00" />
      <section className="page-section">
        <div className="site-container gallery-grid">
          {study.gallery.map((frame) => (
            <div className="gallery-frame" key={frame.label} data-wipe>
              <FilmStill theme={frame} width={1280} height={800} />
            </div>
          ))}
        </div>
      </section>

      {study.quote && (
        <>
          <SectionHeaderBar num="04" label="CLIENT" timecode="00:04:00:00" />
          <section className="site-container pull-quote" data-reveal>
            <blockquote>{study.quote.text}</blockquote>
            <MonoLabel bright>
              {study.quote.authorName} — {study.quote.authorTitle}, {study.quote.authorCompany}
            </MonoLabel>
          </section>
        </>
      )}

      {next && next.slug !== study.slug && (
        <div className="site-container">
          <Link href={`/work/${next.slug}`} className="next-project">
            <div>
              <MonoLabel>NEXT CASE STUDY →</MonoLabel>
              <div className="title mt-4">{next.title}</div>
            </div>
            <Tag>{next.deliverable}</Tag>
          </Link>
        </div>
      )}

      <CtaBand />
    </>
  )
}
