import { services } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Process } from '@/components/sections/home/Process'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Branding, bespoke web design and development, mobile apps, systems and automation, and digital marketing — from one team in Colombo, Sri Lanka.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="(02) — SERVICES"
        title={
          <>
            What we <Em>build</Em>
          </>
        }
        intro="Five disciplines. One team. All from scratch."
        meta={<Tag>{String(services.length).padStart(2, '0')} DISCIPLINES</Tag>}
      />

      <SectionHeaderBar num="01" label="DISCIPLINES" timecode="00:01:00:00" />
      <section className="page-section">
        <div className="site-container">
          <div className="service-card-grid" data-reveal="stagger">
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} className="service-card" key={service.slug}>
                <div className="flex items-center justify-between">
                  <span className="rate-idx">{service.index}</span>
                  <span className="rate-spec-badge">{service.tags[0]}</span>
                </div>
                <div>
                  <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.03em]">
                    {service.title}
                  </h2>
                  <p>{service.summary}</p>
                </div>
                <span className="arrow-link self-start">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionHeaderBar num="02" label="WHY BESPOKE" timecode="00:02:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <h2 className="section-headline" data-reveal>
            No templates. <Em>No WordPress.</Em> No cutting corners.
          </h2>
          <div className="prose" data-reveal>
            <p>
              Templates are built to fit everyone, which means they fit no one particularly well.
              They also look like every other site built on the same theme.
            </p>
            <p>
              We design and build from a blank page, every time. It is the only way to make
              something that fits your business exactly — and something your competitors cannot copy
              by buying the same theme. It is also faster, more secure and cheaper to live with over
              the life of the product.
            </p>
          </div>
        </div>
      </section>

      <Process num="03" />
      <CtaBand num="04" />
    </>
  )
}
