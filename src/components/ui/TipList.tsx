import type { ReactNode } from 'react'

// Card list for "why X happens" / tips sections. Body uses .prose so inline <code> and links match articles.
export function TipList({ items, numbered = false }: { items: { title: string; body: ReactNode }[]; numbered?: boolean }) {
  const List = numbered ? 'ol' : 'ul'
  return (
    <List className="my-5 space-y-3">
      {items.map(({ title, body }, i) => (
        <li key={title} className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex gap-3">
          {numbered && (
            <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center justify-center">
              {i + 1}
            </span>
          )}
          <div className="prose max-w-none min-w-0">
            <span className="block text-slate-100 font-semibold text-sm mb-1">{title}</span>
            <span className="block text-slate-300 text-sm leading-relaxed">{body}</span>
          </div>
        </li>
      ))}
    </List>
  )
}
