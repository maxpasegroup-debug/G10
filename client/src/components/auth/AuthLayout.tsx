import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <div className="grid min-h-dvh lg:grid-cols-[1fr_min(520px,42%)]">
        {/* Left: brand / visual */}
        <aside
          className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-light/90" />
          <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-12 xl:px-14">
            <Link
              to="/"
              className="mb-10 inline-flex w-fit items-center gap-2.5 text-sm font-medium text-white/90 no-underline transition hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/15 text-xs font-bold text-secondary backdrop-blur-sm">
                AA
              </span>
              Apex Academy
            </Link>
            <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
              Learn, practice, and grow — in one secure place.
            </p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
              Sign in with your role to access schedules, grades, and messages tailored to you.
            </p>
          </div>
          <div className="relative z-10 border-t border-white/10 px-10 py-6 text-xs text-white/50 xl:px-14">
            © {new Date().getFullYear()} Apex Academy
          </div>
        </aside>

        {/* Right: card panel */}
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-12">
          <div className="mb-6 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 no-underline hover:text-primary"
            >
              ← Back to home
            </Link>
          </div>
          <div className="mx-auto w-full max-w-[420px] rounded-[12px] border border-primary/[0.08] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
