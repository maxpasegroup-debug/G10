import { Link } from 'react-router-dom'

const dashboardStats = {
  totalStudents: 48,
  todaysClasses: 6,
  pendingEnquiries: 3,
} as const

const todaysClasses = [
  { id: '1', name: 'Beginner Piano', time: '4:00 PM', teacher: 'John Mathew' },
  { id: '2', name: 'Junior Drums', time: '4:30 PM', teacher: 'Rahul Varma' },
  { id: '3', name: 'Vocal Group A', time: '5:00 PM', teacher: 'Ananya Menon' },
  { id: '4', name: 'Guitar Foundations', time: '5:30 PM', teacher: 'Priya Nair' },
] as const

export function AdminHomePage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-primary md:text-3xl">Today&apos;s actions</h2>
        <p className="mt-1 text-lg text-primary/65">What needs your attention right now.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-base font-semibold text-primary/70">Total Students</p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-primary">{dashboardStats.totalStudents}</p>
        </div>
        <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-base font-semibold text-primary/70">Today&apos;s Classes</p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-secondary">{dashboardStats.todaysClasses}</p>
        </div>
        <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-base font-semibold text-primary/70">Pending Enquiries</p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-primary">{dashboardStats.pendingEnquiries}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <h3 className="text-xl font-bold text-primary">Today&apos;s classes</h3>
        <ul className="mt-6">
          {todaysClasses.map((row) => (
            <li
              key={row.id}
              className="grid grid-cols-1 gap-2 border-b border-primary/[0.08] py-4 last:border-0 sm:grid-cols-3 sm:items-center sm:gap-6"
            >
              <span className="text-lg font-semibold text-primary">{row.name}</span>
              <span className="text-base font-medium text-primary/80">{row.time}</span>
              <span className="text-base text-primary/65">{row.teacher}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold text-primary">Quick actions</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            to="/admin/students"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:min-w-[200px]"
          >
            Add Student
          </Link>
          <Link
            to="/admin/classes"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:min-w-[200px]"
          >
            Add Class
          </Link>
          <Link
            to="/admin/attendance"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-secondary px-6 py-4 text-lg font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover sm:min-w-[200px]"
          >
            Mark Attendance
          </Link>
        </div>
      </div>
    </div>
  )
}
