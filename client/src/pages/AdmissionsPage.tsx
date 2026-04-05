import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { API_URL } from '../lib/api'
import { apiFetch } from '../lib/apiClient'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1464375117522-131db81b0160?auto=format&fit=crop&w=1920&q=82'

const COURSES = ['Guitar', 'Piano', 'Vocal', 'Drums'] as const

const STEPS = [
  {
    step: 1,
    title: 'Book a Trial Class',
    text: 'Pick a time online—we confirm quickly so you know exactly when to arrive.',
  },
  {
    step: 2,
    title: 'Get Skill Assessment',
    text: 'A calm, age-appropriate check-in so we place you in the right level and batch.',
  },
  {
    step: 3,
    title: 'Join Your Batch',
    text: 'Start regular sessions with clear goals, small groups, and room to grow.',
  },
] as const

const TRUST = [
  'Limited seats per batch — quality over crowding.',
  'Personal attention guaranteed in every lesson.',
  'Flexible timings available for busy families.',
] as const

export function AdmissionsPage() {
  const location = useLocation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState<string>(COURSES[0])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (location.hash !== '#admission-form') return
    const el = document.getElementById('admission-form')
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!API_URL) {
      setSubmitError('Something went wrong, try again')
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
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong, try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="Admissions hero"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 42, 74, 0.85), rgba(11, 42, 74, 0.95))',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(230,179,37,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-3xl py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            G10 AMR
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Admissions Open
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            Start your musical journey with G10 AMR today
          </p>
          <a
            href="#admission-form"
            className="mt-10 inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-lg bg-[#E6B325] px-8 text-base font-semibold text-black shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Enquire in 30 seconds
          </a>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="how-heading"
            className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            How to Get Started
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-white/60 sm:text-base">
            Three simple steps—no paperwork marathon.
          </p>

          <div className="mt-12 lg:relative">
            <div
              className="hidden lg:absolute lg:left-[12%] lg:right-[12%] lg:top-[26px] lg:z-0 lg:block lg:h-px lg:bg-gradient-to-r lg:from-transparent lg:via-[#E6B325]/35 lg:to-transparent"
              aria-hidden
            />
            <ol className="relative z-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <li
                  key={s.step}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-sm sm:p-8"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#E6B325] bg-[#0B2A4A] text-sm font-bold text-[#E6B325]">
                    {s.step}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        id="admission-form"
        className="scroll-mt-24 border-t border-white/10 bg-[#081a2e] px-5 py-16 sm:scroll-mt-28 sm:px-8 sm:py-20"
        aria-labelledby="form-heading"
      >
        <div className="mx-auto w-full max-w-md">
          <h2 id="form-heading" className="text-center text-2xl font-bold text-white sm:text-3xl">
            Quick enquiry
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/60">
            Name, mobile, and course—that&apos;s it. We&apos;ll reach out with timings.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
            {submitted ? (
              <p className="py-8 text-center text-base font-semibold leading-relaxed text-[#0B2A4A]">
                Thank you! We will contact you soon.
              </p>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                {submitError ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800"
                  >
                    Something went wrong, try again
                  </p>
                ) : null}

                <div>
                  <label htmlFor="adm-name" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
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
                    disabled={submitting}
                    className="min-h-[48px] w-full rounded-lg border border-[#0B2A4A]/15 bg-white px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 transition focus:ring-2 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label htmlFor="adm-phone" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
                    Mobile number
                  </label>
                  <input
                    id="adm-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className="min-h-[48px] w-full rounded-lg border border-[#0B2A4A]/15 bg-white px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 transition focus:ring-2 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label htmlFor="adm-course" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
                    Course
                  </label>
                  <select
                    id="adm-course"
                    name="course"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={submitting}
                    className="min-h-[48px] w-full rounded-lg border border-[#0B2A4A]/15 bg-white px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 transition focus:ring-2 disabled:opacity-60"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[#E6B325] text-base font-bold text-black shadow-lg shadow-black/15 transition hover:bg-[#d4a420] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Request a Call'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] to-[#081a2e] px-5 py-16 sm:px-8 sm:py-20"
        aria-label="Why parents choose us"
      >
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-xl font-bold text-white sm:text-2xl">Why families enquire</h2>
          <ul className="mt-8 space-y-4">
            {TRUST.map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-relaxed text-white/85 sm:text-base"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6B325]/20 text-[#E6B325]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0B2A4A] px-5 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Limited Seats Available — Enquire Now
          </h2>
          <Link
            to="/admissions#admission-form"
            className="mt-8 inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-lg bg-[#E6B325] px-10 text-base font-semibold text-black shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Request a Call
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
