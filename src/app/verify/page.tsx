import type { Metadata } from 'next'
import Link from 'next/link'
import { HashVerifier } from '@/components/tools/HashVerifier'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bcrypt Hash Verifier — Check Password Against Hash',
  description:
    'Verify if a password matches a bcrypt hash instantly. Free online tool. Client-side only — no data leaves your browser. Supports $2b$, $2a$, and $2y$ hashes.',
  alternates: { canonical: 'https://bcryptgenerator.org/verify' },
  keywords: ['bcrypt verifier', 'bcrypt checker', 'verify bcrypt hash', 'check bcrypt password', 'bcrypt hash verifier'],
  openGraph: {
    title: 'Bcrypt Hash Verifier — Free Online Tool',
    description: 'Paste a bcrypt hash and password to verify instantly. No server processing.',
    url: 'https://bcryptgenerator.org/verify',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Bcrypt Hash Verifier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bcrypt Hash Verifier',
    description: 'Paste a bcrypt hash and password to verify instantly. Client-side only.',
    images: ['/opengraph-image'],
  },
}

export default function VerifyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Bcrypt Verifier', url: 'https://bcryptgenerator.org/verify' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Bcrypt Verifier</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
          Bcrypt Hash Verifier
        </h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Check if a password matches a bcrypt hash. Supports <code className="font-mono text-xs text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">$2b$</code>,{' '}
          <code className="font-mono text-xs text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">$2a$</code>, and{' '}
          <code className="font-mono text-xs text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">$2y$</code> hashes.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 mb-10">
          <HashVerifier />
        </div>

        <section className="space-y-4 text-sm text-slate-400 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-100">How bcrypt verification works</h2>
          <p>
            Bcrypt verification does not decrypt the hash. Instead, it extracts the embedded salt from the stored hash, re-hashes the provided password using that salt and the same cost factor, then compares the two results.
          </p>
          <p>
            This means even with access to the hash, an attacker cannot reverse it to the original password — they would need to guess every possible password and hash each one, which bcrypt&apos;s cost factor makes extremely slow.
          </p>
          <div className="flex gap-4 mt-2 flex-wrap">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Generate a hash
            </Link>
            <Link href="/blog/what-is-bcrypt" className="text-blue-400 hover:text-blue-300 transition-colors">
              Learn more about bcrypt →
            </Link>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/blog/what-is-bcrypt', title: 'What is Bcrypt?', desc: 'How bcrypt works, salting, and why it is slow by design.' },
            { href: '/blog/how-many-bcrypt-rounds', title: 'How Many Rounds?', desc: 'OWASP 2026 recommendations for choosing the right cost factor.' },
            { href: '/blog/bcrypt-vs-argon2', title: 'Bcrypt vs Argon2', desc: 'Which password hashing algorithm should you use in 2026?' },
          ].map(({ href, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <p className="text-slate-200 font-medium text-sm group-hover:text-blue-400 transition-colors mb-1">{title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
