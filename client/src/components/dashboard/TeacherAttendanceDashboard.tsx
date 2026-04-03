import { useCallback, useEffect, useMemo, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

type AttendanceStatus = 'Present' | 'Absent' | 'Late'
type PerformanceColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Orange'

type StudentRow = {
  id: string
  name: string
  photo: string
  attendance: AttendanceStatus
  performance: PerformanceColor
  remark: string
}

type ClassRow = { id: number; name: string | null; subject: string | null; studio: string | null }

type StudentApi = {
  id: number
  name: string | null
  photo: string | null
  subject: string | null
}

type AttendanceApi = { id: number; student_id: number; date: string; status: string }
type PerformanceApi = {
  id: number
  student_id: number
  score: string
  remarks: string | null
  created_at: string
}

const statusStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-green-100 text-green-800 border-green-300',
  Absent: 'bg-red-100 text-red-700 border-red-300',
  Late: 'bg-amber-100 text-amber-800 border-amber-300',
}

const performanceColorMap: Record<PerformanceColor, string> = {
  Red: '#dc2626',
  Blue: '#2563eb',
  Green: '#16a34a',
  Yellow: '#D4AF37',
  Orange: '#f97316',
}

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop'

function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function normalizeAttendanceStatus(raw: string | undefined): AttendanceStatus {
  const s = (raw || '').toLowerCase()
  if (s === 'absent') return 'Absent'
  if (s === 'late') return 'Late'
  return 'Present'
}

function scoreToPerformanceColor(score: string): PerformanceColor {
  const lower = String(score || '').trim().toLowerCase()
  if (lower.includes('red')) return 'Red'
  if (lower.includes('blue')) return 'Blue'
  if (lower.includes('green')) return 'Green'
  if (lower.includes('yellow')) return 'Yellow'
  if (lower.includes('orange')) return 'Orange'
  const n = Number.parseInt(String(score).trim(), 10)
  if (!Number.isNaN(n)) {
    if (n < 60) return 'Red'
    if (n < 72) return 'Orange'
    if (n < 82) return 'Green'
    if (n < 92) return 'Blue'
    return 'Yellow'
  }
  return 'Green'
}

function latestAttendanceForStudent(rows: AttendanceApi[], studentId: number, date: string): string | undefined {
  const day = rows.filter((r) => r.student_id === studentId && String(r.date).slice(0, 10) === date)
  if (day.length === 0) return undefined
  const sorted = [...day].sort((a, b) => b.id - a.id)
  return sorted[0].status
}

function latestPerformanceForStudent(rows: PerformanceApi[], studentId: number): PerformanceApi | undefined {
  const mine = rows.filter((r) => r.student_id === studentId)
  if (mine.length === 0) return undefined
  return [...mine].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
}

async function readList<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

export function TeacherAttendanceDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('')
  const [selectedDate, setSelectedDate] = useState(todayIsoDate)
  const [students, setStudents] = useState<StudentRow[]>([])
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const loadRoster = useCallback(async (classId: number) => {
    if (!API_URL) throw new Error('VITE_API_URL is not set')

    const [stRes, attRes, perfRes] = await Promise.all([
      fetch(apiUrl(`/api/students?class_id=${classId}`), { headers: authHeaders() }),
      fetch(apiUrl(`/api/attendance?class_id=${classId}`), { headers: authHeaders() }),
      fetch(apiUrl(`/api/performance?class_id=${classId}`), { headers: authHeaders() }),
    ])

    const list = await readList<StudentApi[]>(stRes)
    const att = await readList<AttendanceApi[]>(attRes)
    const perf = await readList<PerformanceApi[]>(perfRes)

    const rows: StudentRow[] = list.map((s) => {
      const attStatus = latestAttendanceForStudent(att, s.id, selectedDate)
      const p = latestPerformanceForStudent(perf, s.id)
      return {
        id: String(s.id),
        name: s.name || `Student #${s.id}`,
        photo: s.photo || PLACEHOLDER,
        attendance: normalizeAttendanceStatus(attStatus),
        performance: p ? scoreToPerformanceColor(p.score) : 'Green',
        remark: p?.remarks || '',
      }
    })
    setStudents(rows)
  }, [selectedDate])

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      setError('Set VITE_API_URL in the client environment to load classes.')
      return
    }

    let cancelled = false
    async function boot() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiUrl('/api/classes'), { headers: authHeaders() })
        const data = await readList<ClassRow[]>(res)
        if (cancelled) return
        setClasses(data)
        if (data.length) {
          setSelectedClassId((prev) => (prev === '' ? data[0].id : prev))
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load classes')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!API_URL || selectedClassId === '') return
    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        await loadRoster(Number(selectedClassId))
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load roster')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [selectedClassId, loadRoster])

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId],
  )

  const controlsLocked = loading || saveState === 'saving'

  const attendanceSummary = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        acc[student.attendance] += 1
        return acc
      },
      { Present: 0, Absent: 0, Late: 0 } as Record<AttendanceStatus, number>,
    )
  }, [students])

  function updateStudent(id: string, patch: Partial<StudentRow>) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  async function handleSave() {
    if (!API_URL || selectedClassId === '') return
    setSaveState('saving')
    setSaveError(null)
    try {
      for (const s of students) {
        const attRes = await fetch(apiUrl('/api/attendance'), {
          method: 'POST',
          headers: authHeaders(true),
          body: JSON.stringify({
            studentId: Number(s.id),
            date: selectedDate,
            status: s.attendance,
          }),
        })
        if (!attRes.ok) {
          const body = (await attRes.json()) as { error?: string }
          throw new Error(body.error || 'Attendance save failed')
        }
        const perfRes = await fetch(apiUrl('/api/performance'), {
          method: 'POST',
          headers: authHeaders(true),
          body: JSON.stringify({
            studentId: Number(s.id),
            score: s.performance,
            remarks: s.remark.trim() ? s.remark.trim() : null,
          }),
        })
        if (!perfRes.ok) {
          const body = (await perfRes.json()) as { error?: string }
          throw new Error(body.error || 'Performance save failed')
        }
      }
      setSavedAt(new Date().toLocaleTimeString())
      setSaveState('idle')
      await loadRoster(Number(selectedClassId))
    } catch (e) {
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  if (loading && classes.length === 0) {
    return (
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
        Loading classes…
      </div>
    )
  }

  if (error && classes.length === 0) {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-5 text-sm text-red-800 shadow-[var(--shadow-card)]">
        {error}
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">Class</span>
            <select
              value={selectedClassId === '' ? '' : String(selectedClassId)}
              onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
              disabled={controlsLocked}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || `Class ${c.id}`}
                  {c.subject ? ` — ${c.subject}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">Subject</span>
            <p className="rounded-[12px] border border-primary/[0.08] bg-surface/80 px-3.5 py-2.5 text-sm text-primary">
              {selectedClass?.subject || '—'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 self-end text-xs font-semibold">
            <span className="rounded-[10px] border border-green-200 bg-green-50 px-2.5 py-2 text-center text-green-700">
              P: {attendanceSummary.Present}
            </span>
            <span className="rounded-[10px] border border-red-200 bg-red-50 px-2.5 py-2 text-center text-red-700">
              A: {attendanceSummary.Absent}
            </span>
            <span className="rounded-[10px] border border-amber-200 bg-amber-50 px-2.5 py-2 text-center text-amber-700">
              L: {attendanceSummary.Late}
            </span>
          </div>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="mt-2 text-xs text-primary/50">Refreshing roster…</p> : null}
      </div>

      <div className="overflow-hidden rounded-[12px] border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">
            <thead className="bg-primary/[0.04]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-primary/55">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/[0.07]">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-primary/55">
                    {selectedClassId === ''
                      ? 'Select a class.'
                      : 'No students assigned to this class. Set class_id on student records in the admin roster.'}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="align-top">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/10"
                        />
                        <p className="text-sm font-semibold text-primary">{student.name}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="inline-flex rounded-[12px] border border-primary/[0.12] bg-surface/70 p-1">
                        {(['Present', 'Absent', 'Late'] as AttendanceStatus[]).map((status) => {
                          const active = student.attendance === status
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateStudent(student.id, { attendance: status })}
                              disabled={controlsLocked}
                              className={`rounded-[10px] px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                active
                                  ? statusStyles[status]
                                  : 'text-primary/65 hover:bg-primary/[0.05]'
                              }`}
                            >
                              {status}
                            </button>
                          )
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(performanceColorMap) as PerformanceColor[]).map((colorName) => {
                          const active = student.performance === colorName
                          return (
                            <button
                              key={colorName}
                              type="button"
                              onClick={() => updateStudent(student.id, { performance: colorName })}
                              disabled={controlsLocked}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                active
                                  ? 'scale-105 border-primary/35 shadow-[0_2px_10px_-3px_rgba(11,42,74,0.28)]'
                                  : 'border-white/0 hover:scale-105'
                              }`}
                              style={{ backgroundColor: performanceColorMap[colorName] }}
                              aria-label={`${colorName} performance`}
                              title={colorName}
                            >
                              {active ? (
                                <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                              ) : null}
                            </button>
                          )
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <input
                        type="text"
                        value={student.remark}
                        onChange={(e) => updateStudent(student.id, { remark: e.target.value })}
                        placeholder="Add remark…"
                        disabled={controlsLocked}
                        className="w-full rounded-[10px] border border-primary/[0.12] bg-white px-3 py-2 text-sm text-primary outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {saveError ? <p className="mr-auto text-sm text-red-700">{saveError}</p> : null}
        {savedAt ? <p className="text-xs text-primary/55">Saved at {savedAt}</p> : null}
        <button
          type="button"
          disabled={controlsLocked || selectedClassId === '' || students.length === 0}
          onClick={() => void handleSave()}
          className="rounded-[8px] bg-secondary px-6 py-2.5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveState === 'saving' ? 'Saving…' : 'Save'}
        </button>
      </div>
    </section>
  )
}
