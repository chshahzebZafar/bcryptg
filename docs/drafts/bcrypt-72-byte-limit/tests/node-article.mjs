import { createRequire } from 'module'
const require = createRequire(import.meta.url)
process.env.PASSWORD_PEPPER = 'test-pepper-0123456789abcdef'
const password = 'correct horse battery staple '.repeat(5)
// --- article block ---
const crypto = require('crypto')
const bcrypt = require('bcrypt') // or 'bcryptjs'

// The pepper is a long random secret kept outside the database (env var or secrets manager)
function prepare(password) {
  return crypto.createHmac('sha384', process.env.PASSWORD_PEPPER).update(password, 'utf8').digest('base64')
}

const hash = await bcrypt.hash(prepare(password), 12)
const ok = await bcrypt.compare(prepare(password), hash)
// --- end ---
console.log('node article prehash ok:', ok, '| wrong:', await bcrypt.compare(prepare(password.slice(0, -1)), hash), '| len', prepare(password).length)
