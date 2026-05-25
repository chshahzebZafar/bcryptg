'use client'
import { useState } from 'react'
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { verifyHash, parseHash, getSecurityRating } from '@/lib/bcrypt'
import { SecurityBadge } from '@/components/ui/SecurityBadge'

type VerifyResult = 'match' | 'no-match' | 'invalid' | null

export function HashVerifier() {
  const [password, setPassword] = useState('')
  const [hashInput, setHashInput] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult>(null)

  const parsedHash = hashInput ? parseHash(hashInput) : null

  async function handleVerify() {
    if (!password || !hashInput) return
    setLoading(true)
    setResult(null)
    try {
      if (!parsedHash) {
        setResult('invalid')
        return
      }
      const match = await verifyHash(password, hashInput)
      setResult(match ? 'match' : 'no-match')
    } catch {
      setResult('invalid')
    } finally {
      setLoading(false)
    }
  }

  const secRating = parsedHash ? getSecurityRating(parsedHash.rounds) : null

  return (
    <div className="space-y-4">
      <SecurityBadge />

      <div>
        <label htmlFor="verify-password" className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="verify-password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password to verify..."
            autoComplete="off"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 pr-11 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="hash-input" className="block text-sm font-medium text-slate-300 mb-1.5">
          Bcrypt Hash
        </label>
        <textarea
          id="hash-input"
          value={hashInput}
          onChange={e => { setHashInput(e.target.value); setResult(null) }}
          placeholder="$2b$12$..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
        />
      </div>

      {parsedHash && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Hash Info</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-slate-500 text-xs">Version</p>
              <p className="font-mono text-slate-200">{parsedHash.version}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Rounds</p>
              <p className="font-mono text-slate-200">{parsedHash.rounds}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Security</p>
              <p className={`font-mono font-semibold ${secRating?.color}`}>{secRating?.label}</p>
            </div>
          </div>
          {parsedHash.rounds < 12 && (
            <p className="mt-3 text-amber-400 text-xs border-t border-slate-800 pt-2">
              ⚠ OWASP recommends at least 12 rounds for 2026.
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={!password || !hashInput || loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Password'
        )}
      </button>

      {result === 'match' && (
        <div className="flex items-center gap-3 bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-lg px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Password matches this hash</p>
            <p className="text-emerald-500 text-xs mt-0.5">The password is correct.</p>
          </div>
        </div>
      )}

      {result === 'no-match' && (
        <div className="flex items-center gap-3 bg-red-950 border border-red-700 text-red-400 rounded-lg px-4 py-3">
          <XCircle size={18} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Password does not match this hash</p>
            <p className="text-red-500 text-xs mt-0.5">The password or hash is incorrect.</p>
          </div>
        </div>
      )}

      {result === 'invalid' && (
        <div className="flex items-center gap-3 bg-amber-950 border border-amber-700 text-amber-400 rounded-lg px-4 py-3">
          <AlertTriangle size={18} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Invalid bcrypt hash</p>
            <p className="text-amber-500 text-xs mt-0.5">Hash must start with $2b$, $2a$, or $2y$.</p>
          </div>
        </div>
      )}
    </div>
  )
}
