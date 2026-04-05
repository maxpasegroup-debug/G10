import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import type { UserRole } from '../../auth/types'
import { loginWithPassword } from '../../auth/authService'

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  teacher: 'Teacher',
  admin: 'Administrator',
}

type LoginFormProps = {
  role: UserRole
  onChangeRole: () => void
  onLoginSuccess: (role: UserRole) => void
}

export function LoginForm({ role, onChangeRole, onLoginSuccess }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = role === 'admin'

  async function handlePasswordLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await loginWithPassword({
        role,
        identifier: identifier.trim(),
        password,
      })
      if (result.success) {
        toast.success('Signed in successfully')
        onLoginSuccess(result.role ?? role)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed'
      setError(msg)
      toast.error(msg)
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

      {error && (
        <p
          className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
        <div>
          <label htmlFor="auth-identifier" className="mb-1.5 block text-sm font-medium text-primary">
            {isAdmin ? 'Email' : 'Mobile Number'}
          </label>
          <input
            id="auth-identifier"
            name={isAdmin ? 'email' : 'mobile'}
            type="text"
            autoComplete={isAdmin ? 'email' : 'tel'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            className="w-full rounded-[12px] border border-primary/[0.12] bg-white px-4 py-3 text-sm text-primary shadow-[inset_0_1px_2px_rgba(11,42,74,0.04)] outline-none transition placeholder:text-primary/35 focus:border-primary/35 focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={isAdmin ? 'admin@g10amr.com' : '+91 XXXXX XXXXX'}
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
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[8px] bg-secondary py-3.5 text-sm font-semibold text-primary shadow-[0_4px_16px_-4px_rgba(212,175,55,0.45)] transition hover:bg-secondary-hover disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
