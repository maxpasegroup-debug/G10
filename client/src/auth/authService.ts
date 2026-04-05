import toast from 'react-hot-toast'
import { API_URL } from '../lib/api'
import { apiFetch } from '../lib/apiClient'
import type { AuthResult, PasswordLoginPayload } from './types'

const TOKEN_KEY = 'music_academy_token'

export async function loginWithPassword(payload: PasswordLoginPayload): Promise<AuthResult> {
  if (!API_URL) {
    throw new Error('Sign-in requires VITE_API_URL to be set.')
  }

  const data = await apiFetch<{
    success?: boolean
    error?: string
    data?: { token?: string; user?: { role?: string } }
  }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: payload.identifier.trim(),
      password: payload.password,
    }),
  })
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

/**
 * Full sign-out: remove auth token, clear transient UI (toasts), hard-navigate to login.
 * Uses `location.replace` so the session isn’t kept in history and the entire app remounts (no stale React state).
 */
export function logout(): void {
  clearStoredToken()
  toast.dismiss()
  window.location.replace('/login')
}
