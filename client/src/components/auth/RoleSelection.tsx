import type { UserRole } from '../../auth/types'

const roles: { id: UserRole; label: string; description: string }[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Classes, assignments, and progress',
  },
  {
    id: 'parent',
    label: 'Parent',
    description: 'Child’s updates and school communication',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    description: 'Rosters, grading, and classroom tools',
  },
  {
    id: 'admin',
    label: 'Administrator',
    description: 'Staff dashboard and user management',
  },
]

type RoleSelectionProps = {
  onSelect: (role: UserRole) => void
}

export function RoleSelection({ onSelect }: RoleSelectionProps) {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-primary">Welcome</h1>
      <p className="mt-2 text-center text-sm text-primary/65">Choose how you are signing in</p>
      <ul className="mt-8 space-y-3">
        {roles.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              className="flex w-full items-center gap-4 rounded-[12px] border border-primary/[0.1] bg-surface/90 px-4 py-4 text-left shadow-[0_1px_0_rgba(11,42,74,0.04)] transition hover:border-secondary/50 hover:bg-white hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-primary text-sm font-bold text-white">
                {r.label.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-primary">{r.label}</span>
                <span className="mt-0.5 block text-xs text-primary/55">{r.description}</span>
              </span>
              <span className="ml-auto text-secondary" aria-hidden>
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
