import { API_URL, apiUrl } from '../lib/api'
import type { AuthResult, OtpLoginPayload, PasswordLoginPayload, UserRole } from './types'

const TOKEN_KEY = 'music_academy_token'

/**
 * When `VITE_API_URL` is set, auth calls the Express API; otherwise a short delay simulates success (local UI).
 */

export async function loginWithPassword(payload: PasswordLoginPayload): Promise<AuthResult> {
  if (!API_URL) {
    await delay(400)
    return { success: true }
  }

  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.emailOrMobile,
      password: payload.password,
    }),
  })
  const data = (await res.json()) as { success?: boolean; error?: string; data?: { token?: string } }
  if (!res.ok) {
    throw new Error(data.error || 'Sign-in failed')
  }
  if (data.data?.token) {
    localStorage.setItem(TOKEN_KEY, data.data.token)
  }
  return { success: true }
}

export async function loginWithOtp(_payload: OtpLoginPayload): Promise<AuthResult> {
  if (!API_URL) {
    await delay(400)
    return { success: true }
  }
  // OTP endpoint not implemented on server yet — keep graceful fallback.
  await delay(400)
  return { success: true }
}

export async function requestPasswordReset(
  _emailOrMobile: string,
  _role: UserRole,
): Promise<void> {
  void _emailOrMobile
  void _role
  await delay(300)
}

export async function sendOtp(_emailOrMobile: string, _role: UserRole): Promise<void> {
  void _emailOrMobile
  void _role
  await delay(300)
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
