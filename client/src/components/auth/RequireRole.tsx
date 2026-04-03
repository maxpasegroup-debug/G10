import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { decodeJwtPayload, isJwtExpired } from '../../auth/jwt'
import { getStoredToken } from '../../auth/authService'

export type PortalRole = 'student' | 'parent' | 'teacher'

type RequireRoleProps = {
  allowedRole: PortalRole
  children: ReactNode
}

/**
 * Allows the route only when a non-expired JWT lists `role` matching `allowedRole`.
 * Otherwise redirects to `/login`.
 */
export function RequireRole({ allowedRole, children }: RequireRoleProps) {
  const token = getStoredToken()
  const payload = decodeJwtPayload(token)

  if (!token || !payload || isJwtExpired(payload)) {
    return <Navigate to="/login" replace />
  }

  if (payload.role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
