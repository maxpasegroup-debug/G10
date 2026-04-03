import { Link } from 'react-router-dom'
import { useSiteSettings } from '../context/SettingsContext'
import { telHref } from '../lib/phone'

export function PublicFooter() {
  const { settings, loading } = useSiteSettings()
  const name = settings?.academy_name ?? ''
  const email = settings?.email ?? ''
  const phone = settings?.phone ?? ''
  const address = settings?.address ?? ''

  return (
    <footer className="border-t border-primary/[0.08] bg-primary px-4 py-12 text-white sm:px-6 md:px-[60px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:gap-14 lg:grid-cols-3">
        <div>
          <p className="font-[var(--font-brand)] text-lg font-bold tracking-wide text-secondary">
            {loading && !name ? '…' : name}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary/90">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {phone ? (
              <li>
                <a href={telHref(phone)} className="hover:text-secondary">
                  {phone}
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="break-all hover:text-secondary">
                  {email}
                </a>
              </li>
            ) : null}
            {address ? <li className="text-white/75">{address}</li> : null}
          </ul>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary/90">Explore</p>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to="/about" className="text-white/85 hover:text-secondary">
              About
            </Link>
            <Link to="/classes" className="text-white/85 hover:text-secondary">
              Classes
            </Link>
            <Link to="/admissions" className="text-white/85 hover:text-secondary">
              Admissions
            </Link>
            <Link to="/contact" className="text-white/85 hover:text-secondary">
              Contact
            </Link>
            <Link to="/login" className="text-white/85 hover:text-secondary">
              Login
            </Link>
          </nav>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1200px] border-t border-white/10 pt-8 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {loading && !name ? '…' : name}. All rights reserved.
      </p>
    </footer>
  )
}
