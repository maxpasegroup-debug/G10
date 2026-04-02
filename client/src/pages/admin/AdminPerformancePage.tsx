import { useMemo, useState } from 'react'

type PerformanceBand = 'needs_improvement' | 'ok' | 'good' | 'perfect' | 'special'

type StudentOption = { id: string; name: string }

const students: StudentOption[] = [
  { id: 's1', name: 'Meera Krishnan' },
  { id: 's2', name: 'Riya Thomas' },
  { id: 's3', name: 'Arjun Nair' },
  { id: 's4', name: 'Aditya Menon' },
  { id: 's5', name: 'Kiran Das' },
  { id: 's6', name: 'Sana Fathima' },
]

const subjects = [
  { id: 'sub-piano', name: 'Piano' },
  { id: 'sub-drums', name: 'Drums' },
  { id: 'sub-vocal', name: 'Vocal' },
  { id: 'sub-guitar', name: 'Guitar' },
  { id: 'sub-theory', name: 'Music Theory' },
]

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

export function AdminPerformancePage() {
  const [studentId, setStudentId] = useState(students[0]?.id ?? '')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const [band, setBand] = useState<PerformanceBand | null>(null)
  const [remark, setRemark] = useState('')
  const [savedHint, setSavedHint] = useState<string | null>(null)

  const student = useMemo(() => students.find((s) => s.id === studentId), [studentId])
  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjectId])

  const onStudentChange = (id: string) => {
    setStudentId(id)
    setBand(null)
    setSavedHint(null)
  }

  const onSubjectChange = (id: string) => {
    setSubjectId(id)
    setBand(null)
    setSavedHint(null)
  }

  const onBandPick = (b: PerformanceBand) => {
    setBand(b)
    setSavedHint(null)
  }

  const handleSave = () => {
    if (!student || !subject || band == null) return
    const bandLabel = bands.find((x) => x.id === band)?.label ?? band
    const extra = remark.trim() ? ` · Note: “${remark.trim().slice(0, 80)}${remark.trim().length > 80 ? '…' : ''}”` : ''
    setSavedHint(`Saved · ${student.name} · ${subject.name} · ${bandLabel}${extra}`)
  }

  const canSave = student != null && subject != null && band != null

  return (
    <div className="max-w-3xl space-y-8">
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
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
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
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
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
        <p className="mt-1 text-sm text-primary/65">Tap one level. Red is lowest, blue is highest; yellow is special recognition.</p>

        <div className="mt-6 flex flex-col gap-3">
          {bands.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={band === b.id}
              onClick={() => onBandPick(b.id)}
              className={`min-h-[56px] w-full rounded-xl px-4 text-left text-lg font-bold transition sm:text-center ${
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
            placeholder="Short note for parents or teachers…"
            className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary placeholder:text-primary/40 outline-none ring-secondary/30 focus:ring-2"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[220px]"
          >
            Save Performance
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
