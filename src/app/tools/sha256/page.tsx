import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { SHA256Tool } from './SHA256Tool'
import type { FAQ } from '@/types'

export const metadata: Metadata = {
  title: 'Free SHA-256 Hash Generator — Online Web Crypto Tool',
  description:
    'Generate SHA-256 hashes with your browser\'s Web Crypto API. Includes test vectors, SHA-256 vs MD5 vs bcrypt, and command-line examples. Client-side only — no data sent to servers.',
  keywords: ['sha256 generator', 'sha-256 hash', 'sha256 online', 'sha256 hash generator', 'sha256 checksum'],
  alternates: { canonical: 'https://bcryptgenerator.org/tools/sha256' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Free SHA-256 Hash Generator — Web Crypto API',
    description: 'Generate SHA-256 hashes instantly using the Web Crypto API. Client-side only.',
    url: 'https://bcryptgenerator.org/tools/sha256',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'SHA-256 Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SHA-256 Hash Generator',
    description: 'Generate SHA-256 hashes instantly using the Web Crypto API. Client-side only.',
    images: ['/opengraph-image'],
  },
}

const vectors = [
  { input: '(empty string)', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { input: 'abc', hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' },
  { input: 'The quick brown fox jumps over the lazy dog', hash: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592' },
]

const mismatchReasons = [
  {
    title: 'A trailing newline or extra whitespace',
    body: (
      <>
        <code>echo &quot;hello&quot; | sha256sum</code> hashes <code>hello</code> plus a newline. Use <code>echo -n</code> or <code>printf</code>, and watch for spaces copied from documents.
      </>
    ),
  },
  {
    title: 'Hex vs Base64 output',
    body: (
      <>
        The same 32-byte digest can be written as 64 hex characters or 44 Base64 characters. Subresource Integrity (<code>sha256-…</code>) and many APIs use Base64; this tool and <code>sha256sum</code> print hex.
      </>
    ),
  },
  {
    title: 'Hashing text vs hashing a file',
    body: (
      <>
        Hashing a file name, or a file&apos;s contents pasted as text, is not the same as hashing the file&apos;s raw bytes. Use a file-hashing command for downloads and archives.
      </>
    ),
  },
  {
    title: 'Different text encoding',
    body: (
      <>
        This tool hashes the UTF-8 bytes of your text. Other encodings give different results for any character outside plain ASCII.
      </>
    ),
  },
]

const faqs: FAQ[] = [
  {
    q: 'Can I use SHA-256 to hash passwords?',
    a: 'Not on its own. SHA-256 is designed to be fast, so attackers with GPUs can test billions of guesses per second against a stolen hash. Use a password hashing function such as bcrypt or Argon2id. If you need a FIPS-approved option, OWASP recommends PBKDF2-HMAC-SHA256 with at least 600,000 iterations.',
  },
  {
    q: 'Can a SHA-256 hash be reversed?',
    a: 'No. SHA-256 is a one-way function with no known practical attacks against it. As with any fast hash, though, short or common inputs can be found by guessing, so a hash of a weak password offers little protection.',
  },
  {
    q: 'How long is a SHA-256 hash?',
    a: 'A SHA-256 hash is 256 bits (32 bytes), written as 64 hexadecimal characters or 44 Base64 characters.',
  },
  {
    q: 'What is the difference between SHA-256 and HMAC-SHA256?',
    a: 'SHA-256 hashes data on its own, so anyone can compute it. HMAC-SHA256 mixes in a secret key, which proves the message came from someone who knows the key. Use HMAC for webhook signatures, API request signing and similar authentication checks.',
  },
]

export default function SHA256Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'SHA-256 Generator', url: 'https://bcryptgenerator.org/tools/sha256' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">SHA-256 Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Hash size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">SHA-256 Hash Generator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Generate SHA-256 hashes using your browser&apos;s built-in Web Crypto API. Fast, accurate, and client-side only — no data is ever sent to our servers.
        </p>

        <SHA256Tool />

        <article className="prose max-w-none mt-4">
          <h2>What is SHA-256?</h2>
          <p>
            SHA-256 is part of the SHA-2 family of hash functions, published by NIST in 2001. It turns any input into a 256-bit digest, written as 64 hexadecimal characters. It has no known practical collisions, which is why it secures TLS certificates, software signatures, Git (in its SHA-256 mode) and Bitcoin.
          </p>
          <p>
            This tool uses <code>crypto.subtle.digest(&apos;SHA-256&apos;)</code>, the same native implementation your browser uses for HTTPS, so results match every standard SHA-256 library.
          </p>

          <h2>SHA-256 test vectors</h2>
          <p>Use these known values to check this tool, or your own code:</p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Input</th><th>SHA-256 hash</th></tr>
              </thead>
              <tbody>
                {vectors.map(v => (
                  <tr key={v.hash}><td>{v.input}</td><td><code className="break-all">{v.hash}</code></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>SHA-256 vs MD5 vs bcrypt</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th></th><th>MD5</th><th>SHA-256</th><th>bcrypt</th></tr>
              </thead>
              <tbody>
                <tr><td>Output size</td><td>128 bits</td><td>256 bits</td><td>184 bits + salt</td></tr>
                <tr><td>Speed</td><td>Very fast</td><td>Very fast</td><td>Deliberately slow</td></tr>
                <tr><td>Collision resistant</td><td>No (broken)</td><td>Yes</td><td>Not its purpose</td></tr>
                <tr><td>Built-in salt</td><td>No</td><td>No</td><td>Yes</td></tr>
                <tr><td>Use for passwords</td><td>Never</td><td>Not on its own</td><td>Yes</td></tr>
                <tr><td>Best for</td><td>Legacy checksums</td><td>Integrity, signatures</td><td>Password storage</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            In short: use SHA-256 to fingerprint data, and <Link href="/">bcrypt</Link> (or Argon2id) to store passwords. Our{' '}
            <Link href="/blog/bcrypt-vs-argon2">bcrypt vs Argon2 guide</Link> covers the password side in depth.
          </p>

          <h2>Why your SHA-256 hash doesn&apos;t match</h2>
        </article>

        <TipList items={mismatchReasons} />

        <article className="prose max-w-none">
          <h2>Generate a SHA-256 hash on the command line or in code</h2>
          <p><strong>Linux</strong></p>
          <pre><code>{`echo -n "abc" | sha256sum`}</code></pre>
          <p><strong>macOS</strong></p>
          <pre><code>{`echo -n "abc" | shasum -a 256`}</code></pre>
          <p><strong>Windows PowerShell</strong> (files)</p>
          <pre><code>{`Get-FileHash .\\file.zip -Algorithm SHA256`}</code></pre>
          <p><strong>Node.js</strong></p>
          <pre><code>{`require('crypto').createHash('sha256').update('abc', 'utf8').digest('hex')`}</code></pre>
          <p><strong>Python</strong></p>
          <pre><code>{`import hashlib
hashlib.sha256("abc".encode("utf-8")).hexdigest()`}</code></pre>
          <p><strong>Browser JavaScript</strong> (what this tool uses)</p>
          <pre><code>{`const bytes = new TextEncoder().encode('abc')
const digest = await crypto.subtle.digest('SHA-256', bytes)
const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')`}</code></pre>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="SHA-256 FAQ" />
        </div>
      </div>
    </>
  )
}
