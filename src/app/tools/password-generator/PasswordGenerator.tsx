'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, KeyRound, Loader2 } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import { SecurityBadge } from '@/components/ui/SecurityBadge'
import {
  DEFAULT_SYMBOLS,
  generatePassphrase,
  generatePassword,
  passphraseEntropyBits,
  passwordEntropyBits,
  strengthLabel,
  utf8Bytes,
  type PassphraseOptions,
  type PasswordOptions,
} from '@/lib/password'

type Mode = 'password' | 'passphrase'
const LENGTH_PRESETS = [8, 12, 15, 16, 20, 32]
const COUNTS = [1, 5, 10, 20]
const SEPARATORS = [
  { value: '-', label: 'Hyphen (-)' },
  { value: ' ', label: 'Space' },
  { value: '.', label: 'Dot (.)' },
  { value: '_', label: 'Underscore (_)' },
]

export function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>('password')
  const [pw, setPw] = useState<PasswordOptions>({
    length: 16, lower: true, upper: true, digits: true, symbols: true, symbolSet: DEFAULT_SYMBOLS, excludeAmbiguous: false,
  })
  const [pp, setPp] = useState<PassphraseOptions>({ words: 6, separator: '-', capitalize: true, addNumber: true })
  const [count, setCount] = useState(1)
  const [wordlist, setWordlist] = useState<string[] | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState('')
  const [hash, setHash] = useState('')
  const [hashing, setHashing] = useState(false)

  // The word list (~78 KB) is only downloaded the first time passphrase mode is used
  useEffect(() => {
    if (mode === 'passphrase' && !wordlist) {
      import('@/lib/eff-large-wordlist.json').then(m => setWordlist(m.default as string[]))
    }
  }, [mode, wordlist])

  const generate = useCallback(() => {
    setHash('')
    try {
      if (mode === 'passphrase') {
        if (!wordlist) return
        setResults(Array.from({ length: count }, () => generatePassphrase(pp, wordlist)))
      } else {
        setResults(Array.from({ length: count }, () => generatePassword(pw)))
      }
      setError('')
    } catch (e) {
      setResults([])
      setError(e instanceof Error ? e.message : 'Could not generate a password')
    }
  }, [mode, pw, pp, count, wordlist])

  // Generate on the client only, so nothing random is rendered on the server
  useEffect(() => { generate() }, [generate])

  async function hashFirst() {
    if (!results[0]) return
    setHashing(true)
    try {
      const { generateHash } = await import('@/lib/bcrypt')
      setHash(await generateHash(results[0], 12))
    } finally {
      setHashing(false)
    }
  }

  const bits = mode === 'passphrase' ? passphraseEntropyBits(pp, wordlist?.length ?? 7776) : passwordEntropyBits(pw)
  const strength = strengthLabel(bits)
  const first = results[0] ?? ''
  const bytes = first ? utf8Bytes(first) : 0

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        mode === m ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  )

  const check = (key: 'lower' | 'upper' | 'digits' | 'symbols' | 'excludeAmbiguous', label: string) => (
    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
      <input
        type="checkbox"
        checked={Boolean(pw[key])}
        onChange={e => setPw({ ...pw, [key]: e.target.checked })}
        className="accent-blue-500 w-4 h-4"
      />
      {label}
    </label>
  )

  return (
    <div className="space-y-5">
      <SecurityBadge />

      <div role="tablist" aria-label="Generator type" className="flex gap-1 p-1 bg-slate-800 border border-slate-700 rounded-lg">
        {tab('password', 'Random password')}
        {tab('passphrase', 'Passphrase (words)')}
      </div>

      {/* Result */}
      <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
        {results.length <= 1 ? (
          <div className="flex items-start justify-between gap-3">
            <p className="hash-output text-emerald-400 text-lg leading-relaxed min-h-7 break-all select-all" aria-live="polite">
              {first || (mode === 'passphrase' && !wordlist ? 'Loading word list…' : '')}
            </p>
            {first && <CopyButton text={first} className="shrink-0" />}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-end"><CopyButton text={results.join('\n')} /></div>
            <ul className="space-y-1.5">
              {results.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border-b border-slate-800 last:border-0 pb-1.5">
                  <span className="hash-output text-emerald-400 text-sm break-all select-all">{r}</span>
                  <CopyButton text={r} className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {first && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-400">
            <span>Strength: <strong className={strength.color}>{strength.label}</strong></span>
            <span>Entropy: <strong className="text-slate-200">{Math.round(bits)} bits</strong></span>
            <span>Length: <strong className="text-slate-200">{[...first].length} characters</strong></span>
            <span className={bytes > 72 ? 'text-amber-400' : ''}>
              {bytes > 72 ? `${bytes} bytes: over bcrypt's 72-byte limit` : 'Fits bcrypt’s 72-byte limit'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw size={16} /> Generate new
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          How many
          <select
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-md px-2 py-2 text-slate-100"
          >
            {COUNTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {/* Options */}
      {mode === 'password' ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="pw-length" className="text-sm font-medium text-slate-300">Length</label>
              <input
                type="number"
                min={4}
                max={128}
                value={pw.length}
                onChange={e => setPw({ ...pw, length: Math.min(128, Math.max(4, Number(e.target.value) || 4)) })}
                aria-label="Password length"
                className="w-20 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-100 text-sm font-mono"
              />
            </div>
            <input
              id="pw-length"
              type="range"
              min={8}
              max={64}
              value={Math.min(64, pw.length)}
              onChange={e => setPw({ ...pw, length: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {LENGTH_PRESETS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPw({ ...pw, length: n })}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono border cursor-pointer ${
                    pw.length === n ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {n} characters
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {check('upper', 'Uppercase (A–Z)')}
            {check('lower', 'Lowercase (a–z)')}
            {check('digits', 'Numbers (0–9)')}
            {check('symbols', 'Symbols')}
            <div className="col-span-2">{check('excludeAmbiguous', 'Avoid look-alikes (I l 1 O 0 o)')}</div>
          </div>
          {pw.symbols && (
            <div>
              <label htmlFor="pw-symbols" className="block text-sm font-medium text-slate-300 mb-1.5">Symbols to use</label>
              <input
                id="pw-symbols"
                type="text"
                value={pw.symbolSet}
                onChange={e => setPw({ ...pw, symbolSet: e.target.value })}
                spellCheck={false}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">Edit this if a site only accepts certain special characters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="pp-words" className="text-sm font-medium text-slate-300">Number of words</label>
              <span className="text-xs font-mono text-blue-400">{pp.words}</span>
            </div>
            <input
              id="pp-words"
              type="range"
              min={3}
              max={10}
              value={pp.words}
              onChange={e => setPp({ ...pp, words: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Separator
              <select
                value={pp.separator}
                onChange={e => setPp({ ...pp, separator: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-slate-100"
              >
                {SEPARATORS.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={pp.capitalize} onChange={e => setPp({ ...pp, capitalize: e.target.checked })} className="accent-blue-500 w-4 h-4" />
              Capitalise words
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={pp.addNumber} onChange={e => setPp({ ...pp, addNumber: e.target.checked })} className="accent-blue-500 w-4 h-4" />
              Add a number
            </label>
          </div>
          <p className="text-xs text-slate-500">
            Words come from the <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">EFF large word list</a> (7,776 words, CC BY 3.0 US).
          </p>
        </div>
      )}

      {/* Developer extra: bcrypt hash of the generated password */}
      {first && results.length === 1 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-300">
              <strong className="text-slate-100">For developers:</strong> get a bcrypt hash of this password to seed an admin account or test fixture.
            </p>
            <button
              type="button"
              onClick={hashFirst}
              disabled={hashing}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-60 text-slate-100 text-sm font-medium px-3 py-1.5 rounded-md border border-slate-600 cursor-pointer"
            >
              {hashing ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
              {hashing ? 'Hashing…' : 'Hash with bcrypt (cost 12)'}
            </button>
          </div>
          {hash && (
            <div className="flex items-start justify-between gap-3">
              <p className="hash-output text-emerald-300 text-sm break-all select-all">{hash}</p>
              <CopyButton text={hash} className="shrink-0" />
            </div>
          )}
          {hash && (
            <p className="text-xs text-slate-500">
              Using Laravel? Change the first four characters to <code className="text-slate-300">$2y$</code> (<Link href="/blog/bcrypt-php-tutorial" className="underline hover:text-slate-300">why</Link>). Check it any time with the <Link href="/verify" className="underline hover:text-slate-300">bcrypt checker</Link>.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
