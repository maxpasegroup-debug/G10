import { useCallback, useEffect, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

type EnquiryRow = {
  id: number
  name: string
  phone: string
  course: string
  age: string | null
  created_at: string
}

async function readList<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function AdminEnquiriesPage() {
  const [rows, setRows] = useState<EnquiryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!API_URL) {
      setError('VITE_API_URL is not set')
      setRows([])
      setLoading(false)
      return
    }
    setError(null)
    const res = await fetch(apiUrl('/api/enquiries'), { headers: authHeaders() })
    const data = await readList<EnquiryRow[]>(res)
    setRows(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await load()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load enquiries')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [load])

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Enquiries</h2>
        <p className="mt-1 text-sm text-primary/65">Review and respond to admission enquiries.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-primary/60">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-primary/[0.08] bg-white p-8 text-center text-base text-primary/55 shadow-[var(--shadow-card)]">
          No enquiries yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-lg font-bold text-primary">{r.name}</p>
                <time className="text-xs text-primary/50" dateTime={r.created_at}>
                  {formatWhen(r.created_at)}
                </time>
              </div>
              <p className="mt-2 text-sm text-primary/80">
                <span className="font-semibold">Phone:</span> {r.phone}
              </p>
              <p className="mt-1 text-sm text-primary/80">
                <span className="font-semibold">Course:</span> {r.course}
              </p>
              {r.age ? (
                <p className="mt-1 text-sm text-primary/80">
                  <span className="font-semibold">Age:</span> {r.age}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
