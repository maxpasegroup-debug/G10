import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSiteSettings } from '../context/SettingsContext'

const navItems = [
  { label: 'HOME', to: '/' },
  { label: 'ABOUT US', to: '/about' },
  { label: 'CLASSES', to: '/classes' },
  { label: 'FACULTY', to: '/faculty' },
  { label: 'GALLERY', to: '/gallery' },
  { label: 'ADMISSIONS', to: '/admissions' },
  { label: 'CONTACT', to: '/contact' },
] as const

function linkClassName(isActive: boolean) {
  return `g10-navbar__link${isActive ? ' g10-navbar__link--active' : ''}`
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { settings, loading } = useSiteSettings()
  const academyName = settings?.academy_name?.trim() || ''

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (item.label === 'HOME') {
      return location.pathname === '/' && (!location.hash || location.hash === '#home')
    }
    if (item.label === 'ABOUT US') {
      return location.pathname === '/about'
    }
    if (item.label === 'CLASSES') {
      return location.pathname === '/classes'
    }
    if (item.label === 'FACULTY') {
      return location.pathname === '/faculty'
    }
    if (item.label === 'GALLERY') {
      return location.pathname === '/gallery'
    }
    if (item.label === 'ADMISSIONS') {
      return location.pathname === '/admissions'
    }
    if (item.label === 'CONTACT') {
      return location.pathname === '/contact'
    }
    return false
  }

  return (
    <header className="g10-navbar" role="banner">
      <div className="g10-navbar__inner">
        <Link
          to="/"
          className="g10-navbar__logo"
          aria-label={academyName ? `${academyName} home` : 'Home'}
          onClick={() => setOpen(false)}
        >
          <span className="g10-navbar__logo-name">{loading && !academyName ? '…' : academyName}</span>
        </Link>

        <nav className="g10-navbar__menu" aria-label="Main">
          {navItems.flatMap((item, i) => [
            i > 0 ? (
              <span key={`sep-${item.to}`} className="g10-navbar__sep" aria-hidden>
                |
              </span>
            ) : null,
            <Link
              key={item.to}
              to={item.to}
              className={linkClassName(isItemActive(item))}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>,
          ])}
        </nav>

        <Link to="/login" className="student-login-btn g10-navbar__cta">
          Student &amp; Parent Login
        </Link>

        <button
          type="button"
          className="g10-navbar__toggle"
          aria-expanded={open}
          aria-controls="g10-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div id="g10-mobile-nav" className={`g10-navbar__mobile${open ? ' is-open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/login"
          className="student-login-btn g10-navbar__cta g10-navbar__cta--mobile"
          onClick={() => setOpen(false)}
        >
          Student &amp; Parent Login
        </Link>
      </div>
    </header>
  )
}
