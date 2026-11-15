'use client'
import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { THEME_KEY as KEY } from '@/lib/theme'

function setTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme)
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  // Until the visitor picks a theme, keep following the operating system setting live
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      let saved: string | null = null
      try { saved = localStorage.getItem(KEY) } catch {}
      if (saved !== 'light' && saved !== 'dark') setTheme(mql.matches ? 'light' : 'dark')
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem(KEY, next) } catch {}
  }

  // Both icons are rendered and CSS shows the right one, so server and client HTML match
  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer ${className}`}
      title="Switch light / dark mode"
    >
      <Sun size={18} aria-hidden="true" className="light:hidden" />
      <Moon size={18} aria-hidden="true" className="hidden light:block" />
      <span className="sr-only light:hidden">Switch to light mode</span>
      <span className="sr-only hidden light:inline">Switch to dark mode</span>
    </button>
  )
}
