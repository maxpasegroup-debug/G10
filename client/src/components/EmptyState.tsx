import type { ReactNode } from 'react'

export type EmptyStateAction = {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  const btnClass =
    action?.variant === 'secondary'
      ? 'rounded-xl border border-primary/20 bg-white px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-50'
      : 'rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-surface/50 px-6 py-14 text-center ${className}`}
      role="status"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.06] text-primary/38 [&>svg]:h-7 [&>svg]:w-7"
        aria-hidden
      >
        {icon}
      </div>
      <p className="text-sm font-semibold text-primary/80">{title}</p>
      {description ? <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-primary/55">{description}</p> : null}
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={`mt-6 min-h-[44px] ${btnClass}`}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  )
}

export function EmptyStateIconStudents() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  )
}

export function EmptyStateIconClasses() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  )
}

export function EmptyStateIconPhotos() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  )
}

export function EmptyStateIconEnquiries() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12.75z"
      />
    </svg>
  )
}
