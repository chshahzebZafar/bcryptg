import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, PersonSchema } from '@/components/seo/JsonLd'
import { author } from '@/lib/author'
import { ChevronRight, ShieldCheck, Lock, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About BcryptGenerator.org — Privacy Policy & Trust',
  description:
    'BcryptGenerator.org is a free, client-side bcrypt hash tool for developers. No data collection, no tracking, no signup. Read our privacy policy.',
  keywords: ['bcrypt generator privacy', 'bcrypt tool privacy policy', 'client-side bcrypt', 'secure bcrypt tool'],
  alternates: { canonical: 'https://bcryptgenerator.org/about' },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'About BcryptGenerator.org — Privacy Policy & Trust',
    description: 'Free, client-side bcrypt tool for developers. No data collection, no tracking, no signup required.',
    url: 'https://bcryptgenerator.org/about',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BcryptGenerator.org — Privacy & Trust' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BcryptGenerator.org',
    description: 'Free, client-side bcrypt tool. No data collection, no tracking.',
    images: ['/opengraph-image'],
  },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'About', url: 'https://bcryptgenerator.org/about' },
        ]}
      />
      <PersonSchema />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">About</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
          About BcryptGenerator.org
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          A free, open-source bcrypt hashing tool built for developers who care about security.
        </p>

        <div className="space-y-8">
          <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-100">What We Build</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              BcryptGenerator.org provides free, client-side security tools for developers. Our primary tool generates and verifies bcrypt password hashes — entirely in your browser using JavaScript. We also offer MD5, SHA-256, and password strength checking tools.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              The site is built with Next.js and <code className="font-mono text-xs text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">bcryptjs</code> — a pure JavaScript bcrypt implementation that runs fully client-side, meaning your passwords never travel over the network.
            </p>
          </section>

          <section id="author" className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4 scroll-mt-20">
            <div>
              <h2 className="text-xl font-bold text-slate-100">About the Author</h2>
              <p className="text-slate-300 font-medium mt-2">{author.name}</p>
              <p className="text-slate-500 text-sm">{author.jobTitle}</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{author.bio}</p>
            <div>
              <h3 className="text-slate-200 font-semibold text-sm mb-2">Passions</h3>
              <ul className="space-y-1.5">
                {author.passions.map(p => (
                  <li key={p} className="text-slate-400 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Privacy Policy</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">No data collection</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We do not collect, store, or transmit any passwords, hashes, or inputs you enter into our tools. All processing happens in your browser.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">No cookies or tracking</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We do not use advertising cookies or cross-site tracking. Anonymous analytics (page views only) may be collected via Vercel Analytics to help us improve the site.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">Open source</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Our source code is available on GitHub. You can audit exactly what runs in your browser and verify that no passwords are transmitted.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Security Standards</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our recommendations follow{' '}
              <a
                href="https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                OWASP Password Storage Cheat Sheet
              </a>{' '}
              and{' '}
              <a
                href="https://pages.nist.gov/800-63-3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                NIST SP 800-63B
              </a>
              . We update our guidance as standards evolve.
            </p>
          </section>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Bcrypt Generator →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
