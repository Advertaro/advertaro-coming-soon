import { studioStats } from '@advertaro/content'
import { Em, SectionHeaderBar, StatsGrid } from '@advertaro/ui'

const clients = [
  { name: 'W15 Collection', style: 'serif' },
  { name: 'Ishq Villas', style: 'serif' },
  { name: 'Global Housing', style: 'mono' },
  { name: 'Debug Auto', style: 'sans' },
  { name: 'Rapid Adventures', style: 'mono' },
] as const

export function Clients() {
  return (
    <>
      <SectionHeaderBar num="02" label="TRUSTED BY" />
      <section className="edited-for-section">
        <div className="site-container">
          <div className="edited-for-header" data-reveal>
            <h2 className="edited-for-title">
              The brands that call when it <Em>has to be built properly, not templated</Em>
            </h2>
            <span className="mono-label">CLIENTS — 2019–2026</span>
          </div>

          <ul className="clients-grid" data-reveal="stagger">
            {clients.map((client) => (
              <li className="client-card" key={client.name}>
                <span className={`client-wordmark ${client.style === 'sans' ? '' : client.style}`}>
                  {client.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <StatsGrid stats={studioStats} />
      </section>
    </>
  )
}
