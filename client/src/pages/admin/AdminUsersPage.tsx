import { useCallback, useEffect, useId, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { authHeaders } from '../../auth/authService'
import type { UserRole } from '../../auth/types'
import { API_URL } from '../../lib/api'
import { apiFetchData } from '../../lib/apiClient'

type UserRow = {
  id: number
  name: string | null
  email: string
  role: string
  created_at: string
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'parent', label: 'Parent' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' },
]

export function AdminUsersPage() {
  const formId = useId()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')

  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const loadUsers = useCallback(async () => {
    if (!API_URL) {
      setListError('Set VITE_API_URL to manage users.')
      setUsers([])
      return
    }
    setListError(null)
    const data = await apiFetchData<UserRow[]>('/api/users', { headers: authHeaders() })
    setUsers(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        await loadUsers()
      } catch (e) {
        if (!cancelled) setListError(e instanceof Error ? e.message : 'Could not load users')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [loadUsers])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!API_URL) {
      setFormError('VITE_API_URL is not set.')
      return
    }
    setSubmitting(true)
    try {
      await apiFetchData<{ user: UserRow }>('/api/users', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim(),
          password,
          role,
        }),
      })
      setName('')
      setEmail('')
      setPassword('')
      setRole('student')
      await loadUsers()
      toast.success('User created successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error saving data'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !API_URL) return
    setDeleteBusy(true)
    try {
      await apiFetchData<{ id: number }>(`/api/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      setDeleteTarget(null)
      await loadUsers()
      toast.success('User deleted successfully')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error saving data'
      setListError(msg)
      setDeleteTarget(null)
      toast.error(msg)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Users</h2>
        <p className="mt-1 text-sm text-primary/65">
          Create login accounts and assign roles. Only administrators can access this page.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={handleCreate}
          className="h-fit space-y-5 rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
        >
          <h3 className="text-base font-bold text-primary">Add user</h3>

          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p>
          ) : null}

          <div>
            <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-semibold text-primary">
              Name
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="w-full min-h-[48px] rounded-xl border border-primary/[0.12] bg-white px-4 text-sm text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className="mb-1.5 block text-sm font-semibold text-primary">
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full min-h-[48px] rounded-xl border border-primary/[0.12] bg-white px-4 text-sm text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-password`} className="mb-1.5 block text-sm font-semibold text-primary">
              Password
            </label>
            <input
              id={`${formId}-password`}
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="w-full min-h-[48px] rounded-xl border border-primary/[0.12] bg-white px-4 text-sm text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor={`${formId}-role`} className="mb-1.5 block text-sm font-semibold text-primary">
              Role
            </label>
            <select
              id={`${formId}-role`}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={submitting}
              className="w-full min-h-[48px] rounded-xl border border-primary/[0.12] bg-white px-4 text-sm text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full min-h-[48px] rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create user'}
          </button>
        </form>

        <div className="rounded-2xl border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-primary/[0.08] px-5 py-4">
            <h3 className="text-base font-bold text-primary">All users</h3>
            {listError ? <p className="mt-2 text-sm text-red-700">{listError}</p> : null}
          </div>

          {loading ? (
            <p className="p-8 text-center text-sm text-primary/55">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-primary/[0.04] text-xs font-semibold uppercase tracking-wide text-primary/55">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/[0.07]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-primary/55">
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="text-primary">
                        <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                        <td className="px-4 py-3 text-primary/80">{u.email}</td>
                        <td className="px-4 py-3 capitalize text-primary/80">{u.role}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(u)}
                            disabled={loading || submitting || deleteBusy}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4">
          <div
            className="max-w-md rounded-2xl border border-primary/[0.1] bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${formId}-del-title`}
          >
            <h3 id={`${formId}-del-title`} className="text-lg font-bold text-primary">
              Delete user?
            </h3>
            <p className="mt-2 text-sm text-primary/70">
              Remove <strong>{deleteTarget.email}</strong> — they will no longer be able to sign in.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteBusy}
                className="rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/[0.04] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleteBusy}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
