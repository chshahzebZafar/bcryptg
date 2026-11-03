import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// --- article: what you CAN read from a hash ---
const hash = '$2b$12$RB2qR6GI4quP.PUs6xR5He37dCyunLcYFzlvUfwSX41XkRXgOQ3OS'
const [, version, cost, rest] = hash.split('$')
console.log({ version, cost: Number(cost), salt: rest.slice(0, 22), checksum: rest.slice(22) })
// --- article: check a guess ---
const bcrypt = require('bcryptjs')
console.log(await bcrypt.compare('correct horse battery staple', hash)) // true
console.log(await bcrypt.compare('password123', hash))                  // false
