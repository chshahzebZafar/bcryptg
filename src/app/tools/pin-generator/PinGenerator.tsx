'use client'
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import { generatePin, pinCount, MIN_PIN, MAX_PIN } from '@/lib/pin'

const PRESETS = [4, 6, 8]
const COUNTS = [1, 5, 10, 20]

export function PinGenerator() {
  const [length, setLength] = useState(4)
  const [count, setCount] = useState(1)
  const [avoid, setAvoid] = useState(true)
  const [pins, setPins] = useState<string[]>([])

  const generate = useCallback(() => {
    setPins(Array.from({ length: count }, () => generatePin(length, avoid)))
  }, [length, count, avoid])

  // Generated in the browser after load, so the server never renders a PIN
  useEffect(() => { generate() }, [generate])

  const possible = pinCount(length, avoid)

  return (
    <div className="space-y-5">
      <div aria-live="polite">
        {pins.length <= 1 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex items-center justify-between gap-4 min-h-[88px]">
            <span className="font-mono text-4xl sm:text-5xl tracking-[0.3em] text-emerald-400 select-all break-all">
              {pins[0] ?? ' '}
            </span>
            {pins[0] && <CopyButton text={pins[0]} />}
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wide">{pins.length} PINs</span>
              <CopyButton text={pins.join('\n')} />
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
              {pins.map((p, i) => (
                <li key={i} className="font-mono text-lg tracking-widest text-emerald-400 select-all">{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={generate}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
      >
        <RefreshCw size={16} aria-hidden="true" /> Generate new {count > 1 ? 'PINs' : 'PIN'}
      </button>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <span id="pin-length-label" className="block text-sm font-medium text-slate-300 mb-1.5">Number of digits</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="pin-length-label">
            {PRESETS.map(n => (
              <button
                key={n}
                onClick={() => setLength(n)}
                aria-pressed={length === n}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                  length === n ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-400">
              Custom
              <input
                type="number"
                min={MIN_PIN}
                max={MAX_PIN}
                value={length}
                onChange={e => {
                  const n = Math.round(Number(e.target.value))
                  if (n >= MIN_PIN && n <= MAX_PIN) setLength(n)
                }}
                className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-100 text-sm font-mono"
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="pin-count" className="block text-sm font-medium text-slate-300 mb-1.5">How many</label>
          <select
            id="pin-count"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm"
          >
            {COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer">
        <input type="checkbox" checked={avoid} onChange={e => setAvoid(e.target.checked)} className="accent-blue-500 w-4 h-4 mt-0.5" />
        <span>
          Skip easy-to-guess patterns
          <span className="block text-xs text-slate-500">Repeated digits (0000), runs (1234, 9876) and repeated groups (1212)</span>
        </span>
      </label>

      <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
        {possible.toLocaleString('en-US')} possible {length}-digit PINs with these settings. Each digit comes from your browser&apos;s
        cryptographically secure random number generator; nothing is sent to a server or saved.
      </p>
    </div>
  )
}
