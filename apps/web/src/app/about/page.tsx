import { beliefs, site, studioStats, team } from '@advertaro/content'
import { Em, MonoLabel, SectionHeaderBar, StatsGrid, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import { Process } from '@/components/sections/home/Process'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { FilmStill } from '@/components/ui/FilmStill'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Advertaro is a small team of designers, developers and strategists in Colombo, Sri Lanka, building bespoke digital products since 2019.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="(03) — ABOUT"
        title={
          <>
            We're <Em>Advertaro</Em>
          </>
        }
        intro="A small team of designers, developers and strategists in Colombo. We build digital products for businesses that refuse to settle for templates."
        meta={
          <>
            <Tag>EST. {site.founded}</Tag>
            <Tag>COLOMBO · LK</Tag>
            <Tag>WORKING WORLDWIDE</Tag>
          </>
        }
      />

      <SectionHeaderBar num="01" label="THE STORY" timecode="00:01:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <h2 className="section-headline" data-reveal>
            Tired of watching good businesses get <Em>mediocre digital work</Em>
          </h2>
          <div className="prose" data-reveal>
            <p>
              Advertaro started as freelance work in 2018 and became a studio in {site.founded}. The
              reason was simple: we kept meeting excellent businesses — hotels, developers, makers —
              whose websites did not come close to the quality of what they actually did.
            </p>
            <p>
              Most of them had been handed a theme, a plugin stack and an invoice. The sites looked
              like everyone else's, loaded slowly and broke whenever someone tried to change them.
            </p>
            <p>
              We decided to do the opposite. Every project starts from a blank page. Brand, design
              and engineering sit in one team, so nothing gets lost between them. And we only take
              on work we can do exceptionally well.
            </p>
            <p>
              <strong>
                Today we design and build brand identities, bespoke websites, mobile apps and the
                systems behind them — for clients in Sri Lanka and around the world.
              </strong>
            </p>
          </div>
        </div>
      </section>

      <StatsGrid stats={studioStats} />

      <SectionHeaderBar num="02" label="WHAT WE BELIEVE" timecode="00:02:00:00" />
      <section className="page-section">
        <div className="site-container">
          <div className="beliefs-grid" data-reveal="stagger">
            {beliefs.map((belief, i) => (
              <div className="belief-card" key={belief.title}>
                <span className="rate-idx">{String(i + 1).padStart(2, '0')}</span>
                <h3>{belief.title}</h3>
                <p>{belief.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionHeaderBar num="03" label="THE TEAM" timecode="00:03:00:00" />
      <section className="page-section">
        <div className="site-container">
          <div className="section-top" data-reveal>
            <h2 className="section-headline">
              The people <Em>on every credit</Em>
            </h2>
            <MonoLabel>COLOMBO — {new Date().getFullYear()}</MonoLabel>
          </div>
          <div className="team-grid" data-reveal="stagger">
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <FilmStill theme={member.theme} width={800} height={920} />
                <div className="about-portrait-shade" />
                <div className="team-card-info">
                  <MonoLabel className="text-accent!">{member.role}</MonoLabel>
                  <h3 className="mt-2">{member.name}</h3>
                  <p>{member.bio}</p>
                </div>
              </article>
            ))}
            <article className="team-card placeholder">
              <MonoLabel>(+) — STUDIO</MonoLabel>
              <div className="team-card-info">
                <h3>Designers, engineers &amp; strategists</h3>
                <p>Full team profiles are on the way.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <SectionHeaderBar num="04" label="CLIENTS & INDUSTRIES" timecode="00:04:00:00" />
      <section className="page-section">
        <div className="site-container split-grid">
          <h2 className="section-headline" data-reveal>
            Built for <Em>hospitality, property</Em> and ambitious businesses
          </h2>
          <div className="prose" data-reveal>
            <p>
              Most of our work is for boutique hotels and villas, real estate developers, and
              companies whose digital presence is the first impression that matters most. We also
              build platforms and internal systems for operations-heavy businesses.
            </p>
            <p>Recognised at BestWeb.LK:</p>
            <ul>
              {site.awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Process num="05" />
      <CtaBand num="06" />
    </>
  )
}
