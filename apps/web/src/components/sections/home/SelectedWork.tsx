import { featuredCaseStudies } from '@advertaro/content'
import { MonoLabel } from '@advertaro/ui'
import Link from 'next/link'
import { WorkCard } from '@/components/sections/shared/WorkCard'

export function SelectedWork() {
  return (
    <section id="work" className="work-section">
      <div className="site-container">
        <h2 className="sr-only">Selected work</h2>
        <div className="work-stack">
          {featuredCaseStudies.map((study, i) => (
            <WorkCard key={study.slug} study={study} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="section-more">
          <MonoLabel>A few things we're proud of.</MonoLabel>
          <Link href="/work" className="arrow-link">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  )
}
