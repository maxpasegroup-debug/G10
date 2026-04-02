import { useCallback, useMemo, useState } from 'react'

type AttendanceStatus = 'present' | 'absent' | 'late'

type RosterStudent = { id: string; name: string }

type ClassOption = {
  id: string
  label: string
  students: RosterStudent[]
}

const classesWithRosters: ClassOption[] = [
  {
    id: 'c1',
    label: 'Beginner Piano',
    students: [
      { id: 's1', name: 'Meera Krishnan' },
      { id: 's2', name: 'Riya Thomas' },
      { id: 's3', name: 'Arjun Nair' },
    ],
  },
  {
    id: 'c2',
    label: 'Junior Drums',
    students: [
      { id: 's4', name: 'Aditya Menon' },
      { id: 's5', name: 'Kiran Das' },
    ],
  },
  {
    id: 'c3',
    label: 'Vocal Group A',
    students: [
      { id: 's6', name: 'Sana Fathima' },
      { id: 's7', name: 'Neha Paul' },
      { id: 's8', name: 'Maya George' },
    ],
  },
]

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function AdminAttendancePage() {
  const [classId, setClassId] = useState(classesWithRosters[0]?.id ?? '')
  const [date, setDate] = useState(todayIso)
  const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({})
  const [savedHint, setSavedHint] = useState<string | null>(null)

  const activeClass = useMemo(
    () => classesWithRosters.find((c) => c.id === classId),
    [classId],
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

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusByStudent((prev) => ({ ...prev, [studentId]: status }))
    setSavedHint(null)
  }

  const handleSave = () => {
    if (!activeClass) return
    const marked = activeClass.students.filter((s) => statusByStudent[s.id] != null).length
    const total = activeClass.students.length
    setSavedHint(
      marked === total
        ? `Saved for ${activeClass.label} · ${date}`
        : `Saved (${marked} of ${total} marked) · ${activeClass.label} · ${date}`,
    )
  }

  const canSave = activeClass != null && activeClass.students.length > 0

  return (
    <div className="max-w-3xl space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="att-class" className="mb-2 block text-base font-semibold text-primary">
            Select class
          </label>
          <select
            id="att-class"
            value={classId}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          >
            {classesWithRosters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
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

      {activeClass ? (
        <div className="rounded-2xl border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
          <h2 className="text-lg font-bold text-primary">Students</h2>
          <p className="mt-1 text-sm text-primary/65">Tap one button per student.</p>

          <ul className="mt-6 space-y-4">
            {activeClass.students.map((student) => {
              const current = statusByStudent[student.id]
              return (
                <li
                  key={student.id}
                  className="flex flex-col gap-3 rounded-xl border border-primary/[0.06] bg-surface/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-lg font-semibold text-primary">{student.name}</span>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      aria-pressed={current === 'present'}
                      onClick={() => setStatus(student.id, 'present')}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] ${
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
                      onClick={() => setStatus(student.id, 'absent')}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] ${
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
                      onClick={() => setStatus(student.id, 'late')}
                      className={`min-h-[48px] min-w-[100px] rounded-xl px-4 text-base font-bold text-white transition sm:min-w-[110px] ${
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
              onClick={handleSave}
              disabled={!canSave}
              className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[220px]"
            >
              Save Attendance
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
      ) : null}
    </div>
  )
}
