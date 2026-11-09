import { caseStudies, posts, services, site } from '@advertaro/content'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  })

  return [
    page('', 1),
    page('/work', 0.9),
    page('/services', 0.9),
    page('/about', 0.7),
    page('/blog', 0.6),
    page('/contact', 0.8),
    page('/privacy', 0.2),
    page('/terms', 0.2),
    ...caseStudies.map((s) => page(`/work/${s.slug}`, 0.8)),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...posts.map((p) => ({
      ...page(`/blog/${p.slug}`, 0.5),
      lastModified: new Date(p.publishedAt),
    })),
  ]
}
