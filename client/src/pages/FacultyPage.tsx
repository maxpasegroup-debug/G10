import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { PageHero } from '../components/PageHero'

type FacultyMember = {
  id: string
  name: string
  instrument: string
  experience: string
  summary: string
  photo: string
  senior?: boolean
}

const faculty: FacultyMember[] = [
  {
    id: '1',
    name: 'John Mathew',
    instrument: 'Piano Instructor',
    experience: '10+ years experience',
    summary: 'Specialized in classical and modern techniques',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
    senior: true,
  },
  {
    id: '2',
    name: 'Ananya Menon',
    instrument: 'Vocal Coach',
    experience: '12+ years experience',
    summary: 'Trains young voices for stage and examinations',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop',
    senior: true,
  },
  {
    id: '3',
    name: 'Rahul Varma',
    instrument: 'Drums Instructor',
    experience: '8+ years experience',
    summary: 'Focus on timing, grooves, and ensemble playing',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
    senior: false,
  },
  {
    id: '4',
    name: 'Priya Nair',
    instrument: 'Guitar Instructor',
    experience: '9+ years experience',
    summary: 'Acoustic fingerstyle and contemporary band skills',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80&auto=format&fit=crop',
    senior: false,
  },
  {
    id: '5',
    name: 'Arjun Das',
    instrument: 'Keyboard & Theory',
    experience: '11+ years experience',
    summary: 'Foundation through performance-ready repertoire',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop',
    senior: true,
  },
  {
    id: '6',
    name: 'Meera Joseph',
    instrument: 'Violin Instructor',
    experience: '7+ years experience',
    summary: 'Structured bowing and ensemble musicianship',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop',
    senior: false,
  },
]

const trustPoints = [
  'Certified and experienced musicians',
  'Personalized attention for every student',
  'Performance-oriented training approach',
] as const

export function FacultyPage() {
  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Meet Our Faculty"
          subtitle="Experienced musicians guiding every step of your journey"
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-[60px]">
          <div className="mx-auto grid max-w-[1200px] gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((person) => (
              <article
                key={person.id}
                className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[var(--shadow-card)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(11,42,74,0.2)]"
              >
                <div className="relative mb-3">
                  <img
                    src={person.photo}
                    alt={person.name}
                    width={120}
                    height={120}
                    className="h-[120px] w-[120px] rounded-full object-cover ring-2 ring-primary/[0.08]"
                    loading="lazy"
                  />
                </div>
                {person.senior ? (
                  <span className="mb-3 rounded-md bg-secondary/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-secondary">
                    Senior Faculty
                  </span>
                ) : null}
                <h2 className="text-lg font-bold text-primary">{person.name}</h2>
                <p className="mt-1 text-sm font-semibold text-secondary">{person.instrument}</p>
                <p className="mt-2 text-sm font-medium text-primary/70">{person.experience}</p>
                <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-primary/65">{person.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-primary/[0.08] bg-white px-4 py-12 sm:px-6 md:px-[60px] md:py-16">
          <div className="mx-auto max-w-[900px]">
            <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">
              Why Our Faculty Stands Out
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {trustPoints.map((text) => (
                <li
                  key={text}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-primary/[0.08] bg-surface/80 px-5 py-6 text-center shadow-[0_1px_0_rgba(11,42,74,0.04)]"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-[15px] font-medium leading-snug text-primary">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Learn from the best</h2>
            <Link
              to="/classes"
              className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-secondary px-8 py-3.5 font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Join a Class Today
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
