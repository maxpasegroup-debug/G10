import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { authHeaders } from '../../auth/authService'
import { API_URL, apiUrl, resolveMediaUrl } from '../../lib/api'

type GalleryRow = {
  id: number
  image_url: string
  caption: string
  category: string
}

const CATEGORIES = ['classes', 'performances', 'studio'] as const

async function readJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as { success?: boolean; data?: T; error?: string }
  if (!res.ok) throw new Error(body.error || res.statusText || 'Request failed')
  return body.data as T
}

export function AdminGalleryAdminPage() {
  const formId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<GalleryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState<string>('classes')
  const [imageUrl, setImageUrl] = useState('')

  const load = useCallback(async () => {
    if (!API_URL) {
      setError('VITE_API_URL is not set')
      setItems([])
      return
    }
    setError(null)
    const res = await fetch(apiUrl('/api/gallery'))
    const data = await readJson<GalleryRow[]>(res)
    setItems(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await load()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load gallery')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [load])

  const openPicker = () => fileRef.current?.click()

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    e.target.value = ''
    if (!list?.length || !API_URL) return
    const file = list[0]
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', caption.trim() || file.name)
      fd.append('category', category)
      const res = await fetch(apiUrl('/api/gallery/upload'), {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      })
      await readJson<GalleryRow>(res)
      setCaption('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function addByUrl(e: React.FormEvent) {
    e.preventDefault()
    if (!API_URL || !imageUrl.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(apiUrl('/api/gallery'), {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          caption: caption.trim() || 'Photo',
          category,
        }),
      })
      await readJson<GalleryRow>(res)
      setImageUrl('')
      setCaption('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add image')
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id: number) {
    if (!API_URL) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(apiUrl(`/api/gallery/${id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      })
      await readJson<{ id: number }>(res)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-primary/60">Loading gallery…</p>
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary sm:text-xl">Gallery photos</h2>
          <p className="mt-1 text-sm text-primary/65">
            Upload files or paste an image URL. Photos appear on the public gallery page.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            id={`${formId}-file`}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={submitting}
            onChange={(ev) => void onFilesSelected(ev)}
          />
          <button
            type="button"
            onClick={openPicker}
            disabled={submitting}
            className="min-h-[56px] w-full rounded-xl bg-secondary px-8 text-lg font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
          >
            {submitting ? 'Working…' : 'Upload Photo'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor={`${formId}-cap`} className="mb-1.5 block text-sm font-semibold text-primary">
            Caption (used for uploads &amp; URL adds)
          </label>
          <input
            id={`${formId}-cap`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:opacity-60"
            placeholder="e.g. Piano recital"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-cat`} className="mb-1.5 block text-sm font-semibold text-primary">
            Category
          </label>
          <select
            id={`${formId}-cat`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:opacity-60"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={(e) => void addByUrl(e)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${formId}-url`} className="mb-1.5 block text-sm font-semibold text-primary">
            Or add by image URL
          </label>
          <input
            id={`${formId}-url`}
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-primary/[0.12] px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:opacity-60"
            placeholder="https://…"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !imageUrl.trim()}
          className="min-h-[52px] shrink-0 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add URL
        </button>
      </form>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-surface/40 px-6 py-16 text-center">
          <p className="text-base font-medium text-primary/70">No photos in the database yet.</p>
          <p className="mt-2 text-sm text-primary/55">Upload a file or add an image URL above.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((img) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-2xl border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-square bg-primary/[0.06]">
                <img
                  src={resolveMediaUrl(img.image_url)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="mb-2 line-clamp-2 text-xs text-primary/70">{img.caption}</p>
                <p className="mb-2 text-[11px] font-semibold uppercase text-primary/45">{img.category}</p>
                <button
                  type="button"
                  onClick={() => void remove(img.id)}
                  disabled={submitting}
                  className="min-h-[48px] w-full rounded-xl bg-red-600 px-4 text-base font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
