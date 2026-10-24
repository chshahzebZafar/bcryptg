import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { buildMetadata, siteConfig } from '@/lib/seo'
import { author } from '@/lib/author'

export const metadata: Metadata = buildMetadata({
  title: 'Contact | BcryptGenerator.org',
  description:
    'Contact BcryptGenerator.org to report a bug, suggest a tool, correct an article or ask a privacy question.',
  path: '/contact',
})

export default function ContactPage() {
  const email = siteConfig.contactEmail

  return (
    <LegalPage
      title="Contact"
      path="/contact"
      intro={`BcryptGenerator.org is built and maintained by ${author.name}. Questions, bug reports and suggestions are welcome.`}
    >
      <section className="bg-blue-950 border border-blue-800 rounded-xl p-6 text-center">
        <Mail size={24} className="text-blue-400 mx-auto mb-3" />
        <p className="text-slate-300 text-sm mb-2">Email us at</p>
        <a
          href={`mailto:${email}`}
          className="text-xl sm:text-2xl font-mono font-semibold text-blue-400 hover:text-blue-300 break-all"
        >
          {email}
        </a>
        <p className="text-slate-500 text-xs mt-3">We usually reply within a few business days.</p>
      </section>

      <LegalSection title="What to contact us about">
        <ul>
          <li><strong>Bugs:</strong> a tool gives a wrong result, a hash does not verify, or a page does not load</li>
          <li><strong>Corrections:</strong> something in an article is out of date or inaccurate</li>
          <li><strong>Tool or article ideas:</strong> another hash algorithm, language tutorial or security topic you want covered</li>
          <li><strong>Privacy questions or requests:</strong> see our <Link href="/privacy">Privacy Policy</Link></li>
          <li><strong>Advertising or partnerships</strong></li>
        </ul>
      </LegalSection>

      <LegalSection title="Reporting a bug">
        <p>
          Include the page URL, your browser and operating system, and the steps to reproduce the problem. For hash
          issues, share the bcrypt cost and the hash prefix (for example <code className="font-mono text-xs text-emerald-400">$2b$12$</code>)
          rather than a real hash.
        </p>
        <p>
          <strong>Never email us real passwords or production password hashes.</strong> Reproduce the problem with a test
          value instead.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
