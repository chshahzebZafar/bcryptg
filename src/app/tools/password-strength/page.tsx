import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { PasswordStrengthTool } from './PasswordStrengthTool'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Password Strength Checker — Free Online Password Analyzer',
  description:
    'Check your password strength instantly with detailed feedback, plus what NIST SP 800-63B says about length, complexity and breached passwords. Client-side only — your password never leaves your browser.',
  keywords: ['password strength checker', 'password strength test', 'password analyzer', 'strong password checker', 'password security test'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/password-strength' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free Password Strength Checker',
    description: 'Check password strength with detailed feedback and current NIST guidance. Client-side only.',
    url: 'https://bcryptgenerator.org/tools/password-strength',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Password Strength Checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Password Strength Checker',
    description: 'Check password strength with detailed feedback and current NIST guidance. Client-side only.',
    images: ['/opengraph-image'],
  },
}

const attackerTricks = [
  {
    title: 'Breached-password lists',
    body: <>Billions of real passwords from past data breaches are public. Anything that has appeared in a breach is tried first, no matter how complex it looks.</>,
  },
  {
    title: 'Dictionary words with predictable changes',
    body: <>Cracking tools automatically try words with a capital first letter, a number or year on the end, and swaps like <code>a → @</code> or <code>o → 0</code>. <code>P@ssw0rd2026!</code> falls quickly.</>,
  },
  {
    title: 'Keyboard patterns and sequences',
    body: <><code>qwerty</code>, <code>1qaz2wsx</code>, <code>123456</code> and <code>abcdef</code> are among the first guesses in every attack.</>,
  },
  {
    title: 'Personal information',
    body: <>Names, birthdays, pet names, sports teams and the site&apos;s own name are easy to find or guess, especially in targeted attacks.</>,
  },
]

const faqs: FAQ[] = [
  {
    q: 'How long should my password be?',
    a: 'NIST SP 800-63B requires at least 15 characters when a password is the only thing protecting an account, and at least 8 when it is combined with another factor such as an authenticator app. Longer is better: a random four- or five-word passphrase is both long and easy to remember.',
  },
  {
    q: 'Is a passphrase better than a complex password?',
    a: 'Usually, yes. Four or more random words (not a quote or song lyric) give you length, which matters most, without the hard-to-remember symbols. The words must be chosen at random; a common phrase is easy to guess.',
  },
  {
    q: 'Is it safe to type my real password here?',
    a: 'The check runs entirely in your browser and nothing is sent to our servers. Even so, it is good practice not to type a password you actually use into any website. Test a similar password instead.',
  },
  {
    q: 'Should I change my passwords regularly?',
    a: 'No, not on a fixed schedule. NIST advises against forced periodic changes because they push people toward predictable patterns. Change a password when there is a sign it has been exposed, such as a breach notification.',
  },
  {
    q: 'How should websites store my password?',
    a: 'As a slow, salted hash such as bcrypt or Argon2id, never in plain text and never with a fast hash like MD5 or SHA-256. That way, even if the database leaks, each password has to be guessed one slow attempt at a time.',
  },
]

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
          Get instant feedback on how strong a password is and how to improve it. Client-side only — your password never leaves your browser.
        </p>

        <PasswordStrengthTool />

        <article className="prose max-w-none mt-4">
          <h2>What makes a password strong?</h2>
          <p>
            A strong password is one an attacker is unlikely to guess, even with fast hardware and huge lists of leaked passwords. In practice that comes down to three things: <strong>length</strong>, <strong>unpredictability</strong> and <strong>uniqueness</strong> (never reusing it on another site). Length matters most: every extra character multiplies the number of possible passwords.
          </p>
          <p>
            This checker awards points for length (8, 12 and 16+ characters) and for mixing character types, and subtracts points for well-known patterns such as <code>password</code> or <code>123456</code>. Treat the score as a guide: no checker can tell whether a password has already appeared in a data breach or is easy to guess from your personal details.
          </p>

          <h2>What NIST recommends</h2>
          <p>
            The U.S. National Institute of Standards and Technology publishes the most widely followed password guidance, in <a href="https://pages.nist.gov/800-63-4/sp800-63b.html" target="_blank" rel="noopener noreferrer">SP 800-63B</a>. The current version says:
          </p>
          <ul>
            <li>At least <strong>15 characters</strong> when the password is used on its own, or <strong>8</strong> when combined with multi-factor authentication</li>
            <li>Allow passwords of at least <strong>64 characters</strong>, including spaces and Unicode</li>
            <li>Check new passwords against lists of <strong>common and breached passwords</strong></li>
            <li><strong>No composition rules</strong> such as &quot;must contain a symbol&quot;</li>
            <li><strong>No forced periodic changes</strong>, only when there is evidence of compromise</li>
            <li>Allow <strong>password managers and pasting</strong></li>
          </ul>

          <h2>What attackers try first</h2>
          <p>Password cracking isn&apos;t random guessing. Attackers start with the guesses most likely to work:</p>
        </article>

        <TipList items={attackerTricks} />

        <article className="prose max-w-none">
          <h2>How to create a strong password</h2>
          <ul>
            <li>Use a <strong>password manager</strong> to generate and store a long, random, unique password for every site</li>
            <li>For passwords you must remember, use a <strong>passphrase</strong> of four or more random words</li>
            <li>Turn on <strong>multi-factor authentication</strong> wherever it is offered</li>
            <li>Never reuse a password: one breached site then exposes all the others</li>
          </ul>

          <h2>For developers: storing passwords safely</h2>
          <p>
            A strong password only helps if the site stores it properly. Hash passwords with a slow, salted algorithm such as bcrypt or Argon2id, and limit bcrypt input to 72 bytes. Try the <Link href="/">bcrypt generator</Link>, check{' '}
            <Link href="/blog/how-many-bcrypt-rounds">how many rounds to use</Link>, or compare{' '}
            <Link href="/blog/bcrypt-vs-argon2">bcrypt and Argon2</Link>.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="Password Strength FAQ" />
        </div>
      </div>
    </>
  )
}
