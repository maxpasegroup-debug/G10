import { Link } from 'react-router-dom'

export type GalleryTeaser = { src: string; caption: string }

type MusicLandingSectionsProps = {
  /** Class names from DB (e.g. public /classes) */
  classDetailTitles: string[]
  /** Distinct subjects from DB */
  programSubjects: string[]
  /** Recent gallery items for spotlight */
  galleryTeasers: GalleryTeaser[]
}

export function MusicLandingSections({
  classDetailTitles,
  programSubjects,
  galleryTeasers,
}: MusicLandingSectionsProps) {
  return (
    <main className="min-w-0 flex-1 pb-12">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
        <section
          id="classes"
          className="scroll-mt-[88px] rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="class-details-heading"
        >
          <h2
            id="class-details-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            Class Details
          </h2>
          {classDetailTitles.length === 0 ? (
            <p className="mt-5 text-sm leading-relaxed text-primary/65">
              Offerings will appear here when classes are published in the admin.
            </p>
          ) : (
            <ul className="mt-5 space-y-0 divide-y divide-primary/[0.06]">
              {classDetailTitles.map((title) => (
                <li key={title} className="flex items-center gap-3 py-3.5 first:pt-0">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/[0.06] text-secondary"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-medium leading-snug text-primary">{title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          id="faculty"
          className="scroll-mt-[88px] rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="featured-programs-heading"
        >
          <h2
            id="featured-programs-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            Programs
          </h2>
          {programSubjects.length === 0 ? (
            <p className="mt-5 text-sm leading-relaxed text-primary/65">
              Subjects will list here from your active class catalog.
            </p>
          ) : (
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {programSubjects.map((program) => (
                <li key={program}>
                  <Link
                    to={`/classes`}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-primary/[0.07] bg-surface/80 px-4 py-3.5 text-sm font-medium text-primary shadow-[0_1px_0_rgba(11,42,74,0.06)] transition hover:border-secondary/40"
                  >
                    {program}
                    <span className="text-secondary" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          id="gallery"
          className="scroll-mt-[88px] rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="student-spotlight-heading"
        >
          <h2
            id="student-spotlight-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            From the gallery
          </h2>
          {galleryTeasers.length === 0 ? (
            <p className="mt-5 text-sm leading-relaxed text-primary/65">
              Photos from classes and performances appear here once added in admin.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {galleryTeasers.map((t) => (
                <Link
                  key={t.src}
                  to="/gallery"
                  className="group block overflow-hidden rounded-[12px] border border-primary/[0.08] no-underline shadow-[0_2px_12px_-4px_rgba(11,42,74,0.15)] transition hover:border-secondary/40"
                >
                  <span className="relative block aspect-[16/10] bg-primary/10">
                    <img
                      src={t.src}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <p className="px-3 py-2.5 text-sm font-medium text-primary">{t.caption}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-10 flex justify-center sm:mt-12">
        <Link
          to="/admissions#admission-form"
          className="inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-[8px] bg-secondary px-8 text-base font-semibold text-primary shadow-[0_6px_24px_-4px_rgba(212,175,55,0.55)] transition hover:bg-secondary-hover"
        >
          Request a Trial Class
        </Link>
      </div>
    </main>
  )
}
