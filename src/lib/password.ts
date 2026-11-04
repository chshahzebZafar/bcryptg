// Password and passphrase generation using the Web Crypto CSPRNG.
// Plain TypeScript with no imports so it runs in the browser and in Node's test runner.

export const LOWER = 'abcdefghijklmnopqrstuvwxyz'
export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const DIGITS = '0123456789'
export const DEFAULT_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/~'
// Characters that are easy to confuse when read or typed by hand
export const AMBIGUOUS = 'Il1O0o'

export interface PasswordOptions {
  length: number
  lower: boolean
  upper: boolean
  digits: boolean
  symbols: boolean
  symbolSet?: string
  excludeAmbiguous?: boolean
}

export interface PassphraseOptions {
  words: number
  separator: string
  capitalize: boolean
  addNumber: boolean
}

// Uniform integer in [0, max) with rejection sampling, so there is no modulo bias.
export function randomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) throw new RangeError('max must be 1..2^32')
  const limit = 2 ** 32 - (2 ** 32 % max)
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) return buf[0] % max
  }
}

function unique(chars: string): string {
  return [...new Set(chars)].join('')
}

export function characterGroups(opts: PasswordOptions): string[] {
  const strip = (s: string) => (opts.excludeAmbiguous ? [...s].filter(c => !AMBIGUOUS.includes(c)).join('') : s)
  const groups: string[] = []
  if (opts.lower) groups.push(strip(LOWER))
  if (opts.upper) groups.push(strip(UPPER))
  if (opts.digits) groups.push(strip(DIGITS))
  if (opts.symbols) groups.push(strip(unique(opts.symbolSet ?? DEFAULT_SYMBOLS).replace(/\s/g, '')))
  return groups.filter(g => g.length > 0)
}

// Random password that contains at least one character from every selected group.
// Candidates missing a group are discarded and redrawn, which keeps every valid
// password equally likely (forcing characters into fixed positions would not).
export function generatePassword(opts: PasswordOptions): string {
  const groups = characterGroups(opts)
  if (groups.length === 0) throw new Error('Select at least one character type')
  if (opts.length < groups.length) throw new Error(`Length must be at least ${groups.length}`)
  const pool = unique(groups.join(''))
  for (;;) {
    let out = ''
    for (let i = 0; i < opts.length; i++) out += pool[randomInt(pool.length)]
    if (groups.every(g => [...out].some(c => g.includes(c)))) return out
  }
}

export function passwordEntropyBits(opts: PasswordOptions): number {
  const pool = unique(characterGroups(opts).join('')).length
  return pool > 1 ? opts.length * Math.log2(pool) : 0
}

export function generatePassphrase(opts: PassphraseOptions, wordlist: readonly string[]): string {
  if (opts.words < 1) throw new Error('Choose at least one word')
  const words = Array.from({ length: opts.words }, () => {
    const w = wordlist[randomInt(wordlist.length)]
    return opts.capitalize ? w[0].toUpperCase() + w.slice(1) : w
  })
  if (opts.addNumber) {
    const i = randomInt(words.length)
    words[i] = words[i] + String(randomInt(10))
  }
  return words.join(opts.separator)
}

export function passphraseEntropyBits(opts: PassphraseOptions, wordlistSize: number): number {
  let bits = opts.words * Math.log2(wordlistSize)
  if (opts.addNumber) bits += Math.log2(10) + Math.log2(opts.words)
  return bits
}

export function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 50) return { label: 'Weak', color: 'text-red-400' }
  if (bits < 70) return { label: 'Fair', color: 'text-amber-400' }
  if (bits < 100) return { label: 'Strong', color: 'text-emerald-400' }
  return { label: 'Very strong', color: 'text-emerald-300' }
}

export function utf8Bytes(s: string): number {
  return new TextEncoder().encode(s).length
}
