import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api-docs'],
      },
    ],
    sitemap: 'https://bcryptgenerator.org/sitemap.xml',
    host: 'https://bcryptgenerator.org',
  }
}
