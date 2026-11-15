'use client'
import { useMemo, useState } from 'react'
import { encode } from 'uqr'
import { Eye, EyeOff, Download, Printer, AlertTriangle, Wifi } from 'lucide-react'
import { matrixToSvg, wifiPayload, wifiWarnings, type WifiSecurity } from '@/lib/wifi'

const SECURITY: { value: WifiSecurity; label: string }[] = [
  { value: 'WPA', label: 'WPA / WPA2 / WPA3 (most networks)' },
  { value: 'WEP', label: 'WEP (old)' },
  { value: 'nopass', label: 'None (open network)' },
]

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const fileSafe = (s: string) => s.replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^-+|-+$/g, '') || 'network'

export function WifiQrGenerator() {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [security, setSecurity] = useState<WifiSecurity>('WPA')
  const [hidden, setHidden] = useState(false)
  const [show, setShow] = useState(false)
  const [printPassword, setPrintPassword] = useState(true)

  const config = { ssid, password, security, hidden }
  const warnings = wifiWarnings(config)
  const ready = ssid.length > 0 && (security === 'nopass' || password.length > 0)

  // UTF-8 bytes so names and passwords with accents or emoji encode correctly
  const qr = useMemo(() => {
    if (!ready) return null
    const payload = wifiPayload({ ssid, password, security, hidden })
    return encode(Array.from(new TextEncoder().encode(payload)), { ecc: 'M', border: 4 })
  }, [ready, ssid, password, security, hidden])

  const svg = qr ? matrixToSvg(qr.data) : ''

  function downloadPng() {
    if (!qr) return
    const scale = 16
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = qr.size * scale
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    qr.data.forEach((row, y) => row.forEach((dark, x) => { if (dark) ctx.fillRect(x * scale, y * scale, scale, scale) }))
    canvas.toBlob(b => b && download(`wifi-${fileSafe(ssid)}.png`, b), 'image/png')
  }

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="wifi-ssid" className="block text-sm font-medium text-slate-300 mb-1.5">Network name (SSID)</label>
          <input
            id="wifi-ssid"
            value={ssid}
            onChange={e => setSsid(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. Home-WiFi"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="wifi-security" className="block text-sm font-medium text-slate-300 mb-1.5">Security</label>
          <select
            id="wifi-security"
            value={security}
            onChange={e => setSecurity(e.target.value as WifiSecurity)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm"
          >
            {SECURITY.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {security !== 'nopass' && (
          <div>
            <label htmlFor="wifi-pw" className="block text-sm font-medium text-slate-300 mb-1.5">Wi-Fi password</label>
            <div className="relative">
              <input
                id="wifi-pw"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-12 py-2.5 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)} className="accent-blue-500 w-4 h-4" />
          Hidden network (doesn&apos;t broadcast its name)
        </label>

        {ssid && warnings.length > 0 && (
          <ul className="space-y-1.5" aria-live="polite">
            {warnings.map(w => (
              <li key={w} className="flex items-start gap-2 text-sm text-amber-400">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" aria-hidden="true" /> {w}
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-slate-500">
          The QR code is made in your browser. Your network name and password are never sent to a server.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 md:w-64">
        {/* Printable card: the print stylesheet shows only this element */}
        <div id="wifi-card" className="bg-white rounded-xl p-4 w-full max-w-64 text-center text-slate-900">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold mb-2">
            <Wifi size={16} aria-hidden="true" /> Wi-Fi
          </div>
          {qr ? (
            <div
              role="img"
              aria-label={`QR code to join the Wi-Fi network ${ssid}`}
              className="mx-auto w-full max-w-56 aspect-square [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="mx-auto w-full max-w-56 aspect-square border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-500 px-4">
              Enter your network name{security !== 'nopass' ? ' and password' : ''} to create the QR code
            </div>
          )}
          {qr && (
            <div className="mt-2 text-xs leading-relaxed">
              <p className="break-all"><span className="text-slate-500">Network:</span> <strong>{ssid}</strong></p>
              {security !== 'nopass' && printPassword && (
                <p className="break-all"><span className="text-slate-500">Password:</span> <span className="font-mono">{password}</span></p>
              )}
              <p className="text-slate-500 mt-1">Scan with your phone camera to connect</p>
            </div>
          )}
        </div>

        {security !== 'nopass' && (
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer self-start md:self-center">
            <input type="checkbox" checked={printPassword} onChange={e => setPrintPassword(e.target.checked)} className="accent-blue-500 w-3.5 h-3.5" />
            Show password on the card
          </label>
        )}

        <div className="grid grid-cols-3 gap-2 w-full">
          <button
            onClick={downloadPng}
            disabled={!qr}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium px-2 py-2 rounded-lg cursor-pointer"
          >
            <Download size={14} aria-hidden="true" /> PNG
          </button>
          <button
            onClick={() => qr && download(`wifi-${fileSafe(ssid)}.svg`, new Blob([svg], { type: 'image/svg+xml' }))}
            disabled={!qr}
            className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-100 text-sm font-medium px-2 py-2 rounded-lg cursor-pointer"
          >
            <Download size={14} aria-hidden="true" /> SVG
          </button>
          <button
            onClick={() => window.print()}
            disabled={!qr}
            className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-100 text-sm font-medium px-2 py-2 rounded-lg cursor-pointer"
          >
            <Printer size={14} aria-hidden="true" /> Print
          </button>
        </div>
      </div>
    </div>
  )
}
