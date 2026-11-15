import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import type { BlogPost } from '@/types'

const base = 'https://bcryptgenerator.org'

// Date each page's content last changed meaningfully (from git history).
// Update the date when you edit a page's visible content, so search engines
// and AI crawlers know to re-crawl it. Blog posts use their frontmatter.
const staticPages: { path: string; updated: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: '',                          updated: '2026-11-04', changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/verify',                   updated: '2026-11-03', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/tools',                    updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tools/password-generator', updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tools/md5',                updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tools/sha256',             updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tools/password-strength',  updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tools/hash-generator',     updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tools/pin-generator',      updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tools/password-leak-checker', updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tools/wifi-qr-code-generator', updated: '2026-11-15', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about',                    updated: '2026-10-24', changeFrequency: 'yearly',  priority: 0.4 },
  // /api-docs intentionally excluded — marked noindex (coming soon)
]

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const postUpdated = (post: BlogPost) => post.lastModified ?? post.date
  const newestPost = posts.map(postUpdated).sort().at(-1)

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map(p => ({
    url: `${base}${p.path}`,
    lastModified: new Date(p.updated),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  // The blog index changes whenever a post is published or updated
  const blogIndex: MetadataRoute.Sitemap = [{
    url: `${base}/blog`,
    lastModified: new Date(newestPost ?? '2026-10-16'),
    changeFrequency: 'weekly',
    priority: 0.8,
  }]

  const blogRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(postUpdated(post)),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogIndex, ...blogRoutes]
}
