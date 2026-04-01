import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside
      className="hidden w-[280px] shrink-0 lg:block xl:w-[300px]"
      aria-label="Quick links and news"
    >
      <div className="sticky top-24 space-y-5 rounded-[12px] bg-primary p-4 shadow-[var(--shadow-soft)]">
        <div className="rounded-[12px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 text-base font-semibold text-secondary">Portal access</h2>
          <p className="mb-4 text-sm leading-relaxed text-primary/70">
            Sign in to view grades, schedules, and school announcements.
          </p>
          <Link
            to="/login"
            className="block w-full rounded-[12px] bg-secondary py-3 text-center text-sm font-semibold text-primary shadow-[0_6px_24px_-4px_rgba(244,180,0,0.55)] transition hover:bg-secondary-hover"
          >
            Go to login
          </Link>
        </div>

        <div className="rounded-[12px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 text-base font-semibold text-secondary">Campus news</h2>
          <ul className="space-y-4 text-sm text-primary/75">
            <li className="border-b border-primary/[0.06] pb-3">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-secondary">
                Mar 28
              </span>
              Spring open house — register for a campus tour.
            </li>
            <li className="border-b border-primary/[0.06] pb-3">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-secondary">
                Mar 22
              </span>
              Honors list published for Term 2.
            </li>
            <li>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-secondary">
                Mar 15
              </span>
              New STEM lab opening next month.
            </li>
          </ul>
        </div>

        <div className="rounded-[12px] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm font-medium text-secondary">Need help?</p>
          <p className="mt-1 text-sm text-primary/65">admissions@g10amr.edu</p>
        </div>
      </div>
    </aside>
  )
}
