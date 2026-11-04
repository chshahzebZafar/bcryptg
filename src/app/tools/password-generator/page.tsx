import type { Metadata } from 'next'
import Link from 'next/link'
import { KeyRound, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { PasswordGenerator } from './PasswordGenerator'
import type { FAQ } from '@/types'

const URL = 'https://bcryptgenerator.org/tools/password-generator'

export const metadata: Metadata = {
  title: { absolute: 'Free Password Generator: Strong, Random & Private' },
  description:
    'Generate strong random passwords and passphrases in your browser. Pick 12, 16 or 20 characters, symbols or words, then get a bcrypt hash. No sign-up.',
  keywords: ['password generator', 'random password generator', 'strong password generator', 'passphrase generator', 'password generator 16 characters', 'memorable password generator'],
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free Password Generator: Strong, Random & Private',
    description: 'Strong random passwords and passphrases, generated in your browser. No sign-up, nothing sent to a server.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Password Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Password Generator',
    description: 'Strong random passwords and passphrases, generated in your browser. No sign-up.',
    images: ['/opengraph-image'],
  },
}

const entropyRows = [
  { setting: '8 random characters', bits: '51.5' },
  { setting: '12 random characters', bits: '77.3' },
  { setting: '16 random characters (default)', bits: '103.1' },
  { setting: '20 random characters', bits: '128.9' },
  { setting: '4-word passphrase', bits: '51.7' },
  { setting: '5-word passphrase', bits: '64.6' },
  { setting: '6-word passphrase (default)', bits: '77.5' },
]

const faqs: FAQ[] = [
  {
    q: 'Is it safe to use an online password generator?',
    a: 'It depends on where the password is created. This one generates passwords entirely in your browser with the Web Crypto API, and nothing is sent to a server or stored. You can even disconnect from the internet after the page loads and it keeps working. Avoid generators that create passwords on their server, because you can\'t see what happens to them there.',
  },
  {
    q: 'How long should a password be: 12, 15 or 16 characters?',
    a: 'NIST\'s current guidelines require at least 15 characters when a password is the only thing protecting an account, and at least 8 when it is combined with another factor such as an authenticator app. For a random password from a password manager, 16 characters or more is a good default; it costs you nothing because you never type it.',
  },
  {
    q: 'Do I need special characters?',
    a: 'Not for strength: length adds more security than symbols do, and NIST advises sites not to force composition rules. Many sites still require a symbol, though, so the generator includes them by default. If a site rejects certain symbols, edit the symbol list or turn symbols off and add a few characters of length instead.',
  },
  {
    q: 'Are passphrases as secure as random passwords?',
    a: 'They can be, if the words are chosen randomly from a large list. Each word from the 7,776-word EFF list adds about 12.9 bits, so six words give roughly 77.5 bits, about the same as a 12-character random password, but far easier to remember and type. A phrase you choose yourself, like a song lyric, is much weaker.',
  },
  {
    q: 'Do you store or see the passwords I generate?',
    a: 'No. Generation happens in your browser, nothing is sent over the network, and nothing is saved. Close the tab and the passwords are gone, so copy them into your password manager first.',
  },
  {
    q: 'Can I generate several passwords at once?',
    a: 'Yes. Choose 5, 10 or 20 in the "How many" menu and use "Copy" to copy them all, one per line. That\'s handy for test accounts or seeding a development database.',
  },
]

export default function PasswordGeneratorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'Password Generator', url: URL },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Password Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <KeyRound size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Free Password Generator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Create strong, random passwords or easy-to-remember passphrases. Everything is generated in your browser with a cryptographically secure random number generator, so nothing is sent to a server, saved or logged. No sign-up.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
          <PasswordGenerator />
        </div>

        <article className="prose max-w-none mt-4">
          <h2>How long should a password be?</h2>
          <p>
            Longer is stronger, and length matters more than anything else. The U.S. National Institute of Standards and Technology&apos;s <a href="https://pages.nist.gov/800-63-4/sp800-63b.html" target="_blank" rel="noopener noreferrer">SP 800-63B</a> guidelines require:
          </p>
          <ul>
            <li>At least <strong>15 characters</strong> for a password that is the only thing protecting an account</li>
            <li>At least <strong>8 characters</strong> when the password is combined with another factor, such as an authenticator app</li>
            <li>No forced composition rules (like &quot;must contain a symbol&quot;) and no forced periodic changes</li>
          </ul>
          <p>
            That&apos;s why this generator defaults to <strong>16 characters</strong>. If you store passwords in a password manager, you never have to type or remember them, so 20 or more costs you nothing. The presets above cover the most common requirements: 8, 12, 15, 16, 20 and 32 characters.
          </p>

          <h2>Random password or passphrase?</h2>
          <p>
            Strength is measured in <strong>bits of entropy</strong>: each extra bit doubles the number of guesses an attacker needs. These are the exact values for this generator&apos;s settings, using all four character types (87 possible characters) or the 7,776-word EFF list:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Setting</th><th>Entropy</th></tr></thead>
              <tbody>
                {entropyRows.map(r => <tr key={r.setting}><td>{r.setting}</td><td>{r.bits} bits</td></tr>)}
              </tbody>
            </table>
          </div>
          <p>
            Use a <strong>random password</strong> for anything stored in a password manager. Use a <strong>passphrase</strong> for the few passwords you have to type or remember yourself, such as your password manager&apos;s master password or your computer login. A six-word passphrase is about as strong as a 12-character random password, and much easier to type correctly.
          </p>

          <h2>How this generator works</h2>
          <p>
            Every character or word is picked with <code>crypto.getRandomValues()</code>, the browser&apos;s cryptographically secure random number generator, the same source used for encryption keys. Two details make the results trustworthy:
          </p>
          <ul>
            <li><strong>No bias.</strong> Random numbers are mapped onto the character set with rejection sampling, so every character is equally likely. A naive <code>random % length</code> would make some characters slightly more common.</li>
            <li><strong>Every selected type is included, fairly.</strong> When you tick uppercase, lowercase, numbers and symbols, each password contains at least one of each. Rather than forcing them into fixed positions, which would make passwords more predictable, the generator simply discards any candidate that misses a type and draws again.</li>
          </ul>
          <p>
            Passphrase words come from the EFF&apos;s large word list, designed for generating memorable passphrases. Its words are at most 9 letters, so even six words with separators stay under 60 characters.
          </p>

          <h2>For developers: hash it with bcrypt</h2>
          <p>
            Need a password for a seeded admin account or a test fixture? Generate one, then click <strong>Hash with bcrypt</strong> to get a cost-12 hash you can put straight into your database. Remember that bcrypt only uses the first 72 bytes of a password, so the generator warns you when a password goes over that. See <Link href="/blog/bcrypt-72-byte-limit">bcrypt&apos;s maximum password length</Link> for why it matters. You can verify any hash with the <Link href="/verify">bcrypt checker</Link>, or create hashes for your own passwords with the <Link href="/">bcrypt generator</Link>.
          </p>

          <h2>Generate a password from the command line</h2>
          <p>Each of these uses the operating system&apos;s secure random source:</p>
          <p><strong>OpenSSL</strong> (Linux, macOS, Git Bash): 24 characters</p>
          <pre><code>openssl rand -base64 18</code></pre>
          <p><strong>Python</strong>: 22 URL-safe characters</p>
          <pre><code>{`python -c "import secrets; print(secrets.token_urlsafe(16))"`}</code></pre>
          <p><strong>Node.js</strong>: 24 URL-safe characters</p>
          <pre><code>{`node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"`}</code></pre>

          <h2>Keeping passwords safe after you generate them</h2>
          <ul>
            <li>Use a different password for every account, so one breach can&apos;t unlock the others</li>
            <li>Store them in a password manager rather than a note or spreadsheet</li>
            <li>Turn on multi-factor authentication wherever it&apos;s offered</li>
            <li>Check an existing password with the <Link href="/tools/password-strength">password strength checker</Link></li>
          </ul>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="Password Generator FAQ" />
        </div>
      </div>
    </>
  )
}
