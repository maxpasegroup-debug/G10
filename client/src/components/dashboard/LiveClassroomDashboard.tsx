import { useEffect, useMemo, useState } from 'react'
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

type StudioFilter = string
type SubjectFilter = string

const ALL_STUDIOS = 'All studios'
const ALL_SUBJECTS = 'All subjects'

export function LiveClassroomDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [studio, setStudio] = useState<StudioFilter>(ALL_STUDIOS)
  const [subject, setSubject] = useState<SubjectFilter>(ALL_SUBJECTS)

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      setError('Set VITE_API_URL in the client environment to load classes.')
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetchData<ClassRow[]>('/api/classes', { headers: authHeaders() })
        if (cancelled) return
        setClasses(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load classes')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const studioOptions = useMemo(() => {
    const set = new Set<string>()
    classes.forEach((c) => {
      const label = (c.studio || c.name || '').trim()
      if (label) set.add(label)
    })
    return [ALL_STUDIOS, ...[...set].sort()]
  }, [classes])

  const subjectOptions = useMemo(() => {
    const set = new Set<string>()
    classes.forEach((c) => {
      const label = (c.subject || '').trim()
      if (label) set.add(label)
    })
    return [ALL_SUBJECTS, ...[...set].sort()]
  }, [classes])

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const studioLabel = (c.studio || c.name || '').trim()
      const studioMatch = studio === ALL_STUDIOS || studioLabel === studio
      const sub = (c.subject || '').trim()
      const subjectMatch = subject === ALL_SUBJECTS || sub === subject
      return studioMatch && subjectMatch
    })
  }, [classes, studio, subject])

  if (loading) {
    return (
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
        Loading classes…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-5 text-sm text-red-800 shadow-[var(--shadow-card)]">
        {error}
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">
              Studio / room
            </span>
            <select
              value={studio}
              onChange={(e) => setStudio(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {studioOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">Subject</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="h-11 self-end rounded-[8px] bg-secondary px-5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover"
          >
            View Live
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
            No classes match these filters.
          </p>
        ) : (
          filtered.map((c) => {
            const title = (c.studio || c.name || `Class ${c.id}`).trim()
            const sub = (c.subject || 'Session').trim()
            const initial = sub.charAt(0).toUpperCase() || String(c.id)
            const live = Boolean(c.is_live)
            return (
              <article
                key={c.id}
                className={`overflow-hidden rounded-[12px] border bg-white shadow-[var(--shadow-card)] ${
                  live ? 'border-secondary ring-2 ring-secondary/35' : 'border-primary/[0.08]'
                }`}
              >
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                  <span
                    className="font-[family-name:var(--font-brand)] text-5xl font-bold text-primary/20"
                    aria-hidden
                  >
                    {initial}
                  </span>
                  {live ? (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-sm">
                      LIVE
                    </span>
                  ) : null}
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                      aria-label={`Mute ${title}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M23 9l-6 6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                      aria-label={`Expand ${title}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H3v-6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3l-7 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 p-4">
                  <p className="text-base font-semibold text-primary">{title}</p>
                  <p className="text-sm text-primary/65">{sub} session</p>
                  {c.name && c.studio && c.name !== c.studio ? (
                    <p className="text-xs text-primary/50">{c.name}</p>
                  ) : null}
                  {c.meeting_link?.trim() ? (
                    <a
                      href={c.meeting_link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-[10px] bg-secondary px-4 text-sm font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition hover:bg-secondary-hover"
                    >
                      Join Class
                    </a>
                  ) : null}
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
