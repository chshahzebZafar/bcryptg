export const siteConfig = {
  name: 'BcryptGenerator.org',
  url: 'https://bcryptgenerator.org',
  description:
    'Free online bcrypt hash generator and verifier. Generate secure password hashes with adjustable salt rounds. Client-side only — your passwords never leave your browser.',
  ogImage: 'https://bcryptgenerator.org/opengraph-image',
}

export function buildMetadata(overrides: {
  title: string
  description: string
  path?: string
  noIndex?: boolean
}) {
  const url = `${siteConfig.url}${overrides.path ?? ''}`
  return {
    title: overrides.title,
    description: overrides.description,
    alternates: { canonical: url },
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } },
    openGraph: {
      title: overrides.title,
      description: overrides.description,
      url,
      siteName: siteConfig.name,
      type: 'website' as const,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: overrides.title,
      description: overrides.description,
      images: [siteConfig.ogImage],
    },
  }
}
