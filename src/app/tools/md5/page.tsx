import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { MD5Tool } from './MD5Tool'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Free MD5 Hash Generator — Online MD5 Tool',
  description:
    'Generate MD5 hashes from any text instantly, with test vectors, command-line examples and tips for matching other tools. Client-side only. MD5 is not suitable for passwords.',
  keywords: ['md5 generator', 'md5 hash', 'md5 online', 'md5 hash generator', 'generate md5', 'md5 checksum'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/md5' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free MD5 Hash Generator — Online Tool',
    description: 'Generate MD5 hashes instantly, client-side only. Includes test vectors and command-line examples.',
    url: 'https://bcryptgenerator.org/tools/md5',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MD5 Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free MD5 Hash Generator',
    description: 'Generate MD5 hashes instantly, client-side only.',
    images: ['/opengraph-image'],
  },
}

const vectors = [
  { input: '(empty string)', hash: 'd41d8cd98f00b204e9800998ecf8427e' },
  { input: 'abc', hash: '900150983cd24fb0d6963f7d28e17f72' },
  { input: 'The quick brown fox jumps over the lazy dog', hash: '9e107d9d372bb6826bd81d3542a419d6' },
]

const mismatchReasons = [
  {
    title: 'A trailing newline',
    body: (
      <>
        <code>echo &quot;hello&quot; | md5sum</code> hashes <code>hello</code> plus a newline (<code>b1946ac9…</code>), not <code>hello</code> (<code>5d41402a…</code>). Use <code>echo -n</code> or <code>printf</code>.
      </>
    ),
  },
  {
    title: 'Different text encoding',
    body: (
      <>
        This tool hashes the UTF-8 bytes of your text, like most command-line tools and libraries. Tools that hash UTF-16 or Latin-1 bytes give different results for any character outside plain ASCII.
      </>
    ),
  },
  {
    title: 'Windows vs Unix line endings',
    body: (
      <>
        Multi-line text copied from Windows uses <code>\r\n</code> line endings, while Unix uses <code>\n</code>. The extra <code>\r</code> characters change the hash.
      </>
    ),
  },
  {
    title: 'Upper vs lower case hex',
    body: (
      <>
        <code>900150983CD24FB0…</code> and <code>900150983cd24fb0…</code> are the same hash. PowerShell prints uppercase, most other tools print lowercase. Compare them case-insensitively.
      </>
    ),
  },
]

const faqs: FAQ[] = [
  {
    q: 'Can an MD5 hash be decrypted?',
    a: 'No. MD5 is a one-way function, so there is no key to decrypt it with. However, MD5 is so fast that huge lookup tables of precomputed hashes exist for common words and passwords, which is why an MD5 hash of a weak password can often be "reversed" by simply looking it up.',
  },
  {
    q: 'How long is an MD5 hash?',
    a: 'An MD5 hash is 128 bits, usually written as 32 hexadecimal characters. Every input, from an empty string to a multi-gigabyte file, produces a hash of the same length.',
  },
  {
    q: 'Is MD5 safe for file checksums?',
    a: 'It is fine for detecting accidental corruption, such as a broken download or a bad disk copy. It is not safe against deliberate tampering, because attackers can create two different files with the same MD5 hash. To guard against tampering, use SHA-256.',
  },
  {
    q: 'Should I use MD5 or SHA-256?',
    a: 'For anything new, use SHA-256. It is still fast, widely supported and has no known practical collisions. Use MD5 only when a system you need to talk to requires it, and never for passwords, where bcrypt or Argon2id is the right choice.',
  },
]

export default function MD5Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'MD5 Generator', url: 'https://bcryptgenerator.org/tools/md5' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">MD5 Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Hash size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">MD5 Hash Generator</h1>
        </div>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Generate the MD5 hash of any text. The hash is calculated from the UTF-8 bytes of your input, entirely in your browser — nothing is sent to our servers.
        </p>

        <MD5Tool />

        <article className="prose max-w-none mt-4">
          <h2>What is MD5?</h2>
          <p>
            MD5 (Message-Digest Algorithm 5) is a hash function designed by Ronald Rivest in 1991. It turns any input into a 128-bit fingerprint, written as 32 hexadecimal characters. The same input always gives the same hash, and changing a single character changes the whole hash.
          </p>
          <p>
            MD5 was built for security, but it is now considered broken. Researchers showed practical collisions (two different inputs with the same hash) in 2004, and in 2012 the Flame malware used an MD5 collision to forge a Microsoft code-signing certificate. Today MD5 is only appropriate where security doesn&apos;t matter.
          </p>

          <h2>MD5 test vectors</h2>
          <p>Use these known values to confirm that this tool, or your own code, calculates MD5 correctly:</p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Input</th><th>MD5 hash</th></tr>
              </thead>
              <tbody>
                {vectors.map(v => (
                  <tr key={v.hash}><td>{v.input}</td><td><code className="break-all">{v.hash}</code></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Why your MD5 hash doesn&apos;t match</h2>
          <p>MD5 itself is deterministic, so a mismatch always means the input bytes were different. The usual causes:</p>
        </article>

        <TipList items={mismatchReasons} />

        <article className="prose max-w-none">
          <h2>When to use MD5 (and when not to)</h2>
          <p><strong>Still reasonable for:</strong></p>
          <ul>
            <li>Detecting accidental file corruption after a download or copy</li>
            <li>Cache keys, ETags and deduplicating non-sensitive data</li>
            <li>Compatibility with older systems and APIs that require MD5</li>
          </ul>
          <p><strong>Never use MD5 for:</strong></p>
          <ul>
            <li>Storing passwords: use <Link href="/">bcrypt</Link> or Argon2id instead</li>
            <li>Digital signatures, certificates or any tamper protection</li>
            <li>Anything where an attacker controls part of the input</li>
          </ul>

          <h2>Generate an MD5 hash on the command line or in code</h2>
          <p><strong>Linux</strong></p>
          <pre><code>{`echo -n "abc" | md5sum`}</code></pre>
          <p><strong>macOS</strong></p>
          <pre><code>{`md5 -s "abc"`}</code></pre>
          <p><strong>Windows PowerShell</strong> (files)</p>
          <pre><code>{`Get-FileHash .\\file.zip -Algorithm MD5`}</code></pre>
          <p><strong>Node.js</strong></p>
          <pre><code>{`require('crypto').createHash('md5').update('abc', 'utf8').digest('hex')`}</code></pre>
          <p><strong>Python</strong></p>
          <pre><code>{`import hashlib
hashlib.md5("abc".encode("utf-8")).hexdigest()`}</code></pre>
          <p><strong>PHP</strong></p>
          <pre><code>{`md5('abc');`}</code></pre>
          <p>
            Need a secure hash instead? Try the <Link href="/tools/sha256">SHA-256 generator</Link>, or read{' '}
            <Link href="/blog/what-is-bcrypt">what bcrypt is</Link> if you are hashing passwords.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="MD5 FAQ" />
        </div>
      </div>
    </>
  )
}
