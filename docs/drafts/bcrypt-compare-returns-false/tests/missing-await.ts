import bcrypt from 'bcryptjs'
export async function login(password: string, passwordHash: string) {
  const ok = bcrypt.compare(password, passwordHash) // missing await
  if (ok === true) { return 'never' }
  if (bcrypt.compare(password, passwordHash)) { return 'always' }
  return 'no'
}
