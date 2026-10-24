// Every JS code block from the article, run exactly as published (wrapped in a harness).
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
for (const lib of ['bcryptjs', 'bcrypt']) {
  const bcrypt = require(lib)
  console.log('\n==', lib)
  // Triage 1
  const fresh = await bcrypt.hash('test-password', 10)
  console.log('triage compare:', await bcrypt.compare('test-password', fresh))
  // Triage 2
  const user = { passwordHash: await bcrypt.hash('correct horse battery staple', 12), password: undefined }
  console.log(JSON.stringify(user.passwordHash), user.passwordHash?.length)
  const password = 'correct horse battery staple'
  // Cause 1
  const loginHash = await bcrypt.hash(password, 12)
  let ran = false
  if (loginHash === user.passwordHash) { ran = true }
  console.log('cause1 wrong branch ran:', ran)
  ran = false
  if (await bcrypt.compare(password, user.passwordHash)) { ran = true }
  console.log('cause1 right branch ran:', ran)
  // Cause 4
  const ok = bcrypt.compare(password, user.passwordHash) // missing await
  ran = false
  if (ok === true) { ran = true }
  console.log('cause4 ok===true ran:', ran)
  await ok
  // Cause 7
  const storedHash = '$2y$10$msgE.HWBtwR4B3FzV4PtyOIXGcfpEAr67KdQAZNX3V4tvkd6DZOIy'
  const normalized = storedHash.replace(/^\$2y\$/, '$2b$')
  console.log('cause7 normalized compare:', await bcrypt.compare(password, normalized))
}
