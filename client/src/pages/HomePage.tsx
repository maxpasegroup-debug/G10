import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, galleryFileUrl } from '../lib/api'
import { fetchGallery, type GalleryApiRow } from '../lib/publicContent'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'

const HERO_STUDIO =
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=82'

const GALLERY_FALLBACK: { src: string; alt: string }[] = [
  {
    src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    alt: 'Electric guitar in studio lighting',
  },
  {
    src: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
    alt: 'Piano keys close-up',
  },
  {
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    alt: 'Microphone in recording space',
  },
  {
    src: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?auto=format&fit=crop&w=800&q=80',
    alt: 'Drum kit in warm studio',
  },
  {
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    alt: 'Headphones and music production',
  },
  {
    src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80',
    alt: 'Acoustic performance atmosphere',
  },
]

const PROGRAMS = [
  {
    icon: '🎸',
    title: 'Guitar',
    description:
      'Acoustic and electric paths with technique, theory, and repertoire tailored to your goals.',
  },
  {
    icon: '🎹',
    title: 'Piano',
    description:
      'Foundation in reading, timing, and expression—classical to contemporary, at your pace.',
  },
  {
    icon: '🎤',
    title: 'Vocal Training',
    description:
      'Breath control, pitch, tone, and stage confidence in a supportive studio setting.',
  },
  {
    icon: '🥁',
    title: 'Drums',
    description:
      'Groove, coordination, and dynamics on kit—rock, pop, and fusion essentials.',
  },
] as const

const WHY = [
  {
    icon: '🎯',
    title: 'Studio-Based Learning',
    text: 'Learn in a treated, professional home studio—real acoustics, not a noisy corner of a mall.',
  },
  {
    icon: '👥',
    title: 'Small Batch Training',
    text: 'Focused batches so every student gets attention, feedback, and room to grow.',
  },
  {
    icon: '🎤',
    title: 'Performance Exposure',
    text: 'Recitals and showcases that turn practice into presence—confidence on stage and in life.',
  },
] as const

function mapGalleryRows(rows: GalleryApiRow[]) {
  return rows.map((r) => ({
    id: r.id,
    src: galleryFileUrl(r.id),
    alt: (r.caption || '').trim() || 'G10 AMR studio and students',
  }))
}

function initialGalleryItems() {
  if (!API_URL) {
    return GALLERY_FALLBACK.map((item, i) => ({ id: -i - 1, src: item.src, alt: item.alt }))
  }
  return []
}

export function HomePage() {
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems)

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const gallery = await fetchGallery()
        if (cancelled) return
        const mapped = mapGalleryRows(gallery)
        if (mapped.length >= 3) {
          setGalleryItems(mapped.slice(0, 9))
        } else if (mapped.length > 0) {
          const merged = [...mapped]
          let i = 0
          while (merged.length < 6) {
            const f = GALLERY_FALLBACK[i % GALLERY_FALLBACK.length]
            merged.push({
              id: -(merged.length + 1),
              src: f.src,
              alt: f.alt,
            })
            i += 1
          }
          setGalleryItems(merged.slice(0, 9))
        } else {
          setGalleryItems(
            GALLERY_FALLBACK.map((item, idx) => ({ id: -idx - 1, src: item.src, alt: item.alt })),
          )
        }
      } catch {
        if (!cancelled) {
          setGalleryItems(
            GALLERY_FALLBACK.map((item, i) => ({ id: -i - 1, src: item.src, alt: item.alt })),
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-16"
        aria-label="Hero"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_STUDIO}')` }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 42, 74, 0.85), rgba(11, 42, 74, 0.95))',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(230,179,37,0.12),transparent)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            G10 AMR · Trivandrum
          </p>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem]">
            TRIVANDRAM&apos;S 1ST HOME STUDIO BASED MUSIC EDUCATION
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
            Explore the world of music in a comfortable, professional studio environment. Discover
            your rhythm, melody, and passion.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link
              to="/admissions#admission-form"
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-lg bg-[#E6B325] px-8 text-base font-semibold text-black shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-[#d4a420]"
            >
              Request a Trial Class
            </Link>
            <Link
              to="/classes"
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-lg border-2 border-white/90 bg-transparent px-8 text-base font-semibold text-white transition hover:scale-105 hover:border-[#E6B325] hover:text-[#E6B325]"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      <section
        className="relative border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-20 sm:px-8"
        aria-labelledby="programs-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="programs-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Programs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
            Structured paths for every instrument—built for beginners through advancing players.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((p) => (
              <article
                key={p.title}
                className="group rounded-xl bg-white p-7 text-[#0B2A4A] shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <span className="text-4xl" aria-hidden>
                  {p.icon}
                </span>
                <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B2A4A]/75">{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative border-t border-white/10 bg-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="why-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Why Choose G10 AMR
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
            A premium studio experience—personal, rigorous, and rooted in real performance.
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {WHY.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm"
              >
                <span className="text-3xl" aria-hidden>
                  {item.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] to-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="gallery-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <h2 id="gallery-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Gallery Preview
              </h2>
              <p className="mt-3 max-w-xl text-white/65">
                Moments from lessons, rehearsals, and performances inside our studio.
              </p>
            </div>
            <Link
              to="/gallery"
              className="shrink-0 text-sm font-semibold uppercase tracking-wider text-[#E6B325] transition hover:text-[#f0c94a]"
            >
              View full gallery →
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0B2A4A] shadow-lg ring-1 ring-white/10"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2A4A]/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#0B2A4A] px-5 py-20 text-center sm:px-8"
        aria-label="Book a trial"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Your Musical Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Book a free trial and feel the studio—meet the space, hear the sound, and map your
            first steps.
          </p>
          <Link
            to="/admissions#admission-form"
            className="mt-10 inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-lg bg-[#E6B325] px-10 text-base font-semibold text-black shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Book Free Trial
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
