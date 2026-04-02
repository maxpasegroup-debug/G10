import { useNavigate } from 'react-router-dom'
import { clearStoredToken } from '../../auth/authService'

type AdminHeaderProps = {
  title: string
  adminName?: string
  onMenuClick?: () => void
}

export function AdminHeader({ title, adminName = 'Studio Admin', onMenuClick }: AdminHeaderProps) {
  const navigate = useNavigate()

  function handleLogout() {
    clearStoredToken()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-primary/[0.08] bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 text-primary md:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="truncate text-xl font-bold text-primary md:text-2xl">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        <span className="hidden text-base font-medium text-primary/80 sm:inline">{adminName}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition hover:bg-secondary-hover md:px-5 md:py-3 md:text-base"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
