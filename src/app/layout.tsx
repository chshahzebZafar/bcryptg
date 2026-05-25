import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WebAppSchema, OrganizationSchema } from '@/components/seo/JsonLd'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bcryptgenerator.org'),
  title: {
    default: 'Bcrypt Generator — Free Online Bcrypt Hash Generator & Verifier',
    template: '%s | BcryptGenerator.org',
  },
  description:
    'Free online bcrypt hash generator and verifier. Generate secure password hashes with adjustable salt rounds. Client-side only — your passwords never leave your browser.',
  keywords: [
    'bcrypt generator',
    'bcrypt hash generator',
    'online bcrypt',
    'bcrypt checker',
    'bcrypt verifier',
    'password hash generator',
    'bcrypt online',
    'hash password online',
    'bcrypt nodejs',
    'bcrypt php',
    'bcrypt python',
    'free bcrypt tool',
    'bcrypt hash online',
    'generate bcrypt hash',
    'bcrypt cost factor',
    'bcrypt salt rounds',
  ],
  authors: [{ name: 'BcryptGenerator.org', url: 'https://bcryptgenerator.org' }],
  creator: 'BcryptGenerator.org',
  publisher: 'BcryptGenerator.org',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bcryptgenerator.org',
    siteName: 'BcryptGenerator.org',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BcryptGenerator.org' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bcryptgenerator',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://bcryptgenerator.org',
    languages: { 'en': 'https://bcryptgenerator.org' },
  },
  category: 'technology',
  verification: {
    google: '4zYq5s4U-pnMEvSgAhBrlGx0Rsdt7LR7Ds_CXvdCWQk',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <WebAppSchema />
        <OrganizationSchema />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
