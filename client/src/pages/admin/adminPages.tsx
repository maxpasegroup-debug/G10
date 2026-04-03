import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

async function readList(res: Response): Promise<unknown[]> {
  const body = (await res.json()) as { success?: boolean; data?: unknown[]; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return (body.data ?? []) as unknown[]
}

export function AdminHomePage() {
  const [studentCount, setStudentCount] = useState<number | null>(null)
  const [classCount, setClassCount] = useState<number | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!API_URL) {
      setLoadError('VITE_API_URL is not set')
      setSummaryLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setSummaryLoading(true)
      setLoadError(null)
      try {
        const [sRes, cRes] = await Promise.all([
          fetch(apiUrl('/api/students'), { headers: authHeaders() }),
          fetch(apiUrl('/api/classes'), { headers: authHeaders() }),
        ])
        const students = await readList(sRes)
        const classes = await readList(cRes)
        if (!cancelled) {
          setStudentCount(students.length)
          setClassCount(classes.length)
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Could not load summary')
      } finally {
        if (!cancelled) setSummaryLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-primary md:text-3xl">Today&apos;s actions</h2>
        <p className="mt-1 text-lg text-primary/65">What needs your attention right now.</p>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>
      ) : null}

      {summaryLoading && !loadError ? (
        <p className="text-sm text-primary/55">Loading summary…</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-base font-semibold text-primary/70">Total Students</p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-primary">
            {summaryLoading && studentCount == null ? '…' : studentCount == null ? '—' : studentCount}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-base font-semibold text-primary/70">Classes</p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-secondary">
            {summaryLoading && classCount == null ? '…' : classCount == null ? '—' : classCount}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold text-primary">Quick actions</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            to="/admin/users"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:min-w-[200px]"
          >
            Manage users
          </Link>
          <Link
            to="/admin/students"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:min-w-[200px]"
          >
            Students
          </Link>
          <Link
            to="/admin/classes"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:min-w-[200px]"
          >
            Classes
          </Link>
          <Link
            to="/admin/attendance"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-secondary px-6 py-4 text-lg font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover sm:min-w-[200px]"
          >
            Attendance
          </Link>
        </div>
      </div>
    </div>
  )
}
