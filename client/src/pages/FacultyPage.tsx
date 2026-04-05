import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { API_URL, resolveMediaUrl } from '../lib/api'
import { fetchPublicTeachers, type PublicTeacherRow } from '../lib/publicContent'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1920&q=82'

type FacultyCard = {
  key: string
  photoUrl: string | null
  name: string
  specialization: string
  experience: string
  bio: string
}

const STATIC_FACULTY: FacultyCard[] = [
  {
    key: 'static-rahul',
    photoUrl: null,
    name: 'Rahul Nair',
    specialization: 'Guitar Instructor',
    experience: '8+ years experience',
    bio: 'Blends fingerstyle foundations with stage-ready repertoire—students leave every term with songs they are proud to play.',
  },
  {
    key: 'static-meera',
    photoUrl: null,
    name: 'Meera Krishnan',
    specialization: 'Piano Instructor',
    experience: '10+ years experience',
    bio: 'Classical reading meets contemporary pieces; calm pacing for young learners and clear goals for teens.',
  },
  {
    key: 'static-arjun',
    photoUrl: null,
    name: 'Arjun Menon',
    specialization: 'Drums Instructor',
    experience: '12+ years experience',
    bio: 'Builds time, touch, and musicality on the kit—groove-first teaching that connects practice to real bands.',
  },
]

const PHILOSOPHY = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
    title: 'Personalized Attention',
    text: 'Small batches and clear feedback loops—every family knows how their child is progressing week to week.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    title: 'Practical Learning',
    text: 'Lessons tie technique to real songs and listening skills—music you can use, not only exercises on a page.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    ),
    title: 'Performance Focus',
    text: 'Recitals and studio showcases turn practice into presence—confidence that carries beyond the classroom.',
  },
] as const

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'G'
}

function bioFromApi(bio: string | null, title: string) {
  const t = (bio || '').trim()
  if (t.length >= 40) {
    const cut = t.slice(0, 220)
    const lastPeriod = cut.lastIndexOf('.')
    return lastPeriod > 80 ? `${cut.slice(0, lastPeriod + 1)}` : `${cut.trim()}…`
  }
  const role = (title || '').trim() || 'Music'
  return `Teaches ${role} with patient structure, listening skills, and performance-minded goals—so students sound like musicians, not just players.`
}

function experienceFromApi(title: string) {
  const t = (title || '').trim()
  return t ? `${t} · studio-trained faculty` : 'Studio-trained faculty · G10 AMR'
}

function mapTeacher(row: PublicTeacherRow): FacultyCard {
  const name = (row.name || '').trim() || 'Faculty'
  const title = (row.title || '').trim() || 'Music Instructor'
  return {
    key: `api-${row.id}`,
    photoUrl: row.photo_url ? resolveMediaUrl(row.photo_url) : null,
    name,
    specialization: title,
    experience: experienceFromApi(title),
    bio: bioFromApi(row.bio, title),
  }
}

export function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyCard[]>(STATIC_FACULTY)

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false
    ;(async () => {
      try {
        const rows = await fetchPublicTeachers()
        if (cancelled || rows.length === 0) return
        setFaculty(rows.map(mapTeacher))
      } catch {
        /* keep STATIC_FACULTY */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="Faculty hero"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 42, 74, 0.85), rgba(11, 42, 74, 0.95))',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(230,179,37,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-3xl py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            G10 AMR · Faculty
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Meet Our Faculty
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            Experienced musicians dedicated to your growth
          </p>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-20 sm:px-8"
        aria-labelledby="instructors-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="instructors-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Instructors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
            Vetted performers and educators who teach the way they wish they had been taught—clear, kind, and
            musically serious.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((person) => (
              <article
                key={person.key}
                className="flex flex-col rounded-xl bg-white p-8 text-[#0B2A4A] shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="mx-auto shrink-0">
                  {person.photoUrl ? (
                    <img
                      src={person.photoUrl}
                      alt={person.name}
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-full object-cover ring-2 ring-[#0B2A4A]/10"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      className="flex h-32 w-32 items-center justify-center rounded-full bg-[#0B2A4A] text-xl font-bold tracking-tight text-[#E6B325] ring-2 ring-[#E6B325]/30"
                      aria-hidden
                    >
                      {initialsFromName(person.name)}
                    </div>
                  )}
                </div>
                <h3 className="mt-6 text-center text-xl font-bold">{person.name}</h3>
                <p className="mt-1 text-center text-sm font-semibold text-[#E6B325]">{person.specialization}</p>
                <p className="mt-3 text-center text-xs font-medium uppercase tracking-wider text-[#0B2A4A]/50">
                  {person.experience}
                </p>
                <p className="mt-5 text-center text-sm leading-relaxed text-[#0B2A4A]/80">{person.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="philosophy-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="philosophy-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Teaching Philosophy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
            What parents notice first: structure without stiffness, and progress without pressure.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PHILOSOPHY.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm transition hover:border-[#E6B325]/35"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6B325]/15 text-[#E6B325]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    {item.icon}
                  </svg>
                </span>
                <h3 className="mt-6 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#0B2A4A] px-5 py-20 text-center sm:px-8"
        aria-label="Request a trial"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Learn from passionate and experienced musicians
          </h2>
          <p className="mx-auto mt-4 text-white/70">
            Meet the studio, hear our approach, and see which program fits your child—or yourself—best.
          </p>
          <Link
            to="/admissions#admission-form"
            className="mt-10 inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-lg bg-[#E6B325] px-10 text-base font-semibold text-black shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Request a Trial Class
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
