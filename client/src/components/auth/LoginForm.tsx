import { useState, type FormEvent } from 'react'
import type { UserRole } from '../../auth/types'
import {
  loginWithOtp,
  loginWithPassword,
  requestPasswordReset,
  sendOtp,
} from '../../auth/authService'

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  teacher: 'Teacher',
  admin: 'Administrator',
}

type AuthMode = 'password' | 'otp'

type LoginFormProps = {
  role: UserRole
  onChangeRole: () => void
  onLoginSuccess: (role: UserRole) => void
}

export function LoginForm({ role, onChangeRole, onLoginSuccess }: LoginFormProps) {
  const [mode, setMode] = useState<AuthMode>('password')
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpHint, setOtpHint] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePasswordLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await loginWithPassword({
        role,
        emailOrMobile: emailOrMobile.trim(),
        password,
      })
      if (result.success) {
        onLoginSuccess(result.role ?? role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await loginWithOtp({
        role,
        emailOrMobile: emailOrMobile.trim(),
        otp: otp.trim(),
      })
      if (result.success) {
        onLoginSuccess(result.role ?? role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    const id = emailOrMobile.trim()
    if (!id) {
      setError('Enter your email or mobile first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(id, role)
      setOtpHint(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendOtp() {
    const id = emailOrMobile.trim()
    if (!id) {
      setError('Enter your email or mobile first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await sendOtp(id, role)
      setOtpHint('If this account exists, a code was sent.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-primary">Sign in</h1>
          <p className="mt-1 text-sm text-primary/60">
            as{' '}
            <span className="font-medium text-primary">{roleLabels[role]}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeRole}
          disabled={loading}
          className="shrink-0 text-sm font-medium text-primary/70 underline-offset-2 hover:text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Change role
        </button>
      </div>

      <div
        className="mt-6 flex rounded-[12px] border border-primary/[0.1] bg-surface/80 p-1"
        role="tablist"
        aria-label="Sign-in method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'password'}
          disabled={loading}
          onClick={() => {
            setMode('password')
            setError(null)
          }}
          className={`flex-1 rounded-[10px] py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === 'password'
              ? 'bg-white text-primary shadow-sm'
              : 'text-primary/60 hover:text-primary'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'otp'}
          disabled={loading}
          onClick={() => {
            setMode('otp')
            setError(null)
          }}
          className={`flex-1 rounded-[10px] py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === 'otp'
              ? 'bg-white text-primary shadow-sm'
              : 'text-primary/60 hover:text-primary'
          }`}
        >
          Login with OTP
        </button>
      </div>

      {error && (
        <p
          className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      {mode === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-id" className="mb-1.5 block text-sm font-medium text-primary">
              Email or mobile
            </label>
            <input
              id="auth-id"
              name="emailOrMobile"
              type="text"
              autoComplete="username"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              disabled={loading}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-4 py-3 text-sm text-primary shadow-[inset_0_1px_2px_rgba(11,42,74,0.04)] outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="you@school.edu or +91 …"
              required
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-primary">
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-4 py-3 text-sm text-primary shadow-[inset_0_1px_2px_rgba(11,42,74,0.04)] outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm font-medium text-primary/75 underline-offset-2 hover:text-primary hover:underline disabled:opacity-50"
            >
              Forgot Password
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-secondary py-3.5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-id-otp" className="mb-1.5 block text-sm font-medium text-primary">
              Email or mobile
            </label>
            <input
              id="auth-id-otp"
              name="emailOrMobile"
              type="text"
              autoComplete="username"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-4 py-3 text-sm text-primary shadow-[inset_0_1px_2px_rgba(11,42,74,0.04)] outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40"
              placeholder="you@school.edu or +91 …"
              required
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="auth-otp" className="mb-1.5 block text-sm font-medium text-primary">
                One-time code
              </label>
              <input
                id="auth-otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-4 py-3 text-sm text-primary shadow-[inset_0_1px_2px_rgba(11,42,74,0.04)] outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="6-digit code"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="shrink-0 rounded-[12px] border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/[0.04] disabled:opacity-60 sm:mb-0"
            >
              Send OTP
            </button>
          </div>
          {otpHint && <p className="text-xs text-primary/55">{otpHint}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-secondary py-3.5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Login'}
          </button>
        </form>
      )}
    </div>
  )
}
