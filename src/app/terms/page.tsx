import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { buildMetadata, siteConfig } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use | BcryptGenerator.org',
  description:
    'The terms for using BcryptGenerator.org, its free bcrypt, MD5, SHA-256 and password strength tools, and its articles.',
  path: '/terms',
})

export default function TermsPage() {
  const email = siteConfig.contactEmail

  return (
    <LegalPage
      title="Terms of Use"
      path="/terms"
      updated="October 24, 2026"
      intro="By using BcryptGenerator.org you agree to these terms. If you do not agree, please do not use the site."
    >
      <LegalSection title="The service">
        <p>
          BcryptGenerator.org provides free, browser-based developer tools (a bcrypt generator and checker, MD5 and
          SHA-256 generators and a password strength checker) and educational articles about password hashing and
          security. The tools run on your device; no account is needed.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the site or its tools for any unlawful purpose, or to access accounts or systems you are not authorized to access</li>
          <li>Attempt to disrupt, overload or compromise the site or its hosting</li>
          <li>Scrape the site in a way that degrades it for other visitors</li>
          <li>Click on ads fraudulently or encourage others to do so</li>
        </ul>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          The tools and articles are provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any
          kind. We work to keep them accurate and in line with current guidance such as the OWASP Password Storage Cheat
          Sheet and NIST SP 800-63B, but we cannot guarantee that every result or recommendation is error-free, complete
          or suitable for your system.
        </p>
        <p>
          Content on this site is general technical information, not professional security advice. Review and test any
          code before using it in production, and avoid entering live production passwords or secrets into any website,
          including this one.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, BcryptGenerator.org and its author are not liable for any indirect,
          incidental or consequential damages, or any loss of data, revenue or security, arising from your use of the site
          or its tools.
        </p>
      </LegalSection>

      <LegalSection title="Content and code">
        <p>
          Articles, text and design on this site are owned by BcryptGenerator.org. You may quote short excerpts with a
          link back. Code examples in our articles may be used freely in your own projects.
        </p>
      </LegalSection>

      <LegalSection title="Advertising and third-party links">
        <p>
          The site shows ads from Google AdSense and links to other websites. We do not control and are not responsible
          for third-party ads, sites or their content. How advertising uses cookies is explained in our{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms or change, suspend or remove any tool at any time. Continued use after changes means
          you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms? Email <a href={`mailto:${email}`}>{email}</a> or use our{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
