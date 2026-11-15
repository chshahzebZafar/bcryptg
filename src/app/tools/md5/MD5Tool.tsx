'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import { md5 } from '@/lib/hash'

export function MD5Tool() {
  const [input, setInput] = useState('')
  const [hash, setHash] = useState('')

  function handleGenerate() {
    if (!input) return
    setHash(md5(new TextEncoder().encode(input)))
  }

  return (
    <>
      <div className="flex items-start gap-2 bg-amber-950 border border-amber-700 rounded-lg px-4 py-3 mb-6 text-amber-300 text-sm">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <span>
          <strong className="font-semibold">Not for passwords.</strong> MD5 is a fast hash — brute-forceable in seconds.
          Use <Link href="/" className="underline hover:text-amber-200">bcrypt</Link> for password storage.
        </span>
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="md5-input" className="block text-sm font-medium text-slate-300 mb-1.5">Input String</label>
          <textarea
            id="md5-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!input}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          Generate MD5
        </button>
        {hash && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">MD5 Hash</span>
              <CopyButton text={hash} />
            </div>
            <p className="hash-output text-emerald-400 text-sm select-all">{hash}</p>
          </div>
        )}
      </div>
    </>
  )
}
