import { getPost, posts, site, sortedPosts } from '@advertaro/content'
import { Em, MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { Container } from '@/components/ui/Container'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'
import { Prose } from '@/components/ui/Prose'
import { Section } from '@/components/ui/Section'
import { formatDate } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', publishedTime: post.publishedAt, authors: [post.author] },
  }
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const related = sortedPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow={`(${post.category.toUpperCase()}) — JOURNAL`}
        title={<span className="block text-[clamp(40px,6vw,88px)]">{post.title}</span>}
        intro={post.excerpt}
        theme={post.theme}
        meta={
          <>
            <Tag>{formatDate(post.publishedAt)}</Tag>
            <Tag>{post.readingTime} MIN READ</Tag>
            <Tag>BY {post.author.toUpperCase()}</Tag>
          </>
        }
      />
      {post.draft && <DraftBanner>Draft post — review before publishing</DraftBanner>}

      <Section as="article">
        <Container>
          <Prose className="mx-auto">
            <Blocks blocks={post.body} />
          </Prose>
          <div className="mx-auto max-w-180">
            <aside className="mt-14 flex items-center gap-5 rounded-2xl border border-line bg-bg-card p-6">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-line-strong">
                <FilmStill theme={post.theme} width={128} height={128} />
              </div>
              <div>
                <MonoLabel>WRITTEN BY</MonoLabel>
                <p className="mt-1 font-semibold">{post.author}</p>
                <p className="mt-1 text-sm text-ink-secondary">
                  {site.name} ·{' '}
                  <Link href="/about" className="underline decoration-accent underline-offset-4">
                    About the studio
                  </Link>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <>
          <SectionHeaderBar num="01" label="KEEP READING" />
          <Section>
            <Container className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  href={`/blog/${p.slug}`}
                  className="flex flex-col gap-5 rounded-[18px] border border-line bg-bg-card p-5 transition-[border-color] duration-250 ease-[ease] hover:border-accent/55"
                  key={p.slug}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Tag>{p.category}</Tag>
                    <MonoLabel>{p.readingTime} MIN READ</MonoLabel>
                  </div>
                  <h2 className="text-2xl leading-[1.1] font-bold tracking-[-0.03em]">{p.title}</h2>
                </Link>
              ))}
            </Container>
          </Section>
        </>
      )}

      <CtaBand
        title={
          <>
            Working on something similar? <Em>Let's talk.</Em>
          </>
        }
      />
    </>
  )
}
