import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { PageHero } from '../components/PageHero'
import { useSiteSettings } from '../context/SettingsContext'
import { API_URL, resolveMediaUrl } from '../lib/api'
import { fetchPublicTeachers, type PublicTeacherRow } from '../lib/publicContent'

export function FacultyPage() {
  const { settings } = useSiteSettings()
  const academy = settings?.academy_name?.trim() || ''
  const [teachers, setTeachers] = useState<PublicTeacherRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!API_URL) {
      setError('Set VITE_API_URL to load faculty.')
      setTeachers([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchPublicTeachers()
      setTeachers(rows)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load faculty')
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Meet Our Faculty"
          subtitle="Experienced musicians guiding every step of your journey"
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-[60px]">
          <div className="mx-auto grid max-w-[1200px] gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {error ? (
              <p className="col-span-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}
            {loading ? (
              <p className="col-span-full text-center text-sm text-primary/60">Loading…</p>
            ) : teachers.length === 0 && !error ? (
              <p className="col-span-full rounded-2xl border border-primary/[0.08] bg-white p-8 text-center text-primary/70 shadow-[var(--shadow-card)]">
                Teacher profiles will appear here once instructor accounts are added in admin.
              </p>
            ) : (
              teachers.map((person) => {
                const photo = person.photo_url ? resolveMediaUrl(person.photo_url) : null
                const title = (person.title || '').trim() || 'Instructor'
                const bio = (person.bio || '').trim()
                return (
                  <article
                    key={person.id}
                    className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[var(--shadow-card)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(11,42,74,0.2)]"
                  >
                    <div className="relative mb-3">
                      {photo ? (
                        <img
                          src={photo}
                          alt=""
                          width={120}
                          height={120}
                          className="h-[120px] w-[120px] rounded-full object-cover ring-2 ring-primary/[0.08]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary/40 ring-2 ring-primary/[0.08]">
                          {(person.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-primary">{person.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-secondary">{title}</p>
                    {bio ? (
                      <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-primary/65">{bio}</p>
                    ) : null}
                  </article>
                )
              })
            )}
          </div>
        </section>

        <section className="border-t border-primary/[0.08] bg-white px-4 py-12 sm:px-6 md:px-[60px] md:py-16">
          <div className="mx-auto max-w-[900px]">
            <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">Why learn with us</h2>
            <p className="mx-auto mt-6 max-w-[640px] text-center text-sm leading-relaxed text-primary/70">
              {academy
                ? `${academy} combines structured lessons with personal attention. Reach out for batch sizes, timings, and trial classes — we’re happy to help you choose the right program.`
                : 'We combine structured lessons with personal attention. Contact us for batch sizes, timings, and trial classes.'}
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex rounded-xl bg-secondary px-8 py-3 text-sm font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
