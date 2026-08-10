/** Sticky glass navbar with dark-mode toggle. */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, GraduationCap } from 'lucide-react'

const NAV_LINKS = [
  { href: '#home', label: 'صفحه اصلی' },
  { href: '#about', label: 'درباره دانشگاه' },
  { href: '#features', label: 'امکانات' },
  { href: '#contact', label: 'تماس با ما' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-slate-900/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2 font-bold text-lg text-primary dark:text-accent">
          <GraduationCap className="h-7 w-7" />
          دانشگاه لرستان
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-primary dark:hover:text-accent transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="تغییر حالت شب و روز"
            className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/login"
            className="rounded-xl bg-primary dark:bg-accent text-white dark:text-surface-dark px-4 py-2 text-sm font-bold hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
          >
            ورود
          </Link>
        </div>
      </div>
    </header>
  )
}
