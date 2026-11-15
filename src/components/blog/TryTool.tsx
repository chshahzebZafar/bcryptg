import Link from 'next/link'
import { ArrowRight, Hash, KeyRound, ShieldCheck, Wrench } from 'lucide-react'

const ICONS = { generator: Hash, checker: ShieldCheck, password: KeyRound, tool: Wrench }

// Call-to-action box used inside MDX articles: <TryTool href="/verify" ...>text</TryTool>
export function TryTool({
  href,
  title,
  cta,
  icon = 'tool',
  children,
}: {
  href: string
  title: string
  cta: string
  icon?: keyof typeof ICONS
  children?: React.ReactNode
}) {
  const Icon = ICONS[icon]
  return (
    <aside className="not-prose my-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-blue-800 bg-blue-950/40 p-5">
      <div className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-blue-300">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-100 mb-1">{title}</div>
        {children && <div className="text-sm text-slate-400 leading-relaxed">{children}</div>}
      </div>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700"
      >
        {cta} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </aside>
  )
}
