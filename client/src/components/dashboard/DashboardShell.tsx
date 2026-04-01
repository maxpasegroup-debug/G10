import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole } from '../../auth/types'

const PerformanceDashboard = lazy(async () => {
  const m = await import('./PerformanceDashboard')
  return { default: m.PerformanceDashboard }
})
const LiveClassroomDashboard = lazy(async () => {
  const m = await import('./LiveClassroomDashboard')
  return { default: m.LiveClassroomDashboard }
})
const TeacherAttendanceDashboard = lazy(async () => {
  const m = await import('./TeacherAttendanceDashboard')
  return { default: m.TeacherAttendanceDashboard }
})

type MenuKey =
  | 'dashboard'
  | 'classes'
  | 'attendance'
  | 'practice'
  | 'reports'
  | 'messages'
  | 'settings'

type DashboardShellProps = {
  role: UserRole
}

type MenuItem = {
  key: MenuKey
  label: string
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'classes', label: 'My Classes' },
  { key: 'attendance', label: 'Attendance & Performance' },
  { key: 'practice', label: 'Practice Room' },
  { key: 'reports', label: 'Reports' },
  { key: 'messages', label: 'Messages' },
  { key: 'settings', label: 'Settings' },
]

const roleTitle: Record<UserRole, string> = {
  student: 'Student Portal',
  parent: 'Parent Portal',
  teacher: 'Teacher Portal',
}

const roleName: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  teacher: 'Teacher',
}

type AlertTone = 'danger' | 'info' | 'success' | 'warning'

type SmartAlert = {
  id: string
  text: string
  tone: AlertTone
}

export function DashboardShell({ role }: DashboardShellProps) {
  const [active, setActive] = useState<MenuKey>('attendance')
  const [toastIds, setToastIds] = useState<string[]>([])

  const alerts = useMemo(() => getRoleAlerts(role), [role])

  const pageTitle = useMemo(() => {
    const item = menuItems.find((entry) => entry.key === active)
    return item?.label ?? 'Dashboard'
  }, [active])

  useEffect(() => {
    if (alerts.length === 0) {
      setToastIds([])
      return
    }
    setToastIds(alerts.slice(0, 2).map((alert) => alert.id))
  }, [alerts])

  useEffect(() => {
    if (toastIds.length === 0) return
    const timer = window.setTimeout(() => {
      setToastIds((prev) => prev.slice(1))
    }, 4200)
    return () => window.clearTimeout(timer)
  }, [toastIds])

  const visibleToasts = alerts.filter((alert) => toastIds.includes(alert.id))

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <div className="grid min-h-dvh lg:grid-cols-[270px_1fr]">
        <aside className="border-r border-primary/[0.08] bg-primary px-4 py-6 sm:px-6 lg:px-5">
          <Link
            to="/"
            className="mb-8 flex items-center gap-2.5 rounded-[12px] px-2 py-1 text-white no-underline"
          >
            <span className="flex h-9 min-w-9 items-center justify-center rounded-[12px] border border-secondary/30 bg-primary px-2 text-xs font-semibold text-secondary">
              G10
            </span>
            <span className="font-[var(--font-brand)] text-lg tracking-wide text-secondary">G10 AMR</span>
          </Link>

          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-secondary/80">
            {roleTitle[role]}
          </p>

          <nav aria-label="Dashboard sections" className="space-y-1">
            {menuItems.map((item) => {
              const isActive = active === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(item.key)}
                  className={`w-full rounded-[12px] px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-primary shadow-[var(--shadow-card)]'
                      : 'text-white/78 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-primary/[0.08] bg-white/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <h1 className="truncate text-lg font-semibold tracking-tight text-primary sm:text-xl">
                {pageTitle}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3">
                <details className="group relative">
                  <summary className="relative inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-[12px] border border-primary/[0.12] bg-white text-primary transition hover:bg-primary/[0.04]">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {alerts.length > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">
                        {alerts.length}
                      </span>
                    ) : null}
                  </summary>
                  <div className="absolute right-0 mt-2 w-[300px] rounded-[12px] border border-primary/[0.1] bg-white p-2 shadow-[var(--shadow-card)]">
                    <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-primary/50">
                      Smart alerts
                    </p>
                    {alerts.length === 0 ? (
                      <p className="rounded-[10px] px-3 py-2 text-sm text-primary/60">No alerts yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`rounded-[10px] border px-3 py-2 text-sm ${toneStyles[alert.tone]}`}
                          >
                            {alert.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>

                <details className="group relative">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[12px] border border-primary/[0.12] bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-primary/[0.04]">
                    <span className="hidden sm:inline">{roleName[role]}</span>
                    <svg
                      className="h-4 w-4 text-primary/65 transition group-open:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-44 rounded-[12px] border border-primary/[0.1] bg-white p-1.5 shadow-[var(--shadow-card)]">
                    <button
                      type="button"
                      className="block w-full rounded-[10px] px-3 py-2 text-left text-sm text-primary/80 hover:bg-primary/[0.05]"
                    >
                      My Profile
                    </button>
                    <Link
                      to="/login"
                      className="block rounded-[10px] px-3 py-2 text-sm text-primary/80 no-underline hover:bg-primary/[0.05]"
                    >
                      Switch account
                    </Link>
                  </div>
                </details>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{renderSection(active, role, alerts)}</main>
        </div>
      </div>

      {visibleToasts.length > 0 ? (
        <div className="pointer-events-none fixed right-4 top-20 z-40 space-y-2 sm:right-6">
          {visibleToasts.map((alert) => (
            <div
              key={alert.id}
              className={`pointer-events-auto w-[280px] rounded-[12px] border bg-white px-3.5 py-3 text-sm shadow-[var(--shadow-card)] ${toneStyles[alert.tone]}`}
            >
              {alert.text}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function renderSection(active: MenuKey, role: UserRole, alerts: SmartAlert[]) {
  if (active === 'classes') {
    return (
      <Suspense
        fallback={
          <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
            Loading live classrooms…
          </div>
        }
      >
        <LiveClassroomDashboard />
      </Suspense>
    )
  }

  if (active === 'attendance') {
    if (role === 'teacher') {
      return (
        <Suspense
          fallback={
            <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
              Loading attendance…
            </div>
          }
        >
          <TeacherAttendanceDashboard />
        </Suspense>
      )
    }

    return (
      <Suspense
        fallback={
          <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
            Loading performance…
          </div>
        }
      >
        <PerformanceDashboard />
      </Suspense>
    )
  }

  if (active === 'dashboard') {
    return (
      <div className="space-y-4">
        {alerts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {alerts.map((alert) => (
              <article
                key={alert.id}
                className={`rounded-[12px] border bg-white p-4 text-sm font-medium shadow-[var(--shadow-card)] ${toneStyles[alert.tone]}`}
              >
                {alert.text}
              </article>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Upcoming classes', role === 'teacher' ? '6 sessions' : '4 sessions'],
            ['Attendance', role === 'parent' ? '95% (child)' : '96%'],
            ['Performance', role === 'teacher' ? '24 submissions' : 'A- average'],
            ['Messages', '3 unread'],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[12px] border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <p className="text-sm text-primary/60">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
            </article>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-[12px] border border-primary/[0.08] bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-lg font-semibold text-primary">
        {menuItems.find((item) => item.key === active)?.label}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-primary/65">
        This is dynamic content for the {roleName[role].toLowerCase()} role. Connect this section
        to your backend module for real data rendering.
      </p>
    </section>
  )
}

const toneStyles: Record<AlertTone, string> = {
  danger: 'border-red-200 text-red-700 bg-red-50',
  info: 'border-blue-200 text-blue-700 bg-blue-50',
  success: 'border-green-200 text-green-700 bg-green-50',
  warning: 'border-amber-200 text-amber-700 bg-amber-50',
}

function getRoleAlerts(role: UserRole): SmartAlert[] {
  if (role === 'parent') {
    return [
      { id: 'p-1', text: "Your child missed today's class", tone: 'danger' },
      { id: 'p-2', text: 'Performance dropped this week', tone: 'warning' },
      { id: 'p-3', text: 'Great improvement!', tone: 'success' },
    ]
  }

  if (role === 'student') {
    return [
      { id: 's-1', text: 'You improved this week!', tone: 'success' },
      { id: 's-2', text: 'Practice more to reach Blue level', tone: 'info' },
    ]
  }

  return []
}
