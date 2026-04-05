import { useEffect, useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { DotProps } from 'recharts'
import { AuthedImage } from '../AuthedImage'
import { authHeaders } from '../../auth/authService'
import { API_URL, resolveMediaUrl } from '../../lib/api'
import { apiFetchData } from '../../lib/apiClient'

type PerformanceBand =
  | 'Needs Improvement'
  | 'Perfect Timing'
  | 'Good Performance'
  | 'Special Performance'
  | 'OK Performance'

const bandColors: Record<PerformanceBand, string> = {
  'Needs Improvement': '#dc2626',
  'Perfect Timing': '#2563eb',
  'Good Performance': '#16a34a',
  'Special Performance': '#D4AF37',
  'OK Performance': '#f97316',
}

type PerformanceRow = {
  id: number
  student_id: number
  score: string
  remarks: string | null
  created_at: string
}

type AttendanceRow = {
  id: number
  student_id: number
  date: string
  status: string
}

type StudentApi = {
  id: number
  name: string | null
  photo: string | null
  subject: string | null
  class_id: number | null
}

type Props = {
  studentId?: number
  classId?: number
}

/** Maps weekly performance value → point color (5-band scale). */
function colorForPerformanceLevel(value: number): string {
  if (value < 60) return '#dc2626'
  if (value < 70) return '#f97316'
  if (value < 80) return '#16a34a'
  if (value < 90) return '#2563eb'
  return '#D4AF37'
}

function scoreTextToNumeric(score: string): number {
  const n = Number.parseInt(String(score).trim(), 10)
  if (!Number.isNaN(n)) return Math.min(100, Math.max(0, n))
  const lower = String(score).trim().toLowerCase()
  if (lower.includes('red') || lower.includes('needs')) return 55
  if (lower.includes('orange') || lower.includes('ok')) return 65
  if (lower.includes('green') || lower.includes('good')) return 75
  if (lower.includes('blue') || lower.includes('perfect')) return 85
  if (lower.includes('yellow') || lower.includes('special')) return 95
  return 70
}

function scoreTextToBand(score: string): PerformanceBand {
  const lower = String(score).trim().toLowerCase()
  if (lower.includes('red') || lower.includes('needs')) return 'Needs Improvement'
  if (lower.includes('orange') || lower.includes('ok performance')) return 'OK Performance'
  if (lower.includes('green') || lower.includes('good')) return 'Good Performance'
  if (lower.includes('blue') || lower.includes('perfect')) return 'Perfect Timing'
  if (lower.includes('yellow') || lower.includes('special')) return 'Special Performance'
  const n = Number.parseInt(String(score).trim(), 10)
  if (!Number.isNaN(n)) {
    if (n < 60) return 'Needs Improvement'
    if (n < 70) return 'OK Performance'
    if (n < 80) return 'Good Performance'
    if (n < 90) return 'Perfect Timing'
    return 'Special Performance'
  }
  return 'Good Performance'
}

function attendancePercentForStudent(rows: AttendanceRow[], studentId: number): number {
  const mine = rows.filter((r) => r.student_id === studentId)
  if (mine.length === 0) return 0
  const counted = mine.filter((r) => {
    const s = (r.status || '').toLowerCase()
    return s === 'present' || s === 'late'
  }).length
  return Math.round((counted / mine.length) * 100)
}

export function PerformanceDashboard({ studentId, classId }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentApi | null>(null)
  const [performance, setPerformance] = useState<PerformanceRow[]>([])
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      setError('Set VITE_API_URL in the client environment to load dashboard data.')
      return
    }
    if (!studentId) {
      setLoading(false)
      setError(
        'Your login is not linked to a student record yet. Ask the studio to link your account to your student profile, then sign in again.',
      )
      setStudent(null)
      setPerformance([])
      setAttendance([])
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const perfQ = new URLSearchParams({ student_id: String(studentId) })
        const performance = await apiFetchData<PerformanceRow[]>(`/api/performance?${perfQ}`, {
          headers: authHeaders(),
        })

        const attParams = new URLSearchParams({ student_id: String(studentId) })
        if (classId) attParams.set('class_id', String(classId))
        const attendance = await apiFetchData<AttendanceRow[]>(`/api/attendance?${attParams}`, {
          headers: authHeaders(),
        })

        const student = await apiFetchData<StudentApi | null>(`/api/students/${studentId}`, {
          headers: authHeaders(),
        })

        if (cancelled) return
        setPerformance(performance ?? [])
        setAttendance(attendance ?? [])
        setStudent(student ?? null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load data')
          setStudent(null)
          setPerformance([])
          setAttendance([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [studentId, classId])

  const view = useMemo(() => {
    if (!studentId || !student) return null
    const rows = [...performance].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    const latestScore = rows.length ? rows[rows.length - 1].score : '—'
    const band = rows.length ? scoreTextToBand(latestScore) : 'Good Performance'
    const numeric = rows.length ? scoreTextToNumeric(latestScore) : 0
    const color = bandColors[band]
    const trend = rows.map((r) => scoreTextToNumeric(r.score))
    const pct = attendancePercentForStudent(attendance, studentId)
    return {
      name: student.name || 'Student',
      photoUrl: student.photo ? resolveMediaUrl(student.photo) : null,
      subject: student.subject || '—',
      attendancePct: pct,
      band,
      color,
      circleScore: numeric,
      trend: trend.length ? trend : [numeric],
      latestLabel: latestScore,
    }
  }, [student, studentId, performance, attendance])

  if (loading) {
    return (
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
        Loading attendance and performance…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-5 text-sm text-red-800 shadow-[var(--shadow-card)]">
        {error}
      </div>
    )
  }

  if (!view) {
    return (
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-8 text-center text-sm text-primary/55 shadow-[var(--shadow-card)]">
        No student data.
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[12px] border border-primary/[0.08] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
        <p className="text-sm font-medium text-primary/65">Subject</p>
        <p className="mt-1 text-base font-semibold text-primary">{view.subject}</p>
        {!classId ? (
          <p className="mt-2 text-xs text-amber-800">
            Optional: add class_id to the URL to scope attendance to a class roster.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[12px] border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] md:col-span-2 xl:col-span-3">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              {view.photoUrl ? (
                <AuthedImage
                  src={view.photoUrl}
                  alt={view.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                />
              ) : (
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary/45 ring-2 ring-primary/10"
                  aria-hidden
                >
                  {(view.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-primary">{view.name}</h3>
                <p className="text-sm text-primary/55">Attendance {view.attendancePct}%</p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-between gap-3 sm:justify-end">
              <PerformanceCircle score={view.circleScore} color={view.color} />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/45">Performance</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: view.color }}>
                  {view.band}
                </p>
                <p className="mt-0.5 text-xs text-primary/50">Latest: {view.latestLabel}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[10px] border border-primary/[0.08] bg-surface/80 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary/45">
              Performance over time
            </p>
            <WeeklyPerformanceChart values={view.trend} />
          </div>
        </article>
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
    () => values.map((performance, i) => ({ week: `P${i + 1}`, performance })),
    [values],
  )

  return (
    <div className="h-[108px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: 'rgba(11, 42, 74, 0.45)' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(11, 42, 74, 0.12)' }}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            width={28}
            tick={{ fontSize: 10, fill: 'rgba(11, 42, 74, 0.45)' }}
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
