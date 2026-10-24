import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from '@/types'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

// Posts with `draft: true` in their frontmatter are visible in local dev for review,
// but excluded from production builds, the blog index and the sitemap.
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production'

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const slug = file.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
      const { data } = matter(raw)
      return { slug, ...data } as BlogPost
    })
    .filter(post => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const post = { slug, ...data, content } as BlogPost
  if (post.draft && !SHOW_DRAFTS) return null
  return post
}

export function getAllSlugs(): string[] {
  return getAllPosts().map(post => post.slug)
}
