// Random numeric PINs from the Web Crypto CSPRNG, optionally rejecting patterns people
// guess first. Plain TypeScript (the only import is the shared unbiased RNG) so it runs
// in the browser and directly in Node for tests.
import { randomInt } from './password'

export const MIN_PIN = 4
export const MAX_PIN = 12

// All one digit (0000), a run up or down (1234, 9876, 7890), or the same group of
// digits repeated (1212, 123123, 12341234).
export function isPatternPin(pin: string): boolean {
  if (/^(\d)\1+$/.test(pin)) return true
  const d = [...pin].map(Number)
  const steps = d.slice(1).map((x, i) => (x - d[i] + 10) % 10)
  if (steps.every(s => s === 1) || steps.every(s => s === 9)) return true
  for (let size = 1; size <= pin.length / 2; size++) {
    if (pin.length % size === 0 && pin === pin.slice(0, size).repeat(pin.length / size)) return true
  }
  return false
}

export function generatePin(length: number, avoidPatterns: boolean): string {
  if (!Number.isInteger(length) || length < MIN_PIN || length > MAX_PIN) {
    throw new RangeError(`PIN length must be ${MIN_PIN} to ${MAX_PIN} digits`)
  }
  for (;;) {
    let pin = ''
    for (let i = 0; i < length; i++) pin += String(randomInt(10))
    if (!avoidPatterns || !isPatternPin(pin)) return pin
  }
}

// How many PINs the generator can produce with these settings
export function pinCount(length: number, avoidPatterns: boolean): number {
  const total = 10 ** length
  if (!avoidPatterns) return total
  return total - patternCount(length)
}

// Number of pattern PINs of a given length, computed by construction rather than by
// scanning every PIN, so it is instant even for 12 digits.
export function patternCount(length: number): number {
  const set = new Set<string>()
  for (let size = 1; size <= length / 2; size++) {
    if (length % size !== 0) continue
    for (let n = 0; n < 10 ** size; n++) set.add(String(n).padStart(size, '0').repeat(length / size))
  }
  for (let start = 0; start < 10; start++) {
    let up = '', down = ''
    for (let i = 0; i < length; i++) { up += (start + i) % 10; down += (start - i + 100) % 10 }
    set.add(up); set.add(down)
  }
  return set.size
}

export const pinEntropyBits = (length: number, avoidPatterns: boolean) => Math.log2(pinCount(length, avoidPatterns))
