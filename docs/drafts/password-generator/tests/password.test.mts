// Run: node docs/drafts/password-generator/tests/password.test.mts  (Node 24 strips TS types natively)
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as P from '../../../../src/lib/password.ts'

const words: string[] = JSON.parse(readFileSync(new URL('../../../../src/lib/eff-large-wordlist.json', import.meta.url), 'utf8'))
const pass = (m: string) => console.log('  PASS ' + m)

// randomInt uniformity: chi-square over 940k draws, 94 buckets (df=93; 99.9% critical value ~ 140)
{
  const N = 940_000, k = 94, counts = new Array(k).fill(0)
  for (let i = 0; i < N; i++) counts[P.randomInt(k)]++
  const exp = N / k, chi = counts.reduce((a, c) => a + (c - exp) ** 2 / exp, 0)
  assert.ok(chi < 140, `chi-square ${chi}`); pass(`randomInt(94) uniform (chi-square ${chi.toFixed(1)} < 140)`)
  assert.throws(() => P.randomInt(0)); pass('randomInt rejects 0')
}
// defaults & entropy
const full = { length: 16, lower: true, upper: true, digits: true, symbols: true }
{
  const pool = new Set(P.characterGroups(full).join('')).size
  console.log('  INFO default pool size', pool, '| symbols', P.DEFAULT_SYMBOLS.length)
  const bits = P.passwordEntropyBits(full)
  console.log('  INFO 16 chars entropy', bits.toFixed(1), 'bits; 12 chars', P.passwordEntropyBits({ ...full, length: 12 }).toFixed(1), '; 20 chars', P.passwordEntropyBits({ ...full, length: 20 }).toFixed(1))
  console.log('  INFO 6 EFF words', P.passphraseEntropyBits({ words: 6, separator: '-', capitalize: false, addNumber: false }, words.length).toFixed(1), 'bits; 5 words', P.passphraseEntropyBits({ words: 5, separator: '-', capitalize: false, addNumber: false }, words.length).toFixed(1), '; 4 words', P.passphraseEntropyBits({ words: 4, separator: '-', capitalize: false, addNumber: false }, words.length).toFixed(1))
}
// generatePassword guarantees
{
  for (let i = 0; i < 2000; i++) {
    const p = P.generatePassword(full)
    assert.equal(p.length, 16)
    assert.ok(/[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && [...p].some(c => P.DEFAULT_SYMBOLS.includes(c)))
  }
  pass('2000 passwords: length 16, every selected type present')
  for (let i = 0; i < 2000; i++) assert.ok(![...P.generatePassword({ ...full, excludeAmbiguous: true })].some(c => P.AMBIGUOUS.includes(c)))
  pass('excludeAmbiguous never emits Il1O0o')
  for (let i = 0; i < 500; i++) { const p = P.generatePassword({ length: 12, lower: false, upper: false, digits: true, symbols: true, symbolSet: '#!' }); assert.ok(/^[0-9#!]{12}$/.test(p) && /[#!]/.test(p) && /\d/.test(p)) }
  pass('custom symbol set respected')
  assert.match(P.generatePassword({ length: 20, lower: true, upper: true, digits: true, symbols: false }), /^[A-Za-z0-9]{20}$/); pass('no-symbols mode')
  assert.throws(() => P.generatePassword({ length: 8, lower: false, upper: false, digits: false, symbols: false }), /at least one/); pass('no types selected -> error')
  assert.throws(() => P.generatePassword({ ...full, length: 3 }), /at least 4/); pass('length below group count -> error')
  // position uniformity: first character spread over pool (chi-square on 26 lowercase-only)
  const N = 260_000, counts: Record<string, number> = {}
  for (let i = 0; i < N; i++) { const c = P.generatePassword({ length: 1, lower: true, upper: false, digits: false, symbols: false }); counts[c] = (counts[c] ?? 0) + 1 }
  const exp = N / 26, chi = Object.values(counts).reduce((a, c) => a + (c - exp) ** 2 / exp, 0)
  assert.ok(chi < 54, `chi ${chi}`); pass(`single-char draws uniform over a-z (chi-square ${chi.toFixed(1)} < 54)`)
}
// passphrases
{
  const opts = { words: 5, separator: '-', capitalize: true, addNumber: true }
  for (let i = 0; i < 1000; i++) {
    const p = P.generatePassphrase(opts, words)
    const parts = p.split('-')
    assert.ok(parts.length >= 5)
    assert.ok(/[0-9]/.test(p))
    assert.ok(/^[A-Z]/.test(p))
  }
  pass('passphrases: 5 capitalised words with one digit')
  const longest = 6 * 9 + 5
  console.log('  INFO longest possible 6-word passphrase with separator:', longest, 'bytes (bcrypt limit 72)')
  assert.equal(P.utf8Bytes('🔐'), 4); pass('utf8Bytes counts bytes')
}
console.log('ALL PASSED')
