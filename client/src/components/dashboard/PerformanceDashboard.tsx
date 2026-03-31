import { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { DotProps } from 'recharts'

type Subject = 'Keyboard' | 'Guitar' | 'Vocal' | 'Drums'

type PerformanceBand =
  | 'Needs Improvement'
  | 'Perfect Timing'
  | 'Good Performance'
  | 'Special Performance'
  | 'OK Performance'

type Student = {
  id: string
  name: string
  photo: string
  attendance: number
  score: number
  band: PerformanceBand
  trend: number[]
  subject: Subject
}

const subjects: Subject[] = ['Keyboard', 'Guitar', 'Vocal', 'Drums']

const bandColors: Record<PerformanceBand, string> = {
  'Needs Improvement': '#dc2626',
  'Perfect Timing': '#2563eb',
  'Good Performance': '#16a34a',
  'Special Performance': '#f4b400',
  'OK Performance': '#f97316',
}

/** Maps weekly performance value → point color (5-band scale). */
function colorForPerformanceLevel(value: number): string {
  if (value < 60) return '#dc2626'
  if (value < 70) return '#f97316'
  if (value < 80) return '#16a34a'
  if (value < 90) return '#2563eb'
  return '#f4b400'
}

const students: Student[] = [
  {
    id: 's1',
    name: 'Aarav Nair',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&q=80&auto=format&fit=crop',
    attendance: 97,
    score: 92,
    band: 'Perfect Timing',
    trend: [72, 78, 80, 86, 89, 92],
    subject: 'Keyboard',
  },
  {
    id: 's2',
    name: 'Diya Menon',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&q=80&auto=format&fit=crop',
    attendance: 94,
    score: 86,
    band: 'Good Performance',
    trend: [62, 68, 73, 78, 82, 86],
    subject: 'Guitar',
  },
  {
    id: 's3',
    name: 'Neha Paul',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=180&q=80&auto=format&fit=crop',
    attendance: 89,
    score: 79,
    band: 'OK Performance',
    trend: [70, 69, 72, 74, 77, 79],
    subject: 'Vocal',
  },
  {
    id: 's4',
    name: 'Kiran Das',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=180&q=80&auto=format&fit=crop',
    attendance: 82,
    score: 65,
    band: 'Needs Improvement',
    trend: [74, 71, 69, 68, 66, 65],
    subject: 'Drums',
  },
  {
    id: 's5',
    name: 'Maya George',
    photo: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=180&q=80&auto=format&fit=crop',
    attendance: 98,
    score: 95,
    band: 'Special Performance',
    trend: [78, 82, 86, 90, 93, 95],
    subject: 'Keyboard',
  },
  {
    id: 's6',
    name: 'Rohan Babu',
    photo: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=180&q=80&auto=format&fit=crop',
    attendance: 93,
    score: 84,
    band: 'Good Performance',
    trend: [60, 64, 71, 76, 81, 84],
    subject: 'Drums',
  },
]

export function PerformanceDashboard() {
  const [activeSubject, setActiveSubject] = useState<Subject>('Keyboard')

  const filteredStudents = useMemo(
    () => students.filter((student) => student.subject === activeSubject),
    [activeSubject],
  )

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <p className="mb-3 text-sm font-medium text-primary/65">Subjects</p>
        <div className="flex flex-wrap gap-2.5">
          {subjects.map((subject) => {
            const active = subject === activeSubject
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setActiveSubject(subject)}
                className={`rounded-[12px] border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-secondary bg-secondary/15 text-primary shadow-[0_4px_14px_-6px_rgba(244,180,0,0.55)]'
                    : 'border-primary/[0.12] bg-white text-primary/75 hover:bg-primary/[0.04]'
                }`}
              >
                {subject}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredStudents.map((student) => (
          <article
            key={student.id}
            className="rounded-[12px] border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <img
                src={student.photo}
                alt={student.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
              />
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-primary">{student.name}</h3>
                <p className="text-sm text-primary/55">Attendance {student.attendance}%</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <PerformanceCircle score={student.score} color={bandColors[student.band]} />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/45">Performance</p>
                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: bandColors[student.band] }}
                >
                  {student.band}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[10px] border border-primary/[0.08] bg-surface/80 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary/45">
                Weekly performance
              </p>
              <WeeklyPerformanceChart values={student.trend} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PerformanceCircle({ score, color }: { score: number; color: string }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={radius} stroke="#e7edf4" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary">
        {score}
      </span>
    </div>
  )
}

type WeekPoint = {
  week: string
  performance: number
}

function WeeklyPerformanceChart({ values }: { values: number[] }) {
  const data: WeekPoint[] = useMemo(
    () => values.map((performance, i) => ({ week: `W${i + 1}`, performance })),
    [values],
  )

  return (
    <div className="h-[108px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: 'rgba(15, 47, 79, 0.45)' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(15, 47, 79, 0.12)' }}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            width={28}
            tick={{ fontSize: 10, fill: 'rgba(15, 47, 79, 0.45)' }}
            tickLine={false}
            axisLine={false}
          />
          <Line
            type="monotone"
            dataKey="performance"
            stroke="#cbd5e1"
            strokeWidth={1.75}
            dot={<LevelDot />}
            activeDot={{ r: 5, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

type LevelDotProps = DotProps & { payload?: WeekPoint }

function LevelDot(props: LevelDotProps) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || payload == null) return null
  const fill = colorForPerformanceLevel(payload.performance)
  return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={1.5} />
}
