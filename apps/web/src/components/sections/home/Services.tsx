import { services } from '@advertaro/content'
import {
  ArrowLink,
  cn,
  Em,
  MonoLabel,
  SectionHeaderBar,
  SectionHeadline,
  TertiaryHeading,
} from '@advertaro/ui'
import Link from 'next/link'
import { ServiceIllustration } from '@/components/ui/ServiceIllustration'

export function Services() {
  return (
    <section className="col-full grid grid-cols-subgrid">
      <SectionHeaderBar
        id="services"
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="05"
        label="SERVICES"
      />
      <div className="col-content pt-16 pb-24">
        {/* NOTE: draft headline copy — confirm before launch. */}
        <div className="mb-12" data-reveal>
          <SectionHeadline>
            What we build
            <br />
            <Em>end to end</Em>
          </SectionHeadline>
        </div>
        {services.map((service, i) => {
          const reverse = i % 2 === 1
          const num = (
            <div
              className={cn(
                'font-sans text-[length:clamp(32px,4vw,54px)] font-bold tracking-[-0.03em] text-accent',
                reverse && '-order-2 lg:order-none lg:text-right',
              )}
            >
              {service.index}
            </div>
          )
          const media = (
            <div
              className={cn(
                'relative aspect-video overflow-hidden rounded-[14px] border border-line bg-bg-card',
                reverse && '-order-1 lg:order-none',
              )}
              data-wipe
            >
              <ServiceIllustration slug={service.slug} />
              <span
                className="absolute bottom-3 left-4 bg-bg-card/80 px-1.5 py-0.5 font-sans text-[10px] tracking-[0.14em] text-ink-secondary uppercase"
                aria-hidden="true"
              >
                {service.theme.label}
              </span>
            </div>
          )
          const info = (
            <div>
              <TertiaryHeading color="primary" className="mb-3.5">
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </TertiaryHeading>
              <p className="mb-5 max-w-120 text-base leading-[1.55] text-ink-secondary">
                {service.summary}
              </p>
              <div className="font-sans text-[11px] tracking-[0.12em] text-ink-editorial uppercase">
                {service.tags.join(' · ')}
              </div>
              <ArrowLink
                href={`/services/${service.slug}`}
                aria-label={`View ${service.title}`}
                className="mt-6"
              >
                View service →
              </ArrowLink>
            </div>
          )
          return (
            <div
              className={cn(
                'grid grid-cols-1 items-center gap-5 border-b border-line py-11 lg:gap-9',
                reverse ? 'lg:grid-cols-[1.15fr_1fr_110px]' : 'lg:grid-cols-[110px_1fr_1.15fr]',
              )}
              key={service.slug}
              data-reveal
            >
              {reverse ? (
                <>
                  {info}
                  {media}
                  {num}
                </>
              ) : (
                <>
                  {num}
                  {media}
                  {info}
                </>
              )}
            </div>
          )
        })}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <MonoLabel>No templates. No WordPress. No cutting corners.</MonoLabel>
          <ArrowLink href="/services">All services →</ArrowLink>
        </div>
      </div>
    </section>
  )
}
