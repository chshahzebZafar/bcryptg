import bcrypt from 'bcryptjs'

// Highest cost the in-browser verifier will attempt. bcryptjs is pure JS, so
// each extra round doubles the time; cost 31 would effectively never finish.
export const MAX_VERIFY_ROUNDS = 16

// Approximate time per hash on a modern server. Single source of truth for the
// generator labels and the homepage quick reference (matches the rounds blog post).
export const ROUND_TIMINGS: Record<number, string> = {
  10: '~80ms',
  11: '~150ms',
  12: '~300ms',
  13: '~600ms',
  14: '~1.2s',
  15: '~2.5s',
  16: '~5s',
}

export async function generateHash(password: string, rounds: number): Promise<string> {
  const salt = await bcrypt.genSalt(rounds)
  return bcrypt.hash(password, salt)
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// bcrypt only uses the first 72 bytes (UTF-8) of a password; the rest is ignored.
export function passwordTruncates(password: string): boolean {
  return bcrypt.truncates(password)
}

export function parseHash(hash: string) {
  const match = hash.trim().match(/^\$2([aby])\$(\d{2})\$([./A-Za-z0-9]{22})[./A-Za-z0-9]{31}$/)
  if (!match) return null
  const rounds = parseInt(match[2], 10)
  if (rounds < 4 || rounds > 31) return null
  return {
    version: `$2${match[1]}$`,
    rounds,
    salt: match[3],
  }
}

export function getSecurityRating(rounds: number): { label: string; color: string } {
  if (rounds < 10) return { label: 'Weak', color: 'text-red-400' }
  if (rounds < 12) return { label: 'Fair', color: 'text-amber-400' }
  if (rounds < 14) return { label: 'Good', color: 'text-emerald-400' }
  return { label: 'Strong', color: 'text-emerald-400' }
}

export function getRoundsLabel(rounds: number): string {
  const labels: Record<number, string> = {
    4: 'Testing only',
    6: 'Not recommended',
    8: 'Below standard',
    10: 'OWASP minimum',
    11: 'Good',
    12: 'Recommended default',
    13: 'Strong',
    14: 'Very Strong',
  }
  const label = labels[rounds]
  const time = ROUND_TIMINGS[rounds]
  if (!label) return `Round ${rounds}`
  return `Round ${rounds} — ${label}${time ? ` (${time})` : ''}`
}
