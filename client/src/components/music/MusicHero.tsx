export type HeroSlide = {
  key: string
  src: string
  caption: string
}

type MusicHeroProps = {
  /** From live gallery API; empty hides image strip */
  slides: HeroSlide[]
}

export function MusicHero(_props: MusicHeroProps) {
  return (
    <div className="hero">
      <img src="/images/hero-studio.jpg" alt="" className="hero-bg" decoding="async" fetchPriority="high" />
      <div className="hero-content">
        <h1>
          TRIVANDRAM&apos;S 1ST HOME STUDIO
          <br />
          BASED MUSIC EDUCATION
        </h1>
        <p>
          Explore the world of music in a comfortable, professional studio environment. Discover your
          rhythm, melody, and passion.
        </p>
      </div>
    </div>
  )
}
