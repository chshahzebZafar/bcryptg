const native = require('bcrypt'), js = require('bcryptjs'), crypto = require('crypto')
const a72 = 'a'.repeat(72), long = a72 + 'EXTRA', emoji = '🔐'.repeat(19)
;(async () => {
  console.log('emoji chars/bytes:', [...emoji].length, Buffer.byteLength(emoji, 'utf8'), '| JS .length:', emoji.length)
  for (const [n, b] of Object.entries({ bcrypt: native, bcryptjs: js })) {
    const h = await b.hash(a72, 4)
    console.log(n, 'hash(77 bytes) ok:', (await b.hash(long, 4)).slice(0, 7), '| compare(77, hash of 72):', await b.compare(long, h))
  }
  console.log('bcryptjs.truncates(72 a):', js.truncates(a72), '| truncates(77):', js.truncates(long), '| truncates(19 emoji):', js.truncates(emoji))
  // --- article: length check ---
  function assertBcryptLength(password) {
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new Error('Password must be 72 bytes or fewer')
    }
  }
  for (const p of [a72, long, emoji]) { try { assertBcryptLength(p); console.log('check ok', Buffer.byteLength(p)) } catch (e) { console.log('check rejected', Buffer.byteLength(p)) } }
  // --- article: pre-hash with a pepper ---
  const pepper = process.env.PASSWORD_PEPPER ?? 'demo-pepper-from-secret-store'
  function prepare(password) {
    return crypto.createHmac('sha384', pepper).update(password, 'utf8').digest('base64')
  }
  const longPass = 'correct horse battery staple '.repeat(5) // 145 bytes
  const ph = await native.hash(prepare(longPass), 12)
  console.log('prehash length:', prepare(longPass).length, '| verify long:', await native.compare(prepare(longPass), ph), '| verify long minus last char:', await native.compare(prepare(longPass.slice(0, -1)), ph))
})()
