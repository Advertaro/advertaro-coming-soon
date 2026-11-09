import { CtaPill, Em } from '@advertaro/ui'
import { PageHero } from '@/components/sections/shared/PageHero'

export default function NotFound() {
  return (
    <PageHero
      eyebrow="(404) — MISSING FRAME"
      title={
        <>
          This frame <Em>didn't make the cut</Em>
        </>
      }
      intro="The page you're looking for has moved or never existed."
      meta={<CtaPill href="/" label="Back to the start" rollLabel="Take me home" />}
    />
  )
}
