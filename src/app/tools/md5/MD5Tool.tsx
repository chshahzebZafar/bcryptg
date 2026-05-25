'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'

function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  function md5blks(s: string) {
    const nblk = ((s.length + 8) >> 6) + 1
    const blks = new Array(nblk * 16).fill(0)
    for (let i = 0; i < s.length; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8)
    blks[s.length >> 2] |= 0x80 << ((s.length % 4) * 8)
    blks[nblk * 16 - 2] = s.length * 8
    return blks
  }
  const x = md5blks(input)
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < x.length; i += 16) {
    const [olda, oldb, oldc, oldd] = [a, b, c, d]
    a = md5ff(a, b, c, d, x[i], 7, -680876936); d = md5ff(d, a, b, c, x[i+1], 12, -389564586)
    c = md5ff(c, d, a, b, x[i+2], 17, 606105819); b = md5ff(b, c, d, a, x[i+3], 22, -1044525330)
    a = md5ff(a, b, c, d, x[i+4], 7, -176418897); d = md5ff(d, a, b, c, x[i+5], 12, 1200080426)
    c = md5ff(c, d, a, b, x[i+6], 17, -1473231341); b = md5ff(b, c, d, a, x[i+7], 22, -45705983)
    a = md5ff(a, b, c, d, x[i+8], 7, 1770035416); d = md5ff(d, a, b, c, x[i+9], 12, -1958414417)
    c = md5ff(c, d, a, b, x[i+10], 17, -42063); b = md5ff(b, c, d, a, x[i+11], 22, -1990404162)
    a = md5ff(a, b, c, d, x[i+12], 7, 1804603682); d = md5ff(d, a, b, c, x[i+13], 12, -40341101)
    c = md5ff(c, d, a, b, x[i+14], 17, -1502002290); b = md5ff(b, c, d, a, x[i+15], 22, 1236535329)
    a = md5gg(a, b, c, d, x[i+1], 5, -165796510); d = md5gg(d, a, b, c, x[i+6], 9, -1069501632)
    c = md5gg(c, d, a, b, x[i+11], 14, 643717713); b = md5gg(b, c, d, a, x[i], 20, -373897302)
    a = md5gg(a, b, c, d, x[i+5], 5, -701558691); d = md5gg(d, a, b, c, x[i+10], 9, 38016083)
    c = md5gg(c, d, a, b, x[i+15], 14, -660478335); b = md5gg(b, c, d, a, x[i+4], 20, -405537848)
    a = md5gg(a, b, c, d, x[i+9], 5, 568446438); d = md5gg(d, a, b, c, x[i+14], 9, -1019803690)
    c = md5gg(c, d, a, b, x[i+3], 14, -187363961); b = md5gg(b, c, d, a, x[i+8], 20, 1163531501)
    a = md5gg(a, b, c, d, x[i+13], 5, -1444681467); d = md5gg(d, a, b, c, x[i+2], 9, -51403784)
    c = md5gg(c, d, a, b, x[i+7], 14, 1735328473); b = md5gg(b, c, d, a, x[i+12], 20, -1926607734)
    a = md5hh(a, b, c, d, x[i+5], 4, -378558); d = md5hh(d, a, b, c, x[i+8], 11, -2022574463)
    c = md5hh(c, d, a, b, x[i+11], 16, 1839030562); b = md5hh(b, c, d, a, x[i+14], 23, -35309556)
    a = md5hh(a, b, c, d, x[i+1], 4, -1530992060); d = md5hh(d, a, b, c, x[i+4], 11, 1272893353)
    c = md5hh(c, d, a, b, x[i+7], 16, -155497632); b = md5hh(b, c, d, a, x[i+10], 23, -1094730640)
    a = md5hh(a, b, c, d, x[i+13], 4, 681279174); d = md5hh(d, a, b, c, x[i], 11, -358537222)
    c = md5hh(c, d, a, b, x[i+3], 16, -722521979); b = md5hh(b, c, d, a, x[i+6], 23, 76029189)
    a = md5hh(a, b, c, d, x[i+9], 4, -640364487); d = md5hh(d, a, b, c, x[i+12], 11, -421815835)
    c = md5hh(c, d, a, b, x[i+15], 16, 530742520); b = md5hh(b, c, d, a, x[i+2], 23, -995338651)
    a = md5ii(a, b, c, d, x[i], 6, -198630844); d = md5ii(d, a, b, c, x[i+7], 10, 1126891415)
    c = md5ii(c, d, a, b, x[i+14], 15, -1416354905); b = md5ii(b, c, d, a, x[i+5], 21, -57434055)
    a = md5ii(a, b, c, d, x[i+12], 6, 1700485571); d = md5ii(d, a, b, c, x[i+3], 10, -1894986606)
    c = md5ii(c, d, a, b, x[i+10], 15, -1051523); b = md5ii(b, c, d, a, x[i+1], 21, -2054922799)
    a = md5ii(a, b, c, d, x[i+8], 6, 1873313359); d = md5ii(d, a, b, c, x[i+15], 10, -30611744)
    c = md5ii(c, d, a, b, x[i+6], 15, -1560198380); b = md5ii(b, c, d, a, x[i+13], 21, 1309151649)
    a = md5ii(a, b, c, d, x[i+4], 6, -145523070); d = md5ii(d, a, b, c, x[i+11], 10, -1120210379)
    c = md5ii(c, d, a, b, x[i+2], 15, 718787259); b = md5ii(b, c, d, a, x[i+9], 21, -343485551)
    a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd)
  }
  const toHex = (n: number) => {
    let hex = ''
    for (let j = 0; j <= 3; j++) hex += ('0' + ((n >> (j * 8 + 4)) & 0x0f).toString(16)).slice(-1) + ('0' + ((n >> (j * 8)) & 0x0f).toString(16)).slice(-1)
    return hex
  }
  return toHex(a) + toHex(b) + toHex(c) + toHex(d)
}

export function MD5Tool() {
  const [input, setInput] = useState('')
  const [hash, setHash] = useState('')

  function handleGenerate() {
    if (!input) return
    setHash(md5(input))
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
