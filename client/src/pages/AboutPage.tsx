import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { API_URL, galleryFileUrl } from '../lib/api'
import { fetchGallery, type GalleryApiRow } from '../lib/publicContent'

const HERO_STUDIO =
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=82'

const STORY_FALLBACK =
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=82'

const STUDIO_FALLBACKS: { src: string; alt: string }[] = [
  {
    src: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
    alt: 'Piano and warm studio light',
  },
  {
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    alt: 'Vocal recording space',
  },
  {
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    alt: 'Headphones and creative focus',
  },
]

const APPROACH = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    title: 'Personalized Learning',
    text: 'Every student learns differently. We tailor lessons based on individual pace and goals.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    ),
    title: 'Studio Experience',
    text: 'Students learn in a real studio environment with professional equipment.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    ),
    title: 'Performance Focus',
    text: 'We prepare students for real performances, not just theory.',
  },
] as const

function mapGallery(rows: GalleryApiRow[]) {
  return rows.map((r) => ({
    src: galleryFileUrl(r.id),
    alt: (r.caption || '').trim() || 'G10 AMR studio',
  }))
}

function threeStudioImages(mapped: { src: string; alt: string }[]) {
  if (mapped.length >= 3) return mapped.slice(0, 3)
  const out = [...mapped]
  let i = 0
  while (out.length < 3) {
    const f = STUDIO_FALLBACKS[i % STUDIO_FALLBACKS.length]
    out.push({ src: f.src, alt: f.alt })
    i += 1
  }
  return out
}

function initialStoryImage() {
  return { src: STORY_FALLBACK, alt: 'Music creation at G10 AMR' }
}

function initialStudioGrid() {
  return STUDIO_FALLBACKS.map((x) => ({ ...x }))
}

export function AboutPage() {
  const [storyImage, setStoryImage] = useState(initialStoryImage)
  const [studioImages, setStudioImages] = useState(initialStudioGrid)

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const gallery = await fetchGallery()
        if (cancelled) return
        const mapped = mapGallery(gallery)
        if (mapped.length > 0) {
          setStoryImage({
            src: mapped[0].src,
            alt: mapped[0].alt,
          })
          setStudioImages(threeStudioImages(mapped))
        }
      } catch {
        /* keep curated fallbacks */
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
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="About hero"
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(230,179,37,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-3xl py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            G10 AMR
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            About G10 AMR
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            Where passion meets professional music education
          </p>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-20 sm:px-8"
        aria-labelledby="our-story-heading"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h2
              id="our-story-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Our Story
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-[#E6B325]" aria-hidden />
            <p className="mt-8 text-[17px] leading-[1.75] text-white/80">
              G10 AMR was founded with a vision to create a comfortable, home-based studio environment
              where students can learn music with confidence and creativity. Unlike traditional
              classrooms, our studio focuses on personalized attention, structured learning, and real
              musical growth.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <img
                src={storyImage.src}
                alt={storyImage.alt}
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.02]"
                width={720}
                height={540}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="approach-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="approach-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Approach
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
            Thoughtful teaching that honors both craft and the person behind the instrument.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {APPROACH.map((card) => (
              <article
                key={card.title}
                className="group rounded-xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#E6B325]/40 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/20"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6B325]/15 text-[#E6B325] transition group-hover:bg-[#E6B325]/25">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    {card.icon}
                  </svg>
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] to-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="studio-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="studio-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Studio
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-white/70">
            A calm, professional space designed to inspire creativity and confidence.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {studioImages.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className="group overflow-hidden rounded-xl bg-[#0B2A4A] shadow-lg ring-1 ring-white/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#0B2A4A] px-5 py-20 text-center sm:px-8"
        aria-label="Request a trial"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join the G10 AMR family
          </h2>
          <p className="mx-auto mt-4 text-white/70">
            Take the first step—walk into a studio that feels like home and sounds like possibility.
          </p>
          <Link
            to="/admissions#admission-form"
            className="mt-10 inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-lg bg-[#E6B325] px-10 text-base font-semibold text-black shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Request a Trial Class
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
