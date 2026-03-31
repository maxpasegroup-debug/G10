/** Base URL for the Express API (no trailing slash). Set in `.env` as VITE_API_URL. */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${p}`
}
