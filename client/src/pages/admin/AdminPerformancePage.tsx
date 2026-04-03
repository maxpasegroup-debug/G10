import { useCallback, useEffect, useMemo, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

type PerformanceBand = 'needs_improvement' | 'ok' | 'good' | 'perfect' | 'special'

type StudentRow = { id: number; name: string | null; subject: string | null }

const subjects = [
  { id: 'sub-piano', name: 'Piano' },
  { id: 'sub-drums', name: 'Drums' },
  { id: 'sub-vocal', name: 'Vocal' },
  { id: 'sub-guitar', name: 'Guitar' },
  { id: 'sub-theory', name: 'Music Theory' },
] as const

const bandToScore: Record<PerformanceBand, string> = {
  needs_improvement: 'Needs Improvement',
  ok: 'OK',
  good: 'Good',
  perfect: 'Perfect',
  special: 'Special',
}

const bands: {
  id: PerformanceBand
  label: string
  activeClass: string
  idleClass: string
}[] = [
  {
    id: 'needs_improvement',
    label: 'Needs Improvement',
    activeClass: 'bg-red-600 ring-2 ring-red-900 ring-offset-2',
    idleClass: 'bg-red-600/90 hover:bg-red-600',
  },
  {
    id: 'ok',
    label: 'OK',
    activeClass: 'bg-orange-500 ring-2 ring-orange-800 ring-offset-2',
    idleClass: 'bg-orange-500/90 hover:bg-orange-500',
  },
  {
    id: 'good',
    label: 'Good',
    activeClass: 'bg-green-600 ring-2 ring-green-900 ring-offset-2',
    idleClass: 'bg-green-600/85 hover:bg-green-600',
  },
  {
    id: 'perfect',
    label: 'Perfect',
    activeClass: 'bg-blue-600 ring-2 ring-blue-900 ring-offset-2',
    idleClass: 'bg-blue-600/90 hover:bg-blue-600',
  },
  {
    id: 'special',
    label: 'Special',
    activeClass: 'bg-amber-400 ring-2 ring-amber-700 ring-offset-2',
    idleClass: 'bg-amber-400/95 hover:bg-amber-400',
  },
]

async function readJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

export function AdminPerformancePage() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id ?? '')
  const [band, setBand] = useState<PerformanceBand | null>(null)
  const [remark, setRemark] = useState('')
  const [savedHint, setSavedHint] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!API_URL) {
      setLoadError('VITE_API_URL is not set')
      return
    }
    const res = await fetch(apiUrl('/api/students'), { headers: authHeaders() })
    const list = await readJson<StudentRow[]>(res)
    setStudents(list)
    setStudentId((prev) => prev || (list[0] ? String(list[0].id) : ''))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setLoadError(null)
      try {
        await load()
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Could not load students')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  const student = useMemo(
    () => students.find((s) => String(s.id) === studentId),
    [studentId, students],
  )
  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjectId])

  const onStudentChange = (id: string) => {
    setStudentId(id)
    setBand(null)
    setSavedHint(null)
    setSaveError(null)
  }

  const onSubjectChange = (id: string) => {
    setSubjectId(id)
    setBand(null)
    setSavedHint(null)
    setSaveError(null)
  }

  const onBandPick = (b: PerformanceBand) => {
    setBand(b)
    setSavedHint(null)
    setSaveError(null)
  }

  async function handleSave() {
    if (!student || !subject || band == null || !API_URL) return
    setSaving(true)
    setSavedHint(null)
    setSaveError(null)
    try {
      const score = `${bandToScore[band]} · ${subject.name}`
      const res = await fetch(apiUrl('/api/performance'), {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          studentId: student.id,
          score,
          remarks: remark.trim() || null,
        }),
      })
      await readJson<{ id: number }>(res)
      const bandLabel = bands.find((x) => x.id === band)?.label ?? band
      setSavedHint(`Saved · ${student.name ?? ''} · ${subject.name} · ${bandLabel}`)
      setRemark('')
      setBand(null)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const canSave = student != null && subject != null && band != null

  if (loading) {
    return <p className="text-primary/60">Loading…</p>
  }

  return (
    <div className="max-w-3xl space-y-8">
      {loadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{loadError}</p>
      ) : null}
      {saveError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{saveError}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="perf-student" className="mb-2 block text-base font-semibold text-primary">
            Select student
          </label>
          <select
            id="perf-student"
            value={studentId}
            onChange={(e) => onStudentChange(e.target.value)}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          >
            {students.length === 0 ? (
              <option value="">No students</option>
            ) : (
              students.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name ?? `Student ${s.id}`}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="perf-subject" className="mb-2 block text-base font-semibold text-primary">
            Select subject
          </label>
          <select
            id="perf-subject"
            value={subjectId}
            onChange={(e) => onSubjectChange(e.target.value)}
            disabled={saving}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
        <h2 className="text-lg font-bold text-primary">Performance</h2>
        <p className="mt-1 text-sm text-primary/65">Tap one level, then save.</p>

        <div className="mt-6 flex flex-col gap-3">
          {bands.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={band === b.id}
              onClick={() => onBandPick(b.id)}
              disabled={saving}
              className={`min-h-[56px] w-full rounded-xl px-4 text-left text-lg font-bold transition sm:text-center disabled:cursor-not-allowed disabled:opacity-55 ${
                b.id === 'special' ? 'text-primary' : 'text-white'
              } ${band === b.id ? b.activeClass : b.idleClass}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <label htmlFor="perf-remark" className="mb-2 block text-base font-semibold text-primary">
            Remark <span className="font-normal text-primary/55">(optional)</span>
          </label>
          <textarea
            id="perf-remark"
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value)
              setSavedHint(null)
            }}
            rows={3}
            placeholder="Short note…"
            disabled={saving}
            className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary placeholder:text-primary/40 outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave || saving}
            className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[220px]"
          >
            {saving ? 'Saving…' : 'Save Performance'}
          </button>
          {savedHint ? (
            <p className="text-center text-base font-medium text-green-700 sm:text-left">{savedHint}</p>
          ) : (
            <p className="text-center text-sm text-primary/55 sm:text-left">
              Choose student, subject, and one performance level.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
