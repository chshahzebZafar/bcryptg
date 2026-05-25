import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { PasswordStrengthTool } from './PasswordStrengthTool'

export const metadata: Metadata = {
  title: 'Password Strength Checker — Free Online Password Analyzer',
  description:
    'Check your password strength instantly with detailed feedback. Based on NIST SP 800-63B and OWASP guidelines. Free, client-side only — your password never leaves your browser.',
  keywords: ['password strength checker', 'password strength test', 'password analyzer', 'strong password checker', 'password security test'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/password-strength' },
  openGraph: {
    title: 'Free Password Strength Checker — NIST & OWASP Based',
    description: 'Check password strength with detailed feedback. Based on NIST SP 800-63B and OWASP guidelines. Client-side only.',
    url: 'https://bcryptgenerator.org/tools/password-strength',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Password Strength Checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Password Strength Checker',
    description: 'Check password strength with detailed NIST/OWASP-based feedback. Client-side only.',
    images: ['/opengraph-image'],
  },
}

export default function PasswordStrengthPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'Password Strength Checker', url: 'https://bcryptgenerator.org/tools/password-strength' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Password Strength</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Shield size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Password Strength Checker</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Analyze your password strength with detailed feedback based on NIST SP 800-63B and OWASP guidelines. Client-side only — your password never leaves your browser.
        </p>

        <PasswordStrengthTool />

        <section className="mt-10 bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3 text-sm text-slate-400 leading-relaxed">
          <h2 className="text-slate-200 font-semibold text-base">What makes a strong password?</h2>
          <p>
            NIST SP 800-63B (2026) recommends prioritizing <strong className="text-slate-300">password length</strong> over complexity rules. A 16-character passphrase is stronger than an 8-character password with symbols.
          </p>
          <h3 className="text-slate-300 font-semibold">NIST 2026 key recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Minimum 8 characters — 12+ strongly recommended</li>
            <li>Allow all printable ASCII and Unicode characters</li>
            <li>Check against lists of known compromised passwords</li>
            <li>Do not require mandatory complexity rules or periodic resets</li>
            <li>Support paste functionality in password fields</li>
          </ul>
          <p>
            Once you have a strong password, protect it by storing it as a bcrypt hash.{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300">Try the Bcrypt Generator →</Link>
          </p>
          <p>
            Learn which hashing algorithm to choose:{' '}
            <Link href="/blog/bcrypt-vs-argon2" className="text-blue-400 hover:text-blue-300">Bcrypt vs Argon2</Link>{' '}
            and <Link href="/blog/how-many-bcrypt-rounds" className="text-blue-400 hover:text-blue-300">how many rounds to use in 2026</Link>.
          </p>
        </section>
      </div>
    </>
  )
}
