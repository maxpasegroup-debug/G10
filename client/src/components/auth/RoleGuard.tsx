import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../../auth/types'
import { decodeJwtPayload, isJwtSessionValid } from '../../auth/jwt'
import { getStoredToken } from '../../auth/authService'

const KNOWN_ROLES: readonly UserRole[] = ['admin', 'student', 'parent', 'teacher'] as const

function isKnownRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (KNOWN_ROLES as readonly string[]).includes(value)
}

type RoleGuardProps = {
  allowedRole: UserRole
  children: ReactNode
}

/**
 * Route guard: requires a present, non-expired JWT whose `role` matches `allowedRole`.
 * Any failure (missing token, bad shape, expiry, wrong role) → `/login`.
 */
export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const token = getStoredToken()
  const payload = decodeJwtPayload(token)

  if (!token || !payload || !isJwtSessionValid(payload)) {
    return <Navigate to="/login" replace />
  }

  if (!isKnownRole(payload.role) || payload.role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
