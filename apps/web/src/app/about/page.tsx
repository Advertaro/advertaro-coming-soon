import { beliefs, site, studioStats, team } from '@advertaro/content'
import { cn, Em, MonoLabel, SectionHeaderBar, StatsGrid, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import { Process } from '@/components/sections/home/Process'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Container } from '@/components/ui/Container'
import { FilmStill } from '@/components/ui/FilmStill'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'
import { SectionHeadline } from '@/components/ui/SectionHeadline'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Advertaro is a small team of designers, developers and strategists in Colombo, Sri Lanka, building bespoke digital products since 2019.',
  alternates: { canonical: '/about' },
}

const teamCardClass =
  'group relative flex aspect-[4/4.6] flex-col justify-end overflow-hidden rounded-[18px] border border-line bg-bg-card p-5.5'

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

      <SectionHeaderBar num="01" label="THE STORY" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeadline data-reveal>
            Tired of watching good businesses get <Em>mediocre digital work</Em>
          </SectionHeadline>
          <Prose data-reveal>
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
          </Prose>
        </Container>
      </Section>

      <StatsGrid stats={studioStats} />

      <SectionHeaderBar num="02" label="WHAT WE BELIEVE" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2" data-reveal="stagger">
            {beliefs.map((belief, i) => (
              <div
                className="rounded-[18px] border border-line bg-bg-card p-7.5"
                key={belief.title}
              >
                <span className="font-sans text-xs/[inherit] font-semibold text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4.5 mb-2.5 text-2xl/[inherit] font-bold tracking-tight">
                  {belief.title}
                </h3>
                <p className="text-[15.5px] leading-[1.55] text-ink-secondary">{belief.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <SectionHeaderBar num="03" label="THE TEAM" />
      <Section>
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6" data-reveal>
            <SectionHeadline>
              The people <Em>on every credit</Em>
            </SectionHeadline>
            <MonoLabel>COLOMBO — {new Date().getFullYear()}</MonoLabel>
          </div>
          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            data-reveal="stagger"
          >
            {team.map((member) => (
              <article className={teamCardClass} key={member.name}>
                <FilmStill theme={member.theme} width={800} height={920} />
                <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(10,10,11,0.5)_0%,transparent_40%,rgba(10,10,11,0.92)_100%)]" />
                <div className="relative z-2">
                  <MonoLabel className="text-accent">{member.role}</MonoLabel>
                  <h3 className="mt-2 text-xl/[inherit] font-bold tracking-[-0.02em] transition-colors duration-200 ease-[ease] group-hover:text-accent">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.45] text-ink-secondary">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
            <article className={cn(teamCardClass, 'justify-between border-dashed')}>
              <MonoLabel>(+) — STUDIO</MonoLabel>
              <div className="relative z-2">
                <h3 className="text-xl/[inherit] font-bold tracking-[-0.02em] transition-colors duration-200 ease-[ease] group-hover:text-accent">
                  Designers, engineers &amp; strategists
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.45] text-ink-secondary">
                  Full team profiles are on the way.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </Section>

      <SectionHeaderBar num="04" label="CLIENTS & INDUSTRIES" />
      <Section>
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeadline data-reveal>
            Built for <Em>hospitality, property</Em> and ambitious businesses
          </SectionHeadline>
          <Prose data-reveal>
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
          </Prose>
        </Container>
      </Section>

      <Process num="05" />
      <CtaBand num="06" />
    </>
  )
}
