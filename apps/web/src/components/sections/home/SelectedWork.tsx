import { featuredCaseStudies } from '@advertaro/content'
import { ArrowLink, MonoLabel } from '@advertaro/ui'
import { WorkCard } from '@/components/sections/shared/WorkCard'
import { Container } from '@/components/ui/Container'

export function SelectedWork() {
  return (
    <section id="work" className="pt-[72px] pb-24">
      <Container>
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
      </Container>
    </section>
  )
}
