import { Navigate, useSearchParams } from 'react-router-dom'
import { getAuthenticatedDashboardPath } from '../../auth/jwt'

/** Redirects `/dashboard` to the role-specific path; keeps query except `role`. */
export function DashboardLegacyRedirect() {
  const [searchParams] = useSearchParams()
  const path = getAuthenticatedDashboardPath()
  if (!path) return <Navigate to="/login" replace />

  const copy = new URLSearchParams(searchParams)
  copy.delete('role')
  copy.delete('student_id')
  const qs = copy.toString()
  return <Navigate to={qs ? `${path}?${qs}` : path} replace />
}
