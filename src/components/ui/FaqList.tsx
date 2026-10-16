import type { FAQ } from '@/types'

export function FaqList({ faqs, heading = 'Frequently Asked Questions', id }: { faqs: FAQ[]; heading?: string; id?: string }) {
  const headingId = id ?? 'faq-heading'
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-bold text-slate-100 mb-6">
        {heading}
      </h2>
      <div className="space-y-4">
        {faqs.map(faq => (
          <details key={faq.q} className="bg-slate-900 border border-slate-700 rounded-lg group">
            <summary className="px-5 py-4 cursor-pointer text-slate-200 font-medium text-sm select-none list-none flex items-center justify-between gap-3 hover:text-slate-100">
              {faq.q}
              <span className="text-slate-500 text-lg leading-none shrink-0 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-5 pb-4">
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
