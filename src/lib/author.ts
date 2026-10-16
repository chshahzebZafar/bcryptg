import { siteConfig } from '@/lib/seo'

// Single source for the site author: blog byline, author box, About page and Article schema.
export const author = {
  name: 'Shahzeb Zafar',
  jobTitle: 'Software Engineer',
  url: `${siteConfig.url}/about#author`,
  bio:
    'Shahzeb Zafar is a software engineer who builds web applications and backend services, with a focus on authentication and the safe handling of user data. Shahzeb created BcryptGenerator.org to give developers a fast, private way to generate and verify password hashes, and writes the guides here to explain the security decisions behind them in plain, practical terms.',
  passions: [
    'Application security and password storage done right',
    'Privacy-first tools that keep user data on the device',
    'Clear, practical technical writing for developers',
    'Fast, accessible web experiences',
    'Developer tooling that removes friction from everyday work',
  ],
  knowsAbout: ['bcrypt', 'Password hashing', 'Authentication', 'Web security', 'Next.js', 'Node.js'],
}
