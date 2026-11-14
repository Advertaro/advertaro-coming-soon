import { studioStats } from '@advertaro/content'
import { cn, Em, MonoLabel, SectionHeaderBar, StatsGrid } from '@advertaro/ui'

const clients = [
  { name: 'W15 Collection', style: 'serif' },
  { name: 'Ishq Villas', style: 'serif' },
  { name: 'Global Housing', style: 'mono' },
  { name: 'Debug Auto', style: 'sans' },
  { name: 'Rapid Adventures', style: 'mono' },
] as const

const wordmarkStyles = {
  serif: 'text-2xl/[inherit] font-normal tracking-[-0.01em]',
  mono: 'font-sans text-sm/[inherit] font-semibold tracking-[0.08em] uppercase',
  sans: '',
}

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
      <ul
        className="mb-18 col-full grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5"
        data-reveal="stagger"
      >
        {clients.map((client) => (
          <li
            className="group flex h-28 items-center justify-center rounded-xl border border-line bg-bg-card p-6 transition-[translate,border-color,background-color] duration-250 ease-[ease] hover:-translate-y-0.5 hover:border-line-strong hover:bg-bg-card-hover"
            key={client.name}
          >
            <span
              className={cn(
                'text-center text-[19px] leading-[1.1] font-bold tracking-[-0.03em] text-ink-wordmark transition-colors duration-250 ease-[ease] group-hover:text-white',
                wordmarkStyles[client.style],
              )}
            >
              {client.name}
            </span>
          </li>
        ))}
      </ul>

      <StatsGrid className="col-full" stats={studioStats} />
    </section>
  )
}
