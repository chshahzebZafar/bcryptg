const bcrypt = require('bcrypt')
const pw = 'correct horse battery staple'
const phpHash = process.argv[2]
;(async () => {
  console.log('input prefix:', phpHash.slice(0, 7))
  console.log('bcrypt.compare(pw, phpHash):', await bcrypt.compare(pw, phpHash))
  const normalized = phpHash.replace(/^\$2y\$/, '$2b$')
  console.log('normalized prefix:', normalized.slice(0, 7))
  console.log('bcrypt.compare(pw, normalized):', await bcrypt.compare(pw, normalized))
})()
