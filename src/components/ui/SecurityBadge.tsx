import { ShieldCheck, Lock, Eye } from 'lucide-react'

export function SecurityBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-400 text-sm">
      <ShieldCheck size={15} className="shrink-0" />
      <span className="font-medium">Processed in your browser — no data sent to servers</span>
    </div>
  )
}

export function TrustBar() {
  const signals = [
    { icon: ShieldCheck, text: 'Client-side only', sub: 'No passwords sent to servers' },
    { icon: Lock, text: 'No storage', sub: 'Nothing is saved or logged' },
    { icon: Eye, text: 'Open source', sub: 'View code on GitHub' },
  ]
  return (
    <div className="hidden sm:grid sm:grid-cols-3 gap-3 my-6">
      {signals.map(({ icon: Icon, text, sub }) => (
        <div
          key={text}
          className="flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
        >
          <Icon size={18} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-100 font-medium text-sm">{text}</p>
            <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
