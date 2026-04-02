import { useCallback, useId, useMemo, useState, type FormEvent } from 'react'

type Student = {
  id: string
  name: string
  phone: string
  course: string
  photo: string
}

const courseOptions = ['Piano', 'Guitar', 'Vocal', 'Drums'] as const

const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Meera Krishnan',
    phone: '+91 98765 11102',
    course: 'Piano',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 's2',
    name: 'Aditya Menon',
    phone: '+91 98765 22109',
    course: 'Drums',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 's3',
    name: 'Sana Fathima',
    phone: '+91 98765 33441',
    course: 'Vocal',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 's4',
    name: 'Vikram Das',
    phone: '+91 98765 44882',
    course: 'Guitar',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop',
  },
]

function nextId(list: Student[]) {
  const n = list.length + 1
  return `s${Date.now()}-${n}`
}

export function AdminStudentsPage() {
  const formId = useId()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [panelOpen, setPanelOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCourse, setFormCourse] = useState<string>(courseOptions[0])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const activeStudent = useMemo(
    () => (viewId ? students.find((s) => s.id === viewId) : null),
    [viewId, students],
  )

  const resetForm = useCallback(() => {
    setFormName('')
    setFormPhone('')
    setFormCourse(courseOptions[0])
    setPhotoFile(null)
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const openAdd = useCallback(() => {
    setMode('add')
    setActiveId(null)
    resetForm()
    setPanelOpen(true)
  }, [resetForm])

  const openEdit = useCallback(
    (student: Student) => {
      setMode('edit')
      setActiveId(student.id)
      setFormName(student.name)
      setFormPhone(student.phone)
      setFormCourse(student.course)
      setPhotoFile(null)
      setPhotoPreview(student.photo)
      setPanelOpen(true)
    },
    [],
  )

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    resetForm()
    setActiveId(null)
  }, [resetForm])

  function onPhotoChange(file: File | null) {
    setPhotoFile(file)
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const defaultPhoto =
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop'

    if (mode === 'add') {
      const photoUrl = photoPreview ?? defaultPhoto
      setStudents((prev) => [
        ...prev,
        {
          id: nextId(prev),
          name: formName.trim(),
          phone: formPhone.trim(),
          course: formCourse,
          photo: photoUrl,
        },
      ])
    } else if (activeId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                name: formName.trim(),
                phone: formPhone.trim(),
                course: formCourse,
                photo: photoFile != null && photoPreview != null ? photoPreview : s.photo,
              }
            : s,
        ),
      )
    }
    closePanel()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg text-primary/70">{students.length} students</p>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-secondary px-6 py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover sm:ml-auto"
        >
          Add Student
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => (
          <article
            key={student.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-4 p-5">
              <img
                src={student.photo}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-primary/[0.06]"
                width={80}
                height={80}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-primary">{student.name}</h3>
                <p className="mt-1 text-sm font-medium text-secondary">{student.course}</p>
              </div>
            </div>
            <div className="mt-auto flex gap-3 border-t border-primary/[0.08] p-4">
              <button
                type="button"
                onClick={() => setViewId(student.id)}
                className="min-h-[44px] flex-1 rounded-xl border border-primary/20 bg-white py-2.5 text-sm font-bold text-primary transition hover:bg-primary/[0.04]"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => openEdit(student)}
                className="min-h-[44px] flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-light"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      {panelOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
          onClick={closePanel}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id={`${formId}-title`} className="text-xl font-bold text-primary">
                {mode === 'add' ? 'Add student' : 'Edit student'}
              </h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm font-semibold text-primary/60 hover:text-primary"
                onClick={closePanel}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Name
                </label>
                <input
                  id={`${formId}-name`}
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-phone`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Phone
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                  placeholder="+91 …"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-course`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Course
                </label>
                <select
                  id={`${formId}-course`}
                  value={formCourse}
                  onChange={(e) => setFormCourse(e.target.value)}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                >
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-photo`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Photo
                </label>
                <input
                  id={`${formId}-photo`}
                  type="file"
                  accept="image/*"
                  className="w-full rounded-xl border border-dashed border-primary/25 bg-surface/50 px-3 py-3 text-sm text-primary file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
                />
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    className="mt-3 h-24 w-24 rounded-xl object-cover ring-2 ring-primary/[0.08]"
                  />
                ) : null}
              </div>
              <button
                type="submit"
                className="w-full min-h-[52px] rounded-xl bg-secondary py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover"
              >
                {mode === 'add' ? 'Save student' : 'Update student'}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {activeStudent ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Student details"
          onClick={() => setViewId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <img
                src={activeStudent.photo}
                alt=""
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-primary/[0.08]"
              />
              <div>
                <h3 className="text-xl font-bold text-primary">{activeStudent.name}</h3>
                <p className="mt-2 text-base font-medium text-secondary">{activeStudent.course}</p>
                <p className="mt-2 text-base text-primary/75">{activeStudent.phone}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full min-h-[48px] rounded-xl bg-primary py-3 text-base font-bold text-white"
              onClick={() => setViewId(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
