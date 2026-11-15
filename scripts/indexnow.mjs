// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver and others share submissions).
// Run after a deploy that adds or changes pages:
//   npm run indexnow                 -> every URL in the live sitemap
//   npm run indexnow -- /blog/foo /  -> only these paths
// The key file must already be live at https://bcryptgenerator.org/<KEY>.txt

const HOST = 'bcryptgenerator.org'
const SITE = `https://${HOST}`
const KEY = '3b88c999cd0c951704f9a3da43782052'

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m.at(1).trim())
}

async function main() {
  const args = process.argv.slice(2)
  const urlList = args.length
    ? args.map(p => (p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? p : `/${p}`}`))
    : await sitemapUrls()

  // Git Bash on Windows rewrites "/blog/x" into "C:/Program Files/Git/blog/x"; refuse mangled paths
  const bad = urlList.filter(u => !u.startsWith(`${SITE}/`) && u !== SITE || /^https:\/\/[^/]+\/.*:/.test(u))
  if (bad.length) {
    throw new Error(`Invalid URL(s): ${bad.join(', ')}\nIn Git Bash, pass paths without the leading slash (blog/foo) or prefix the command with MSYS_NO_PATHCONV=1.`)
  }

  const keyCheck = await fetch(`${SITE}/${KEY}.txt`)
  if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
    throw new Error('Key file is not live yet. Deploy first, then run this again.')
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  })

  // 200 = accepted, 202 = accepted (key validation pending)
  console.log(`IndexNow responded ${res.status} ${res.statusText} for ${urlList.length} URLs`)
  urlList.forEach(u => console.log(`  ${u}`))
  if (res.status >= 300) {
    console.error(await res.text())
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error(err.message)
  process.exitCode = 1
})
