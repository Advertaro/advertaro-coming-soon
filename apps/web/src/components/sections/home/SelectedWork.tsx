import { featuredCaseStudies } from '@advertaro/content'
import { ArrowLink, MonoLabel } from '@advertaro/ui'
import { WorkCard } from '@/components/sections/shared/WorkCard'

export function SelectedWork() {
  return (
    <section id="work" className="col-full grid grid-cols-subgrid pt-18 pb-24">
      <div className="col-content">
        <h2 className="sr-only">Selected work</h2>
        <div className="flex flex-col gap-11">
          {featuredCaseStudies.map((study, i) => (
            <WorkCard key={study.slug} study={study} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <MonoLabel>A few things we're proud of.</MonoLabel>
          <ArrowLink href="/work">View all work →</ArrowLink>
        </div>
      </div>
    </section>
  )
}
