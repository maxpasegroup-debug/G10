import { useCallback, useEffect, useState } from 'react'

const STUDIO_BG =
  'https://images.unsplash.com/photo-1598488035139-1d2a8ce7f0d0?w=1920&q=80&auto=format&fit=crop'

const carouselItems = [
  {
    key: 'violin',
    title: 'Violin',
    caption: 'Child violin mentoring in a guided classroom',
    image:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'drums',
    title: 'Drums',
    caption: 'Kid drum practice with instructor support',
    image:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'singing',
    title: 'Singing Group',
    caption: 'Kids vocal group session and ensemble coaching',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'keyboard',
    title: 'Keyboard / Piano',
    caption: 'Hands-on piano class with teacher guidance',
    image:
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900&q=80&auto=format&fit=crop',
  },
] as const

export function MusicHero() {
  const [index, setIndex] = useState(0)
  const len = carouselItems.length

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len)
    },
    [len],
  )

  useEffect(() => {
    const t = window.setInterval(() => setIndex((i) => (i + 1) % len), 5000)
    return () => window.clearInterval(t)
  }, [len])

  return (
    <section
      id="home"
      className="relative isolate min-h-[min(92vh,920px)] overflow-hidden scroll-mt-20"
      aria-labelledby="music-hero-title"
    >
      {/* Blurred studio layer */}
      <div
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url(${STUDIO_BG})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-primary/35 backdrop-blur-md" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,42,74,0.85),rgba(11,42,74,0.85))]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="music-hero-title"
            className="text-balance text-3xl font-bold uppercase leading-tight tracking-wide text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.2rem] lg:leading-[1.12]"
          >
            TRIVANDRAM&apos;S 1ST HOME STUDIO BASED MUSIC EDUCATION
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[#E5E7EB] sm:text-lg">
            Private and small-group lessons in a dedicated home studio — patient instructors,
            structured progress, and a warm space where beginners and advancing musicians thrive.
          </p>
        </div>

        {/* Instrument carousel */}
        <div className="mx-auto mt-12 w-full max-w-5xl">
          <div className="relative rounded-[12px] border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6">
            <div className="overflow-hidden rounded-[10px]">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${len * 100}%`,
                  transform: `translateX(-${(index * 100) / len}%)`,
                }}
              >
                {carouselItems.map((item) => (
                  <div
                    key={item.key}
                    className="shrink-0 px-1 sm:px-2"
                    style={{ width: `${100 / len}%` }}
                    aria-hidden={carouselItems[index].key !== item.key}
                  >
                    <figure className="overflow-hidden rounded-[16px] border border-white/20 bg-white shadow-[var(--shadow-card)]">
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={`${item.title} classroom session`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.7))] px-4 pb-3 pt-10 text-left">
                          <span className="block text-sm font-semibold text-white">{item.title}</span>
                          <span className="block text-xs text-white/90">{item.caption}</span>
                        </div>
                      </div>
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/25 bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Previous instrument"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Carousel position">
                {carouselItems.map((item, i) => (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${item.title}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? 'w-8 bg-secondary' : 'w-2.5 bg-white/35 hover:bg-white/55'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/25 bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Next instrument"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
