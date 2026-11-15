import { sortedPosts } from '@advertaro/content'
import { Em, MonoLabel, SecondaryHeading, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Container } from '@/components/ui/Container'
import { FilmStill } from '@/components/ui/FilmStill'
import { Section } from '@/components/ui/Section'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on digital, design and building things — from the Advertaro studio.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const [featured, ...rest] = sortedPosts

  return (
    <>
      <PageHero
        eyebrow="(04) — JOURNAL"
        title={
          <>
            Thoughts on digital, <Em>design and building things</Em>
          </>
        }
      />
      <SectionHeaderBar num="01" label="LATEST" />
      <Section>
        <Container>
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="grid grid-cols-1 items-stretch gap-10 rounded-[20px] border border-line bg-bg-card p-6 transition-[border-color] duration-250 ease-[ease] hover:border-accent/55 lg:grid-cols-[1.2fr_0.8fr]"
              data-reveal
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-xl border border-line">
                <FilmStill theme={featured.theme} width={1280} height={800} />
              </div>
              <div className="flex flex-col justify-between gap-6 py-2 pr-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Tag num="01">{featured.category}</Tag>
                  <MonoLabel>{formatDate(featured.publishedAt)}</MonoLabel>
                  <MonoLabel>{featured.readingTime} MIN READ</MonoLabel>
                </div>
                <div>
                  <SecondaryHeading className="text-[length:clamp(26px,3vw,40px)] leading-[1.1] font-bold tracking-[-0.03em]">
                    {featured.title}
                  </SecondaryHeading>
                  <p className="mt-3.5 text-base leading-[1.55] text-ink-secondary">
                    {featured.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start border-b border-accent pb-0.75 font-sans text-xs/[inherit] tracking-[0.12em] text-white uppercase transition-colors duration-200 ease-[ease] hover:text-accent">
                  Read the post →
                </span>
              </div>
            </Link>
          )}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2" data-reveal="stagger">
            {rest.map((post, i) => (
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-5 rounded-[18px] border border-line bg-bg-card p-5 transition-[border-color] duration-250 ease-[ease] hover:border-accent/55"
                key={post.slug}
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-xl border border-line">
                  <FilmStill theme={post.theme} width={1280} height={800} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Tag num={String(i + 2).padStart(2, '0')}>{post.category}</Tag>
                  <MonoLabel>{formatDate(post.publishedAt)}</MonoLabel>
                  <MonoLabel>{post.readingTime} MIN READ</MonoLabel>
                </div>
                <SecondaryHeading className="text-2xl leading-[1.1] font-bold tracking-[-0.03em]">
                  {post.title}
                </SecondaryHeading>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand num="02" />
    </>
  )
}
