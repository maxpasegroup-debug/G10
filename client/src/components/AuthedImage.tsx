import { useEffect, useState, type ImgHTMLAttributes } from 'react'
import { getStoredToken } from '../auth/authService'
import { API_URL, resolveMediaUrl } from '../lib/api'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | null | undefined
}

export function AuthedImage({ src, alt = '', className, ...rest }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    const raw = src?.trim()
    if (!raw) {
      setBlobUrl(null)
      return
    }

    const absolute =
      raw.startsWith('http://') || raw.startsWith('https://') ? raw : resolveMediaUrl(raw)
    const needsBearer = Boolean(API_URL && absolute.includes('/api/uploads/'))

    if (!needsBearer) {
      setBlobUrl(absolute || raw)
      return
    }

    let cancelled = false
    const token = getStoredToken()
    ;(async () => {
      try {
        const r = await fetch(absolute, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!r.ok) throw new Error(String(r.status))
        const blob = await r.blob()
        const u = URL.createObjectURL(blob)
        if (!cancelled) setBlobUrl(u)
      } catch {
        if (!cancelled) setBlobUrl(null)
      }
    })()

    return () => {
      cancelled = true
      setBlobUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [src])

  if (!src?.trim()) return null
  if (!blobUrl) {
    return <span className={className} {...rest} aria-hidden />
  }
  return <img src={blobUrl} alt={alt} className={className} {...rest} />
}
