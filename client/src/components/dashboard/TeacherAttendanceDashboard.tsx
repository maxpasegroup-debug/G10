import { useMemo, useState } from 'react'

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

const classOptions = ['Class 8-A', 'Class 9-B', 'Class 10-C']
const subjectOptions = ['Keyboard', 'Guitar', 'Vocal', 'Drums']

const statusStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-green-100 text-green-800 border-green-300',
  Absent: 'bg-red-100 text-red-700 border-red-300',
  Late: 'bg-amber-100 text-amber-800 border-amber-300',
}

const performanceColorMap: Record<PerformanceColor, string> = {
  Red: '#dc2626',
  Blue: '#2563eb',
  Green: '#16a34a',
  Yellow: '#f4b400',
  Orange: '#f97316',
}

const initialStudents: StudentRow[] = [
  {
    id: 'st-1',
    name: 'Aarav Nair',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop',
    attendance: 'Present',
    performance: 'Blue',
    remark: '',
  },
  {
    id: 'st-2',
    name: 'Diya Menon',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop',
    attendance: 'Late',
    performance: 'Green',
    remark: '',
  },
  {
    id: 'st-3',
    name: 'Neha Paul',
    photo:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80&auto=format&fit=crop',
    attendance: 'Absent',
    performance: 'Red',
    remark: '',
  },
  {
    id: 'st-4',
    name: 'Rohan Babu',
    photo:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=120&q=80&auto=format&fit=crop',
    attendance: 'Present',
    performance: 'Yellow',
    remark: '',
  },
]

export function TeacherAttendanceDashboard() {
  const [selectedClass, setSelectedClass] = useState(classOptions[0])
  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0])
  const [students, setStudents] = useState<StudentRow[]>(initialStudents)
  const [savedAt, setSavedAt] = useState<string | null>(null)

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

  function handleSave() {
    // Future API integration point.
    setSavedAt(new Date().toLocaleTimeString())
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">
              Select Class
            </span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {classOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">
              Select Subject
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {subjectOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

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
              {students.map((student) => (
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
                            className={`rounded-[10px] px-3 py-1.5 text-xs font-semibold transition ${
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
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                              active
                                ? 'scale-105 border-primary/35 shadow-[0_2px_10px_-3px_rgba(15,47,79,0.28)]'
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
                      placeholder="Add remark..."
                      className="w-full rounded-[10px] border border-primary/[0.12] bg-white px-3 py-2 text-sm text-primary outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {savedAt ? <p className="text-xs text-primary/55">Saved at {savedAt}</p> : null}
        <button
          type="button"
          onClick={handleSave}
          className="rounded-[12px] bg-secondary px-6 py-2.5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(244,180,0,0.45)] transition hover:bg-secondary-hover"
        >
          Save
        </button>
      </div>
    </section>
  )
}
