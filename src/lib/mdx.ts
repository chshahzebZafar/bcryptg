import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from '@/types'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const slug = file.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
      const { data } = matter(raw)
      return { slug, ...data } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, ...data, content } as BlogPost
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}
