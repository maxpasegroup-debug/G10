import { getStoredToken } from './authService'

/** Payload shape from server `jwt.sign({ id, email, role }, …)`. */
export type AppJwtPayload = {
  id?: number
  email?: string
  role?: string
  exp?: number
  iat?: number
}

function base64UrlToString(segment: string): string {
  const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4)
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Decode JWT payload (no signature verification — use only for routing UI;
 * the API still validates the token).
 */
export function decodeJwtPayload(token: string | null | undefined): AppJwtPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = base64UrlToString(parts[1])
    return JSON.parse(json) as AppJwtPayload
  } catch {
    return null
  }
}

export function isJwtExpired(payload: AppJwtPayload | null): boolean {
  if (!payload?.exp || typeof payload.exp !== 'number') return false
  return payload.exp * 1000 <= Date.now()
}

/**
 * Strict check for route guards: payload must carry a numeric `exp` in the future.
 * Tokens without `exp` are treated as invalid for protected routes.
 */
export function isJwtSessionValid(payload: AppJwtPayload | null): boolean {
  if (!payload?.exp || typeof payload.exp !== 'number') return false
  return payload.exp * 1000 > Date.now()
}

/** Path for the role-specific dashboard shell (or admin app). */
export function getDashboardPathForRole(role: string | null | undefined): string | null {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'student':
      return '/student'
    case 'parent':
      return '/parent'
    case 'teacher':
      return '/teacher'
    default:
      return null
  }
}

/** Valid token → dashboard path for that role; missing/expired/unknown → null. */
export function getAuthenticatedDashboardPath(): string | null {
  const token = getStoredToken()
  const payload = decodeJwtPayload(token)
  if (!token || !payload || isJwtExpired(payload)) return null
  return getDashboardPathForRole(payload.role)
}
