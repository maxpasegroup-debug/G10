import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState, EmptyStateIconPhotos } from '../components/EmptyState'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'
import { PublicFooter } from '../components/PublicFooter'
import { API_URL, resolveMediaUrl } from '../lib/api'
import { apiFetchData } from '../lib/apiClient'

type GalleryCategory = 'classes' | 'performances' | 'studio'

type GalleryItem = {
  id: string
  src: string
  category: GalleryCategory
  caption: string
}

const filterTabs = [
  { key: 'all' as const, label: 'All' },
  { key: 'classes' as const, label: 'Classes' },
  { key: 'performances' as const, label: 'Performances' },
  { key: 'studio' as const, label: 'Studio' },
]

const PAGE_SIZE = 8

export function GalleryPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<(typeof filterTabs)[number]['key']>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightboxId, setLightboxId] = useState<string | null>(null)
  const [displayItems, setDisplayItems] = useState<GalleryItem[]>([])
  const [galleryNotice, setGalleryNotice] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!API_URL) {
        setDisplayItems([])
        setGalleryNotice('Set VITE_API_URL to load gallery photos from the server.')
        return
      }
      try {
        const rows = await apiFetchData<{ id: number; image_url: string; caption: string; category: string }[]>(
          '/api/gallery',
        )
        if (!Array.isArray(rows)) {
          throw new Error('bad response')
        }
        if (cancelled) return
        if (rows.length === 0) {
          setDisplayItems([])
          setGalleryNotice(null)
          return
        }
        setGalleryNotice(null)
        setDisplayItems(
          rows.map((r) => ({
            id: String(r.id),
            src: resolveMediaUrl(r.image_url),
            category: r.category as GalleryCategory,
            caption: r.caption || 'Photo',
          })),
        )
      } catch {
        if (!cancelled) {
          setDisplayItems([])
          setGalleryNotice('Could not load gallery. Check your connection and try again.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return displayItems
    return displayItems.filter((item) => item.category === activeFilter)
  }, [activeFilter, displayItems])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    setLightboxId((id) => {
      if (!id) return null
      const next =
        activeFilter === 'all' ? displayItems : displayItems.filter((item) => item.category === activeFilter)
      return next.some((item) => item.id === id) ? id : null
    })
  }, [activeFilter, displayItems])

  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const currentLightboxItem = useMemo(() => {
    if (!lightboxId) return null
    return filtered.find((item) => item.id === lightboxId) ?? null
  }, [lightboxId, filtered])

  const goNext = useCallback(() => {
    if (!lightboxId || filtered.length === 0) return
    const i = filtered.findIndex((item) => item.id === lightboxId)
    if (i < 0) return
    setLightboxId(filtered[(i + 1) % filtered.length].id)
  }, [lightboxId, filtered])

  const goPrev = useCallback(() => {
    if (!lightboxId || filtered.length === 0) return
    const i = filtered.findIndex((item) => item.id === lightboxId)
    if (i < 0) return
    setLightboxId(filtered[(i - 1 + filtered.length) % filtered.length].id)
  }, [lightboxId, filtered])

  useEffect(() => {
    if (!lightboxId) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxId(null)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxId, goNext, goPrev])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Gallery"
          subtitle="Moments from our classrooms, performances, and practice sessions"
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-[60px]">
          <div className="mx-auto max-w-[1400px]">
            {galleryNotice ? (
              <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                {galleryNotice}
              </p>
            ) : null}
            <div
              className="flex flex-wrap justify-center gap-3 md:justify-start"
              role="tablist"
              aria-label="Gallery categories"
            >
              {filterTabs.map((tab) => {
                const active = tab.key === activeFilter
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-secondary text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)]'
                        : 'border border-primary bg-white text-primary hover:bg-primary/[0.04]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="mt-10">
                {displayItems.length === 0 ? (
                  <EmptyState
                    icon={<EmptyStateIconPhotos />}
                    title="No photos uploaded"
                    description="We’re adding new moments from our classes and performances—check back soon."
                    className="bg-white shadow-[var(--shadow-card)]"
                    action={{
                      label: 'Browse classes',
                      onClick: () => navigate('/classes'),
                    }}
                  />
                ) : (
                  <EmptyState
                    icon={<EmptyStateIconPhotos />}
                    title="No photos in this category"
                    description="Try another tab or view the full gallery."
                    className="bg-white shadow-[var(--shadow-card)]"
                    action={{
                      label: 'View all',
                      onClick: () => setActiveFilter('all'),
                      variant: 'secondary',
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="mt-10 columns-2 gap-4 sm:columns-3 xl:columns-4">
                {visibleItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className="group mb-4 w-full cursor-zoom-in break-inside-avoid rounded-xl bg-white text-left shadow-[var(--shadow-card)] outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    onClick={() => setLightboxId(item.id)}
                  >
                    <span className="relative block overflow-hidden rounded-xl">
                      <img
                        src={item.src}
                        alt=""
                        className={`w-full object-cover transition duration-300 ease-out group-hover:scale-105 ${
                          idx % 4 === 0 ? 'h-[260px] sm:h-[280px]' : 'h-[200px] sm:h-[220px]'
                        }`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={idx === 0 ? 'high' : 'low'}
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-10">
                        <span className="text-sm font-medium text-white">{item.caption}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {visibleCount < filtered.length ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="rounded-lg border border-primary bg-white px-8 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/[0.04]"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Load More
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Be part of these moments</h2>
            <Link
              to="/classes"
              className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-secondary px-8 py-3.5 font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Join Now
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />

      {currentLightboxItem ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightboxId(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxId(null)
            }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {filtered.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}

          <div className="max-h-[90vh] max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentLightboxItem.src}
              alt=""
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              decoding="async"
            />
            <p className="mt-3 text-center text-sm text-white/90">{currentLightboxItem.caption}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
