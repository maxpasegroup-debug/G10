import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { EmptyState, EmptyStateIconClasses } from '../../components/EmptyState'
import { authHeaders } from '../../auth/authService'
import { API_URL } from '../../lib/api'
import { apiFetchData } from '../../lib/apiClient'

type ClassRow = {
  id: number
  name: string | null
  subject: string | null
  studio: string | null
  is_live: boolean | null
  meeting_link: string | null
}

const subjectOptions = ['Piano', 'Guitar', 'Vocal', 'Drums'] as const

export function AdminClassesPage() {
  const formId = useId()
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState<string>(subjectOptions[0])
  const [studio, setStudio] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [meetingLink, setMeetingLink] = useState('')

  const load = useCallback(async () => {
    if (!API_URL) {
      setListError('VITE_API_URL is not set')
      setClasses([])
      return
    }
    setListError(null)
    const data = await apiFetchData<ClassRow[]>('/api/classes', { headers: authHeaders() })
    setClasses(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        await load()
      } catch (e) {
        if (!cancelled) setListError(e instanceof Error ? e.message : 'Could not load classes')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  const resetForm = useCallback(() => {
    setName('')
    setSubject(subjectOptions[0])
    setStudio('')
    setIsLive(false)
    setMeetingLink('')
  }, [])

  const openForm = useCallback(() => {
    setFormError(null)
    resetForm()
    setFormOpen(true)
  }, [resetForm])

  const closeForm = useCallback(() => {
    if (submitting) return
    setFormOpen(false)
    setFormError(null)
    resetForm()
  }, [resetForm, submitting])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!API_URL) return
    setFormError(null)
    setSubmitting(true)
    try {
      await apiFetchData<ClassRow>('/api/classes', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          name: name.trim(),
          subject,
          studio: studio.trim() || null,
          isLive,
          meetingLink: meetingLink.trim() || null,
        }),
      })
      setFormOpen(false)
      setFormError(null)
      resetForm()
      await load()
      toast.success('Class created successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error saving data'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-primary/60">Loading classes…</p>
  }

  return (
    <div className="space-y-6">
      {listError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{listError}</p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg text-primary/70">{classes.length} classes</p>
        <button
          type="button"
          onClick={openForm}
          disabled={submitting}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-secondary px-6 py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
        >
          Add Class
        </button>
      </div>

      {!listError && classes.length === 0 ? (
        <EmptyState
          icon={<EmptyStateIconClasses />}
          title="No classes created"
          description="Create a class to organize students, schedules, and live sessions."
          action={{
            label: 'Add class',
            onClick: openForm,
            disabled: submitting,
          }}
        />
      ) : classes.length > 0 ? (
        <ul className="space-y-4">
          {classes.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
            >
              <p className="text-xl font-bold text-primary">{item.name}</p>
              <p className="mt-2 text-base text-primary/75">
                <span className="font-semibold text-primary/85">Subject: </span>
                {item.subject || '—'}
              </p>
              {item.studio ? (
                <p className="mt-1 text-base text-primary/75">
                  <span className="font-semibold text-primary/85">Studio / schedule: </span>
                  {item.studio}
                </p>
              ) : null}
              {item.meeting_link ? (
                <p className="mt-2 text-sm text-primary/70">
                  <span className="font-semibold text-primary/85">Meeting link: </span>
                  <span className="break-all">{item.meeting_link}</span>
                </p>
              ) : null}
              {item.is_live ? (
                <span className="mt-3 inline-block rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-800">
                  Live
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {formOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
          onClick={closeForm}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={`${formId}-title`} className="text-xl font-bold text-primary">
              Add class
            </h2>
            {formError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {formError}
              </p>
            ) : null}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Class name
                </label>
                <input
                  id={`${formId}-name`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="e.g. Beginner Piano"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-sub`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Subject
                </label>
                <select
                  id={`${formId}-sub`}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {subjectOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-studio`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Studio / schedule
                </label>
                <input
                  id={`${formId}-studio`}
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Room or times"
                />
              </div>
              <div>
                <label htmlFor={`${formId}-meet`} className="mb-1.5 block text-sm font-semibold text-primary">
                  Meeting link
                </label>
                <input
                  id={`${formId}-meet`}
                  type="url"
                  inputMode="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="https://meet.google.com/… or Zoom link"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary">
                <input
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
                Mark as live session
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[52px] rounded-xl bg-secondary py-3 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Creating…' : 'Create class'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
