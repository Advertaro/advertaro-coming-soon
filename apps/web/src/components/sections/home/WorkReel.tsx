import { getCaseStudy } from '@advertaro/content'
import { Em, SecondaryHeading } from '@advertaro/ui'
import { type ReelProject, WorkReelStage } from './WorkReelStage'

const slugs = ['ishq-villas', 'w15-collection', 'debug-auto-exclusives', 'global-housing']

// Only the fields the client stage renders cross the boundary, keeping full case-study copy out of the bundle.
const projects: ReelProject[] = slugs.map((slug) => {
  const study = getCaseStudy(slug)
  if (!study) throw new Error(`WorkReel: missing case study "${slug}"`)
  return {
    slug,
    client: study.client,
    outcome: study.outcome,
    // NOTE: draft quotes — pending client approval before launch.
    quote: study.quote,
    bg: `/video/reel/${slug}-bg`,
    fg: `/video/reel/${slug}-fg`,
  }
})

export function WorkReel() {
  return (
    <WorkReelStage projects={projects}>
      {/* NOTE: draft copy — confirm before launch. */}
      <SecondaryHeading className="text-[clamp(32px,4.6vw,64px)] leading-[1] font-semibold tracking-[-0.035em]">
        <Em className="font-semibold tracking-[-0.035em] text-ink">
          Built <span className="text-accent">properly</span>, not templated
        </Em>
      </SecondaryHeading>
    </WorkReelStage>
  )
}
