import { useEffect, useState } from 'react'
import type { UserRole } from '../../auth/types'
import { authHeaders } from '../../auth/authService'
import { API_URL } from '../../lib/api'
import { apiFetchData } from '../../lib/apiClient'

type Props = {
  role: UserRole
  studentId?: number
  classId?: number
}

type PerfRow = { student_id: number; score: string; created_at: string }
type AttRow = { student_id: number; date: string; status: string }
type StudentRow = { id: number; class_id: number | null; name: string | null }

function attendancePct(rows: AttRow[], studentId: number): number {
  const mine = rows.filter((r) => r.student_id === studentId)
  if (mine.length === 0) return 0
  const ok = mine.filter((r) => {
    const s = (r.status || '').toLowerCase()
    return s === 'present' || s === 'late'
  }).length
  return Math.round((ok / mine.length) * 100)
}

export function DashboardHomeSummary({ role, studentId, classId }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cards, setCards] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      setError(null)
      setCards([
        { label: 'API', value: 'Set VITE_API_URL' },
        { label: 'Attendance', value: '—' },
        { label: 'Performance', value: '—' },
        { label: 'Messages', value: '—' },
      ])
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (role === 'teacher') {
          const [classes, students, perf] = await Promise.all([
            apiFetchData<{ id: number }[]>('/api/classes', { headers: authHeaders() }),
            apiFetchData<unknown[]>('/api/students', { headers: authHeaders() }),
            apiFetchData<unknown[]>('/api/performance', { headers: authHeaders() }),
          ])
          if (cancelled) return
          setCards([
            { label: 'My classes', value: String((classes ?? []).length) },
            { label: 'Students', value: String((students ?? []).length) },
            { label: 'Performance entries', value: String((perf ?? []).length) },
            { label: 'Messages', value: '—' },
          ])
          return
        }

        if ((role === 'student' || role === 'parent') && studentId) {
          const perfQ = new URLSearchParams({ student_id: String(studentId) })
          const perf = await apiFetchData<PerfRow[]>(`/api/performance?${perfQ}`, { headers: authHeaders() })
          const attParams = new URLSearchParams({ student_id: String(studentId) })
          if (classId) attParams.set('class_id', String(classId))
          const att = await apiFetchData<AttRow[]>(`/api/attendance?${attParams}`, { headers: authHeaders() })
          const student =
            (await apiFetchData<StudentRow | null>(`/api/students/${studentId}`, { headers: authHeaders() })) ??
            null
          let classLabel = '—'
          if (student?.class_id) {
            const cls =
              (await apiFetchData<{ name: string | null; subject: string | null } | null>(
                `/api/classes/${student.class_id}`,
                { headers: authHeaders() },
              )) ?? null
            if (cls) classLabel = [cls.name, cls.subject].filter(Boolean).join(' · ') || `Class ${student.class_id}`
          }
          const pct = attendancePct(att, studentId)
          const sorted = [...perf].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          )
          const latest = sorted.length ? sorted[sorted.length - 1].score : '—'
          if (cancelled) return
          setCards([
            { label: 'Your class', value: classLabel },
            { label: 'Attendance', value: `${pct}%` },
            { label: 'Latest performance', value: String(latest) },
            { label: 'Messages', value: '—' },
          ])
          return
        }

        if (cancelled) return
        setCards([
          {
            label: 'Profile',
            value: 'Add ?student_id=… for learner stats',
          },
          { label: 'Attendance', value: '—' },
          { label: 'Performance', value: '—' },
          { label: 'Messages', value: '—' },
        ])
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load summary')
          setCards([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [role, studentId, classId])

  if (loading) {
    return (
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-6 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
        Loading summary…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-5 text-sm text-red-800 shadow-[var(--shadow-card)]">
        {error}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value }) => (
        <article
          key={label}
          className="rounded-[12px] border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)]"
        >
          <p className="text-sm text-primary/60">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-primary">{value}</p>
        </article>
      ))}
    </div>
  )
}
