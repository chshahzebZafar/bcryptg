'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Terminal } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Generator' },
  { href: '/verify', label: 'Verifier' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group" aria-label="BcryptGenerator.org home">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-mono font-bold text-slate-100 text-base tracking-tight group-hover:text-blue-400 transition-colors">
              BcryptGenerator<span className="text-blue-400">.org</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}
            </nav>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-800 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
