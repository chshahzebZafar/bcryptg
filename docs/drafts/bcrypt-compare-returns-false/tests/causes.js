// Reproduces every "bcrypt compare returns false" cause used in the article, against both
// the native `bcrypt` package and `bcryptjs`. Prints observed behaviour, not assumptions.
const native = require('bcrypt')
const js = require('bcryptjs')

const pw = 'correct horse battery staple'
const libs = { bcrypt: native, bcryptjs: js }

async function attempt(label, fn) {
  try {
    const r = await fn()
    console.log(`  ${label}: returned ${typeof r === 'object' ? Object.prototype.toString.call(r) : JSON.stringify(r)}`)
  } catch (e) {
    console.log(`  ${label}: THREW ${e.constructor.name}: ${e.message}`)
  }
}

;(async () => {
  for (const [name, b] of Object.entries(libs)) {
    console.log(`\n=== ${name} ${require(`./node_modules/${name}/package.json`).version}`)
    const hash = await b.hash(pw, 10)

    console.log('0. sanity: compare(right password, fresh hash)')
    await attempt('compare', () => b.compare(pw, hash))

    console.log('1. comparing two hashes of the same password as strings')
    const hash2 = await b.hash(pw, 10)
    await attempt('hash === hash2', () => hash === hash2)

    console.log('2. hash re-hashed on save (double hashing)')
    const doubled = await b.hash(hash, 10)
    await attempt('compare(pw, hash(hash(pw)))', () => b.compare(pw, doubled))
    await attempt('compare(storedHash, doubled)', () => b.compare(hash, doubled))

    console.log('3. arguments swapped: compare(hash, password)')
    await attempt('compare(hash, pw)', () => b.compare(hash, pw))

    console.log('4. missing await')
    const notAwaited = b.compare(pw, hash)
    await attempt('notAwaited === true', () => notAwaited === true)
    await attempt('Boolean(notAwaited) with WRONG password', () => Boolean(b.compare('wrong', hash)))
    await notAwaited

    console.log('5. truncated hash (VARCHAR(50))')
    await attempt('compare(pw, hash.slice(0,50))', () => b.compare(pw, hash.slice(0, 50)))
    await attempt('compare(pw, hash.slice(0,59))', () => b.compare(pw, hash.slice(0, 59)))

    console.log('6. trailing newline / whitespace on the stored hash')
    await attempt('compare(pw, hash + "\\n")', () => b.compare(pw, hash + '\n'))
    await attempt('compare(pw, " " + hash)', () => b.compare(pw, ' ' + hash))
    console.log('   ... and on the password')
    await attempt('compare(pw + "\\n", hash)', () => b.compare(pw + '\n', hash))
    await attempt('compare(pw + " ", hash)', () => b.compare(pw + ' ', hash))

    console.log('7. hash field not loaded (undefined / null / empty)')
    await attempt('compare(pw, undefined)', () => b.compare(pw, undefined))
    await attempt('compare(pw, null)', () => b.compare(pw, null))
    await attempt('compare(pw, "")', () => b.compare(pw, ''))

    console.log('8. different pre-processing (pepper / lowercase / SHA-256 pre-hash on one side only)')
    const crypto = require('crypto')
    const peppered = await b.hash(pw + 'PEPPER', 10)
    await attempt('compare(pw, hash(pw+pepper))', () => b.compare(pw, peppered))
    const prehashed = await b.hash(crypto.createHash('sha256').update(pw).digest('hex'), 10)
    await attempt('compare(pw, hash(sha256hex(pw)))', () => b.compare(pw, prehashed))

    console.log('9. MYTH: cost must match. Hash at cost 4, 10, 12; compare never takes a cost')
    for (const c of [4, 12]) {
      const h = await b.hash(pw, c)
      await attempt(`cost ${c}: compare(pw, h)`, () => b.compare(pw, h))
    }

    console.log('10. bytes > 72')
    const long = 'a'.repeat(72)
    const hLong = await b.hash(long, 10)
    await attempt('compare(72 a + "EXTRA", hash(72 a))', () => b.compare(long + 'EXTRA', hLong))

    console.log('11. cross-version prefixes ($2a$ / $2y$ written by other systems)')
    await attempt('compare(pw, hash with $2a$)', () => b.compare(pw, hash.replace(/^\$2b\$/, '$2a$')))
    await attempt('compare(pw, hash with $2y$)', () => b.compare(pw, hash.replace(/^\$2b\$/, '$2y$')))
  }

  console.log('\n=== cross-library')
  const hNative = await native.hash(pw, 10)
  const hJs = await js.hash(pw, 10)
  await attempt('bcryptjs.compare(pw, nativeHash)', () => js.compare(pw, hNative))
  await attempt('bcrypt.compare(pw, bcryptjsHash)', () => native.compare(pw, hJs))
})()
