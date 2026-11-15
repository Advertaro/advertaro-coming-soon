import { credits, site } from '@advertaro/content'
import { ArrowLink, cn, Em, MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import { FilmStill } from '@/components/ui/FilmStill'
import { SectionHeadline } from '@/components/ui/SectionHeadline'

const portraitTheme = { base: '#172334', glow: '#ff4d00', label: 'ADVERTARO // STUDIO, COLOMBO' }

export function About() {
  return (
    <section className="col-full grid grid-cols-subgrid">
      <SectionHeaderBar
        id="about"
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="06"
        label="ABOUT"
      />
      <div className="col-content pt-22 pb-26">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-reveal>
            <SectionHeadline className="mb-9">
              Every pixel handled
              <br />
              <Em>by the same team</Em>
            </SectionHeadline>

            <dl className="mb-8 border-t border-line">
              {credits.map((credit) => (
                <div
                  className="flex items-center justify-between border-b border-line py-3.5 text-sm/[inherit]"
                  key={credit.role}
                >
                  <dt className="font-sans text-[11.5px] tracking-[0.14em] text-ink-secondary">
                    {credit.role}
                  </dt>
                  <dd
                    className={cn('font-semibold', credit.highlight ? 'text-accent' : 'text-white')}
                  >
                    {credit.person}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="max-w-125 text-base leading-[1.6] text-ink-secondary">
              <strong className="font-semibold text-white">
                Same name on every credit. That's just how we work.
              </strong>
              <br />
              Designers, developers and strategists in Colombo, building for hospitality, real
              estate and ambitious businesses since {site.founded}.
            </p>
            <ArrowLink href="/about" className="mt-8">
              About us →
            </ArrowLink>
          </div>

          <div
            className="relative flex aspect-[4/4.4] flex-col justify-between overflow-hidden rounded-[18px] border border-line bg-bg-card p-6"
            data-wipe
          >
            <FilmStill theme={portraitTheme} width={800} height={880} />
            <div className="absolute inset-0 z-2 bg-[linear-gradient(180deg,rgba(10,10,11,0.5)_0%,transparent_40%,rgba(10,10,11,0.92)_100%)]" />

            <div className="relative z-3 flex items-end justify-between">
              <Tag>advertaro_studio.mov</Tag>
              <Tag>COLOMBO · LK</Tag>
            </div>

            <div className="relative z-3 flex items-end justify-between">
              <div>
                <MonoLabel as="div" bright>
                  ADVERTARO STUDIO
                </MonoLabel>
                <MonoLabel as="div">DESIGN &amp; ENGINEERING</MonoLabel>
              </div>
              <div className="relative flex items-center" aria-hidden="true">
                <svg aria-hidden="true" className="h-13 w-35" viewBox="0 0 180 64" fill="none">
                  <path
                    d="M16 48 C26 16, 34 14, 38 42 C42 22, 54 12, 62 36 C70 26, 82 24, 90 36 C100 22, 118 20, 128 34 C138 14, 152 10, 166 28"
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 52 Q95 42 162 46"
                    stroke="#ff4d00"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
