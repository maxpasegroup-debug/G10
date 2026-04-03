import { useSiteSettings } from '../../context/SettingsContext'

export type HeroSlide = {
  key: string
  src: string
  caption: string
}

type MusicHeroProps = {
  /** From live gallery API; empty hides image strip */
  slides: HeroSlide[]
}

const DEFAULT_HERO_LINES = ["TRIVANDRAM'S 1ST HOME STUDIO", 'BASED MUSIC EDUCATION'] as const

export function MusicHero({ slides }: MusicHeroProps) {
  const { settings } = useSiteSettings()
  const academy = settings?.academy_name?.trim()
  const titleRaw = settings?.home_hero_title?.trim() ?? ''
  const customLines = titleRaw
    ? titleRaw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
    : []
  const headlineLines = customLines.length > 0 ? customLines : [...DEFAULT_HERO_LINES]
  const customSub = settings?.home_hero_subtitle?.trim()
  const subtitle =
    customSub ||
    (academy
      ? `${academy} — explore music in a comfortable, professional studio environment.`
      : 'Explore the world of music in a comfortable, professional studio environment. Discover your rhythm, melody, and passion.')
  const visibleSlides = slides.slice(0, 4)

  return (
    <section id="home" className="g10-hero" aria-labelledby="music-hero-title">
      <div className="g10-hero__bg">
        <div className="g10-hero__text-block">
          <div className="g10-hero__headline-wrap">
            <h1 id="music-hero-title" className="g10-hero__headline">
              {headlineLines.map((line, i) => (
                <span key={`${i}-${line.slice(0, 24)}`} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="g10-hero__sub">{subtitle}</p>
          </div>
        </div>

        {visibleSlides.length > 0 ? (
          <div className="g10-hero__slider-outer">
            <div className="g10-hero__glass">
              <div className="g10-hero__grid">
                {visibleSlides.map((item, i) => (
                  <figure key={item.key} className="g10-hero__card">
                    <img
                      src={item.src}
                      alt=""
                      width={400}
                      height={200}
                      decoding="async"
                      fetchPriority={i === 0 ? 'high' : 'low'}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="g10-hero__card-overlay" aria-hidden />
                    <figcaption className="g10-hero__card-caption">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
