import { useCallback, useEffect, useMemo, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

type AttendanceStatus = 'present' | 'absent' | 'late'

type ClassRow = { id: number; name: string | null }
type StudentRow = { id: number; name: string | null }
type AttendanceRow = { student_id: number; date: string; status: string }

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function normalizeUiStatus(raw: string | undefined): AttendanceStatus | undefined {
  const s = (raw || '').toLowerCase()
  if (s === 'present') return 'present'
  if (s === 'absent') return 'absent'
  if (s === 'late') return 'late'
  return undefined
}

function apiStatus(s: AttendanceStatus): string {
  if (s === 'present') return 'Present'
  if (s === 'absent') return 'Absent'
  return 'Late'
}

async function readJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

export function AdminAttendancePage() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(todayIso)
  const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({})
  const [savedHint, setSavedHint] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rosterLoading, setRosterLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadClasses = useCallback(async () => {
    if (!API_URL) return
    const res = await fetch(apiUrl('/api/classes'), { headers: authHeaders() })
    const list = await readJson<ClassRow[]>(res)
    setClasses(list)
    setClassId((prev) => prev || (list[0] ? String(list[0].id) : ''))
  }, [])

  const loadRoster = useCallback(async (cid: string, d: string) => {
    if (!API_URL || !cid) {
      setStudents([])
      return
    }
    const [stRes, attRes] = await Promise.all([
      fetch(apiUrl(`/api/students?class_id=${cid}`), { headers: authHeaders() }),
      fetch(apiUrl(`/api/attendance?class_id=${cid}&date=${d}`), { headers: authHeaders() }),
    ])
    const roster = await readJson<StudentRow[]>(stRes)
    const att = await readJson<AttendanceRow[]>(attRes)
    setStudents(roster)
    const next: Record<string, AttendanceStatus> = {}
    for (const row of att) {
      const u = normalizeUiStatus(row.status)
      if (u) next[String(row.student_id)] = u
    }
    setStatusByStudent(next)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function boot() {
      setLoading(true)
      try {
        await loadClasses()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [loadClasses])

  useEffect(() => {
    if (!classId) return
    let cancelled = false
    async function run() {
      try {
        await loadRoster(classId, date)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load roster')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [classId, date, loadRoster])

  const activeClass = useMemo(
    () => classes.find((c) => String(c.id) === classId),
    [classId, classes],
  )

  const resetMarks = useCallback(() => {
    setStatusByStudent({})
    setSavedHint(null)
  }, [])

  const onClassChange = (id: string) => {
    setClassId(id)
    resetMarks()
  }

  const onDateChange = (value: string) => {
    setDate(value)
    resetMarks()
  }

  const setStatus = (sid: string, status: AttendanceStatus) => {
    setStatusByStudent((prev) => ({ ...prev, [sid]: status }))
    setSavedHint(null)
  }

  async function handleSave() {
    if (!students.length || !API_URL) return
    setSaving(true)
    setError(null)
    setSavedHint(null)
    try {
      let marked = 0
      for (const s of students) {
        const st = statusByStudent[String(s.id)]
        if (!st) continue
        const res = await fetch(apiUrl('/api/attendance'), {
          method: 'POST',
          headers: authHeaders(true),
          body: JSON.stringify({
            studentId: s.id,
            date,
            status: apiStatus(st),
          }),
        })
        await readJson(res)
        marked += 1
      }
      const total = students.length
      setSavedHint(
        marked === total && total > 0
          ? `Saved for ${activeClass?.name ?? 'class'} · ${date}`
          : `Saved (${marked} of ${total} marked) · ${date}`,
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const canSave = students.length > 0
  const rosterBusy = rosterLoading || saving

  if (loading) {
    return <p className="text-primary/60">Loading…</p>
  }

  return (
    <div className="max-w-3xl space-y-8">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="att-class" className="mb-2 block text-base font-semibold text-primary">
            Select class
          </label>
          <select
            id="att-class"
            value={classId}
            onChange={(e) => onClassChange(e.target.value)}
            disabled={rosterBusy}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {classes.length === 0 ? (
              <option value="">No classes</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name || `Class ${c.id}`}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="att-date" className="mb-2 block text-base font-semibold text-primary">
            Select date
          </label>
          <input
            id="att-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          />
        </div>
      </div>

      {rosterLoading ? (
        <p className="text-sm text-primary/55">Loading roster…</p>
      ) : null}

      {students.length > 0 ? (
        <div className="rounded-2xl border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
          <h2 className="text-lg font-bold text-primary">Students</h2>
          <p className="mt-1 text-sm text-primary/65">Tap one button per student.</p>

          <ul className="mt-6 space-y-4">
            {students.map((student) => {
              const current = statusByStudent[String(student.id)]
              return (
                <li
                  key={student.id}
                  className="flex flex-col gap-3 rounded-xl border border-primary/[0.06] bg-surface/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-lg font-semibold text-primary">{student.name ?? `Student ${student.id}`}</span>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      aria-pressed={current === 'present'}
                      onClick={() => setStatus(String(student.id), 'present')}
                      disabled={rosterBusy}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] disabled:cursor-not-allowed disabled:opacity-50 ${
                        current === 'present'
                          ? 'bg-green-600 ring-2 ring-green-800 ring-offset-2'
                          : 'bg-green-600/85 hover:bg-green-600'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      aria-pressed={current === 'absent'}
                      onClick={() => setStatus(String(student.id), 'absent')}
                      disabled={rosterBusy}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] disabled:cursor-not-allowed disabled:opacity-50 ${
                        current === 'absent'
                          ? 'bg-red-600 ring-2 ring-red-900 ring-offset-2'
                          : 'bg-red-600/90 hover:bg-red-600'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      aria-pressed={current === 'late'}
                      onClick={() => setStatus(String(student.id), 'late')}
                      disabled={rosterBusy}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] disabled:cursor-not-allowed disabled:opacity-50 ${
                        current === 'late'
                          ? 'bg-orange-500 ring-2 ring-orange-800 ring-offset-2'
                          : 'bg-orange-500/90 hover:bg-orange-500'
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!canSave || rosterBusy}
              className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[220px]"
            >
              {saving ? 'Saving…' : 'Save Attendance'}
            </button>
            {savedHint ? (
              <p className="text-center text-base font-medium text-green-700 sm:text-left">{savedHint}</p>
            ) : (
              <p className="text-center text-sm text-primary/55 sm:text-left">
                Tap Present, Absent, or Late for each student.
              </p>
            )}
          </div>
        </div>
      ) : classId ? (
        <p className="text-sm text-primary/60">No students in this class.</p>
      ) : null}
    </div>
  )
}
