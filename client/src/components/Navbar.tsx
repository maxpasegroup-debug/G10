import { useState } from 'react'
import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Classes', href: '#classes' },
  { label: 'Faculty', href: '#faculty' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Contact', href: '#contact' },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/15 bg-primary shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md backdrop-saturate-150"
      role="banner"
    >
      <div className="mx-auto flex h-18 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-white no-underline"
          onClick={() => setOpen(false)}
        >
          <span className="leading-none text-secondary" aria-hidden>
            <span className="block font-[var(--font-brand)] text-lg tracking-[0.14em]">G10</span>
            <span className="mt-0.5 block font-[var(--font-brand)] text-sm tracking-[0.24em]">AMR</span>
          </span>
          <span className="sr-only">G10 AMR</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-evenly gap-2 md:flex"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex-1 rounded-[10px] px-2 py-2 text-center text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-secondary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-secondary px-4 text-sm font-semibold text-primary shadow-[0_2px_12px_-2px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover md:px-5"
          >
            Student &amp; Parent Login
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/20 bg-white/10 text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-white/15 bg-primary backdrop-blur-md md:hidden ${open ? 'block' : 'hidden'}`}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-0.5 px-4 py-3 sm:px-6" aria-label="Mobile">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[10px] px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-secondary"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
