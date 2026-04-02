import { useCallback, useId, useState, type FormEvent } from 'react'

type ClassItem = {
  id: string
  className: string
  subject: string
  time: string
  teacher: string
}

const subjectOptions = ['Piano', 'Guitar', 'Vocal', 'Drums'] as const

const initialClasses: ClassItem[] = [
  {
    id: 'c1',
    className: 'Beginner Piano',
    subject: 'Piano',
    time: 'Mon, Wed, Fri – 5:00 PM',
    teacher: 'John Mathew',
  },
  {
    id: 'c2',
    className: 'Junior Drums',
    subject: 'Drums',
    time: 'Tue, Thu – 4:30 PM',
    teacher: 'Rahul Varma',
  },
  {
    id: 'c3',
    className: 'Vocal Group A',
    subject: 'Vocal',
    time: 'Mon, Wed – 5:00 PM',
    teacher: 'Ananya Menon',
  },
]

function nextId() {
  return `c-${Date.now()}`
}

export function AdminClassesPage() {
  const formId = useId()
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses)
  const [formOpen, setFormOpen] = useState(false)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState<string>(subjectOptions[0])
  const [time, setTime] = useState('')
  const [teacher, setTeacher] = useState('')

  const resetForm = useCallback(() => {
    setName('')
    setSubject(subjectOptions[0])
    setTime('')
    setTeacher('')
  }, [])

  const openForm = useCallback(() => {
    resetForm()
    setFormOpen(true)
  }, [resetForm])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    resetForm()
  }, [resetForm])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setClasses((prev) => [
      ...prev,
      {
        id: nextId(),
        className: name.trim(),
        subject,
        time: time.trim(),
        teacher: teacher.trim(),
      },
    ])
    closeForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg text-primary/70">{classes.length} classes</p>
        <button
          type="button"
          onClick={openForm}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-secondary px-6 py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover sm:ml-auto"
        >
          Add Class
        </button>
      </div>

      <ul className="space-y-4">
        {classes.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <h3 className="text-xl font-bold text-primary">{item.className}</h3>
            <div className="mt-3 grid gap-2 text-base sm:grid-cols-3 sm:gap-6">
              <p>
                <span className="font-semibold text-primary/55">Subject </span>
                <span className="font-medium text-secondary">{item.subject}</span>
              </p>
              <p>
                <span className="font-semibold text-primary/55">Time </span>
                <span className="text-primary/85">{item.time}</span>
              </p>
              <p>
                <span className="font-semibold text-primary/55">Teacher </span>
                <span className="text-primary/85">{item.teacher}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      {formOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
          onClick={closeForm}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id={`${formId}-title`} className="text-xl font-bold text-primary">
                Add class
              </h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm font-semibold text-primary/60 hover:text-primary"
                onClick={closeForm}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Class name
                </label>
                <input
                  id={`${formId}-name`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                  placeholder="e.g. Beginner Piano"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-subject`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Subject
                </label>
                <select
                  id={`${formId}-subject`}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                >
                  {subjectOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-time`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Time
                </label>
                <input
                  id={`${formId}-time`}
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                  placeholder="e.g. Mon, Wed – 5:00 PM"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-teacher`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Teacher
                </label>
                <input
                  id={`${formId}-teacher`}
                  required
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                  placeholder="Teacher name"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[52px] rounded-xl bg-secondary py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover"
              >
                Save class
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
