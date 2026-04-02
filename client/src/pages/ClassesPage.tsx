import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'

type Subject = 'Piano' | 'Guitar' | 'Vocal' | 'Drums'

type ClassOffering = {
  id: string
  subject: Subject
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  ageGroup: string
  timing: string
  image: string
  featured: boolean
}

const subjects: Subject[] = ['Piano', 'Guitar', 'Vocal', 'Drums']

const allClasses: ClassOffering[] = [
  {
    id: 'p1',
    subject: 'Piano',
    name: 'Beginner Piano',
    level: 'Beginner',
    ageGroup: 'Ages 6–12',
    timing: 'Mon, Wed, Fri – 5 PM',
    image: '/images/hero-keyboard.jpg',
    featured: true,
  },
  {
    id: 'p2',
    subject: 'Piano',
    name: 'Keys & Theory Lab',
    level: 'Intermediate',
    ageGroup: 'Ages 10–16',
    timing: 'Tue, Thu – 4:30 PM',
    image: '/images/music-class.jpg',
    featured: false,
  },
  {
    id: 'p3',
    subject: 'Piano',
    name: 'Performance Piano',
    level: 'Advanced',
    ageGroup: 'Ages 14+',
    timing: 'Sat – 10 AM',
    image: '/images/hero-keyboard.jpg',
    featured: false,
  },
  {
    id: 'g1',
    subject: 'Guitar',
    name: 'Beginner Guitar',
    level: 'Beginner',
    ageGroup: 'Ages 8–14',
    timing: 'Tue, Thu – 5 PM',
    image: '/images/music-class.jpg',
    featured: true,
  },
  {
    id: 'g2',
    subject: 'Guitar',
    name: 'Acoustic Ensemble',
    level: 'Intermediate',
    ageGroup: 'Ages 12+',
    timing: 'Wed, Fri – 4 PM',
    image: '/images/hero-violin.jpg',
    featured: false,
  },
  {
    id: 'g3',
    subject: 'Guitar',
    name: 'Lead & Rhythm Studio',
    level: 'Advanced',
    ageGroup: 'Ages 15+',
    timing: 'Sat – 11 AM',
    image: '/images/music-class.jpg',
    featured: false,
  },
  {
    id: 'v1',
    subject: 'Vocal',
    name: 'Beginner Vocal',
    level: 'Beginner',
    ageGroup: 'Ages 7–12',
    timing: 'Mon, Wed – 4 PM',
    image: '/images/hero-singing.jpg',
    featured: true,
  },
  {
    id: 'v2',
    subject: 'Vocal',
    name: 'Stage & Mic Skills',
    level: 'Intermediate',
    ageGroup: 'Ages 11–16',
    timing: 'Tue, Thu – 5:30 PM',
    image: '/images/hero-singing.jpg',
    featured: false,
  },
  {
    id: 'v3',
    subject: 'Vocal',
    name: 'Advanced Harmony',
    level: 'Advanced',
    ageGroup: 'Ages 14+',
    timing: 'Fri – 5 PM',
    image: '/images/music-class.jpg',
    featured: false,
  },
  {
    id: 'd1',
    subject: 'Drums',
    name: 'Drum Foundations',
    level: 'Beginner',
    ageGroup: 'Ages 8–13',
    timing: 'Mon, Wed, Fri – 5 PM',
    image: '/images/hero-drums.jpg',
    featured: true,
  },
  {
    id: 'd2',
    subject: 'Drums',
    name: 'Groove Builders',
    level: 'Intermediate',
    ageGroup: 'Ages 12+',
    timing: 'Tue, Thu – 6 PM',
    image: '/images/hero-drums.jpg',
    featured: false,
  },
  {
    id: 'd3',
    subject: 'Drums',
    name: 'Studio Session Drumming',
    level: 'Advanced',
    ageGroup: 'Ages 15+',
    timing: 'Sat – 9 AM',
    image: '/images/music-class.jpg',
    featured: false,
  },
]

function levelStyle(level: ClassOffering['level']) {
  switch (level) {
    case 'Beginner':
      return 'text-primary/70'
    case 'Intermediate':
      return 'text-primary/80'
    default:
      return 'text-primary'
  }
}

type ClassCardProps = {
  item: ClassOffering
  featured?: boolean
}

function ClassCard({ item, featured }: ClassCardProps) {
  const imgHeight = featured ? 'min-h-[240px] md:min-h-[280px]' : 'min-h-[180px]'

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ${
        featured ? 'ring-2 ring-secondary/50 md:col-span-3' : ''
      }`}
    >
      <div className={`relative -mx-4 -mt-4 mb-4 overflow-hidden rounded-t-2xl ${imgHeight}`}>
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 240}
        />
        {featured ? (
          <span className="absolute left-3 top-3 rounded-md bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
            Most Popular
          </span>
        ) : null}
      </div>
      <h3 className="text-lg font-bold text-primary">{item.name}</h3>
      <p className={`mt-1 text-sm font-medium ${levelStyle(item.level)}`}>
        <span className="text-primary/50">Level: </span>
        {item.level}
      </p>
      <p className="mt-2 text-sm text-primary/75">
        <span className="font-medium text-primary/80">Age group: </span>
        {item.ageGroup}
      </p>
      <p className="mt-1 text-sm text-primary/75">
        <span className="font-medium text-primary/80">Timing: </span>
        {item.timing}
      </p>
      <Link
        to="/admissions#admission-form"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-secondary py-2.5 text-sm font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover"
      >
        Book Trial
      </Link>
    </article>
  )
}

export function ClassesPage() {
  const [activeSubject, setActiveSubject] = useState<Subject>('Piano')

  const { featured, rest } = useMemo(() => {
    const filtered = allClasses.filter((c) => c.subject === activeSubject)
    const feat = filtered.find((c) => c.featured) ?? filtered[0]
    const others = feat ? filtered.filter((c) => c.id !== feat.id) : []
    return { featured: feat, rest: others }
  }, [activeSubject])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero
          title="Our Music Classes"
          subtitle="Choose your path and start learning with expert guidance"
        />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-[60px]">
          <div className="mx-auto max-w-[1200px]">
            <div
              className="flex flex-wrap justify-center gap-3 md:justify-start"
              role="tablist"
              aria-label="Subject"
            >
              {subjects.map((s) => {
                const active = s === activeSubject
                return (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveSubject(s)}
                    className={`min-w-[100px] rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-secondary text-primary shadow-[0_4px_12px_rgba(212,175,55,0.25)]'
                        : 'border border-primary bg-white text-primary hover:bg-primary/[0.04]'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured ? (
                <ClassCard key={featured.id} item={featured} featured />
              ) : null}
              {rest.map((item) => (
                <ClassCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Not sure where to start?</h2>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-secondary px-8 py-3 font-semibold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
            >
              Talk to Us
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
