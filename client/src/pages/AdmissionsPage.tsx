import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'
import { PublicFooter } from '../components/PublicFooter'
import { useSiteSettings } from '../context/SettingsContext'
import { API_URL } from '../lib/api'
import { apiFetch } from '../lib/apiClient'
import { fetchPublicClasses } from '../lib/publicContent'

export function AdmissionsPage() {
  const { settings, loading } = useSiteSettings()
  const academy = settings?.academy_name?.trim() || ''
  const admissionsMsg = (settings?.admissions_message ?? '').trim()
  const location = useLocation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState<string>('')
  const [age, setAge] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const classes = await fetchPublicClasses()
        if (cancelled) return
        const subs = [...new Set(classes.map((c) => (c.subject || '').trim()).filter(Boolean))].sort()
        setSubjects(subs)
        setCourse((prev) => {
          if (prev && subs.includes(prev)) return prev
          return subs[0] ?? 'General enquiry'
        })
      } catch {
        if (!cancelled) {
          setSubjects([])
          setCourse('General enquiry')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (location.hash !== '#admission-form') return
    const el = document.getElementById('admission-form')
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  const selectCourse = useCallback((title: string) => {
    setCourse(title)
    document.getElementById('admission-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!API_URL) {
      const msg = 'This form requires the API (set VITE_API_URL).'
      setSubmitError(msg)
      toast.error(msg)
      return
    }
    setSubmitting(true)
    try {
      await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          course,
          age: age.trim() || null,
        }),
      })
      setSubmitted(true)
      toast.success('Enquiry submitted successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error saving data'
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Admissions Open"
          subtitle={
            loading && !academy && !admissionsMsg
              ? 'Loading…'
              : admissionsMsg || `Start your musical journey with ${academy || 'us'} today`
          }
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-14">
          <div className="mx-auto max-w-[1000px]">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
              {[
                {
                  step: 'Step 1',
                  title: 'Choose Your Course',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  ),
                },
                {
                  step: 'Step 2',
                  title: 'Book a Free Trial',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  ),
                },
                {
                  step: 'Step 3',
                  title: 'Confirm Admission',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" />
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-1 flex-col items-center text-center md:max-w-[280px]"
                >
                  <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      {item.icon}
                    </svg>
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/50">{item.step}</p>
                  <h2 className="mt-1 text-lg font-bold text-primary">{item.title}</h2>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-10 sm:px-6 md:px-[60px] md:pb-14">
          <div className="mx-auto max-w-[1000px]">
            <h2 className="mb-8 text-center text-xl font-bold text-primary md:text-2xl">Pick a program</h2>
            {subjects.length === 0 ? (
              <p className="mb-6 text-center text-sm text-primary/65">
                Subjects from your live class catalog will appear here. You can still enquire below.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((s) => (
                  <article
                    key={s}
                    className="overflow-hidden rounded-2xl border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]"
                  >
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                      <span className="font-[family-name:var(--font-brand)] text-4xl font-bold text-primary/25">
                        {s.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-primary">{s}</h3>
                      <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-light"
                        onClick={() => selectCourse(s)}
                      >
                        Select
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="admission-form"
          className="scroll-mt-[88px] px-4 pb-14 sm:px-6 md:px-[60px] md:pb-20"
        >
          <div className="mx-auto max-w-[520px]">
            <h2 className="mb-8 text-center text-xl font-bold text-primary md:text-2xl">Quick enquiry</h2>
            <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
              {submitted ? (
                <p className="py-6 text-center text-base font-medium text-primary/80">
                  Thank you! We&apos;ll call you shortly.
                </p>
              ) : (
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                  {submitError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                      {submitError}
                    </p>
                  ) : null}
                  <div>
                    <label htmlFor="adm-name" className="mb-2 block text-sm font-semibold text-primary">
                      Name
                    </label>
                    <input
                      id="adm-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 transition focus:ring-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="adm-phone" className="mb-2 block text-sm font-semibold text-primary">
                      Phone number
                    </label>
                    <input
                      id="adm-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={submitting}
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 transition focus:ring-2 disabled:opacity-60"
                      placeholder="+91 …"
                    />
                  </div>
                  <div>
                    <label htmlFor="adm-course" className="mb-2 block text-sm font-semibold text-primary">
                      Course
                    </label>
                    <select
                      id="adm-course"
                      name="course"
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      disabled={submitting}
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 transition focus:ring-2 disabled:opacity-60"
                    >
                      {(subjects.length ? subjects : ['General enquiry']).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="adm-age" className="mb-2 block text-sm font-semibold text-primary">
                      Age <span className="font-normal text-primary/50">(optional)</span>
                    </label>
                    <input
                      id="adm-age"
                      name="age"
                      type="number"
                      min={3}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      disabled={submitting}
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 transition focus:ring-2 disabled:opacity-60"
                      placeholder="e.g. 10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-secondary py-4 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Request a Call'}
                  </button>
                </form>
              )}

              <ul className="mt-8 space-y-3 border-t border-primary/[0.08] pt-6">
                {[
                  academy ? `Enrolment team at ${academy}` : 'We respond to every enquiry',
                  settings?.phone ? `Call ${settings.phone}` : null,
                  settings?.email ? `Email ${settings.email}` : null,
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <li key={line as string} className="flex items-center gap-3 text-sm font-medium text-primary/75">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {line}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Limited Seats Available</h2>
            <Link
              to="/admissions#admission-form"
              className="mt-6 inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-[8px] bg-secondary px-8 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Book Your Trial Now
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
