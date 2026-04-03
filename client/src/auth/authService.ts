import { API_URL, apiUrl } from '../lib/api'
import type { AuthResult, OtpLoginPayload, PasswordLoginPayload, UserRole } from './types'

const TOKEN_KEY = 'music_academy_token'

export async function loginWithPassword(payload: PasswordLoginPayload): Promise<AuthResult> {
  if (!API_URL) {
    throw new Error('Sign-in requires VITE_API_URL to be set.')
  }

  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.emailOrMobile,
      password: payload.password,
    }),
  })
  const data = (await res.json()) as {
    success?: boolean
    error?: string
    data?: { token?: string; user?: { role?: string } }
  }
  if (!res.ok) {
    throw new Error(data.error || 'Sign-in failed')
  }
  if (data.data?.token) {
    localStorage.setItem(TOKEN_KEY, data.data.token)
  }
  const apiRole = data.data?.user?.role
  const role =
    apiRole === 'admin' ||
    apiRole === 'student' ||
    apiRole === 'parent' ||
    apiRole === 'teacher'
      ? apiRole
      : undefined
  return { success: true, role: role ?? payload.role }
}

export async function loginWithOtp(_payload: OtpLoginPayload): Promise<AuthResult> {
  void _payload
  throw new Error('OTP sign-in is not available.')
}

export async function requestPasswordReset(
  _emailOrMobile: string,
  _role: UserRole,
): Promise<void> {
  void _emailOrMobile
  void _role
  throw new Error('Password reset is not available.')
}

export async function sendOtp(_emailOrMobile: string, _role: UserRole): Promise<void> {
  void _emailOrMobile
  void _role
  throw new Error('OTP is not available.')
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Headers for authenticated API calls. Pass `true` when sending JSON body. */
export function authHeaders(jsonBody?: boolean): HeadersInit {
  const headers: Record<string, string> = {}
  if (jsonBody) headers['Content-Type'] = 'application/json'
  const token = getStoredToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
