import { useMemo, useState } from 'react'

type StudioFilter = 'All Studios' | 'Studio A' | 'Studio B' | 'Studio C' | 'Practice Room'
type SubjectFilter = 'All Subjects' | 'Keyboard' | 'Guitar' | 'Vocal' | 'Drums'

type LiveCard = {
  id: string
  title: 'Studio A' | 'Studio B' | 'Studio C' | 'Practice Room'
  subject: 'Keyboard' | 'Guitar' | 'Vocal' | 'Drums'
  image: string
  isChildClass?: boolean
}

const studioOptions: StudioFilter[] = [
  'All Studios',
  'Studio A',
  'Studio B',
  'Studio C',
  'Practice Room',
]

const subjectOptions: SubjectFilter[] = ['All Subjects', 'Keyboard', 'Guitar', 'Vocal', 'Drums']

const cards: LiveCard[] = [
  {
    id: 'studio-a',
    title: 'Studio A',
    subject: 'Keyboard',
    image:
      'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'studio-b',
    title: 'Studio B',
    subject: 'Guitar',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80&auto=format&fit=crop',
    isChildClass: true,
  },
  {
    id: 'studio-c',
    title: 'Studio C',
    subject: 'Vocal',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'practice-room',
    title: 'Practice Room',
    subject: 'Drums',
    image:
      'https://images.unsplash.com/photo-1519892300165-cb5582e4c7d2?w=1200&q=80&auto=format&fit=crop',
  },
]

export function LiveClassroomDashboard() {
  const [studio, setStudio] = useState<StudioFilter>('All Studios')
  const [subject, setSubject] = useState<SubjectFilter>('All Subjects')

  const filtered = useMemo(
    () =>
      cards.filter((card) => {
        const studioMatch = studio === 'All Studios' || card.title === studio
        const subjectMatch = subject === 'All Subjects' || card.subject === subject
        return studioMatch && subjectMatch
      }),
    [studio, subject],
  )

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">
              Select Studio
            </span>
            <select
              value={studio}
              onChange={(e) => setStudio(e.target.value as StudioFilter)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {studioOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/55">
              Select Subject
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectFilter)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="h-11 self-end rounded-[8px] bg-secondary px-5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover"
          >
            View Live
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((card) => (
          <article
            key={card.id}
            className={`overflow-hidden rounded-[12px] border bg-white shadow-[var(--shadow-card)] ${
              card.isChildClass
                ? 'border-secondary ring-2 ring-secondary/35'
                : 'border-primary/[0.08]'
            }`}
          >
            <div className="relative aspect-video bg-primary/10">
              <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-sm">
                LIVE
              </span>
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                  aria-label={`Mute ${card.title}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M23 9l-6 6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                  aria-label={`Expand ${card.title}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H3v-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 3l-7 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 p-4">
              <p className="text-base font-semibold text-primary">{card.title}</p>
              <p className="text-sm text-primary/65">{card.subject} session</p>
              {card.isChildClass ? (
                <p className="inline-flex rounded-[10px] bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-primary">
                  Your Child is in this class
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
