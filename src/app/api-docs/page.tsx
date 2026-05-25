import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bcrypt API Documentation — REST API for Bcrypt Hashing',
  description:
    'Free REST API for generating and verifying bcrypt hashes. Simple HTTP endpoints, no authentication required. Coming soon.',
  alternates: { canonical: 'https://bcryptgenerator.org/api-docs' },
  robots: { index: false, follow: true },
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/hash',
    desc: 'Generate a bcrypt hash from a password.',
    body: JSON.stringify({ password: 'myPassword123', rounds: 12 }, null, 2),
    response: JSON.stringify({ hash: '$2b$12$...', rounds: 12, processingTime: '312ms' }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/verify',
    desc: 'Verify a password against a bcrypt hash.',
    body: JSON.stringify({ password: 'myPassword123', hash: '$2b$12$...' }, null, 2),
    response: JSON.stringify({ match: true, rounds: 12 }, null, 2),
  },
]

export default function APIDocsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'API Docs', url: 'https://bcryptgenerator.org/api-docs' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">API Docs</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">API Documentation</h1>
        <p className="text-slate-400 text-lg mb-3 leading-relaxed">
          Free REST API for bcrypt hash generation and verification. No API key required.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-950 border border-amber-700 text-amber-300 text-sm px-3 py-1.5 rounded-lg mb-10">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Coming soon — the browser tool is available now.
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-4">Base URL</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-emerald-400">
              https://bcryptgenerator.org/api
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-4">Rate Limits</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800">
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Tier</th>
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Limit</th>
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="px-4 py-3 text-slate-400">Free</td>
                    <td className="px-4 py-3 text-slate-400">100 req/min</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">Free</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-400">Pro (coming soon)</td>
                    <td className="px-4 py-3 text-slate-400">10,000 req/min</td>
                    <td className="px-4 py-3 text-slate-400">Contact us</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-6">Endpoints</h2>
            <div className="space-y-6">
              {endpoints.map(ep => (
                <div key={ep.path} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700 bg-slate-800">
                    <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${ep.method === 'POST' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-emerald-900 text-emerald-300 border border-emerald-700'}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-200 text-sm">{ep.path}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-slate-400 text-sm">{ep.desc}</p>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Request Body</p>
                      <pre className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-slate-300 font-mono overflow-x-auto">
                        {ep.body}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Response</p>
                      <pre className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-emerald-300 font-mono overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400 text-sm mb-3">
            Prefer to hash client-side? Use our free browser tool — no API calls needed.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Open Bcrypt Generator →
          </Link>
        </div>
      </div>
    </>
  )
}
