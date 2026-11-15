import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { ChevronRight, Hash, Shield, Lock, KeyRound, FileCheck2, Grid3x3, ShieldAlert, Wifi } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Security Tools: Hash, Password & PIN Generators',
  description:
    'Free online security tools: bcrypt generator, hash and checksum calculator, password, PIN and Wi-Fi QR generators, a password leak checker and strength checker. All in your browser.',
  keywords: ['security tools', 'hash generator', 'checksum calculator', 'pin generator', 'password generator', 'bcrypt tool', 'online security tools', 'password tools'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free Security Tools: Hash, Password & PIN Generators',
    description: 'Bcrypt, hash and file checksum, password and PIN tools. Everything runs in your browser; no data is sent to a server.',
    url: 'https://bcryptgenerator.org/tools',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Developer Security Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Security Tools',
    description: 'Bcrypt, hash and checksum, password and PIN tools. All client-side and free.',
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
    href: '/tools/hash-generator',
    icon: FileCheck2,
    label: 'Hash Generator & Checksum',
    desc: 'MD5, SHA-1, SHA-256 and SHA-512 of text or files, plus a checksum checker to verify downloads. Files are never uploaded.',
    badge: 'New',
    badgeColor: 'bg-emerald-900 text-emerald-300 border border-emerald-700',
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
    href: '/tools/password-generator',
    icon: KeyRound,
    label: 'Password Generator',
    desc: 'Generate strong random passwords or memorable passphrases, then get a bcrypt hash of them in one click.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/pin-generator',
    icon: Grid3x3,
    label: 'PIN Generator',
    desc: 'Random 4, 6 or 8-digit PINs for phones, SIM and bank cards, skipping patterns like 1234 and 0000.',
    badge: 'New',
    badgeColor: 'bg-emerald-900 text-emerald-300 border border-emerald-700',
  },
  {
    href: '/tools/password-leak-checker',
    icon: ShieldAlert,
    label: 'Password Leak Checker',
    desc: 'Check if a password has appeared in a data breach. Only 5 characters of its hash leave your browser.',
    badge: 'New',
    badgeColor: 'bg-emerald-900 text-emerald-300 border border-emerald-700',
  },
  {
    href: '/tools/wifi-qr-code-generator',
    icon: Wifi,
    label: 'Wi-Fi QR Code Generator',
    desc: 'A QR code that connects phones to your Wi-Fi in one scan. Download as PNG or SVG, or print a card.',
    badge: 'New',
    badgeColor: 'bg-emerald-900 text-emerald-300 border border-emerald-700',
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
          Free Security Tools
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
                <tr><td>Verify a download, or get a file&apos;s MD5, SHA-1, SHA-256 or SHA-512 checksum</td><td><Link href="/tools/hash-generator">Hash Generator &amp; Checksum</Link></td></tr>
                <tr><td>Fingerprint text with SHA-256, with code examples</td><td><Link href="/tools/sha256">SHA-256 Generator</Link></td></tr>
                <tr><td>Match a value from an older system that uses MD5</td><td><Link href="/tools/md5">MD5 Generator</Link></td></tr>
                <tr><td>Create a strong random password or passphrase</td><td><Link href="/tools/password-generator">Password Generator</Link></td></tr>
                <tr><td>Pick a random PIN for a phone, SIM or bank card</td><td><Link href="/tools/pin-generator">PIN Generator</Link></td></tr>
                <tr><td>Find out if a password has been leaked in a data breach</td><td><Link href="/tools/password-leak-checker">Password Leak Checker</Link></td></tr>
                <tr><td>Let guests join your Wi-Fi by scanning a code</td><td><Link href="/tools/wifi-qr-code-generator">Wi-Fi QR Code Generator</Link></td></tr>
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
