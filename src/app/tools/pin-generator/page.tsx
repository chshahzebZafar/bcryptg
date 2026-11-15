import type { Metadata } from 'next'
import Link from 'next/link'
import { Grid3x3, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema, ToolSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { PinGenerator } from './PinGenerator'
import { patternCount } from '@/lib/pin'
import type { FAQ } from '@/types'

const URL = 'https://bcryptgenerator.org/tools/pin-generator'

export const metadata: Metadata = {
  title: { absolute: 'Random PIN Generator: Secure 4, 6 & 8-Digit PINs' },
  description:
    'Generate a random 4, 6 or 8-digit PIN in your browser, skipping easy-to-guess patterns like 1234 and 0000. Free, private and no sign-up.',
  keywords: [
    'pin generator', 'random pin generator', '4 digit pin generator', '6 digit pin generator',
    'secure pin generator', 'pin code generator', 'random 4 digit number', 'random pin number',
  ],
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Random PIN Generator: Secure 4, 6 & 8-Digit PINs',
    description: 'Random PINs that skip patterns like 1234 and 0000. Generated in your browser; nothing is sent or saved.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Random PIN Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random PIN Generator',
    description: 'Secure random 4, 6 and 8-digit PINs, generated in your browser.',
    images: ['/opengraph-image'],
  },
}

const fmt = (n: number) => n.toLocaleString('en-US')

const lengths = [4, 6, 8].map(d => ({
  digits: d,
  total: 10 ** d,
  patterns: patternCount(d),
}))

const avoid = [
  {
    title: 'Dates and years',
    body: <>Birthdays, anniversaries and years such as 1990 or 2015 are among the first things anyone guesses, and they&apos;re often findable on social media.</>,
  },
  {
    title: 'Repeated digits and runs',
    body: <><code>0000</code>, <code>1111</code>, <code>1234</code> and <code>9876</code> are the obvious first guesses. This generator skips them by default.</>,
  },
  {
    title: 'Keypad shapes',
    body: <>Straight lines, corners and crosses on the keypad, such as <code>2580</code> (down the middle column), are easy to remember and just as easy to guess.</>,
  },
  {
    title: 'Numbers tied to you',
    body: <>Digits from your phone number, house number, car plate or ID card. Someone who knows you, or has your wallet, can try them.</>,
  },
]

const faqs: FAQ[] = [
  {
    q: 'Is a 4-digit PIN secure?',
    a: 'It can be, because PINs rely on attempt limits rather than size. A phone or bank card that locks after a few wrong tries leaves an attacker with a tiny chance of guessing a random 4-digit PIN: about 0.03% with three tries. The risk comes from PINs that aren\'t random, such as 1234 or a birth year, which are tried first. Where you can, use 6 digits: that is 100 times more combinations.',
  },
  {
    q: 'What is the most secure PIN?',
    a: 'There isn\'t a single "most secure" PIN. Any PIN chosen at random is as strong as any other of the same length; what makes a PIN weak is a pattern or a personal meaning that makes it guessable. That\'s why the safest PIN is one picked at random, like the ones above, rather than one you choose.',
  },
  {
    q: 'Are the PINs I generate stored or sent anywhere?',
    a: 'No. Each PIN is created in your browser with the Web Crypto API\'s secure random number generator. Nothing is sent to a server, logged or saved, and the PIN disappears when you close or refresh the page.',
  },
  {
    q: 'Why does the generator skip some PINs?',
    a: 'With "skip easy-to-guess patterns" switched on, it never shows PINs made of one repeated digit (0000), a run up or down (1234, 9876, 7890) or a repeated group (1212, 123123). For 4 digits that removes 120 of the 10,000 possible PINs, which barely affects the number of choices but rules out the guesses an attacker tries first.',
  },
  {
    q: 'Should I use a PIN or a password?',
    a: 'Use a PIN where the device itself limits wrong attempts, such as a phone lock screen, a SIM card or a bank card. For online accounts, where an attacker might make many guesses, use a long random password instead, from the password generator.',
  },
  {
    q: 'Can I generate several PINs at once?',
    a: 'Yes. Choose 5, 10 or 20 under "How many" and use Copy to copy them all, one per line. That is handy for setting up several devices or giving each person on a team their own PIN.',
  },
]

export default function PinGeneratorPage() {
  return (
    <>
      <ToolSchema
        name="Random PIN Generator"
        path="/tools/pin-generator"
        description="Generate random 4 to 12-digit PINs in your browser with a cryptographically secure random number generator, skipping easy-to-guess patterns."
        featureList={[
          '4, 6, 8 or any length from 4 to 12 digits',
          'Skips repeated digits, runs and repeated groups',
          'Generate up to 20 PINs at once',
          'Cryptographically secure randomness; nothing sent to a server',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'PIN Generator', url: URL },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">PIN Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Grid3x3 size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Random PIN Generator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Get a random 4, 6 or 8-digit PIN for your phone, SIM card, bank card or door code. PINs are created in your browser with a cryptographically secure random number generator and skip patterns like 1234 and 0000. Nothing is sent or saved.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
          <PinGenerator />
        </div>

        <article className="prose max-w-none mt-4">
          <h2>4-digit vs 6-digit PIN: how much safer is it?</h2>
          <p>
            Every extra digit multiplies the number of possible PINs by ten. These are the exact numbers for random PINs, and how many the pattern filter removes:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Digits</th><th>Possible PINs</th><th>Patterns skipped</th><th>Chance 3 random guesses succeed</th></tr>
              </thead>
              <tbody>
                {lengths.map(l => (
                  <tr key={l.digits}>
                    <td>{l.digits}</td>
                    <td>{fmt(l.total)}</td>
                    <td>{fmt(l.patterns)}</td>
                    <td>about 1 in {fmt(Math.round((l.total - l.patterns) / 3))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            A PIN is short, so it relies on the device locking after a few wrong attempts. That is why a random 4-digit PIN is fine for a bank card, while an online account needs a long password. If your phone or app lets you choose, <strong>6 digits</strong> gives you 100 times more combinations for two extra taps.
          </p>

          <h2>PINs to avoid</h2>
          <p>Most guessed PINs aren&apos;t guessed by luck. People choose numbers that mean something, and attackers try those first:</p>
        </article>

        <TipList items={avoid} />

        <article className="prose max-w-none">
          <h2>How this PIN generator works</h2>
          <ul>
            <li><strong>Secure randomness.</strong> Each digit comes from <code>crypto.getRandomValues()</code>, your browser&apos;s cryptographically secure random number generator, not the predictable <code>Math.random()</code>.</li>
            <li><strong>No bias.</strong> Random numbers are mapped to digits with rejection sampling, so every digit from 0 to 9 is exactly equally likely.</li>
            <li><strong>Patterns skipped, fairly.</strong> If a PIN matches a pattern, the generator throws it away and draws a new one, so every remaining PIN is equally likely.</li>
            <li><strong>Private.</strong> PINs are created on your device and never sent anywhere. You can disconnect from the internet after the page loads and it keeps working.</li>
          </ul>

          <h2>Where to use a random PIN</h2>
          <ul>
            <li><strong>Phone lock screen.</strong> iPhones use a 6-digit passcode by default, and Android allows a PIN of 4 digits or more. Choose 6 or more.</li>
            <li><strong>SIM card PIN.</strong> Stops someone using your SIM in another phone. SIM PINs are 4 to 8 digits.</li>
            <li><strong>Bank and payment cards.</strong> Usually 4 digits, changed at your bank&apos;s ATM or in its app.</li>
            <li><strong>Voicemail, door entry and alarm codes</strong>, and any account that asks for a numeric PIN.</li>
          </ul>
          <p>
            Use a different PIN for each card and device, never keep it written down with the card, and change it if someone may have seen you enter it.
          </p>

          <h2>Need something stronger than a PIN?</h2>
          <p>
            For online accounts, use the <Link href="/tools/password-generator">password generator</Link> to create a long random password or passphrase, and check existing ones with the <Link href="/tools/password-strength">password strength checker</Link>.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="PIN Generator FAQ" />
        </div>
      </div>
    </>
  )
}
