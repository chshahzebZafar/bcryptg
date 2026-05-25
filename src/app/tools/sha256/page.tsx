import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SHA256Tool } from './SHA256Tool'

export const metadata: Metadata = {
  title: 'Free SHA-256 Hash Generator — Online Web Crypto Tool',
  description:
    'Generate SHA-256 hashes using your browser\'s built-in Web Crypto API. Fast, accurate, and client-side only. Free online tool — no data sent to servers.',
  keywords: ['sha256 generator', 'sha-256 hash', 'sha256 online', 'sha256 hash generator', 'sha256 tool'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/sha256' },
  openGraph: {
    title: 'Free SHA-256 Hash Generator — Web Crypto API',
    description: 'Generate SHA-256 hashes instantly using Web Crypto API. Client-side only.',
    url: 'https://bcryptgenerator.org/tools/sha256',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'SHA-256 Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SHA-256 Hash Generator',
    description: 'Generate SHA-256 hashes instantly using Web Crypto API. Client-side only.',
    images: ['/opengraph-image'],
  },
}

export default function SHA256Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'SHA-256 Generator', url: 'https://bcryptgenerator.org/tools/sha256' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">SHA-256 Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Hash size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">SHA-256 Hash Generator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Generate SHA-256 hashes using your browser&apos;s built-in Web Crypto API. Fast, accurate, and client-side only — no data is ever sent to our servers.
        </p>

        <SHA256Tool />

        <section className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3 text-sm text-slate-400 leading-relaxed">
          <h2 className="text-slate-200 font-semibold text-base">About SHA-256</h2>
          <p>
            SHA-256 (Secure Hash Algorithm 256-bit) is part of the SHA-2 family, standardized by NIST in 2001. It produces a 256-bit (64 hex character) digest and is widely used for data integrity verification, digital signatures, TLS certificates, and blockchain.
          </p>
          <p>
            <strong className="text-slate-300">Not suitable for passwords</strong> — SHA-256 is a fast hash designed for speed, which makes it vulnerable to brute-force attacks when used for passwords. Use{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300">bcrypt</Link> instead. See{' '}
            <Link href="/blog/what-is-bcrypt" className="text-blue-400 hover:text-blue-300">what is bcrypt</Link> for a full comparison.
          </p>
          <h3 className="text-slate-300 font-semibold">Common uses for SHA-256</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>File integrity checks and checksums</li>
            <li>Digital signatures (TLS, code signing)</li>
            <li>Blockchain and cryptocurrency (Bitcoin uses SHA-256)</li>
            <li>HMAC authentication tokens</li>
          </ul>
        </section>
      </div>
    </>
  )
}
