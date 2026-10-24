import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { buildMetadata, siteConfig } from '@/lib/seo'
import { author } from '@/lib/author'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | BcryptGenerator.org',
  description:
    'How BcryptGenerator.org handles your data: tool inputs never leave your browser, plus details on analytics, Google AdSense advertising cookies and how to opt out.',
  path: '/privacy',
})

export default function PrivacyPage() {
  const email = siteConfig.contactEmail

  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="October 24, 2026"
      intro="This policy explains what information BcryptGenerator.org collects, how it is used, and the choices you have. The short version: anything you type into our tools stays in your browser."
    >
      <LegalSection title="Who we are">
        <p>
          BcryptGenerator.org (&quot;we&quot;, &quot;us&quot;) is a free website of developer security tools run by{' '}
          <Link href="/about#author">{author.name}</Link>. If you have questions about this policy, contact us at{' '}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Information you enter into our tools">
        <p>
          The bcrypt generator, bcrypt checker, MD5 and SHA-256 generators and password strength checker run entirely in
          your browser with JavaScript. Passwords, hashes and text you enter are <strong>never sent to our servers</strong>,
          logged or stored by us. You can confirm this by disconnecting from the internet after the page loads; the tools
          keep working.
        </p>
      </LegalSection>

      <LegalSection title="Information collected automatically">
        <p>When you visit the site, some information is collected automatically:</p>
        <ul>
          <li>
            <strong>Hosting logs.</strong> Our hosting provider, Vercel, processes technical data such as your IP address,
            browser type and the pages requested in order to deliver the site and protect it from abuse.
          </li>
          <li>
            <strong>Analytics.</strong> We use Vercel Analytics to count page views and see which pages are popular. It
            reports aggregated statistics and does not use cookies to identify you.
          </li>
          <li>
            <strong>Advertising.</strong> Our advertising partners collect information through cookies and similar
            technologies, as described below.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="advertising" title="Advertising and cookies">
        <p>
          We use Google AdSense to show ads on this site. Advertising keeps the tools free.
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or
            other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies, including the DoubleClick cookie, enables it and its partners to serve
            ads to you based on your visits to this site and/or other sites on the internet.
          </li>
          <li>
            Other third-party vendors or ad networks may also serve ads on this site and may use cookies, web beacons or
            similar technologies to measure ad performance.
          </li>
        </ul>
        <p>
          You can learn how Google uses information from sites that use its services at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="opt-out" title="How to opt out of personalized ads">
        <ul>
          <li>
            Turn off personalized advertising from Google in{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            Opt out of personalized advertising from many third-party vendors at{' '}
            <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>{' '}
            (United States) or{' '}
            <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
              youronlinechoices.eu
            </a>{' '}
            (Europe).
          </li>
          <li>
            Block or delete cookies in your browser settings. If you do, you will still see ads, but they will be less
            relevant to you.
          </li>
        </ul>
        <p>
          Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent before
          personalized ads or advertising cookies are used. You can change your choice at any time from the consent
          settings shown on the site.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul>
          <li>To run, secure and fix the website</li>
          <li>To understand which pages and tools are useful so we can improve them</li>
          <li>To show advertising that pays for the site</li>
          <li>To reply when you contact us</li>
        </ul>
        <p>We do not sell personal information, and we do not create user accounts.</p>
      </LegalSection>

      <LegalSection title="Emails you send us">
        <p>
          If you email us, we receive your email address and whatever you write. We use it only to reply to you and keep
          it no longer than needed for that conversation.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on where you live, including under the GDPR in Europe and privacy laws such as the CCPA in California,
          you may have the right to access, correct or delete personal information about you, to object to or limit its
          use, and to withdraw consent. Because we do not store tool inputs or run accounts, we hold very little about
          you. To make a request, email <a href={`mailto:${email}`}>{email}</a>. For data held by Google, use your Google
          account settings or the links above.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          This site is intended for developers and is not directed at children under 13. We do not knowingly collect
          personal information from children.
        </p>
      </LegalSection>

      <LegalSection title="Links to other websites">
        <p>
          Our articles link to other websites, such as OWASP and NIST. We are not responsible for their content or
          privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top shows when it last
          changed. See also our <Link href="/terms">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
