import Link from 'next/link'
import { author } from '@/lib/author'

export function AuthorBox() {
  const initials = author.name.split(' ').map(n => n[0]).join('')
  return (
    <aside aria-label="About the author" className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex gap-4">
      <div
        aria-hidden="true"
        className="shrink-0 w-12 h-12 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold flex items-center justify-center"
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide">Written by</p>
        <p className="text-slate-100 font-semibold">
          <Link href="/about#author" className="hover:text-blue-400 transition-colors">{author.name}</Link>
        </p>
        <p className="text-slate-400 text-xs mb-2">{author.jobTitle}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{author.bio}</p>
      </div>
    </aside>
  )
}
