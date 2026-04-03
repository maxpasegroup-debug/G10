import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

type StudentRow = {
  id: number
  name: string | null
  photo: string | null
  subject: string | null
  class_id: number | null
}

type ClassOption = { id: number; name: string | null }

const courseOptions = ['Piano', 'Guitar', 'Vocal', 'Drums'] as const

async function readJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

export function AdminStudentsPage() {
  const formId = useId()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [activeId, setActiveId] = useState<number | null>(null)
  const [viewId, setViewId] = useState<number | null>(null)

  const [formName, setFormName] = useState('')
  const [formSubject, setFormSubject] = useState<string>(courseOptions[0])
  const [formPhotoUrl, setFormPhotoUrl] = useState('')
  const [formClassId, setFormClassId] = useState<string>('')

  const load = useCallback(async () => {
    if (!API_URL) {
      setListError('VITE_API_URL is not set')
      setStudents([])
      return
    }
    setListError(null)
    const [sRes, cRes] = await Promise.all([
      fetch(apiUrl('/api/students'), { headers: authHeaders() }),
      fetch(apiUrl('/api/classes'), { headers: authHeaders() }),
    ])
    const list = await readJson<StudentRow[]>(sRes)
    const cls = await readJson<ClassOption[]>(cRes)
    setStudents(list)
    setClasses(cls)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        await load()
      } catch (e) {
        if (!cancelled) setListError(e instanceof Error ? e.message : 'Could not load data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  const activeStudent = useMemo(
    () => (viewId != null ? students.find((s) => s.id === viewId) : null),
    [viewId, students],
  )

  const resetForm = useCallback(() => {
    setFormName('')
    setFormSubject(courseOptions[0])
    setFormPhotoUrl('')
    setFormClassId('')
  }, [])

  const openAdd = useCallback(() => {
    setMode('add')
    setActiveId(null)
    resetForm()
    setPanelOpen(true)
  }, [resetForm])

  const openEdit = useCallback(
    (s: StudentRow) => {
      setFormError(null)
      setMode('edit')
      setActiveId(s.id)
      setFormName(s.name || '')
      setFormSubject((s.subject && courseOptions.includes(s.subject as (typeof courseOptions)[number])
        ? s.subject
        : courseOptions[0]) as string)
      setFormPhotoUrl(s.photo || '')
      setFormClassId(s.class_id != null ? String(s.class_id) : '')
      setPanelOpen(true)
    },
    [],
  )

  const closePanel = useCallback(() => {
    if (submitting) return
    setPanelOpen(false)
    setFormError(null)
    resetForm()
    setActiveId(null)
  }, [resetForm, submitting])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!API_URL) return
    setFormError(null)
    setSubmitting(true)
    const payload = {
      name: formName.trim(),
      subject: formSubject,
      photo: formPhotoUrl.trim() || null,
      class_id: formClassId ? Number(formClassId) : null,
    }
    try {
      if (mode === 'add') {
        const res = await fetch(apiUrl('/api/students'), {
          method: 'POST',
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        })
        await readJson<StudentRow>(res)
      } else if (activeId != null) {
        const res = await fetch(apiUrl(`/api/students/${activeId}`), {
          method: 'PATCH',
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        })
        await readJson<StudentRow>(res)
      }
      setPanelOpen(false)
      setFormError(null)
      resetForm()
      setActiveId(null)
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const photoFallback =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop'

  if (loading) {
    return <p className="text-primary/60">Loading students…</p>
  }

  return (
    <div className="space-y-6">
      {listError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{listError}</p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg text-primary/70">{students.length} students</p>
        <button
          type="button"
          onClick={openAdd}
          disabled={submitting}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-secondary px-6 py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
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
                src={student.photo || photoFallback}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-primary/[0.06]"
                width={80}
                height={80}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-primary">{student.name}</h3>
                <p className="mt-1 text-sm font-medium text-secondary">{student.subject || '—'}</p>
              </div>
            </div>
            <div className="mt-auto flex gap-3 border-t border-primary/[0.08] p-4">
              <button
                type="button"
                onClick={() => setViewId(student.id)}
                disabled={submitting}
                className="min-h-[44px] flex-1 rounded-xl border border-primary/20 bg-white py-2.5 text-sm font-bold text-primary transition hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => openEdit(student)}
                disabled={submitting}
                className="min-h-[44px] flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-lg px-2 py-1 text-sm font-semibold text-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                onClick={closePanel}
                disabled={submitting}
              >
                Close
              </button>
            </div>
            {formError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {formError}
              </p>
            ) : null}
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
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-course`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Subject
                </label>
                <select
                  id={`${formId}-course`}
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-class`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Class <span className="font-normal text-primary/50">(optional)</span>
                </label>
                <select
                  id={`${formId}-class`}
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">— None —</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || `Class ${c.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-photo`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Photo URL <span className="font-normal text-primary/50">(optional)</span>
                </label>
                <input
                  id={`${formId}-photo`}
                  type="url"
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="https://…"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[52px] rounded-xl bg-secondary py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Saving…' : mode === 'add' ? 'Save student' : 'Update student'}
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
                src={activeStudent.photo || photoFallback}
                alt=""
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-primary/[0.08]"
              />
              <div>
                <h3 className="text-xl font-bold text-primary">{activeStudent.name}</h3>
                <p className="mt-2 text-base font-medium text-secondary">{activeStudent.subject || '—'}</p>
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
