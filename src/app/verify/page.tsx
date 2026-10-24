import type { Metadata } from 'next'
import Link from 'next/link'
import { HashVerifier } from '@/components/tools/HashVerifier'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { ChevronRight } from 'lucide-react'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Bcrypt Checker — Verify a Password Against a Bcrypt Hash',
  description:
    'Check whether a password matches a bcrypt hash, inspect its version, cost and salt, and debug why a bcrypt comparison fails. Client-side only — supports $2a$, $2b$ and $2y$.',
  alternates: { canonical: 'https://bcryptgenerator.org/verify' },
  keywords: ['bcrypt checker', 'bcrypt verifier', 'verify bcrypt hash', 'check bcrypt password', 'bcrypt compare online'],
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Bcrypt Checker — Verify a Password Against a Bcrypt Hash',
    description: 'Check a password against a bcrypt hash, inspect the hash, and debug failed comparisons. Runs entirely in your browser.',
    url: 'https://bcryptgenerator.org/verify',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Bcrypt Checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bcrypt Checker — Verify a Password Against a Hash',
    description: 'Check a password against a bcrypt hash and debug failed comparisons. Client-side only.',
    images: ['/opengraph-image'],
  },
}

// Real cost-12 hash of "correct horse battery staple", split into its parts.
const SAMPLE = {
  prefix: '$2b$',
  cost: '12',
  salt: 'RB2qR6GI4quP.PUs6xR5He',
  hash: '37dCyunLcYFzlvUfwSX41XkRXgOQ3OS',
}

const failureReasons = [
  {
    title: 'Hashing the password again and comparing strings',
    body: (
      <>
        Every call to <code>hash()</code> generates a new random salt, so hashing the same password twice gives two different results. Never compare <code>hash(password) == storedHash</code>. Use the library&apos;s <code>compare()</code> / <code>verify()</code> function, which reuses the salt stored in the hash.
      </>
    ),
  },
  {
    title: 'The hash was cut off in the database',
    body: (
      <>
        A bcrypt hash is always exactly 60 characters. A <code>VARCHAR(50)</code> column, or a form field with a length limit, silently truncates it and every check fails. Use <code>CHAR(60)</code>, or <code>VARCHAR(60)</code> or longer.
      </>
    ),
  },
  {
    title: '$ signs removed by your shell or .env file',
    body: (
      <>
        Shells, Docker Compose and many <code>.env</code> loaders treat <code>$2b</code> and <code>$12</code> as variables and replace them with nothing. Wrap the hash in single quotes, or escape each <code>$</code> (as <code>$$</code> in Docker Compose).
      </>
    ),
  },
  {
    title: 'Invisible whitespace or a trailing newline',
    body: (
      <>
        Copying from a terminal or reading from a file often adds a newline, and <code>secret</code> and <code>secret\n</code> are different inputs. Trim the stored hash and check how the password is read. This checker trims pasted hashes automatically.
      </>
    ),
  },
  {
    title: 'Different pre-processing on each side',
    body: (
      <>
        Some apps pre-hash passwords (for example with SHA-256) or normalize them before calling bcrypt. If the code that creates the hash and the code that checks it don&apos;t do exactly the same steps, the comparison fails.
      </>
    ),
  },
  {
    title: 'Passwords longer than 72 bytes',
    body: (
      <>
        bcrypt only uses the first 72 bytes of a password, so two long passwords that share the same first 72 bytes both match. Some newer libraries reject longer input instead of truncating it, which can make an old hash appear not to verify.
      </>
    ),
  },
  {
    title: 'A library that does not recognize the prefix',
    body: (
      <>
        <code>$2y$</code> (PHP) and <code>$2b$</code> produce identical hashes. A library that rejects <code>$2y$</code> will usually accept the same hash with the prefix changed to <code>$2b$</code>.
      </>
    ),
  },
]

const faqs: FAQ[] = [
  {
    q: 'Can a bcrypt hash be decrypted?',
    a: 'No. Bcrypt is a one-way function, so there is nothing to decrypt. The only way to find out whether a password matches is to hash the candidate password with the salt and cost stored in the hash and compare the results, which is exactly what this checker does.',
  },
  {
    q: 'Why does the same password produce a different bcrypt hash every time?',
    a: 'Each hash gets a new random 16-byte salt, stored in characters 8–29 of the hash. Different salts produce different hashes, but every one of them still verifies against the same password.',
  },
  {
    q: 'Is it safe to paste a real hash and password into this page?',
    a: 'The check runs entirely in your browser with the bcryptjs library, and nothing you type is sent to a server. Even so, avoid pasting live production credentials into any website; use test accounts where you can.',
  },
  {
    q: 'What is the difference between $2a$, $2b$ and $2y$?',
    a: '$2a$ is the original prefix. $2y$ was introduced by PHP after fixing a bug in its implementation, and $2b$ by OpenBSD after fixing a separate length-handling bug. Modern libraries produce identical output for all three, so a hash with any of these prefixes can be checked here.',
  },
  {
    q: 'Why does the checker refuse hashes with a very high cost?',
    a: 'Each extra cost round doubles the work, and JavaScript bcrypt in a browser is slower than a native server library. Cost 16 can already take ten seconds or more, and cost 20+ can take minutes, so the checker stops at 16 instead of freezing the tab.',
  },
]

export default function VerifyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Bcrypt Checker', url: 'https://bcryptgenerator.org/verify' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Bcrypt Checker</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
          Bcrypt Hash Checker
        </h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Paste a bcrypt hash and a password to check whether they match. The checker also shows the hash&apos;s version and cost, and the guide below explains the most common reasons a bcrypt check fails.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 mb-4">
          <HashVerifier />
        </div>

        <article className="prose max-w-none">
          <h2>Anatomy of a bcrypt hash</h2>
          <p>
            Every bcrypt hash is a 60-character string that stores everything needed to check a password: the algorithm version, the cost, the salt and the hash itself. Here is a real cost-12 hash of <code>correct horse battery staple</code>:
          </p>
        </article>

        <div className="mb-2 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm break-all leading-relaxed">
          <span className="text-blue-400">{SAMPLE.prefix}</span>
          <span className="text-amber-400">{SAMPLE.cost}</span>
          <span className="text-slate-500">$</span>
          <span className="text-emerald-400">{SAMPLE.salt}</span>
          <span className="text-fuchsia-400">{SAMPLE.hash}</span>
        </div>

        <dl className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Version', value: SAMPLE.prefix, color: 'text-blue-400', meaning: 'Algorithm variant: $2a$, $2b$ or $2y$' },
            { label: 'Cost', value: SAMPLE.cost, color: 'text-amber-400', meaning: 'Work factor: 2¹² = 4,096 key-setup rounds' },
            { label: 'Salt', value: SAMPLE.salt, color: 'text-emerald-400', meaning: '22 characters encoding a random 16-byte salt' },
            { label: 'Hash', value: SAMPLE.hash, color: 'text-fuchsia-400', meaning: '31 characters encoding the 23-byte result' },
          ].map(({ label, value, color, meaning }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg p-3 min-w-0">
              <dt className="text-xs text-slate-500 uppercase tracking-wide">{label}</dt>
              <dd className={`font-mono text-sm break-all mt-0.5 ${color}`}>{value}</dd>
              <dd className="text-slate-400 text-sm mt-1">{meaning}</dd>
            </div>
          ))}
        </dl>

        <article className="prose max-w-none">
          <h2>How bcrypt verification works</h2>
          <p>
            Verification never decrypts anything. The checker reads the cost and salt from the stored hash, runs bcrypt on the password you entered with those same settings, and compares the result with the stored hash. If they are identical, the password is correct.
          </p>
          <p>
            Because the salt and cost live inside the hash, you only ever store one value per user. It also means an attacker who steals the hash still has to guess passwords one at a time, paying the full cost of bcrypt for every guess. See{' '}
            <Link href="/blog/how-many-bcrypt-rounds">how many bcrypt rounds to use</Link> for how the cost factor affects that.
          </p>

          <h2>Why a bcrypt check fails (and how to fix it)</h2>
          <p>If you are sure the password is right but the check still fails, it is almost always one of these. For code examples and fixes in Node.js, PHP and Python, read the full guide: <Link href="/blog/bcrypt-compare-returns-false">why bcrypt.compare() returns false</Link>.</p>
        </article>

        <TipList items={failureReasons} numbered />

        <article className="prose max-w-none">
          <h2>Checking a bcrypt hash in code</h2>
          <p>Use your library&apos;s compare function. It extracts the salt and cost from the hash for you and compares the result in constant time.</p>
          <p><strong>Node.js</strong> (bcrypt or bcryptjs)</p>
          <pre><code>{`const ok = await bcrypt.compare(password, storedHash)`}</code></pre>
          <p><strong>PHP</strong></p>
          <pre><code>{`$ok = password_verify($password, $storedHash);`}</code></pre>
          <p><strong>Python</strong> (bcrypt)</p>
          <pre><code>{`ok = bcrypt.checkpw(password.encode(), stored_hash.encode())`}</code></pre>
          <p>
            Full walkthroughs: <Link href="/blog/bcrypt-nodejs-tutorial">Node.js</Link>,{' '}
            <Link href="/blog/bcrypt-php-tutorial">PHP</Link> and{' '}
            <Link href="/blog/bcrypt-python-tutorial">Python</Link>. Need a fresh hash to test with?{' '}
            <Link href="/">Create one with the bcrypt generator</Link>.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} />
        </div>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/blog/what-is-bcrypt', title: 'What is Bcrypt?', desc: 'How bcrypt works, salting, and why it is slow by design.' },
            { href: '/blog/how-many-bcrypt-rounds', title: 'How Many Rounds?', desc: 'OWASP guidance and benchmarks for choosing the right cost factor.' },
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
