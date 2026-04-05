/** Base URL for the Express API (no trailing slash). Set in `.env` as VITE_API_URL. */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${p}`
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
