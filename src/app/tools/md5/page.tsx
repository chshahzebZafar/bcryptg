import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { MD5Tool } from './MD5Tool'

export const metadata: Metadata = {
  title: 'Free MD5 Hash Generator — Online MD5 Tool',
  description:
    'Generate MD5 hashes from any string instantly. Free online MD5 generator — client-side only, no data sent to servers. Note: MD5 is not suitable for password storage.',
  keywords: ['md5 generator', 'md5 hash', 'md5 online', 'md5 hash generator', 'generate md5'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/md5' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free MD5 Hash Generator — Online Tool',
    description: 'Generate MD5 hashes instantly, client-side only. No data sent to servers.',
    url: 'https://bcryptgenerator.org/tools/md5',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MD5 Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free MD5 Hash Generator',
    description: 'Generate MD5 hashes instantly, client-side only.',
    images: ['/opengraph-image'],
  },
}

export default function MD5Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'MD5 Generator', url: 'https://bcryptgenerator.org/tools/md5' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">MD5 Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Hash size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">MD5 Hash Generator</h1>
        </div>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Generate MD5 hashes from any text string. Free, client-side only — no data is ever sent to our servers.
        </p>

        <MD5Tool />

        <section className="mt-10 bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3 text-sm text-slate-400 leading-relaxed">
          <h2 className="text-slate-200 font-semibold text-base">What is MD5?</h2>
          <p>
            MD5 (Message-Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (32 hex character) hash value. It was designed by Ronald Rivest in 1991 and was originally intended for use as a cryptographic hash function.
          </p>
          <p>
            <strong className="text-slate-300">MD5 is not suitable for password storage</strong> — it is too fast and has been cryptographically broken. For password hashing, always use{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300">bcrypt</Link> or Argon2id instead.
            Read our guide on <Link href="/blog/bcrypt-vs-argon2" className="text-blue-400 hover:text-blue-300">bcrypt vs Argon2</Link> to learn more.
          </p>
          <h3 className="text-slate-300 font-semibold">Common uses for MD5</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>File integrity verification (checksums)</li>
            <li>Non-security data deduplication</li>
            <li>Cache key generation</li>
            <li>Legacy system compatibility</li>
          </ul>
        </section>
      </div>
    </>
  )
}
