import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import type { BlogPost } from '@/types'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://bcryptgenerator.org'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: new Date('2026-05-25'), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/verify`,                  lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/tools`,                   lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/md5`,               lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/sha256`,            lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/password-strength`, lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`,                    lastModified: new Date('2026-05-25'), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/about`,                   lastModified: new Date('2026-05-25'), changeFrequency: 'yearly',  priority: 0.4 },
    // /api-docs intentionally excluded — marked noindex (coming soon)
  ]

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post: BlogPost) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified ?? post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
