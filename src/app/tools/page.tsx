import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { ChevronRight, Hash, Shield, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Developer Security Tools — Hash Generators & Password Tools',
  description:
    'Free online security tools for developers: bcrypt generator, MD5 hash generator, SHA-256 generator, and password strength checker. All client-side — no data sent to servers.',
  keywords: ['developer security tools', 'hash generator', 'bcrypt tool', 'online security tools', 'password tools'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free Developer Security Tools — Hash Generators & Password Tools',
    description: 'Free online security tools for developers: bcrypt generator, MD5, SHA-256, and password strength checker. All client-side — no data sent to servers.',
    url: 'https://bcryptgenerator.org/tools',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Developer Security Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Security Tools',
    description: 'Bcrypt generator, MD5, SHA-256, and password strength checker — all client-side, free.',
    images: ['/opengraph-image'],
  },
}

const tools = [
  {
    href: '/',
    icon: Shield,
    label: 'Bcrypt Generator',
    desc: 'Generate secure bcrypt password hashes with adjustable salt rounds. The industry standard for password hashing.',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-900 text-blue-300 border border-blue-700',
  },
  {
    href: '/verify',
    icon: Lock,
    label: 'Bcrypt Checker',
    desc: 'Check a password against a bcrypt hash, inspect its cost and salt, and debug failed comparisons.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/md5',
    icon: Hash,
    label: 'MD5 Generator',
    desc: 'Generate MD5 hashes from any string. Note: MD5 is not suitable for password storage — use bcrypt instead.',
    badge: 'Not for passwords',
    badgeColor: 'bg-amber-900 text-amber-300 border border-amber-700',
  },
  {
    href: '/tools/sha256',
    icon: Hash,
    label: 'SHA-256 Generator',
    desc: 'Generate SHA-256 hashes using the browser\'s built-in Web Crypto API. Fast and reliable.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/password-strength',
    icon: Shield,
    label: 'Password Strength Checker',
    desc: 'Check how strong your password is, with detailed feedback and current NIST guidance.',
    badge: null,
    badgeColor: '',
  },
]

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Tools</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
          Developer Security Tools
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Free, client-side security tools. All processing happens in your browser — no data is ever sent to our servers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map(({ href, icon: Icon, label, desc, badge, badgeColor }) => (
            <Link
              key={href}
              href={href}
              className="group bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-blue-400" />
                </div>
                {badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
              <h2 className="text-slate-100 font-semibold mb-1.5 group-hover:text-blue-400 transition-colors">
                {label}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-3 text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                Open tool →
              </div>
            </Link>
          ))}
        </div>

        <article className="prose max-w-none mt-6">
          <h2>Which tool do you need?</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>If you want to…</th><th>Use</th></tr>
              </thead>
              <tbody>
                <tr><td>Store a user&apos;s password safely</td><td><Link href="/">Bcrypt Generator</Link></td></tr>
                <tr><td>Check a password against a stored bcrypt hash, or debug a failing login</td><td><Link href="/verify">Bcrypt Checker</Link></td></tr>
                <tr><td>Fingerprint a file or message, or verify a download</td><td><Link href="/tools/sha256">SHA-256 Generator</Link></td></tr>
                <tr><td>Match a value from an older system that uses MD5</td><td><Link href="/tools/md5">MD5 Generator</Link></td></tr>
                <tr><td>See how guessable a password is</td><td><Link href="/tools/password-strength">Password Strength Checker</Link></td></tr>
              </tbody>
            </table>
          </div>

          <h2>Password hashing vs general-purpose hashing</h2>
          <p>
            All of these tools produce hashes, one-way fingerprints that can&apos;t be turned back into the original input. The difference is speed. <strong>MD5 and SHA-256</strong> are built to be fast, which is ideal for checking that a file hasn&apos;t changed but dangerous for passwords, because attackers can try billions of guesses per second.
          </p>
          <p>
            <strong>Bcrypt</strong> is built to be slow and adds a random salt to every hash, so each guess against a stolen hash costs real time. That is why passwords belong in bcrypt (or Argon2id) and nowhere else. Read{' '}
            <Link href="/blog/what-is-bcrypt">what bcrypt is and how it works</Link> for the full picture.
          </p>

          <h2>Your data stays in your browser</h2>
          <p>
            Every tool on this site runs locally with JavaScript and your browser&apos;s built-in Web Crypto API. Passwords, hashes and text you enter are never sent to a server, logged or stored. More on this in our <Link href="/about">privacy policy</Link>.
          </p>
        </article>
      </div>
    </>
  )
}
