import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { UserRole } from '../auth/types'
import { DashboardShell } from '../components/dashboard/DashboardShell'

const allowedRoles: UserRole[] = ['student', 'parent', 'teacher']

export function DashboardPage() {
  const [searchParams] = useSearchParams()
  const role = useMemo<UserRole>(() => {
    const value = searchParams.get('role')
    if (value && allowedRoles.includes(value as UserRole)) {
      return value as UserRole
    }
    return 'student'
  }, [searchParams])

  return <DashboardShell role={role} />
}
