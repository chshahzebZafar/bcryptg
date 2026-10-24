// Real MongoDB (in-memory) test of the two Mongoose causes: re-hashing on save and select:false.
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const pw = 'correct horse battery staple'

function model(name, { guarded, selectFalse }) {
  const schema = new mongoose.Schema({
    email: String,
    displayName: String,
    password: { type: String, select: selectFalse ? false : true },
  })
  schema.pre('save', async function () {
    if (guarded && !this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
  })
  return mongoose.model(name, schema)
}

;(async () => {
  const mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
  console.log('mongoose', mongoose.version)

  for (const guarded of [false, true]) {
    const User = model(guarded ? 'Guarded' : 'Unguarded', { guarded, selectFalse: false })
    const u = await User.create({ email: 'a@example.com', password: pw })
    console.log(`\n${guarded ? 'WITH' : 'WITHOUT'} isModified guard`)
    console.log('  login right after sign-up:', await bcrypt.compare(pw, (await User.findById(u._id)).password))
    const again = await User.findById(u._id)
    again.displayName = 'Ada' // unrelated profile edit
    await again.save()
    console.log('  login after editing displayName:', await bcrypt.compare(pw, (await User.findById(u._id)).password))
  }

  const Hidden = model('Hidden', { guarded: true, selectFalse: true })
  const h = await Hidden.create({ email: 'b@example.com', password: pw })
  console.log('\nselect: false')
  const plain = await Hidden.findOne({ email: 'b@example.com' })
  console.log('  user.password without .select():', plain.password)
  try {
    console.log('  compare:', await bcrypt.compare(pw, plain.password))
  } catch (e) {
    console.log('  compare THREW:', e.message)
  }
  const withPw = await Hidden.findOne({ email: 'b@example.com' }).select('+password')
  console.log('  with .select("+password"):', await bcrypt.compare(pw, withPw.password))

  await mongoose.disconnect()
  await mongod.stop()
})().catch(e => { console.error(e); process.exit(1) })
