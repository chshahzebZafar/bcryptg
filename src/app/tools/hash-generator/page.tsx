import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema, ToolSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { HashGenerator } from './HashGenerator'
import type { FAQ } from '@/types'

const URL = 'https://bcryptgenerator.org/tools/hash-generator'

export const metadata: Metadata = {
  title: { absolute: 'Hash Generator & Checksum Calculator: MD5, SHA-256, SHA-512' },
  description:
    'Free online hash generator and file checksum calculator. Get the MD5, SHA-1, SHA-256 or SHA-512 of text or a file and verify a download. Nothing is uploaded.',
  keywords: [
    'hash generator', 'checksum calculator', 'file hash checker', 'online hash generator', 'verify checksum',
    'sha256 checksum', 'sha512 hash generator', 'sha1 hash generator', 'md5 checksum', 'file checksum',
  ],
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Hash Generator & File Checksum Calculator',
    description: 'MD5, SHA-1, SHA-256, SHA-384 and SHA-512 for text or files, with a checksum checker. Runs in your browser; nothing is uploaded.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Hash Generator & Checksum Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator & File Checksum Calculator',
    description: 'MD5, SHA-1, SHA-256 and SHA-512 for text or files. Verify downloads in your browser.',
    images: ['/opengraph-image'],
  },
}

const algorithms = [
  { name: 'MD5', hex: 32, status: 'Broken for security (collisions since 2004)', use: 'Older download pages and legacy systems' },
  { name: 'SHA-1', hex: 40, status: 'Broken for security (practical collision in 2017)', use: 'Older software and Git object IDs' },
  { name: 'SHA-256', hex: 64, status: 'Secure', use: 'Most download checksums, code signing, TLS' },
  { name: 'SHA-384', hex: 96, status: 'Secure', use: 'Certificates and some security standards' },
  { name: 'SHA-512', hex: 128, status: 'Secure', use: 'Some Linux distributions and backups' },
]

const mismatchReasons = [
  {
    title: 'The download is incomplete or corrupted',
    body: <>The most common cause. A dropped connection or a full disk leaves a file that looks fine but has different bytes. Download it again, ideally from the official source.</>,
  },
  {
    title: 'You compared different algorithms',
    body: <>A SHA-256 checksum will never match an MD5 or SHA-512 hash of the same file. Check the length: 32 hex characters is MD5, 40 is SHA-1, 64 is SHA-256, 128 is SHA-512. The checker above detects this for you.</>,
  },
  {
    title: 'You checked the wrong file or version',
    body: <>Download pages often list checksums for several files (installer vs portable, x64 vs ARM, different versions). Make sure the line you copied belongs to the exact file you downloaded.</>,
  },
  {
    title: 'You hashed text instead of the file',
    body: <>Pasting a file&apos;s contents, or its name, into a text box gives a different result. Use the <strong>File</strong> tab. And for text, an invisible trailing newline or space changes the hash completely.</>,
  },
  {
    title: 'The file was modified',
    body: <>If you re-downloaded from the official site and it still doesn&apos;t match, don&apos;t run the file. It may have been replaced on a mirror, or tampered with on the way to you.</>,
  },
]

const faqs: FAQ[] = [
  {
    q: 'What is a checksum?',
    a: 'A checksum is a short fingerprint calculated from every byte of a file, usually with a hash function such as SHA-256. Changing even one byte gives a completely different checksum, so if your result matches the one published by the developer, you have exactly the file they released.',
  },
  {
    q: 'Is my file uploaded anywhere?',
    a: 'No. Your browser reads the file and calculates the hashes on your own device using the Web Crypto API (and our own MD5 code). Nothing is sent to a server, so it works for private files too, and keeps working if you go offline after the page loads.',
  },
  {
    q: 'Which algorithm should I use to verify a download?',
    a: 'Whichever one the download page publishes, because you can only compare like with like. If you can choose, use SHA-256: it is secure, fast and supported by every operating system. MD5 and SHA-1 still detect accidental corruption, but they no longer protect against deliberate tampering.',
  },
  {
    q: 'Can a hash be reversed to get the original file or text?',
    a: 'No. Hash functions are one-way: there is no key and no way to turn a hash back into its input. Short or common text can sometimes be found by guessing and comparing, which is why fast hashes like these must never be used to store passwords. Use bcrypt or Argon2id for that.',
  },
  {
    q: 'Is SHA-1 still safe?',
    a: 'Not for security. Researchers produced two different PDF files with the same SHA-1 hash in 2017, so an attacker can create a malicious file that matches a legitimate SHA-1 checksum in some situations. It still detects accidental corruption, but prefer SHA-256 whenever the publisher offers it.',
  },
  {
    q: 'How big a file can I check?',
    a: 'Up to 2 GB in the browser. The file is read into memory, so very large files depend on your device. For larger files, use the built-in command on your computer, shown above for Windows, macOS and Linux.',
  },
]

export default function HashGeneratorPage() {
  return (
    <>
      <ToolSchema
        name="Hash Generator & Checksum Calculator"
        path="/tools/hash-generator"
        description="Calculate the MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hash of text or a file and compare it with a published checksum. Runs in your browser."
        featureList={[
          'MD5, SHA-1, SHA-256, SHA-384 and SHA-512 at once',
          'Hash text or files up to 2 GB',
          'Checksum checker with automatic algorithm detection',
          'Files never leave your device',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'Hash Generator', url: URL },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Hash Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Hash size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Hash Generator &amp; Checksum Calculator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Get the MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hash of any text or file, then paste a published checksum to check that a download is genuine. Everything runs in your browser: files are never uploaded.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
          <HashGenerator />
        </div>

        <article className="prose max-w-none mt-4">
          <h2>How to verify a downloaded file</h2>
          <ol>
            <li>Find the checksum on the official download page. It&apos;s often labelled <em>SHA-256</em>, <em>checksum</em> or <em>hash</em>, or provided in a file such as <code>SHA256SUMS</code>.</li>
            <li>Open the <strong>File</strong> tab above and choose the file you downloaded.</li>
            <li>Paste the published checksum into <strong>Verify a checksum</strong>. The tool detects the algorithm from its length and tells you whether it matches.</li>
          </ol>
          <p>
            A match means your file is byte-for-byte identical to the one the publisher hashed. Get the checksum from the publisher&apos;s own site, not from the mirror you downloaded from: anyone who can replace a file can usually replace a checksum sitting next to it.
          </p>

          <h2>Which hash algorithm should you use?</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Algorithm</th><th>Length (hex)</th><th>Security</th><th>Where you&apos;ll see it</th></tr>
              </thead>
              <tbody>
                {algorithms.map(a => (
                  <tr key={a.name}><td>{a.name}</td><td>{a.hex}</td><td>{a.status}</td><td>{a.use}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            To verify a download, use the algorithm the publisher lists. To choose one yourself, use <strong>SHA-256</strong>. MD5 and SHA-1 still catch accidental corruption, but they no longer stop deliberate tampering: researchers created a practical{' '}
            <a href="https://shattered.io/" target="_blank" rel="noopener noreferrer">SHA-1 collision</a> in 2017, and MD5 collisions have been practical for even longer.
          </p>

          <h2>Check a file&apos;s hash on Windows, macOS and Linux</h2>
          <p>Every operating system has a built-in checksum command, useful for files over 2 GB or for scripts.</p>
          <p><strong>Windows (PowerShell)</strong>: SHA-256 is the default</p>
          <pre><code>{`Get-FileHash .\\file.iso
Get-FileHash .\\file.iso -Algorithm MD5`}</code></pre>
          <p>Compare against a published checksum. This prints <code>True</code> or <code>False</code>, and ignores upper/lower case:</p>
          <pre><code>{`(Get-FileHash .\\file.iso).Hash -eq "paste-the-checksum-here"`}</code></pre>
          <p><strong>Windows (Command Prompt)</strong></p>
          <pre><code>{`certutil -hashfile file.iso SHA256`}</code></pre>
          <p><strong>macOS</strong></p>
          <pre><code>{`shasum -a 256 file.iso
md5 file.iso`}</code></pre>
          <p><strong>Linux</strong></p>
          <pre><code>{`sha256sum file.iso
sha256sum -c SHA256SUMS   # checks every file listed, prints OK or FAILED`}</code></pre>
          <p>
            PowerShell prints uppercase hex and most other tools print lowercase. They&apos;re the same value, so compare them ignoring case.
          </p>

          <h2>Why your checksum doesn&apos;t match</h2>
        </article>

        <TipList items={mismatchReasons} />

        <article className="prose max-w-none">
          <h2>Hash test values</h2>
          <p>Hash the text <code>abc</code> above and you should get exactly these values. They come from the official test vectors, so you can also use them to check your own code:</p>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Algorithm</th><th>Hash of &quot;abc&quot;</th></tr></thead>
              <tbody>
                <tr><td>MD5</td><td><code className="break-all">900150983cd24fb0d6963f7d28e17f72</code></td></tr>
                <tr><td>SHA-1</td><td><code className="break-all">a9993e364706816aba3e25717850c26c9cd0d89d</code></td></tr>
                <tr><td>SHA-256</td><td><code className="break-all">ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad</code></td></tr>
                <tr><td>SHA-512</td><td><code className="break-all">ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f</code></td></tr>
              </tbody>
            </table>
          </div>

          <h2>Checksums are not for passwords</h2>
          <p>
            MD5 and the SHA family are designed to be fast, which is perfect for checking large files and terrible for storing passwords: an attacker with a stolen database can test billions of guesses per second. Passwords need a slow, salted hash. Use the <Link href="/">bcrypt generator</Link>, and read <Link href="/blog/what-is-bcrypt">what bcrypt is</Link> to see why it&apos;s different.
          </p>
          <p>
            Need just one algorithm, with command-line and code examples? See the <Link href="/tools/sha256">SHA-256 generator</Link> and the <Link href="/tools/md5">MD5 generator</Link>.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="Hash Generator FAQ" />
        </div>
      </div>
    </>
  )
}
