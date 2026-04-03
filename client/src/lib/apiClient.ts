import { apiUrl } from './api'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown = undefined) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function readResponseJson(res: Response): Promise<unknown> {
  const text = await res.text()
  const t = text.trim()
  if (!t) return null
  try {
    return JSON.parse(t) as unknown
  } catch {
    throw new ApiError('Invalid JSON from API', res.status)
  }
}

function errorMessageFromBody(body: unknown, res: Response): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const e = (body as { error: unknown }).error
    if (typeof e === 'string' && e.trim()) return e
  }
  if (res.statusText.trim()) return res.statusText
  return `Request failed (${res.status})`
}

/**
 * GET/POST/etc. against the API: applies `VITE_API_URL`, throws on non-OK HTTP,
 * on invalid JSON, and when the body includes `{ success: false }`.
 * Returns the parsed JSON body (use `apiFetchData` when the server wraps payloads in `{ data }`).
 */
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(apiUrl(path), options)
  const body = await readResponseJson(res)

  if (!res.ok) {
    throw new ApiError(errorMessageFromBody(body, res), res.status, body)
  }

  if (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    (body as { success?: boolean }).success === false
  ) {
    throw new ApiError(errorMessageFromBody(body, res), res.status, body)
  }

  return body as T
}

type ApiEnvelope<T> = { success?: boolean; data?: T; error?: string }

/** Like `apiFetch`, but returns the `data` field from `{ success, data, error }` responses. */
export async function apiFetchData<T>(path: string, options: RequestInit = {}): Promise<T> {
  const envelope = await apiFetch<ApiEnvelope<T>>(path, options)
  return envelope.data as T
}
