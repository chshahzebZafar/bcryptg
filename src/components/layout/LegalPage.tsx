import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'

type Props = {
  title: string
  path: string
  intro: string
  updated?: string
  children: React.ReactNode
}

// Shared shell for the Contact, Privacy Policy and Terms of Use pages.
export function LegalPage({ title, path, intro, updated, children }: Props) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bcryptgenerator.org' },
          { name: title, url: `https://bcryptgenerator.org${path}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">{title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">{title}</h1>
        {updated && <p className="text-slate-500 text-sm mb-4">Last updated: {updated}</p>}
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">{intro}</p>

        <div className="space-y-6">{children}</div>
      </div>
    </>
  )
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-3 scroll-mt-20">
      <h2 className="text-xl font-bold text-slate-100">{title}</h2>
      <div className="text-slate-400 text-sm leading-relaxed space-y-3 [&_a]:text-blue-400 [&_a:hover]:text-blue-300 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-slate-200">
        {children}
      </div>
    </section>
  )
}
