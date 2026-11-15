// Breached-password check against Have I Been Pwned's Pwned Passwords range API using
// k-anonymity: only the first 5 characters of the password's SHA-1 hash leave the device.
// The API returns every hash suffix sharing that prefix (plus random padding), and the
// match happens locally. Plain TypeScript so it runs in the browser and in Node tests.

export const RANGE_API = 'https://api.pwnedpasswords.com/range/'

export async function sha1Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

// Count for `suffix` in a range response ("SUFFIX:COUNT" per line). Padding lines have count 0.
export function findCount(body: string, suffix: string): number {
  for (const line of body.split('\n')) {
    const [s, c] = line.trim().split(':')
    if (s === suffix) return Number(c) || 0
  }
  return 0
}

export interface PwnedResult {
  count: number
  prefix: string // the only part of the hash that was sent
  hash: string
  candidates: number // hash suffixes (real and padding) returned for that prefix and compared locally
}

export async function checkPwned(password: string, fetchImpl: typeof fetch = fetch): Promise<PwnedResult> {
  const hash = await sha1Hex(password)
  const prefix = hash.slice(0, 5)
  const res = await fetchImpl(RANGE_API + prefix, { headers: { 'Add-Padding': 'true' }, cache: 'no-store' })
  if (!res.ok) throw new Error(`The breach database returned an error (${res.status}). Please try again.`)
  const body = await res.text()
  return { count: findCount(body, hash.slice(5)), prefix, hash, candidates: body.split('\n').filter(l => l.includes(':')).length }
}
