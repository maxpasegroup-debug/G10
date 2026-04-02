const classDetails = [
  'Junior Melodies',
  'Intermediate Rhythms',
  'Advanced Harmonies',
] as const

const featuredPrograms = ['Piano', 'Guitar', 'Violin', 'Vocal Training'] as const

const testimonials = [
  {
    quote:
      'The home studio feels calm and focused. My daughter went from shy to performing at the recital in six months.',
    name: 'Ananya K.',
    role: 'Parent, Junior Melodies',
  },
  {
    quote:
      'Patient teachers and clear structure. I finally understood rhythm — drums are now my favorite hour of the week.',
    name: 'Rahul M.',
    role: 'Student, Intermediate Rhythms',
  },
] as const

export function MusicLandingSections() {
  return (
    <main className="min-w-0 flex-1 pb-12">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
        {/* A. Class Details */}
        <section
          className="rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="class-details-heading"
        >
          <h2
            id="class-details-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            Class Details
          </h2>
          <ul className="mt-5 space-y-0 divide-y divide-primary/[0.06]">
            {classDetails.map((title) => (
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
        </section>

        {/* B. Featured Programs */}
        <section
          className="rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="featured-programs-heading"
        >
          <h2
            id="featured-programs-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            Featured Programs
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {featuredPrograms.map((program) => (
              <li key={program}>
                <span className="flex items-center justify-between gap-3 rounded-[12px] border border-primary/[0.07] bg-surface/80 px-4 py-3.5 text-sm font-medium text-primary shadow-[0_1px_0_rgba(11,42,74,0.06)]">
                  {program}
                  <span className="text-secondary" aria-hidden>
                    →
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* C. Student Spotlight */}
        <section
          className="rounded-[12px] border border-primary/[0.06] bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
          aria-labelledby="student-spotlight-heading"
        >
          <h2
            id="student-spotlight-heading"
            className="border-b border-primary/[0.08] pb-3 text-base font-semibold uppercase tracking-wide text-primary"
          >
            Student Spotlight
          </h2>
          <div className="mt-5 space-y-4">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-[12px] border border-secondary/35 bg-secondary/90 p-4 shadow-[0_4px_16px_-6px_rgba(212,175,55,0.35)] sm:p-5"
              >
                <p className="text-sm leading-relaxed text-primary/90">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-3 border-t border-primary/10 pt-3">
                  <cite className="not-italic">
                    <span className="block text-sm font-semibold text-primary">{t.name}</span>
                    <span className="mt-0.5 block text-xs text-primary/65">{t.role}</span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10 flex justify-center sm:mt-12">
        <button
          type="button"
          className="inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-[8px] bg-secondary px-8 text-base font-semibold text-primary shadow-[0_6px_24px_-4px_rgba(212,175,55,0.55)] transition hover:bg-secondary-hover"
        >
          Request a Trial Class
        </button>
      </div>
    </main>
  )
}
