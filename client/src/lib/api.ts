/** Normalized API base (no trailing slash). Empty string when `VITE_API_URL` is unset — use for UI guards before calling `apiUrl`. */
function readApiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined
  return String(raw ?? '')
    .trim()
    .replace(/\/$/, '')
}

export const API_URL = readApiBase()

/**
 * Absolute URL for an API path. Always uses the configured backend origin.
 * @throws Error if `VITE_API_URL` is not set (avoids accidental same-origin `/api/...` calls that break login).
 */
export function apiUrl(path: string): string {
  const base = readApiBase()
  if (!base) {
    throw new Error('VITE_API_URL is not set')
  }
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/** Public gallery binary (no JWT; row must exist in gallery_items). */
export function galleryFileUrl(id: number): string {
  if (!API_URL || !Number.isFinite(id) || id <= 0) return ''
  return apiUrl(`/api/gallery/files/${id}`)
}

/**
 * Absolute URL for API-hosted uploads. `/uploads/...` maps to authenticated `/api/uploads/...`.
 * Use with `AuthedImage` or fetch + Bearer for anything under `/api/uploads/`.
 */
export function resolveMediaUrl(urlOrPath: string): string {
  if (!urlOrPath) return ''
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) return urlOrPath
  if (!API_URL) return urlOrPath
  const p = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`
  if (p.startsWith('/uploads/')) {
    return `${API_URL}/api/uploads${p.slice('/uploads'.length)}`
  }
  return `${API_URL}${p}`
}
