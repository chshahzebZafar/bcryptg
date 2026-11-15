import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema, ToolSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { PasswordLeakChecker } from './PasswordLeakChecker'
import type { FAQ } from '@/types'

const URL = 'https://bcryptgenerator.org/tools/password-leak-checker'

export const metadata: Metadata = {
  title: { absolute: 'Password Leak Checker: Has My Password Been Leaked?' },
  description:
    'Check if your password has appeared in a data breach, privately. Only 5 characters of its hash leave your browser, so your password is never sent. Free.',
  keywords: [
    'password leak checker', 'has my password been leaked', 'password breach checker', 'check if password leaked',
    'pwned password check', 'compromised password check', 'leaked password check', 'have i been pwned password',
  ],
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Password Leak Checker: Has My Password Been Leaked?',
    description: 'Check a password against known data breaches without sending it anywhere.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Password Leak Checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Has My Password Been Leaked?',
    description: 'Check a password against known data breaches, privately, in your browser.',
    images: ['/opengraph-image'],
  },
}

// Counts from the Pwned Passwords API, checked with this tool on 15 November 2026
const examples = [
  { pw: '123456', count: '210,463,629' },
  { pw: 'password', count: '52,373,976' },
  { pw: 'P@ssw0rd', count: '6,421,554' },
  { pw: 'correct horse battery staple', count: '391' },
]

const faqs: FAQ[] = [
  {
    q: 'Is it safe to type my real password here?',
    a: 'Your password never leaves your browser. It is hashed with SHA-1 on your device and only the first 5 of the hash\'s 40 characters are sent, which matches hundreds of different hashes. You can see exactly what was sent under "What was sent to check this?" after each check. Even so, if you prefer, check a password you no longer use, or one that differs by a character.',
  },
  {
    q: 'My password was found. What should I do?',
    a: 'Stop using it. Change it on every site where you use it, starting with your email account, because email can reset everything else. Give each site its own long random password stored in a password manager, and turn on two-factor authentication where you can.',
  },
  {
    q: 'Does "not found" mean my password is safe?',
    a: 'It means it isn\'t in any breach this database knows about, which is good. It doesn\'t mean it is strong: a short password, a name plus a year, or a keyboard pattern can still be guessed quickly. Check it with the password strength checker too, and never reuse it.',
  },
  {
    q: 'Where does the breach data come from?',
    a: 'From Pwned Passwords, part of Have I Been Pwned, the breach notification service run by security researcher Troy Hunt. It contains passwords exposed in real data breaches, along with how many times each one was seen.',
  },
  {
    q: 'Does this check whether my email address was in a breach?',
    a: 'No. This tool checks passwords only. To see which breaches included your email address, search for it on haveibeenpwned.com.',
  },
  {
    q: 'Why does the check use SHA-1 if SHA-1 is broken?',
    a: 'Here SHA-1 is only a lookup key that lets your browser and the database find the same entry without sharing the password. Its weaknesses matter for signatures and certificates, not for this. It must never be used to store passwords; websites should use bcrypt or Argon2id for that.',
  },
]

export default function PasswordLeakCheckerPage() {
  return (
    <>
      <ToolSchema
        name="Password Leak Checker"
        path="/tools/password-leak-checker"
        description="Check whether a password appears in known data breaches using the Pwned Passwords k-anonymity API. Only a 5-character hash prefix leaves the browser."
        featureList={[
          'Checks against passwords exposed in real data breaches',
          'k-anonymity: only 5 characters of the SHA-1 hash are sent',
          'Shows how many times a password was seen',
          'Shows exactly what was sent for each check',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'Password Leak Checker', url: URL },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Password Leak Checker</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <ShieldAlert size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Password Leak Checker</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Has your password been leaked? Check it against the Pwned Passwords database of passwords exposed in real data breaches. Your password is never sent: your browser shares only the first 5 characters of its hash, and the match happens on your device.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
          <PasswordLeakChecker />
        </div>

        <article className="prose max-w-none mt-4">
          <h2>How it checks your password without sending it</h2>
          <p>
            This checker uses a technique called <strong>k-anonymity</strong>, the same one password managers and browsers use for breach alerts:
          </p>
          <ol>
            <li>Your browser turns the password into a SHA-1 hash. For <code>password</code> that&apos;s <code>5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8</code>.</li>
            <li>It sends only the first 5 characters, <code>5BAA6</code>, to the Pwned Passwords database.</li>
            <li>The database replies with every leaked hash that starts with those 5 characters (often hundreds), plus random padding so the reply size reveals nothing.</li>
            <li>Your browser looks for the rest of your hash in that list. The database never learns which entry, if any, was yours.</li>
          </ol>

          <h2>How often common passwords appear in breaches</h2>
          <p>We checked a few well-known passwords with this tool. The numbers are how many times each one appears across leaked password lists:</p>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Password</th><th>Times seen in breaches</th></tr></thead>
              <tbody>
                {examples.map(e => <tr key={e.pw}><td><code>{e.pw}</code></td><td>{e.count}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p>
            Swapping letters for symbols doesn&apos;t help: <code>P@ssw0rd</code> has been seen millions of times. Even <code>correct horse battery staple</code>, the famous example of a strong passphrase, has leaked hundreds of times, because so many people copied it. A good password is random <em>and</em> unique to you.
          </p>

          <h2>What to do if your password was leaked</h2>
          <ul>
            <li><strong>Change it everywhere you used it</strong>, starting with your email account, which can reset all your other passwords.</li>
            <li><strong>Use a different password for every site.</strong> Leaked passwords are tried on other sites automatically (credential stuffing), so reuse turns one breach into many.</li>
            <li><strong>Let a password manager remember them</strong>, and create new ones with the <Link href="/tools/password-generator">password generator</Link>.</li>
            <li><strong>Turn on two-factor authentication</strong>, so a leaked password alone isn&apos;t enough to sign in.</li>
          </ul>

          <h2>For developers: block breached passwords at sign-up</h2>
          <p>
            NIST&apos;s <a href="https://pages.nist.gov/800-63-4/sp800-63b.html" target="_blank" rel="noopener noreferrer">SP 800-63B</a> guidelines require services to check new passwords against lists of compromised passwords. The same range API works from any backend, with no API key:
          </p>
          <pre><code>{`const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
const res = await fetch('https://api.pwnedpasswords.com/range/' + hash.slice(0, 5), {
  headers: { 'Add-Padding': 'true' },
})
const line = (await res.text()).split('\\n').find(l => l.startsWith(hash.slice(5)))
const timesSeen = line ? Number(line.split(':')[1]) : 0`}</code></pre>
          <p>
            Then store the password with a slow hash such as bcrypt, never SHA-1. Try the <Link href="/">bcrypt generator</Link>, or read{' '}
            <Link href="/blog/how-many-bcrypt-rounds">how many bcrypt rounds to use</Link>.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="Password Leak Checker FAQ" />
        </div>
      </div>
    </>
  )
}
