// Wi-Fi network QR payloads in the widely supported "WIFI:" format (originally from
// ZXing, read by the iOS and Android cameras). Plain TypeScript, no imports.

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

export interface WifiConfig {
  ssid: string
  password: string
  security: WifiSecurity
  hidden: boolean
}

// Backslash-escape the characters that structure the payload: \ ; , : "
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

export function wifiPayload({ ssid, password, security, hidden }: WifiConfig): string {
  let out = `WIFI:T:${security};S:${escapeWifi(ssid)};`
  if (security !== 'nopass') out += `P:${escapeWifi(password)};`
  if (hidden) out += 'H:true;'
  return out + ';'
}

// Problems that would stop a phone joining, or that the user should know about
export function wifiWarnings({ ssid, password, security }: WifiConfig): string[] {
  const w: string[] = []
  const bytes = (s: string) => new TextEncoder().encode(s).length
  if (!ssid) w.push('Enter the network name (SSID) exactly as it appears in your Wi-Fi list.')
  else if (bytes(ssid) > 32) w.push('Network names can be at most 32 bytes. Check the name is exactly right.')
  if (security === 'WPA') {
    if (!password) w.push('WPA networks need a password.')
    else if (password.length < 8 || (password.length > 63 && !/^[0-9a-fA-F]{64}$/.test(password))) {
      w.push('WPA passwords are 8 to 63 characters. Check the password is exactly right.')
    }
  }
  if (security === 'WEP') w.push('WEP is obsolete and easy to crack. Switch your router to WPA2 or WPA3 if you can.')
  return w
}

// QR matrix to an SVG path (one subpath per dark module run), for crisp scaling
export function matrixToSvg(data: boolean[][], dark = '#000', light = '#fff'): string {
  const n = data.length
  let d = ''
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!data[y][x]) continue
      let run = 1
      while (x + run < n && data[y][x + run]) run++
      d += `M${x} ${y}h${run}v1h-${run}z`
      x += run - 1
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">` +
    `<rect width="${n}" height="${n}" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`
}
