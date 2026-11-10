import { getPost, posts, site, sortedPosts } from '@advertaro/content'
import { Em, MonoLabel, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { Blocks } from '@/components/ui/Blocks'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { FilmStill } from '@/components/ui/FilmStill'
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

      <article className="page-section">
        <div className="site-container">
          <div className="article-body prose">
            <Blocks blocks={post.body} />
          </div>
          <div className="article-body">
            <aside className="author-card">
              <div className="author-avatar">
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
        </div>
      </article>

      {related.length > 0 && (
        <>
          <SectionHeaderBar num="01" label="KEEP READING" />
          <section className="page-section">
            <div className="site-container post-grid mt-0!">
              {related.map((p) => (
                <Link href={`/blog/${p.slug}`} className="post-card" key={p.slug}>
                  <div className="post-meta">
                    <Tag>{p.category}</Tag>
                    <span className="mono-label">{p.readingTime} MIN READ</span>
                  </div>
                  <h2 className="post-title">{p.title}</h2>
                </Link>
              ))}
            </div>
          </section>
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
