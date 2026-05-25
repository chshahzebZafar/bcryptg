'use client'
import bcrypt from 'bcryptjs'

export async function generateHash(password: string, rounds: number): Promise<string> {
  const salt = await bcrypt.genSalt(rounds)
  return bcrypt.hash(password, salt)
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function parseHash(hash: string) {
  const match = hash.match(/^\$2([aby])\$(\d+)\$(.{22})/)
  if (!match) return null
  return {
    version: `$2${match[1]}$`,
    rounds: parseInt(match[2], 10),
    salt: match[3],
  }
}

export function getSecurityRating(rounds: number): { label: string; color: string } {
  if (rounds < 10) return { label: 'Weak', color: 'text-red-400' }
  if (rounds < 12) return { label: 'Fair', color: 'text-amber-400' }
  if (rounds >= 12) return { label: 'Good', color: 'text-emerald-400' }
  return { label: 'Strong', color: 'text-emerald-400' }
}

export function getRoundsLabel(rounds: number): string {
  const labels: Record<number, string> = {
    4: 'Round 4 — Testing only',
    6: 'Round 6 — Not recommended',
    8: 'Round 8 — Below standard',
    10: 'Round 10 — Acceptable',
    11: 'Round 11 — Good',
    12: 'Round 12 — Recommended (OWASP 2026)',
    13: 'Round 13 — Strong',
    14: 'Round 14 — Very Strong (~4s)',
  }
  return labels[rounds] ?? `Round ${rounds}`
}
