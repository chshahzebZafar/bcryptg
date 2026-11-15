// General-purpose hashing for text and files: MD5 (implemented here, Web Crypto has none)
// plus SHA-1/256/384/512 via crypto.subtle. Plain TypeScript with no imports so it runs
// in the browser and directly in Node for tests.

export const ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
export type Algorithm = (typeof ALGORITHMS)[number]

// Hex length of each digest, used to recognise a pasted checksum
export const HEX_LENGTH: Record<Algorithm, number> = {
  'MD5': 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-384': 96, 'SHA-512': 128,
}

const S = Int32Array.of(
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
)
const K = Int32Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0)

// Message word used in each of the 64 steps
const G = Int32Array.from({ length: 64 }, (_, i) =>
  i < 16 ? i : i < 32 ? (5 * i + 1) % 16 : i < 48 ? (3 * i + 5) % 16 : (7 * i) % 16)

// Incremental MD5 (RFC 1321): feed data in chunks with update(), then call hex().
// Reads 64-byte blocks straight from the input and stores a 64-bit bit length,
// so it handles files of any size without copying them.
export class Md5 {
  private state = new Int32Array([0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476])
  private M = new Int32Array(16)
  private pending = new Uint8Array(64)
  private pendingLen = 0
  private total = 0

  update(bytes: Uint8Array): this {
    this.total += bytes.length
    let off = 0
    if (this.pendingLen > 0) {
      const take = Math.min(64 - this.pendingLen, bytes.length)
      this.pending.set(bytes.subarray(0, take), this.pendingLen)
      this.pendingLen += take
      off = take
      if (this.pendingLen < 64) return this
      this.block(this.pending, 0)
      this.pendingLen = 0
    }
    const full = off + Math.floor((bytes.length - off) / 64) * 64
    for (; off < full; off += 64) this.block(bytes, off)
    this.pending.set(bytes.subarray(full))
    this.pendingLen = bytes.length - full
    return this
  }

  hex(): string {
    // Final block(s): pending bytes, 0x80, zero padding, 64-bit little-endian bit length
    const rest = this.pendingLen
    const tail = new Uint8Array(rest < 56 ? 64 : 128)
    tail.set(this.pending.subarray(0, rest))
    tail[rest] = 0x80
    const tv = new DataView(tail.buffer)
    const bits = this.total * 8
    tv.setUint32(tail.length - 8, bits >>> 0, true)
    tv.setUint32(tail.length - 4, Math.floor(bits / 2 ** 32), true)
    for (let off = 0; off < tail.length; off += 64) this.block(tail, off)

    const out = new Uint8Array(16)
    const ov = new DataView(out.buffer)
    this.state.forEach((w, i) => ov.setInt32(i * 4, w, true))
    return toHex(out)
  }

  private block(b: Uint8Array, o: number) {
    const M = this.M, state = this.state
    for (let i = 0; i < 16; i++, o += 4) M[i] = b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)
    let A = state[0], B = state[1], C = state[2], D = state[3], t = 0, i = 0
    for (; i < 16; i++) {
      t = (((B & C) | (~B & D)) + A + K[i] + M[G[i]]) | 0
      A = D; D = C; C = B; B = (B + ((t << S[i]) | (t >>> (32 - S[i])))) | 0
    }
    for (; i < 32; i++) {
      t = (((D & B) | (~D & C)) + A + K[i] + M[G[i]]) | 0
      A = D; D = C; C = B; B = (B + ((t << S[i]) | (t >>> (32 - S[i])))) | 0
    }
    for (; i < 48; i++) {
      t = ((B ^ C ^ D) + A + K[i] + M[G[i]]) | 0
      A = D; D = C; C = B; B = (B + ((t << S[i]) | (t >>> (32 - S[i])))) | 0
    }
    for (; i < 64; i++) {
      t = ((C ^ (B | ~D)) + A + K[i] + M[G[i]]) | 0
      A = D; D = C; C = B; B = (B + ((t << S[i]) | (t >>> (32 - S[i])))) | 0
    }
    state[0] = (state[0] + A) | 0; state[1] = (state[1] + B) | 0
    state[2] = (state[2] + C) | 0; state[3] = (state[3] + D) | 0
  }
}

export function md5(bytes: Uint8Array): string {
  return new Md5().update(bytes).hex()
}

// MD5 of a large buffer in slices, yielding to the browser between slices so the
// page stays responsive and can show progress. onProgress receives 0..1.
export async function md5Chunked(bytes: Uint8Array, onProgress?: (p: number) => void, slice = 4 * 1024 * 1024): Promise<string> {
  const h = new Md5()
  for (let off = 0; off < bytes.length; off += slice) {
    h.update(bytes.subarray(off, off + slice))
    onProgress?.(Math.min(1, (off + slice) / bytes.length))
    await new Promise(r => setTimeout(r, 0))
  }
  return h.hex()
}

export function toHex(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += b.toString(16).padStart(2, '0')
  return s
}

export async function digestHex(algorithm: Algorithm, bytes: Uint8Array): Promise<string> {
  if (algorithm === 'MD5') return md5(bytes)
  return toHex(new Uint8Array(await crypto.subtle.digest(algorithm, bytes as BufferSource)))
}

export async function hashAll(bytes: Uint8Array): Promise<Record<Algorithm, string>> {
  const entries = await Promise.all(ALGORITHMS.map(async a => [a, await digestHex(a, bytes)] as const))
  return Object.fromEntries(entries) as Record<Algorithm, string>
}

// Pull a checksum out of whatever the user pasted: a bare hash, `sha256sum` output
// ("<hash>  file.iso"), PowerShell's uppercase hex, OpenSSL's "SHA256(file)= <hash>",
// or hex split by spaces or colons. Returns lowercase hex and the algorithm its length implies.
export function parseChecksum(input: string): { hex: string; algorithm: Algorithm } | null {
  const lengths = Object.values(HEX_LENGTH)
  const byLength = (hex: string) => ALGORITHMS.find(a => HEX_LENGTH[a] === hex.length)
  const tokens = input.match(/[0-9a-fA-F]+/g) ?? []
  const token = tokens.filter(t => lengths.includes(t.length)).sort((x, y) => y.length - x.length)[0]
  if (token) return { hex: token.toLowerCase(), algorithm: byLength(token)! }
  const joined = input.replace(/[\s:]/g, '')
  if (/^[0-9a-fA-F]+$/.test(joined) && lengths.includes(joined.length)) {
    return { hex: joined.toLowerCase(), algorithm: byLength(joined)! }
  }
  return null
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} bytes`
  const units = ['KB', 'MB', 'GB']
  let v = n / 1024, i = 0
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`
}
