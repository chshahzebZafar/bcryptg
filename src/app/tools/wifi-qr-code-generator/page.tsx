import type { Metadata } from 'next'
import Link from 'next/link'
import { Wifi, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema, ToolSchema } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/ui/FaqList'
import { TipList } from '@/components/ui/TipList'
import { WifiQrGenerator } from './WifiQrGenerator'
import type { FAQ } from '@/types'

const URL = 'https://bcryptgenerator.org/tools/wifi-qr-code-generator'

export const metadata: Metadata = {
  title: { absolute: 'Wi-Fi QR Code Generator: Free, No Sign-Up, Private' },
  description:
    'Create a QR code that connects phones to your Wi-Fi with one scan. Download it as PNG or SVG, or print a card. Free, no sign-up, made in your browser.',
  keywords: [
    'wifi qr code generator', 'qr code for wifi', 'wifi password qr code', 'wifi qr code generator free',
    'wifi qr code generator no sign up', 'guest wifi qr code', 'wifi qr code', 'share wifi qr code',
  ],
  alternates: { canonical: URL },
  openGraph: {
    siteName: 'BcryptGenerator.org',
    locale: 'en_US',
    title: 'Wi-Fi QR Code Generator: Free, No Sign-Up, Private',
    description: 'A QR code that joins your Wi-Fi in one scan. PNG, SVG or a printable card. Your password never leaves your browser.',
    url: URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Wi-Fi QR Code Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wi-Fi QR Code Generator',
    description: 'Free Wi-Fi QR codes with no sign-up, made privately in your browser.',
    images: ['/opengraph-image'],
  },
}

const troubleshooting = [
  {
    title: 'The network name doesn\'t match exactly',
    body: <>Names are case-sensitive and spaces count. Copy the name exactly as it appears in your phone&apos;s Wi-Fi list, including any <code>-5G</code> ending.</>,
  },
  {
    title: 'The wrong security type is selected',
    body: <>Almost every home and office network uses WPA2 or WPA3; choose <strong>WPA / WPA2 / WPA3</strong>. Choose <strong>None</strong> only for networks with no password at all.</>,
  },
  {
    title: 'The password has a typo',
    body: <>Wi-Fi passwords are case-sensitive. Use the eye button to check it, or copy it from your router&apos;s settings or the sticker on the router.</>,
  },
  {
    title: 'The network is hidden',
    body: <>If your router doesn&apos;t broadcast its name, tick <strong>Hidden network</strong>, otherwise some phones won&apos;t find it.</>,
  },
  {
    title: 'The router only allows known devices',
    body: <>If MAC filtering or a device allow-list is switched on in your router, a new phone can&apos;t join until you add it, even with the right password.</>,
  },
]

const faqs: FAQ[] = [
  {
    q: 'How do I scan a Wi-Fi QR code?',
    a: 'Open your phone\'s camera and point it at the code. iPhones and most Android phones show a "Join network" or "Connect" prompt; tap it. On some Android phones, use Google Lens or the QR code scanner in Quick Settings instead.',
  },
  {
    q: 'Is it safe to create a Wi-Fi QR code here?',
    a: 'Yes. The QR code is created by code running in your browser, and your network name and password are never sent to a server or stored. You can even disconnect from the internet after the page loads and it still works.',
  },
  {
    q: 'Will the QR code stop working?',
    a: 'Not unless you change your network name or password. This creates a static QR code that contains your network details directly, with no link to a website, so there is nothing to expire and no account to keep paying for. If you change the Wi-Fi password, make a new code.',
  },
  {
    q: 'Can someone see my Wi-Fi password from the QR code?',
    a: 'Yes. Anyone who scans the code can read the password, which is exactly how it lets them join. Only display it where you\'d be happy to share the password, and consider a separate guest network for visitors so they can\'t reach your own devices.',
  },
  {
    q: 'Does it work with WPA3?',
    a: 'Choose "WPA / WPA2 / WPA3". The QR code format uses one setting for all of them, and the phone negotiates the right security with your router when it connects.',
  },
  {
    q: 'What size should I print the QR code?',
    a: 'At least 3 cm (about 1.2 inches) across for scanning from close up, and larger if people will scan it from a distance. Download the SVG for printing: it stays perfectly sharp at any size. Keep the white border around the code, because scanners need it.',
  },
]

export default function WifiQrPage() {
  return (
    <>
      <ToolSchema
        name="Wi-Fi QR Code Generator"
        path="/tools/wifi-qr-code-generator"
        description="Create a QR code that connects phones to a Wi-Fi network in one scan, as PNG, SVG or a printable card. Generated in the browser."
        featureList={[
          'WPA, WPA2, WPA3, WEP and open networks',
          'Hidden network support',
          'Download as PNG or SVG, or print a card',
          'Network name and password never leave the browser',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: 'Tools', url: 'https://bcryptgenerator.org/tools' },
          { name: 'Wi-Fi QR Code Generator', url: URL },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-slate-300 transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Wi-Fi QR Code Generator</span>
        </nav>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <Wifi size={17} className="text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Wi-Fi QR Code Generator</h1>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed max-w-3xl">
          Make a QR code that lets guests join your Wi-Fi by pointing their phone camera at it. No typing long passwords, no sign-up, no watermark. The code is created in your browser, so your password is never sent anywhere.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-6">
          <WifiQrGenerator />
        </div>

        <article className="prose max-w-none mt-4">
          <h2>How to make a QR code for your Wi-Fi</h2>
          <ol>
            <li>Type your <strong>network name</strong> exactly as it appears in your Wi-Fi list.</li>
            <li>Choose the <strong>security</strong>. For almost every network that&apos;s WPA / WPA2 / WPA3.</li>
            <li>Enter the <strong>Wi-Fi password</strong>. The QR code appears as you type.</li>
            <li>Test it with your own phone, then download it as PNG or SVG, or print the card.</li>
          </ol>
          <p>
            Can&apos;t remember the password? It&apos;s usually on a sticker on the router, or in the router&apos;s settings page. A computer that&apos;s already connected can show it too: on Windows in the Wi-Fi network&apos;s properties, and on a Mac in Keychain Access.
          </p>

          <h2>Where to use a Wi-Fi QR code</h2>
          <ul>
            <li><strong>At home</strong>: on the fridge or in the guest room, so visitors don&apos;t ask for the password.</li>
            <li><strong>Cafés, restaurants and shops</strong>: on tables, menus or the counter.</li>
            <li><strong>Offices and meeting rooms</strong>: for a guest network that keeps visitors off your work devices.</li>
            <li><strong>Holiday rentals</strong>: in the welcome guide, with the house rules.</li>
          </ul>
          <p>
            Use a <strong>guest network</strong> for any QR code in a public place: anyone who scans it can read the password, and a guest network keeps them away from your own computers and devices.
          </p>

          <h2>Why your Wi-Fi QR code isn&apos;t working</h2>
        </article>

        <TipList items={troubleshooting} />

        <article className="prose max-w-none">
          <h2>Time for a stronger Wi-Fi password?</h2>
          <p>
            A QR code means nobody has to type the password, so it can be long and random without being a nuisance. WPA passwords can be 8 to 63 characters. Create one with the <Link href="/tools/password-generator">password generator</Link>, for example 20 random characters, set it in your router, then make a new QR code here. If it&apos;s an old favourite, check it with the <Link href="/tools/password-leak-checker">password leak checker</Link> first.
          </p>

          <h2>What&apos;s inside a Wi-Fi QR code?</h2>
          <p>The code holds a short line of text in a standard format that phone cameras recognise:</p>
          <pre><code>{`WIFI:T:WPA;S:Home-WiFi;P:my-password;;`}</code></pre>
          <ul>
            <li><code>T</code> is the security type: <code>WPA</code>, <code>WEP</code> or <code>nopass</code></li>
            <li><code>S</code> is the network name and <code>P</code> the password</li>
            <li><code>H:true</code> is added for hidden networks</li>
            <li>The characters <code>\</code> <code>;</code> <code>,</code> <code>:</code> and <code>&quot;</code> in a name or password are escaped with a backslash, which this generator does for you</li>
          </ul>
          <p>
            Because the details are in the code itself, it works without an internet connection and never expires. Some QR code websites instead create &quot;dynamic&quot; codes that route people through their own servers first, and can stop working when a free trial ends.
          </p>
        </article>

        <div className="mt-12">
          <FaqList faqs={faqs} heading="Wi-Fi QR Code FAQ" />
        </div>
      </div>
    </>
  )
}
