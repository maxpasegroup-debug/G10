import { useCallback, useState } from 'react'

const heroCards = [
  {
    key: 'violin',
    src: '/images/hero-violin.jpg',
    caption: 'Explore your passion',
  },
  {
    key: 'drums',
    src: '/images/hero-drums.jpg',
    caption: 'Learn from professionals',
  },
  {
    key: 'singing',
    src: '/images/hero-singing.jpg',
    caption: 'Find your voice together',
  },
  {
    key: 'keyboard',
    src: '/images/hero-keyboard.jpg',
    caption: 'Master melody & keys',
  },
] as const

const dotCount = 5

export function MusicHero() {
  const [activeDot, setActiveDot] = useState(1)

  const go = useCallback((dir: -1 | 1) => {
    setActiveDot((i) => (i + dir + dotCount) % dotCount)
  }, [])

  return (
    <section id="home" className="g10-hero" aria-labelledby="music-hero-title">
      <div className="g10-hero__bg">
        <div className="g10-hero__text-block">
          <div className="g10-hero__headline-wrap">
            <h1 id="music-hero-title" className="g10-hero__headline">
              <span className="block">TRIVANDRAM&apos;S 1ST HOME STUDIO</span>
              <span className="block">BASED MUSIC EDUCATION</span>
            </h1>
            <p className="g10-hero__sub">
              Explore the world of music in a comfortable, professional studio environment.
              Discover your rhythm, melody, and passion.
            </p>
          </div>
        </div>

        <div className="g10-hero__slider-outer">
          <button
            type="button"
            className="g10-hero__arrow g10-hero__arrow--prev"
            aria-label="Previous"
            onClick={() => go(-1)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="g10-hero__glass">
            <div className="g10-hero__grid">
              {heroCards.map((item) => (
                <figure key={item.key} className="g10-hero__card">
                  <img src={item.src} alt="" width={400} height={200} />
                  <div className="g10-hero__card-overlay" aria-hidden />
                  <figcaption className="g10-hero__card-caption">{item.caption}</figcaption>
                </figure>
              ))}
            </div>

            <div className="g10-hero__dots" role="tablist" aria-label="Gallery position">
              {Array.from({ length: dotCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeDot}
                  aria-label={`Slide ${i + 1}`}
                  className={`g10-hero__dot${i === activeDot ? ' g10-hero__dot--active' : ''}`}
                  onClick={() => setActiveDot(i)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="g10-hero__arrow g10-hero__arrow--next"
            aria-label="Next"
            onClick={() => go(1)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
