'use client'
import { useEffect, useRef, useState } from 'react'
import { FileUp, Type, CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import {
  ALGORITHMS,
  digestHex,
  formatBytes,
  md5Chunked,
  parseChecksum,
  type Algorithm,
} from '@/lib/hash'

type Mode = 'text' | 'file'
type Results = Partial<Record<Algorithm, string>>

// ArrayBuffers above ~2 GB fail in some browsers, and Web Crypto needs the whole file in memory
const MAX_FILE_BYTES = 2 * 1024 ** 3

const NOTES: Record<Algorithm, string> = {
  'MD5': 'Legacy checksums only',
  'SHA-1': 'Legacy, collisions are practical',
  'SHA-256': 'Most common for downloads',
  'SHA-384': 'SHA-2 family',
  'SHA-512': 'SHA-2 family',
}

export function HashGenerator() {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<Results>({})
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [expected, setExpected] = useState('')
  const [upper, setUpper] = useState(false)
  const [dragging, setDragging] = useState(false)
  const runId = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)

  // Text: hash as you type (short debounce)
  useEffect(() => {
    if (mode !== 'text') return
    const id = ++runId.current
    if (!text) { setResults({}); return }
    const t = setTimeout(async () => {
      const bytes = new TextEncoder().encode(text)
      const out: Results = {}
      for (const a of ALGORITHMS) out[a] = await digestHex(a, bytes)
      if (id === runId.current) setResults(out)
    }, 120)
    return () => clearTimeout(t)
  }, [text, mode])

  async function hashFile(f: File) {
    const id = ++runId.current
    setFile(f)
    setResults({})
    setError('')
    if (f.size > MAX_FILE_BYTES) {
      setError(`This file is ${formatBytes(f.size)}. The browser tool handles files up to 2 GB; use a command below for larger files.`)
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      const bytes = new Uint8Array(await f.arrayBuffer())
      // SHA digests run natively off the main thread; MD5 runs in slices so the page stays responsive
      const shaPromise = Promise.all(
        ALGORITHMS.filter(a => a !== 'MD5').map(async a => [a, await digestHex(a, bytes)] as const),
      )
      const md5 = await md5Chunked(bytes, p => { if (id === runId.current) setProgress(p) })
      const sha = await shaPromise
      if (id === runId.current) setResults({ MD5: md5, ...Object.fromEntries(sha) })
    } catch {
      if (id === runId.current) setError('Could not read this file. Try again, or use a command below.')
    } finally {
      if (id === runId.current) setBusy(false)
    }
  }

  function switchMode(m: Mode) {
    runId.current++
    setMode(m)
    setResults({})
    setError('')
    setBusy(false)
    if (m === 'text') setFile(null)
  }

  const parsed = expected.trim() ? parseChecksum(expected) : null
  const actual = parsed ? results[parsed.algorithm] : undefined
  const match = parsed && actual ? actual === parsed.hex : null
  const show = (h: string) => (upper ? h.toUpperCase() : h)
  const hasResults = Object.keys(results).length > 0

  return (
    <div className="space-y-5">
      {/* Mode switch */}
      <div role="tablist" aria-label="What to hash" className="grid grid-cols-2 gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
        {([['text', 'Text', Type], ['file', 'File', FileUp]] as const).map(([m, label, Icon]) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              mode === m ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={15} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <div>
          <label htmlFor="hash-text" className="block text-sm font-medium text-slate-300 mb-1.5">Text to hash</label>
          <textarea
            id="hash-text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste text. Hashes update as you type."
            rows={4}
            spellCheck={false}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
          />
          <p className="text-xs text-slate-500 mt-1">Hashed as UTF-8 bytes, exactly as typed (no trailing newline).</p>
        </div>
      ) : (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setDragging(false)
              const f = e.dataTransfer.files?.[0]
              if (f) hashFile(f)
            }}
            className={`border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
              dragging ? 'border-blue-500 bg-blue-950/40' : 'border-slate-700 bg-slate-950'
            }`}
          >
            <FileUp size={26} className="mx-auto text-slate-500 mb-2" aria-hidden="true" />
            <p className="text-slate-300 text-sm mb-3">Drop a file here, or</p>
            <button
              onClick={() => fileInput.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Choose file
            </button>
            <input
              ref={fileInput}
              type="file"
              className="sr-only"
              aria-label="Choose a file to hash"
              onChange={e => { const f = e.target.files?.[0]; if (f) hashFile(f); e.target.value = '' }}
            />
            <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} aria-hidden="true" /> The file is read by your browser and never uploaded. Up to 2 GB.
            </p>
          </div>
          {file && (
            <p className="text-sm text-slate-400 mt-2 break-all">
              <span className="text-slate-200">{file.name}</span> · {formatBytes(file.size)}
            </p>
          )}
          {busy && (
            <div className="mt-3" aria-live="polite">
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
                <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Hashing… {Math.round(progress * 100)}%
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      {/* Results */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg divide-y divide-slate-800" aria-live="polite">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs text-slate-400 uppercase tracking-wide">Hashes (hex)</span>
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} className="accent-blue-500 w-3.5 h-3.5" />
            Uppercase
          </label>
        </div>
        {ALGORITHMS.map(a => {
          const h = results[a]
          const highlighted = parsed?.algorithm === a && match !== null
          return (
            <div key={a} className={`px-4 py-3 ${highlighted ? (match ? 'bg-emerald-950/50' : 'bg-red-950/40') : ''}`}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-sm font-semibold text-slate-200">
                  {a} <span className="font-normal text-xs text-slate-500">· {NOTES[a]}</span>
                </span>
                {h && <CopyButton text={show(h)} />}
              </div>
              <p className={`font-mono text-sm break-all ${h ? 'text-emerald-400 select-all' : 'text-slate-600'}`}>
                {h ? show(h) : mode === 'file' ? 'Choose a file to see its hash' : 'Type something to see its hash'}
              </p>
            </div>
          )
        })}
      </div>

      {/* Checksum comparison */}
      <div>
        <label htmlFor="expected" className="block text-sm font-medium text-slate-300 mb-1.5">
          Verify a checksum <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="expected"
          value={expected}
          onChange={e => setExpected(e.target.value)}
          placeholder="Paste the checksum from the download page"
          spellCheck={false}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-2 text-sm" aria-live="polite">
          {expected.trim() && !parsed && (
            <p className="text-amber-400">That doesn&apos;t look like an MD5, SHA-1, SHA-256, SHA-384 or SHA-512 checksum.</p>
          )}
          {parsed && !hasResults && (
            <p className="text-slate-400">Detected a {parsed.algorithm} checksum. Now add the {mode === 'file' ? 'file' : 'text'} to compare.</p>
          )}
          {match === true && (
            <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 size={16} aria-hidden="true" /> Match: the {parsed!.algorithm} checksum is identical.
            </p>
          )}
          {match === false && (
            <p className="flex items-center gap-1.5 text-red-400 font-medium">
              <XCircle size={16} aria-hidden="true" /> No match: the {parsed!.algorithm} checksum is different. Don&apos;t trust this {mode === 'file' ? 'file' : 'input'}.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
