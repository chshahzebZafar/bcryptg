'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ShieldAlert, ShieldCheck, Search } from 'lucide-react'
import { checkPwned, type PwnedResult } from '@/lib/pwned'

export function PasswordLeakChecker() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<PwnedResult | null>(null)
  const [error, setError] = useState('')

  async function check(e?: React.FormEvent) {
    e?.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError('')
    setResult(null)
    try {
      setResult(await checkPwned(password))
    } catch (err) {
      setError(err instanceof Error && err.message.startsWith('The breach')
        ? err.message
        : 'Could not reach the breach database. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={check} className="space-y-3">
        <label htmlFor="leak-pw" className="block text-sm font-medium text-slate-300">Password to check</label>
        <div className="relative">
          <input
            id="leak-pw"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setResult(null); setError('') }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Type a password"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg pl-4 pr-12 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={!password || busy}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Search size={16} aria-hidden="true" />}
          {busy ? 'Checking…' : 'Check if leaked'}
        </button>
      </form>

      <div aria-live="polite">
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

        {result && result.count > 0 && (
          <div className="bg-red-950/60 border border-red-800 rounded-lg p-4">
            <p className="flex items-center gap-2 text-red-300 font-semibold mb-1.5">
              <ShieldAlert size={18} aria-hidden="true" />
              Leaked: seen {result.count.toLocaleString('en-US')} {result.count === 1 ? 'time' : 'times'} in data breaches
            </p>
            <p className="text-sm text-red-200/90 leading-relaxed">
              Attackers try known leaked passwords first, so don&apos;t use this one anywhere. If you do, change it on every site
              where you used it, starting with email and banking. Create a new one with the{' '}
              <Link href="/tools/password-generator" className="underline hover:opacity-80">password generator</Link>.
            </p>
          </div>
        )}

        {result && result.count === 0 && (
          <div className="bg-emerald-950/60 border border-emerald-800 rounded-lg p-4">
            <p className="flex items-center gap-2 text-emerald-300 font-semibold mb-1.5">
              <ShieldCheck size={18} aria-hidden="true" />
              Not found in any known data breach
            </p>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Good news, but not a guarantee it&apos;s strong: a short or predictable password can still be guessed. Check it with the{' '}
              <Link href="/tools/password-strength" className="underline hover:opacity-80">password strength checker</Link>, and
              use it on one site only.
            </p>
          </div>
        )}

        {result && (
          <details className="mt-3 bg-slate-950 border border-slate-800 rounded-lg text-sm">
            <summary className="px-4 py-2.5 cursor-pointer text-slate-300 select-none">What was sent to check this?</summary>
            <div className="px-4 pb-4 text-slate-400 space-y-1.5 leading-relaxed">
              <p>Your browser hashed the password with SHA-1 and sent only the first 5 of its 40 characters:</p>
              <p className="font-mono text-base"><span className="text-amber-300">{result.prefix}</span><span className="text-slate-500">{result.hash.slice(5)}</span></p>
              <p>
                The breach database replied with {result.candidates.toLocaleString('en-US')} hashes that start with{' '}
                <code>{result.prefix}</code> (some of them random padding), and your browser compared them locally. Neither the
                password nor its full hash left your device.
              </p>
            </div>
          </details>
        )}
      </div>

      <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
        Breach data from{' '}
        <a href="https://haveibeenpwned.com/Passwords" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
          Have I Been Pwned&apos;s Pwned Passwords
        </a>
        . Nothing you type is stored or logged.
      </p>
    </div>
  )
}
