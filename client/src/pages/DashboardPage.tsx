import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getLinkedStudentIdFromToken } from '../auth/jwt'
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

  const studentId = useMemo(() => {
    if (role !== 'student' && role !== 'parent') return undefined
    return getLinkedStudentIdFromToken()
  }, [role])

  const classId = useMemo(
    () => parsePositiveInt(searchParams.get('class_id')),
    [searchParams],
  )

  return <DashboardShell role={role} studentId={studentId} classId={classId} />
}
