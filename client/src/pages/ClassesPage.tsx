import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1464375117522-131db81b0160?auto=format&fit=crop&w=1920&q=82'

const PROGRAMS = [
  {
    icon: '🎸',
    title: 'Guitar',
    description:
      'Chord vocabulary, picking, rhythm, and songcraft—acoustic or electric, with clear milestones each term.',
    age: 'Ages 6+',
    level: 'Beginner → Advanced',
  },
  {
    icon: '🎹',
    title: 'Piano',
    description:
      'Reading, technique, and musicality from first notes to performance pieces, in a patient, structured path.',
    age: 'Ages 5+',
    level: 'Beginner → Advanced',
  },
  {
    icon: '🎤',
    title: 'Vocal',
    description:
      'Breath, pitch, tone, and expression—build confidence for the stage and for everyday communication.',
    age: 'Ages 8+',
    level: 'Beginner → Advanced',
  },
  {
    icon: '🥁',
    title: 'Drums',
    description:
      'Timekeeping, fills, coordination, and groove across styles—taught on kit with real studio monitoring.',
    age: 'Ages 7+',
    level: 'Beginner → Advanced',
  },
] as const

const LEVELS = [
  {
    title: 'Beginner',
    ages: 'Ages 5–8',
    text: 'Introduction to rhythm, basics, and fun learning',
  },
  {
    title: 'Intermediate',
    ages: 'Ages 9–13',
    text: 'Structured lessons with performance practice',
  },
  {
    title: 'Advanced',
    ages: 'Ages 14+',
    text: 'Professional-level training and recording',
  },
] as const

const STEPS = [
  {
    step: 1,
    title: 'Book a Trial Class',
    text: 'Pick a time that suits your family. We’ll confirm and welcome you to the studio.',
  },
  {
    step: 2,
    title: 'Get Skill Evaluation',
    text: 'A calm assessment of listening, rhythm, and comfort—so we place you in the right level.',
  },
  {
    step: 3,
    title: 'Join Your Batch',
    text: 'Small groups, fixed schedules, and clear goals—parents always know what comes next.',
  },
] as const

export function ClassesPage() {
  return (
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="Programs hero"
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
            G10 AMR · Programs
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Explore Our Music Programs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            Structured learning for every age and skill level
          </p>
          <Link
            to="/admissions#admission-form"
            className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#E6B325] px-8 text-base font-semibold text-black shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-[#d4a420]"
          >
            Request a Trial Class
          </Link>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-20 sm:px-8"
        aria-labelledby="programs-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="programs-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Our Programs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
            Four focused tracks—each with age guidance and a clear level path. Parents see structure;
            students feel momentum.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((p) => (
              <article
                key={p.title}
                className="flex flex-col rounded-xl bg-white p-7 text-[#0B2A4A] shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-4xl" aria-hidden>
                  {p.icon}
                </span>
                <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#0B2A4A]/80">{p.description}</p>
                <dl className="mt-6 space-y-2 border-t border-[#0B2A4A]/10 pt-5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[#0B2A4A]/55">Age group</dt>
                    <dd className="text-right font-semibold text-[#0B2A4A]">{p.age}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[#0B2A4A]/55">Level</dt>
                    <dd className="text-right font-semibold text-[#0B2A4A]">{p.level}</dd>
                  </div>
                </dl>
                <Link
                  to="/admissions#admission-form"
                  className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#E6B325] text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-[#d4a420]"
                >
                  Book Trial
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="levels-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="levels-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Learning Levels
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
            Placement is based on age and ability—never guesswork. We explain the “why” to parents
            after every evaluation.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {LEVELS.map((L) => (
              <article
                key={L.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition hover:border-[#E6B325]/35 hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E6B325]">{L.ages}</p>
                <h3 className="mt-3 text-2xl font-bold text-white">{L.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{L.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] to-[#081a2e] px-5 py-20 sm:px-8"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="how-heading"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
            A simple path from first visit to your regular batch—transparent at every step.
          </p>

          <div className="mt-14 lg:relative">
            <div className="hidden lg:absolute lg:left-[16.67%] lg:right-[16.67%] lg:top-[28px] lg:z-0 lg:block lg:h-px lg:bg-gradient-to-r lg:from-transparent lg:via-[#E6B325]/40 lg:to-transparent" aria-hidden />

            <ol className="relative z-10 grid gap-8 lg:grid-cols-3 lg:gap-6">
              {STEPS.map((s) => (
                <li
                  key={s.step}
                  className="relative flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm lg:pt-10"
                >
                  <span
                    className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E6B325] bg-[#0B2A4A] text-lg font-bold text-[#E6B325]"
                    aria-hidden
                  >
                    {s.step}
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="text-sm font-semibold text-[#E6B325] underline-offset-4 transition hover:text-[#f0c94a] hover:underline"
            >
              Questions before you book? Contact us
            </Link>
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#0B2A4A] px-5 py-20 text-center sm:px-8"
        aria-label="Start your journey"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Your Musical Journey Today
          </h2>
          <p className="mx-auto mt-4 text-white/70">
            One trial class is enough to hear the difference a dedicated studio makes—for you and your
            child.
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
