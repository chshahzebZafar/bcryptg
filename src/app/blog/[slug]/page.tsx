import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/mdx'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { AuthorBox } from '@/components/layout/AuthorBox'
import { author } from '@/lib/author'
import { ChevronRight } from 'lucide-react'
import type { BlogPost } from '@/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: author.name, url: author.url }],
    ...(post.draft && { robots: { index: false, follow: false } }),
    alternates: { canonical: `https://bcryptgenerator.org/blog/${slug}` },
    openGraph: {
      siteName: 'BcryptGenerator.org',
      locale: 'en_US',
      title: post.title,
      description: post.description,
      url: `https://bcryptgenerator.org/blog/${slug}`,
      type: 'article',
      authors: [author.name],
      publishedTime: post.date,
      modifiedTime: post.lastModified ?? post.date,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.description}
        url={`https://bcryptgenerator.org/blog/${slug}`}
        datePublished={post.date}
        dateModified={post.lastModified ?? post.date}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Blog', url: 'https://bcryptgenerator.org/blog' },
          { name: post.title, url: `https://bcryptgenerator.org/blog/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {post.draft && (
          <p className="mb-6 rounded-lg border border-amber-700 bg-amber-950 px-4 py-2 text-sm text-amber-300">
            Draft for review. Only visible in local development, not on the live site.
          </p>
        )}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400 truncate max-w-48">{post.title}</span>
        </nav>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
            <span>
              By{' '}
              <Link href="/about#author" className="text-slate-300 hover:text-blue-400 transition-colors">
                {author.name}
              </Link>
            </span>
            <span>·</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose max-w-none">
          <MDXRemote source={post.content ?? ''} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        <div className="mt-10">
          <AuthorBox />
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8">
          <div className="bg-blue-950 border border-blue-800 rounded-xl p-5 text-center">
            <p className="text-slate-300 font-medium mb-3">Ready to try it?</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Open Bcrypt Generator →
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-slate-200 font-medium text-sm group-hover:text-blue-400 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
