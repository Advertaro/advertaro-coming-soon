import type { Block } from '@advertaro/content'
import { SectionHeaderBar } from '@advertaro/ui'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { Container } from '@/components/ui/Container'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'

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
      <Section>
        <Container>
          <Prose className="mx-auto">
            <Blocks blocks={body} />
          </Prose>
        </Container>
      </Section>
    </>
  )
}
