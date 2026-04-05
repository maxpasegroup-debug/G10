import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { API_URL, galleryFileUrl } from '../lib/api'
import { fetchGallery, type GalleryApiRow } from '../lib/publicContent'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1920&q=82'

type GalleryImage = {
  id: string
  src: string
  caption: string
}

function mapRows(rows: GalleryApiRow[]): GalleryImage[] {
  return rows.map((r) => ({
    id: String(r.id),
    src: galleryFileUrl(r.id),
    caption: (r.caption || '').trim() || 'G10 AMR',
  }))
}

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready'>(() => (API_URL ? 'loading' : 'ready'))
  const [lightboxId, setLightboxId] = useState<string | null>(null)

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const rows = await fetchGallery()
        if (cancelled) return
        setImages(Array.isArray(rows) ? mapRows(rows) : [])
      } catch {
        if (!cancelled) setImages([])
      } finally {
        if (!cancelled) setLoadState('ready')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const current = useMemo(() => {
    if (!lightboxId) return null
    return images.find((img) => img.id === lightboxId) ?? null
  }, [lightboxId, images])

  const goNext = useCallback(() => {
    if (!lightboxId || images.length === 0) return
    const i = images.findIndex((img) => img.id === lightboxId)
    if (i < 0) return
    setLightboxId(images[(i + 1) % images.length].id)
  }, [lightboxId, images])

  const goPrev = useCallback(() => {
    if (!lightboxId || images.length === 0) return
    const i = images.findIndex((img) => img.id === lightboxId)
    if (i < 0) return
    setLightboxId(images[(i - 1 + images.length) % images.length].id)
  }, [lightboxId, images])

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
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="Gallery hero"
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
            G10 AMR · Gallery
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Moments at G10 AMR
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            A glimpse into our classrooms, performances, and studio sessions
          </p>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-16 sm:px-8 sm:py-20"
        aria-label="Photo gallery"
      >
        <div className="mx-auto max-w-7xl">
          {loadState === 'loading' ? (
            <p className="text-center text-sm text-white/50">Loading gallery…</p>
          ) : images.length === 0 ? (
            <p className="text-center text-lg font-medium text-white/80">No images available yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {images.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxId(item.id)}
                  className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#0B2A4A] text-left shadow-md ring-1 ring-white/10 outline-none transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#E6B325] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A4A]"
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#081a2e] px-5 py-20 sm:px-8"
        aria-label="Our experience"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-white/85 sm:text-xl sm:leading-relaxed">
            Every session at G10 AMR is more than just a class — it&apos;s an experience where students
            explore creativity, build confidence, and enjoy the journey of music.
          </p>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#0B2A4A] px-5 py-20 text-center sm:px-8"
        aria-label="Book a trial"
      >
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be part of these moments
          </h2>
          <Link
            to="/admissions#admission-form"
            className="mt-10 inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-lg bg-[#E6B325] px-10 text-base font-semibold text-black shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Book Your Trial Class
          </Link>
        </div>
      </section>

      <PublicFooter />

      {current ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Full image"
          onClick={() => setLightboxId(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxId(null)
            }}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
                aria-label="Previous"
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
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
                aria-label="Next"
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

          <div className="max-h-[90vh] max-w-[min(100%,1200px)]" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.caption}
              className="max-h-[82vh] w-full rounded-lg object-contain shadow-2xl"
              decoding="async"
            />
            <p className="mt-4 text-center text-sm text-white/80">{current.caption}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
