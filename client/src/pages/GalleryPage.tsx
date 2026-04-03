import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'
import { PublicFooter } from '../components/PublicFooter'

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

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    src: '/images/hero-keyboard.jpg',
    category: 'classes',
    caption: 'Piano Session',
  },
  {
    id: '2',
    src: '/images/hero-drums.jpg',
    category: 'classes',
    caption: 'Drum Lesson',
  },
  {
    id: '3',
    src: '/images/hero-singing.jpg',
    category: 'classes',
    caption: 'Vocal Group',
  },
  {
    id: '4',
    src: '/images/hero-violin.jpg',
    category: 'classes',
    caption: 'Violin Class',
  },
  {
    id: '5',
    src: '/images/music-class.jpg',
    category: 'studio',
    caption: 'Studio Space',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80&auto=format&fit=crop',
    category: 'studio',
    caption: 'Instrument Wall',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80&auto=format&fit=crop',
    category: 'performances',
    caption: 'Live Performance',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80&auto=format&fit=crop',
    category: 'performances',
    caption: 'Stage Ensemble',
  },
  {
    id: '9',
    src: '/images/hero-keyboard.jpg',
    category: 'studio',
    caption: 'Keys Corner',
  },
  {
    id: '10',
    src: '/images/hero-singing.jpg',
    category: 'performances',
    caption: 'Recital Night',
  },
  {
    id: '11',
    src: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900&q=80&auto=format&fit=crop',
    category: 'classes',
    caption: 'Keyboard Class',
  },
  {
    id: '12',
    src: '/images/music-class.jpg',
    category: 'classes',
    caption: 'Group Practice',
  },
  {
    id: '13',
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80&auto=format&fit=crop',
    category: 'performances',
    caption: 'Concert Lights',
  },
  {
    id: '14',
    src: '/images/hero-drums.jpg',
    category: 'studio',
    caption: 'Practice Room',
  },
  {
    id: '15',
    src: 'https://images.unsplash.com/photo-1519892300165-cb5582e4c7d2?w=900&q=80&auto=format&fit=crop',
    category: 'classes',
    caption: 'Rhythm Lab',
  },
  {
    id: '16',
    src: '/images/hero-violin.jpg',
    category: 'performances',
    caption: 'String Showcase',
  },
]

const PAGE_SIZE = 8

export function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filterTabs)[number]['key']>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightboxId, setLightboxId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return galleryItems
    return galleryItems.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    setLightboxId((id) => {
      if (!id) return null
      const next =
        activeFilter === 'all'
          ? galleryItems
          : galleryItems.filter((item) => item.category === activeFilter)
      return next.some((item) => item.id === id) ? id : null
    })
  }, [activeFilter])

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
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-10">
                      <span className="text-sm font-medium text-white">{item.caption}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>

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
            />
            <p className="mt-3 text-center text-sm text-white/90">{currentLightboxItem.caption}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
