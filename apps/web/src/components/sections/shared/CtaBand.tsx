import { site } from '@advertaro/content'
import { CtaPill, Em, SecondaryHeading, SectionHeaderBar } from '@advertaro/ui'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

type CtaBandProps = {
  title?: ReactNode
  body?: ReactNode
  num?: string
}

export function CtaBand({
  title = (
    <>
      Ready to start <Em>something worth showing?</Em>
    </>
  ),
  body = 'Tell us what you are building. We reply within one business day.',
  num,
}: CtaBandProps) {
  return (
    <>
      <SectionHeaderBar num={num} label="START A PROJECT" />
      <section className="relative overflow-hidden py-26 text-center before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,77,0,0.16)_0%,transparent_60%)] before:content-['']">
        <Container data-reveal>
          <SecondaryHeading className="relative mx-auto mb-6 max-w-250 text-[length:clamp(40px,6vw,92px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            {title}
          </SecondaryHeading>
          <p className="relative mx-auto mb-8 max-w-130 text-[17px] text-ink-secondary">{body}</p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <CtaPill href="/contact" label="Start a conversation" rollLabel="Let's talk" />
            <CtaPill href={`mailto:${site.email}`} label={site.email} variant="ghost" />
          </div>
        </Container>
      </section>
    </>
  )
}
