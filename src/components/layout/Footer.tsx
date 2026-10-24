import Link from 'next/link'
import { Terminal, ShieldCheck } from 'lucide-react'

const tools = [
  { href: '/', label: 'Bcrypt Generator' },
  { href: '/verify', label: 'Hash Verifier' },
  { href: '/tools/md5', label: 'MD5 Generator' },
  { href: '/tools/sha256', label: 'SHA-256 Generator' },
  { href: '/tools/password-strength', label: 'Password Strength' },
]

const learn = [
  { href: '/blog', label: 'Security Blog' },
  { href: '/blog/what-is-bcrypt', label: 'What is Bcrypt?' },
  { href: '/blog/bcrypt-vs-argon2', label: 'Bcrypt vs Argon2' },
  { href: '/about', label: 'About' },
]

const legal = [
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
                <Terminal size={14} className="text-white" />
              </div>
              <span className="font-mono font-bold text-slate-100 text-sm tracking-tight">
                BcryptGenerator<span className="text-blue-400">.org</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Free developer security tools. Generate and verify bcrypt hashes instantly — entirely in your browser.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck size={13} />
              <span>Client-side only — no data sent to servers</span>
            </div>
          </div>

          <div>
            <h3 className="text-slate-300 font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2">
              {tools.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 text-sm hover:text-slate-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-300 font-semibold text-sm mb-3">Learn</h3>
            <ul className="space-y-2">
              {learn.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 text-sm hover:text-slate-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-300 font-semibold text-sm mb-3">Trust</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>No signup required</li>
              <li>No data stored</li>
              <li>HTTPS encrypted</li>
              <li>Follows OWASP guidance</li>
            </ul>
            <ul className="mt-4 space-y-2">
              {legal.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BcryptGenerator.org — Free Developer Security Tools</p>
          <p>
            Built for developers. Follows{' '}
            <a
              href="https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 underline"
            >
              OWASP guidelines
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
