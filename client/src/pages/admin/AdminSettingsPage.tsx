import { useEffect, useId, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl } from '../../lib/api'

export function AdminSettingsPage() {
  const formId = useId()
  const [academyName, setAcademyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [mapEmbedUrl, setMapEmbedUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!API_URL) {
      setError('VITE_API_URL is not set')
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(apiUrl('/api/settings'))
        const body = (await res.json()) as {
          success?: boolean
          data?: {
            academy_name: string
            email: string
            phone: string
            address: string
            map_embed_url: string | null
          }
          error?: string
        }
        if (!res.ok) throw new Error(body.error || 'Could not load settings')
        const d = body.data
        if (d && !cancelled) {
          setAcademyName(d.academy_name ?? '')
          setEmail(d.email ?? '')
          setPhone(d.phone ?? '')
          setAddress(d.address ?? '')
          setMapEmbedUrl(d.map_embed_url ?? '')
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave() {
    if (!API_URL) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch(apiUrl('/api/settings'), {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({
          academy_name: academyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          map_embed_url: mapEmbedUrl.trim() || null,
        }),
      })
      const body = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(body.error || 'Save failed')
      setMessage('Saved')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-primary/60">Loading settings…</p>
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Settings</h2>
        <p className="mt-1 text-sm text-primary/65">
          Public site contact details and branding (stored in the database).
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="space-y-6 rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
        <div>
          <label htmlFor={`${formId}-name`} className="mb-2 block text-base font-semibold text-primary">
            Academy name
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={academyName}
            onChange={(e) => {
              setAcademyName(e.target.value)
              setMessage(null)
            }}
            autoComplete="organization"
            disabled={saving}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="mb-2 block text-base font-semibold text-primary">
            Email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setMessage(null)
            }}
            autoComplete="email"
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="mb-2 block text-base font-semibold text-primary">
            Phone number
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setMessage(null)
            }}
            autoComplete="tel"
            disabled={saving}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-address`} className="mb-2 block text-base font-semibold text-primary">
            Address
          </label>
          <textarea
            id={`${formId}-address`}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setMessage(null)
            }}
            rows={3}
            className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-map`} className="mb-2 block text-base font-semibold text-primary">
            Map embed URL
          </label>
          <input
            id={`${formId}-map`}
            type="url"
            value={mapEmbedUrl}
            onChange={(e) => {
              setMapEmbedUrl(e.target.value)
              setMessage(null)
            }}
            disabled={saving}
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="https://maps.google.com/maps?…"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {message ? (
            <p className="text-center text-base font-medium text-green-700 sm:text-left">{message}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
