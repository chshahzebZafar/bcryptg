'use client'
import { useState } from 'react'
import { CopyButton } from '@/components/ui/CopyButton'

export function SHA256Tool() {
  const [input, setInput] = useState('')
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!input) return
    setLoading(true)
    try {
      const data = new TextEncoder().encode(input)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      setHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''))
    } catch {
      setHash('Error generating hash.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 space-y-4">
      <div>
        <label htmlFor="sha-input" className="block text-sm font-medium text-slate-300 mb-1.5">Input String</label>
        <textarea
          id="sha-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={!input || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? 'Generating...' : 'Generate SHA-256'}
      </button>
      {hash && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide">SHA-256 Hash</span>
            <CopyButton text={hash} />
          </div>
          <p className="hash-output text-emerald-400 text-sm select-all">{hash}</p>
        </div>
      )}
    </div>
  )
}
