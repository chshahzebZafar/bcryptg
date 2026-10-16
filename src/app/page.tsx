import type { Metadata } from 'next'
import Link from 'next/link'
import { BcryptGenerator } from '@/components/tools/BcryptGenerator'
import { HashVerifier } from '@/components/tools/HashVerifier'
import { TrustBar } from '@/components/ui/SecurityBadge'
import { FAQSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { ROUND_TIMINGS } from '@/lib/bcrypt'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Bcrypt Generator — Free Online Bcrypt Hash Generator',
  description:
    'Generate bcrypt password hashes instantly with adjustable salt rounds (4–14). Runs in your browser, with code snippets in 7 languages. Free — no signup required.',
  alternates: { canonical: 'https://bcryptgenerator.org' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free Bcrypt Hash Generator — Online Tool',
    description: 'Generate bcrypt password hashes instantly with adjustable salt rounds. Client-side only. No signup required.',
    url: 'https://bcryptgenerator.org',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Free Bcrypt Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Bcrypt Hash Generator',
    description: 'Generate bcrypt password hashes instantly. Client-side only — no data sent to servers.',
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
    a: 'OWASP sets a minimum bcrypt work factor (cost) of 10. For new systems in 2026 we recommend 12 as the default: it takes approximately 300ms on a modern server, which is slow enough to resist brute-force attacks but fast enough for production use. For higher security, use 13 or 14 rounds.',
  },
  {
    q: 'Is bcrypt still secure in 2026?',
    a: 'Yes, with caveats. Bcrypt with a cost factor of 12 or more is still widely considered secure. OWASP now lists Argon2id as the first choice for new systems and recommends bcrypt for systems where Argon2id is not available, with a work factor of at least 10 and passwords limited to 72 bytes.',
  },
  {
    q: 'What is the difference between bcrypt and MD5?',
    a: 'MD5 is a fast cryptographic hash function never designed for passwords — it can be brute-forced in seconds with modern GPUs. Bcrypt is a slow, salted password-hashing function designed specifically to resist brute-force attacks. Never use MD5 for password storage.',
  },
  {
    q: 'Can I use a hash generated here in my application?',
    a: 'Yes. Hashes use the standard $2b$ format, which bcrypt libraries for Node.js, PHP (password_verify), Python, Java, Go and Ruby all accept. That makes the generator handy for seeding a database, creating a first admin account or writing test fixtures. For real users, generate hashes in your own backend when they sign up.',
  },
  {
    q: 'Why does the generator warn about passwords over 72 bytes?',
    a: 'Bcrypt only reads the first 72 bytes of a password and ignores the rest, so a longer password adds no extra security. Non-ASCII characters such as accented letters or emoji take 2–4 bytes each in UTF-8, so the limit can be reached with fewer than 72 characters.',
  },
  {
    q: 'Is it safe to use this tool? Do you store my passwords?',
    a: 'Yes, completely safe. All hashing and verification happens in your browser using JavaScript. No password or hash is ever sent to our servers. You can verify this by disconnecting from the internet — the tool still works. We have no server-side logging of any inputs.',
  },
]

const relatedTools = [
  { href: '/tools/md5', label: 'MD5 Generator', desc: 'Generate MD5 hashes and checksums for text' },
  { href: '/tools/sha256', label: 'SHA-256 Generator', desc: 'Generate SHA-256 hashes using Web Crypto API' },
  { href: '/tools/password-strength', label: 'Password Strength', desc: 'Check how strong your password is' },
]

export default function HomePage() {
  return (
    <>
      <FAQSchema faqs={faqs} />

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
              <h2 className="text-lg font-semibold text-slate-100 mb-1">Quick Hash Check</h2>
              <p className="text-slate-400 text-sm mb-5">
                Test a hash you just generated. To inspect a hash or debug a check that fails, use the full{' '}
                <Link href="/verify" className="text-blue-400 hover:text-blue-300 transition-colors">bcrypt checker</Link>.
              </p>
              <HashVerifier />
            </div>

            <FaqList faqs={faqs} />

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
                  { rounds: 10, label: 'Acceptable' },
                  { rounds: 12, label: 'Recommended' },
                  { rounds: 13, label: 'Strong' },
                  { rounds: 14, label: 'Very Strong' },
                ].map(({ rounds, label }) => (
                  <div key={rounds} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400">Round {rounds}</span>
                    <span className="text-slate-500">{ROUND_TIMINGS[rounds]}</span>
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
