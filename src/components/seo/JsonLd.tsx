import type { FAQ } from '@/types'
import { author } from '@/lib/author'

const OG_IMAGE = 'https://bcryptgenerator.org/opengraph-image'
const SITE_URL = 'https://bcryptgenerator.org'
const SITE_NAME = 'BcryptGenerator.org'

export function WebAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bcrypt Generator',
    url: SITE_URL,
    description: 'Free online bcrypt hash generator and verifier. Client-side only — no passwords sent to servers.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Generate bcrypt hashes',
      'Verify passwords against hashes',
      'Adjustable salt rounds (4–14)',
      'Client-side processing — no server round trips',
      'Code snippets in 7 languages',
      'MD5 and SHA-256 generators',
      'Password strength checker',
    ],
    screenshot: OG_IMAGE,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    image: {
      '@type': 'ImageObject',
      url: OG_IMAGE,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.jobTitle,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.svg`,
      width: 32,
      height: 32,
    },
    description: 'Free online bcrypt hash generator and verifier. Client-side only — no passwords sent to servers.',
    foundingDate: '2026',
    knowsAbout: ['bcrypt', 'password hashing', 'cryptography', 'web security', 'Argon2', 'SHA-256', 'MD5'],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': author.url,
    name: author.name,
    jobTitle: author.jobTitle,
    url: author.url,
    description: author.bio,
    knowsAbout: author.knowsAbout,
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
