'use client'
import { useState, useEffect, useCallback } from 'react'
import { Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react'
import { generateHash, getRoundsLabel } from '@/lib/bcrypt'
import { CopyButton } from '@/components/ui/CopyButton'
import { SecurityBadge } from '@/components/ui/SecurityBadge'
import { CodeSnippets } from '@/components/tools/CodeSnippets'
import type { HashHistoryItem } from '@/types'

const HISTORY_KEY = 'bcrypt_history'

export function BcryptGenerator() {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [rounds, setRounds] = useState(12)
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HashHistoryItem[]>([])
  const [showSnippets, setShowSnippets] = useState(false)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const addToHistory = useCallback((h: HashHistoryItem) => {
    setHistory(prev => {
      const next = [h, ...prev].slice(0, 5)
      try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  async function handleGenerate() {
    if (!password) return
    setLoading(true)
    setHash('')
    try {
      const result = await generateHash(password, rounds)
      setHash(result)
      addToHistory({ hash: result, rounds, timestamp: Date.now() })
    } catch {
      setHash('Error generating hash. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roundLabel = getRoundsLabel(rounds)

  return (
    <div className="space-y-4">
      <SecurityBadge />

      <div>
        <label htmlFor="password-input" className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password-input"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Enter your password..."
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
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="rounds-slider" className="text-sm font-medium text-slate-300">
            Salt Rounds
          </label>
          <span className="text-xs font-mono text-blue-400">{rounds}</span>
        </div>
        <input
          id="rounds-slider"
          type="range"
          min={4}
          max={14}
          value={rounds}
          onChange={e => setRounds(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <p className="text-xs text-slate-400 mt-1.5 font-mono">{roundLabel}</p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!password || loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            Generate Hash
          </>
        )}
      </button>

      {hash && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Generated Hash</span>
            <CopyButton text={hash} />
          </div>
          <p className="hash-output text-emerald-400 text-sm leading-relaxed select-all">{hash}</p>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Recent Hashes (session only)</h3>
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="hash-output text-emerald-300 text-xs truncate">{item.hash}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {item.rounds} rounds · {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <CopyButton text={item.hash} className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowSnippets(!showSnippets)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          {showSnippets ? '▲ Hide' : '▼ Show'} code examples
        </button>
        {showSnippets && <CodeSnippets />}
      </div>
    </div>
  )
}
