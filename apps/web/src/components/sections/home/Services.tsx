import { services } from '@advertaro/content'
import { SectionHeaderBar } from '@advertaro/ui'
import Link from 'next/link'
import { FilmStill } from '@/components/ui/FilmStill'

export function Services() {
  return (
    <>
      <SectionHeaderBar id="services" num="04" label="SERVICES" timecode="00:04:00:00" />
      <section className="services-section">
        <div className="site-container">
          <h2 className="sr-only">Services</h2>
          {services.map((service, i) => {
            const reverse = i % 2 === 1
            const num = <div className="service-num">{service.index}</div>
            const media = (
              <div className="service-media-box" data-wipe>
                <FilmStill theme={service.theme} mode={service.visual} width={640} height={360} />
              </div>
            )
            const info = (
              <div className="service-info">
                <h3>
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </h3>
                <p>{service.summary}</p>
                <div className="service-tags">{service.tags.join(' · ')}</div>
              </div>
            )
            return (
              <div
                className={`service-row${reverse ? ' reverse' : ''}`}
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
          <div className="section-more">
            <span className="mono-label">No templates. No WordPress. No cutting corners.</span>
            <Link href="/services" className="arrow-link">
              All services →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
