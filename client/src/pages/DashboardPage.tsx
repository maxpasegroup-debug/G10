import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { UserRole } from '../auth/types'
import { DashboardShell } from '../components/dashboard/DashboardShell'

export type DashboardPortalRole = Extract<UserRole, 'student' | 'parent' | 'teacher'>

type DashboardPageProps = {
  role: DashboardPortalRole
}

function parsePositiveInt(raw: string | null): number | undefined {
  if (raw == null || raw === '') return undefined
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined
}

export function DashboardPage({ role }: DashboardPageProps) {
  const [searchParams] = useSearchParams()

  const studentId = useMemo(
    () => parsePositiveInt(searchParams.get('student_id')),
    [searchParams],
  )
  const classId = useMemo(
    () => parsePositiveInt(searchParams.get('class_id')),
    [searchParams],
  )

  return <DashboardShell role={role} studentId={studentId} classId={classId} />
}
