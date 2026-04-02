type PageHeroProps = {
  title: string
  subtitle: string
}

/** Reuses landing hero background (`g10-hero__bg`) for inner pages. */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="g10-page-hero" aria-labelledby="page-hero-title">
      <div className="g10-hero__bg">
        <div className="g10-page-hero__inner">
          <h1 id="page-hero-title" className="g10-page-hero__title">
            {title}
          </h1>
          <p className="g10-page-hero__subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  )
}
