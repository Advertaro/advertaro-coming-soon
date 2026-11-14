import { studioStats } from '@advertaro/content'
import { Em, SectionHeaderBar, StatsGrid } from '@advertaro/ui'
import { ClientMarquee } from './ClientMarquee'

export function Clients() {
  return (
    <section className="col-full grid grid-cols-subgrid gap-y-6 pt-22">
      <SectionHeaderBar
        className="col-full grid grid-cols-subgrid px-0 sm:px-0 *:col-content"
        num="02"
        label="TRUSTED BY"
      />
      <div className="mb-12 col-content flex flex-wrap items-end justify-between gap-8" data-reveal>
        <h2 className="max-w-180 text-[clamp(30px,4.2vw,56px)] leading-[1.08] font-semibold tracking-[-0.035em]">
          The brands that call when it <Em>has to be built properly, not templated</Em>
        </h2>
      </div>
      <ClientMarquee />

      <div className="col-full grid grid-cols-subgrid border-y border-line">
        <StatsGrid className="col-content border-x border-y-0" stats={studioStats} />
      </div>
    </section>
  )
}
