import { sortedPosts } from '@advertaro/content'
import { Em, SectionHeaderBar, Tag } from '@advertaro/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/sections/shared/CtaBand'
import { PageHero } from '@/components/sections/shared/PageHero'
import { FilmStill } from '@/components/ui/FilmStill'
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
      <SectionHeaderBar num="01" label="LATEST" timecode="00:01:00:00" />
      <section className="page-section">
        <div className="site-container">
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="post-feature" data-reveal>
              <div className="post-media">
                <FilmStill theme={featured.theme} width={1280} height={800} />
              </div>
              <div className="post-feature-body">
                <div className="post-meta">
                  <Tag num="01">{featured.category}</Tag>
                  <span className="mono-label">{formatDate(featured.publishedAt)}</span>
                  <span className="mono-label">{featured.readingTime} MIN READ</span>
                </div>
                <div>
                  <h2 className="post-title">{featured.title}</h2>
                  <p className="post-excerpt">{featured.excerpt}</p>
                </div>
                <span className="arrow-link self-start">Read the post →</span>
              </div>
            </Link>
          )}
          <div className="post-grid" data-reveal="stagger">
            {rest.map((post, i) => (
              <Link href={`/blog/${post.slug}`} className="post-card" key={post.slug}>
                <div className="post-media">
                  <FilmStill theme={post.theme} width={1280} height={800} />
                </div>
                <div className="post-meta">
                  <Tag num={String(i + 2).padStart(2, '0')}>{post.category}</Tag>
                  <span className="mono-label">{formatDate(post.publishedAt)}</span>
                  <span className="mono-label">{post.readingTime} MIN READ</span>
                </div>
                <h2 className="post-title">{post.title}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand num="02" />
    </>
  )
}
