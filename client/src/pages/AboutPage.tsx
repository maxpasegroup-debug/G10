import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'
import { PublicFooter } from '../components/PublicFooter'
import { useSiteSettings } from '../context/SettingsContext'
import { API_URL, resolveMediaUrl } from '../lib/api'
import { fetchGallery, fetchPublicClasses, fetchPublicTeachers } from '../lib/publicContent'

export function AboutPage() {
  const { settings, loading } = useSiteSettings()
  const academy = settings?.academy_name?.trim() || ''
  const aboutFromSettings = (settings?.about_text ?? '').trim()
  const [heroSrc, setHeroSrc] = useState<string | null>(null)
  const [studioShots, setStudioShots] = useState<{ src: string; alt: string }[]>([])
  const [stats, setStats] = useState({ classes: 0, teachers: 0, gallery: 0 })

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const [classes, teachers, gallery] = await Promise.all([
          fetchPublicClasses(),
          fetchPublicTeachers(),
          fetchGallery(),
        ])
        if (cancelled) return
        setStats({
          classes: classes.length,
          teachers: teachers.length,
          gallery: gallery.length,
        })
        const first = gallery[0]
        setHeroSrc(first ? resolveMediaUrl(first.image_url) : null)
        setStudioShots(
          gallery.slice(0, 3).map((r) => ({
            src: resolveMediaUrl(r.image_url),
            alt: (r.caption || '').trim() || 'Gallery',
          })),
        )
      } catch {
        if (!cancelled) {
          setHeroSrc(null)
          setStudioShots([])
          setStats({ classes: 0, teachers: 0, gallery: 0 })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title={loading && !academy ? 'About' : `About ${academy || 'us'}`}
          subtitle="Where passion meets structured musical growth"
        />

        <section className="px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div>
              <h2 className="mb-5 text-2xl font-bold tracking-tight text-primary md:text-3xl">Our Story</h2>
              <p className="whitespace-pre-line text-[17px] leading-relaxed text-primary/80">
                {loading && !academy && !aboutFromSettings ? (
                  '…'
                ) : aboutFromSettings ? (
                  aboutFromSettings
                ) : academy ? (
                  <>
                    <strong>{academy}</strong> is a home studio based music academy focused on nurturing talent
                    through personalized attention, structured learning, and real performance exposure.
                  </>
                ) : (
                  <>
                    We are a home studio based music academy focused on nurturing talent through personalized
                    attention, structured learning, and real performance exposure.
                  </>
                )}
              </p>
            </div>
            <div className="overflow-hidden rounded-[12px] shadow-[var(--shadow-card)]">
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt=""
                  className="h-full min-h-[260px] w-full object-cover md:min-h-[320px]"
                  width={600}
                  height={400}
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <div className="flex min-h-[260px] w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 md:min-h-[320px]">
                  <span className="font-[family-name:var(--font-brand)] text-4xl font-bold text-primary/25">
                    {academy.slice(0, 1).toUpperCase() || 'G'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary md:text-3xl">Why Choose Us</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Active programs',
                  text:
                    stats.classes > 0
                      ? `${stats.classes} class offering${stats.classes === 1 ? '' : 's'} open for enrollment.`
                      : 'Programs are published from your class catalog as soon as they are added.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  ),
                },
                {
                  title: 'Faculty',
                  text:
                    stats.teachers > 0
                      ? `${stats.teachers} instructor${stats.teachers === 1 ? '' : 's'} on staff — see the faculty page for profiles.`
                      : 'Instructor profiles appear when teacher accounts are added in admin.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  ),
                },
                {
                  title: 'Gallery',
                  text:
                    stats.gallery > 0
                      ? `${stats.gallery} photo${stats.gallery === 1 ? '' : 's'} from classes and performances.`
                      : 'Photos from classes and performances are added through the admin gallery.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  ),
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="rounded-[12px] border border-primary/[0.08] bg-surface/60 p-6 shadow-[var(--shadow-card)] md:p-8"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      {card.icon}
                    </svg>
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-primary">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-primary/70">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary md:text-3xl">Studio Preview</h2>
            {studioShots.length === 0 ? (
              <p className="text-center text-sm text-primary/65">
                Gallery photos will appear here once they are uploaded in admin.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {studioShots.map((img) => (
                  <div
                    key={img.src}
                    className="overflow-hidden rounded-[12px] shadow-[var(--shadow-card)]"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="aspect-[4/3] w-full object-cover"
                      width={400}
                      height={300}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Start Your Musical Journey Today</h2>
            <Link
              to="/admissions#admission-form"
              className="mt-8 inline-flex items-center justify-center rounded-[8px] bg-secondary px-8 py-3.5 text-base font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Book Free Trial
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
