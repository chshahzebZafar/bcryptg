import type { Metadata } from 'next'
import Link from 'next/link'
import { BcryptGenerator } from '@/components/tools/BcryptGenerator'
import { HashVerifier } from '@/components/tools/HashVerifier'
import { TrustBar } from '@/components/ui/SecurityBadge'
import { FAQSchema, SoftwareApplicationSchema } from '@/components/seo/JsonLd'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Bcrypt Generator — Free Online Bcrypt Hash Generator & Verifier',
  description:
    'Generate and verify bcrypt password hashes instantly. Adjustable salt rounds, client-side processing, code snippets in 7 languages. Free — no signup required.',
  alternates: { canonical: 'https://bcryptgenerator.org' },
  openGraph: {
    title: 'Free Bcrypt Hash Generator & Verifier — Online Tool',
    description: 'Generate and verify bcrypt password hashes instantly. Adjustable salt rounds, client-side only. No signup required.',
    url: 'https://bcryptgenerator.org',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Free Bcrypt Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Bcrypt Hash Generator & Verifier',
    description: 'Generate and verify bcrypt password hashes instantly. Client-side only — no data sent to servers.',
    images: ['/opengraph-image'],
  },
}

const faqs: FAQ[] = [
  {
    q: 'What is bcrypt?',
    a: 'Bcrypt is a password-hashing function designed by Niels Provos and David Mazières in 1999. It uses the Blowfish cipher and incorporates a salt to protect against rainbow table attacks. Its key feature is an adjustable cost factor (rounds) that makes it deliberately slow, protecting against brute-force attacks as hardware improves.',
  },
  {
    q: 'How many bcrypt rounds should I use in 2026?',
    a: 'OWASP recommends a minimum of 12 rounds (cost factor) in 2026. Round 12 takes approximately 300ms on a modern server, which is slow enough to resist brute-force attacks but fast enough for production use. For higher security, use 13 or 14 rounds.',
  },
  {
    q: 'Is bcrypt still secure in 2026?',
    a: 'Yes. Bcrypt remains a strong choice for password hashing in 2026. OWASP and NIST both recommend it with a cost factor of at least 12. While Argon2id is the latest recommendation for new systems, bcrypt with 12+ rounds is widely considered secure.',
  },
  {
    q: 'What is the difference between bcrypt and MD5?',
    a: 'MD5 is a fast cryptographic hash function never designed for passwords — it can be brute-forced in seconds with modern GPUs. Bcrypt is a slow, salted password-hashing function designed specifically to resist brute-force attacks. Never use MD5 for password storage.',
  },
  {
    q: 'Can bcrypt hashes be reversed or decrypted?',
    a: 'No. Bcrypt is a one-way hashing function — hashes cannot be reversed or decrypted. The only way to verify a password is to hash it with the same salt and compare the result. This is why even if a database is breached, bcrypt hashes cannot be reversed to plain-text passwords.',
  },
  {
    q: 'What does the $2b$ prefix mean in a bcrypt hash?',
    a: 'The prefix identifies the bcrypt version. $2b$ is the current standard (fixed in 2011). $2a$ is an older version still widely used. $2y$ is used by PHP. All three are compatible in most implementations. The number after the prefix (e.g., $2b$12$) is the cost factor (rounds).',
  },
  {
    q: 'Is it safe to use this tool? Do you store my passwords?',
    a: 'Yes, completely safe. All hashing and verification happens in your browser using JavaScript. No password or hash is ever sent to our servers. You can verify this by disconnecting from the internet — the tool still works. We have no server-side logging of any inputs.',
  },
]

const relatedTools = [
  { href: '/tools/md5', label: 'MD5 Generator', desc: 'Generate MD5 hashes for strings and files' },
  { href: '/tools/sha256', label: 'SHA-256 Generator', desc: 'Generate SHA-256 hashes using Web Crypto API' },
  { href: '/tools/password-strength', label: 'Password Strength', desc: 'Check how strong your password is' },
]

export default function HomePage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <SoftwareApplicationSchema />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight leading-tight">
                Free Bcrypt Hash Generator
              </h1>
              <p className="mt-3 text-slate-400 text-lg leading-relaxed max-w-2xl">
                Generate and verify bcrypt password hashes instantly — free, no signup, entirely in your browser. Adjustable salt rounds (4–14), code examples in 7 languages.
              </p>
              <TrustBar />
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-5">Hash Generator</h2>
              <BcryptGenerator />
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-1">Hash Verifier</h2>
              <p className="text-slate-400 text-sm mb-5">Check if a password matches a bcrypt hash.</p>
              <HashVerifier />
            </div>

            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-bold text-slate-100 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-slate-900 border border-slate-700 rounded-lg group"
                  >
                    <summary className="px-5 py-4 cursor-pointer text-slate-200 font-medium text-sm select-none list-none flex items-center justify-between gap-3 hover:text-slate-100">
                      {faq.q}
                      <span className="text-slate-500 text-lg leading-none shrink-0 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section aria-labelledby="what-is-bcrypt-heading">
              <h2 id="what-is-bcrypt-heading" className="text-2xl font-bold text-slate-100 mb-4">
                What is Bcrypt?
              </h2>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 space-y-3 text-slate-400 text-sm leading-relaxed">
                <p>
                  Bcrypt is the industry standard for password hashing, designed to be computationally expensive by intent. Unlike MD5 or SHA-1, bcrypt uses a{' '}
                  <strong className="text-slate-300">salt</strong> to prevent rainbow table attacks and an adjustable{' '}
                  <strong className="text-slate-300">cost factor</strong> that scales with hardware improvements.
                </p>
                <p>
                  Every bcrypt hash begins with a version identifier (<code className="font-mono text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">$2b$</code>), followed by the cost factor and a 128-bit salt embedded directly in the hash. This means you only need to store the hash — the salt is included.
                </p>
                <Link
                  href="/blog/what-is-bcrypt"
                  className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Read the full guide →
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Related Tools</h3>
              <div className="space-y-3">
                {relatedTools.map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 hover:bg-slate-750 transition-colors group"
                  >
                    <p className="text-slate-200 font-medium text-sm group-hover:text-blue-400 transition-colors">{label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Quick Reference</h3>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { rounds: 10, time: '~100ms', label: 'Acceptable' },
                  { rounds: 12, time: '~300ms', label: 'Recommended' },
                  { rounds: 13, time: '~600ms', label: 'Strong' },
                  { rounds: 14, time: '~1.2s', label: 'Very Strong' },
                ].map(({ rounds, time, label }) => (
                  <div key={rounds} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400">Round {rounds}</span>
                    <span className="text-slate-500">{time}</span>
                    <span className={rounds >= 12 ? 'text-emerald-400' : 'text-amber-400'}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Learn More</h3>
              <ul className="space-y-2">
                {[
                  { href: '/blog/bcrypt-vs-argon2', label: 'Bcrypt vs Argon2' },
                  { href: '/blog/how-many-bcrypt-rounds', label: 'How many rounds?' },
                  { href: '/blog/bcrypt-nodejs-tutorial', label: 'Node.js tutorial' },
                  { href: '/blog/bcrypt-php-tutorial', label: 'PHP tutorial' },
                  { href: '/blog/bcrypt-python-tutorial', label: 'Python tutorial' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
