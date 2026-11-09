import { site } from '@advertaro/content'
import { CtaPill, Em, SectionHeaderBar } from '@advertaro/ui'
import type { ReactNode } from 'react'

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
      <SectionHeaderBar num={num} label="START A PROJECT" timecode="END OF REEL" />
      <section className="cta-band">
        <div className="site-container" data-reveal>
          <h2>{title}</h2>
          <p>{body}</p>
          <div className="actions">
            <CtaPill href="/contact" label="Start a conversation" rollLabel="Let's talk" />
            <CtaPill href={`mailto:${site.email}`} label={site.email} variant="ghost" />
          </div>
        </div>
      </section>
    </>
  )
}
