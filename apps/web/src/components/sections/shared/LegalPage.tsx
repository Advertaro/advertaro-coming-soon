import type { Block } from '@advertaro/content'
import { SectionHeaderBar } from '@advertaro/ui'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { DraftBanner } from '@/components/ui/DraftBanner'

export function LegalPage({
  title,
  updated,
  body,
}: {
  title: string
  updated: string
  body: Block[]
}) {
  return (
    <>
      <PageHero eyebrow="(—) — LEGAL" title={title} intro={`Last updated ${updated}.`} />
      <DraftBanner>Draft — to be reviewed by legal counsel before launch</DraftBanner>
      <SectionHeaderBar label="DOCUMENT" />
      <section className="page-section">
        <div className="site-container">
          <div className="article-body prose">
            <Blocks blocks={body} />
          </div>
        </div>
      </section>
    </>
  )
}
