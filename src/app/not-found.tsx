import type { Metadata } from 'next'
import Link from 'next/link'
import { Terminal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found — BcryptGenerator.org',
  description: 'The page you\'re looking for doesn\'t exist. Return to the bcrypt generator or explore our other free security tools.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  const links = [
    { href: '/', label: 'Bcrypt Generator' },
    { href: '/verify', label: 'Hash Verifier' },
    { href: '/tools', label: 'All Tools' },
    { href: '/blog', label: 'Security Blog' },
  ]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Terminal size={24} className="text-blue-400" />
        </div>
        <h1 className="text-6xl font-bold text-slate-700 font-mono mb-4">404</h1>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">Page not found</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. Try one of the links below.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-400 text-sm font-medium px-4 py-3 rounded-lg transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
