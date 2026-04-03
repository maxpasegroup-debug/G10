import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { decodeJwtPayload, getDashboardPathForRole, isJwtExpired } from '../../auth/jwt'
import { getStoredToken } from '../../auth/authService'

type RequireAdminProps = {
  children: ReactNode
}

/**
 * Allows content only when a non-expired JWT has `role: admin`.
 */
export function RequireAdmin({ children }: RequireAdminProps) {
  const token = getStoredToken()
  const payload = decodeJwtPayload(token)

  if (!token || !payload || isJwtExpired(payload)) {
    return <Navigate to="/login" replace />
  }

  if (payload.role !== 'admin') {
    const dest = getDashboardPathForRole(payload.role) ?? '/'
    return <Navigate to={dest} replace />
  }

  return <>{children}</>
}
