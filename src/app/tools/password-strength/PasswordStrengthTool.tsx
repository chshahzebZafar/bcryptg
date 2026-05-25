'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

interface Strength {
  score: number
  label: string
  color: string
  barColor: string
  feedback: string[]
}

function checkStrength(password: string): Strength {
  if (!password) return { score: 0, label: '', color: '', barColor: '', feedback: [] }
  let score = 0
  const feedback: string[] = []
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')
  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Use 12+ characters for better security')
  if (password.length >= 16) score += 1
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters (A–Z)')
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters (a–z)')
  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers (0–9)')
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters (!@#$%...)')
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein']
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2)
    feedback.push('Avoid common password patterns')
  }
  const pct = score / 7
  if (pct < 0.3) return { score, label: 'Very Weak', color: 'text-red-400', barColor: 'bg-red-500', feedback }
  if (pct < 0.5) return { score, label: 'Weak', color: 'text-orange-400', barColor: 'bg-orange-500', feedback }
  if (pct < 0.7) return { score, label: 'Fair', color: 'text-amber-400', barColor: 'bg-amber-500', feedback }
  if (pct < 0.9) return { score, label: 'Strong', color: 'text-emerald-400', barColor: 'bg-emerald-500', feedback }
  return { score, label: 'Very Strong', color: 'text-emerald-400', barColor: 'bg-emerald-400', feedback }
}

export function PasswordStrengthTool() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const strength = checkStrength(password)

  return (
    <>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 space-y-5">
        <div>
          <label htmlFor="pw-input" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <input
              id="pw-input"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter a password to analyze..."
              autoComplete="off"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 pr-11 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {password && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Strength</span>
                <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Length', ok: password.length >= 12, val: `${password.length} chars` },
                { label: 'Uppercase', ok: /[A-Z]/.test(password), val: /[A-Z]/.test(password) ? 'Present' : 'Missing' },
                { label: 'Lowercase', ok: /[a-z]/.test(password), val: /[a-z]/.test(password) ? 'Present' : 'Missing' },
                { label: 'Numbers', ok: /[0-9]/.test(password), val: /[0-9]/.test(password) ? 'Present' : 'Missing' },
                { label: 'Symbols', ok: /[^A-Za-z0-9]/.test(password), val: /[^A-Za-z0-9]/.test(password) ? 'Present' : 'Missing' },
                { label: '12+ chars', ok: password.length >= 12, val: password.length >= 12 ? 'Yes' : 'No' },
              ].map(({ label, ok, val }) => (
                <div key={label} className={`border rounded-lg px-3 py-2 ${ok ? 'border-emerald-800 bg-emerald-950' : 'border-slate-700 bg-slate-800'}`}>
                  <p className="text-slate-500">{label}</p>
                  <p className={ok ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>{val}</p>
                </div>
              ))}
            </div>

            {strength.feedback.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-slate-300 mb-2">Suggestions</p>
                <ul className="space-y-1">
                  {strength.feedback.map(f => (
                    <li key={f} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-slate-500">
        Ready to hash your password? Use our{' '}
        <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">Bcrypt Generator →</Link>
      </div>
    </>
  )
}
