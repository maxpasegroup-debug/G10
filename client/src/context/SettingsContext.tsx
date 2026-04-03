import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { API_URL, apiUrl } from '../lib/api'

export type SiteSettings = {
  academy_name: string
  email: string
  phone: string
  address: string
  map_embed_url: string | null
}

type SettingsContextValue = {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!API_URL) {
        setError('VITE_API_URL is not set')
        setLoading(false)
        return
      }
      try {
        const res = await fetch(apiUrl('/api/settings'))
        const body = (await res.json()) as {
          success?: boolean
          data?: SiteSettings
          error?: string
        }
        if (!res.ok) throw new Error(body.error || 'Could not load site settings')
        if (body.success && body.data && !cancelled) setSettings(body.data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load site settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ settings, loading, error }), [settings, loading, error])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSiteSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SettingsProvider')
  }
  return ctx
}
