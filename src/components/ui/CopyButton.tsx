'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        copied
          ? 'bg-emerald-900 text-emerald-400 border border-emerald-700'
          : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-slate-100'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  )
}
