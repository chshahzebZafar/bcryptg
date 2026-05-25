import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Developer Security Blog — Bcrypt, Password Hashing & More',
  description:
    'Learn about bcrypt, password hashing best practices, Argon2, and secure authentication for developers. Up-to-date guides for 2026.',
  keywords: ['bcrypt tutorial', 'password hashing guide', 'argon2 vs bcrypt', 'developer security blog'],
  alternates: { canonical: 'https://bcryptgenerator.org/blog' },
  openGraph: {
    title: 'Developer Security Blog — Bcrypt, Password Hashing & More',
    description: 'Learn about bcrypt, password hashing best practices, Argon2, and secure authentication for developers.',
    url: 'https://bcryptgenerator.org/blog',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Developer Security Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Security Blog',
    description: 'Guides on bcrypt, password hashing, Argon2, and secure authentication for developers.',
    images: ['/opengraph-image'],
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Blog', url: 'https://bcryptgenerator.org/blog' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
          Security Blog
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Guides on password hashing, bcrypt, Argon2, and secure authentication — written for developers.
        </p>

        <div className="space-y-4">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500">
                  <span>{post.readingTime}</span>
                  <span>·</span>
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">{post.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {post.tags?.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
