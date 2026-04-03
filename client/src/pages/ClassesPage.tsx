import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { PageHero } from '../components/PageHero'
import { API_URL } from '../lib/api'
import { fetchPublicClasses, type PublicClassRow } from '../lib/publicContent'

function ClassCard({
  item,
  featured,
}: {
  item: PublicClassRow
  featured?: boolean
}) {
  const title = (item.name || item.studio || `Class ${item.id}`).trim()
  const sub = (item.subject || 'Music').trim()
  const schedule = (item.studio || '').trim()
  const live = Boolean(item.is_live)

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ${
        featured ? 'ring-2 ring-secondary/50 md:col-span-3' : ''
      }`}
    >
      <div
        className={`relative -mx-4 -mt-4 mb-4 flex min-h-[160px] items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/15 to-primary/5 md:min-h-[200px] ${
          featured ? 'md:min-h-[240px]' : ''
        }`}
      >
        <span className="font-[family-name:var(--font-brand)] text-5xl font-bold text-primary/20 sm:text-6xl">
          {sub.charAt(0).toUpperCase()}
        </span>
        {live ? (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
            Live
          </span>
        ) : null}
        {featured ? (
          <span className="absolute right-3 top-3 rounded-md bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
            Featured
          </span>
        ) : null}
      </div>
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="mt-1 text-sm font-medium text-primary/80">
        <span className="text-primary/50">Subject: </span>
        {sub}
      </p>
      {schedule ? (
        <p className="mt-2 text-sm text-primary/75">
          <span className="font-medium text-primary/80">Schedule / studio: </span>
          {schedule}
        </p>
      ) : (
        <p className="mt-2 text-sm text-primary/55">Schedule posted soon — contact us for times.</p>
      )}
      <Link
        to="/admissions#admission-form"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-secondary py-2.5 text-sm font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover"
      >
        Book Trial
      </Link>
    </article>
  )
}

export function ClassesPage() {
  const [classes, setClasses] = useState<PublicClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSubject, setActiveSubject] = useState<string>('')

  const load = useCallback(async () => {
    if (!API_URL) {
      setError('Set VITE_API_URL to load classes.')
      setClasses([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPublicClasses()
      setClasses(data)
      const subs = [...new Set(data.map((c) => (c.subject || '').trim()).filter(Boolean))].sort()
      setActiveSubject((prev) => {
        if (prev && subs.includes(prev)) return prev
        return subs[0] ?? ''
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load classes')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const subjects = useMemo(() => {
    const u = new Set<string>()
    for (const c of classes) {
      const s = (c.subject || '').trim()
      if (s) u.add(s)
    }
    return [...u].sort()
  }, [classes])

  const { featured, rest } = useMemo(() => {
    const filtered = activeSubject
      ? classes.filter((c) => (c.subject || '').trim() === activeSubject)
      : classes
    const liveFirst = [...filtered].sort((a, b) => Number(b.is_live) - Number(a.is_live))
    const feat = liveFirst[0]
    const others = feat ? liveFirst.filter((c) => c.id !== feat.id) : []
    return { featured: feat, rest: others }
  }, [activeSubject, classes])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Our Music Classes"
          subtitle="Choose your path and start learning with expert guidance"
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-[60px]">
          <div className="mx-auto max-w-[1200px]">
            {error ? (
              <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            ) : null}
            {loading ? (
              <p className="text-sm text-primary/60">Loading classes…</p>
            ) : classes.length === 0 && !error ? (
              <p className="rounded-2xl border border-primary/[0.08] bg-white p-8 text-center text-primary/70 shadow-[var(--shadow-card)]">
                No classes published yet. Check back soon or contact us for availability.
              </p>
            ) : (
              <>
                <div
                  className="flex flex-wrap justify-center gap-3 md:justify-start"
                  role="tablist"
                  aria-label="Subject"
                >
                  {subjects.map((s) => {
                    const active = s === activeSubject
                    return (
                      <button
                        key={s}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveSubject(s)}
                        className={`min-w-[100px] rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                          active
                            ? 'bg-secondary text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)]'
                            : 'border border-primary bg-white text-primary hover:bg-primary/[0.04]'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {featured ? <ClassCard key={featured.id} item={featured} featured /> : null}
                  {rest.map((item) => (
                    <ClassCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Not sure where to start?</h2>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-secondary px-8 py-3 font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Talk to Us
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
