import { services } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Process } from '@/components/sections/home/Process'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Container } from '@/components/ui/Container'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'
import { SectionHeadline } from '@/components/ui/SectionHeadline'

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

      <SectionHeaderBar num="01" label="DISCIPLINES" />
      <Section>
        <Container>
          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            data-reveal="stagger"
          >
            {services.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                className="relative flex min-h-75 flex-col justify-between gap-7 rounded-[18px] border border-line bg-bg-card p-7 transition-[translate,border-color,background-color,background-image] duration-250 ease-[ease] hover:-translate-y-1 hover:border-accent/55 hover:bg-transparent hover:bg-[linear-gradient(180deg,rgba(255,77,0,0.07)_0%,var(--color-bg-card)_55%)]"
                key={service.slug}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs/[inherit] font-semibold text-accent">
                    {service.index}
                  </span>
                  <span className="rounded-md border border-line bg-white/5 px-2.5 py-1.25 font-sans text-[10.5px] tracking-widest text-ink-secondary">
                    {service.tags[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.03em]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-normal text-ink-secondary">
                    {service.summary}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start border-b border-accent pb-0.75 font-sans text-xs/[inherit] tracking-[0.12em] text-white uppercase transition-colors duration-200 ease-[ease] hover:text-accent">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <SectionHeaderBar num="02" label="WHY BESPOKE" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeadline data-reveal>
            No templates. <Em>No WordPress.</Em> No cutting corners.
          </SectionHeadline>
          <Prose data-reveal>
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
          </Prose>
        </Container>
      </Section>

      <Process num="03" />
      <CtaBand num="04" />
    </>
  )
}
