import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { API_URL } from '../lib/api'
import { apiFetch } from '../lib/apiClient'

export type SiteSettings = {
  academy_name: string
  email: string
  phone: string
  address: string
  map_embed_url: string | null
  home_hero_title: string
  home_hero_subtitle: string
  about_text: string
  contact_intro: string
  admissions_message: string
}

type SettingsContextValue = {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
  reload: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchSeq, setFetchSeq] = useState(0)

  const reload = useCallback(() => setFetchSeq((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!API_URL) {
        setError('VITE_API_URL is not set')
        setLoading(false)
        return
      }
      const initialLoad = fetchSeq === 0
      if (initialLoad) setLoading(true)
      setError(null)
      try {
        const body = await apiFetch<{
          success?: boolean
          data?: SiteSettings
          error?: string
        }>('/api/settings')
        if (body.success && body.data && !cancelled) setSettings(body.data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load site settings')
      } finally {
        if (!cancelled && initialLoad) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [fetchSeq])

  const value = useMemo(
    () => ({ settings, loading, error, reload }),
    [settings, loading, error, reload],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSiteSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SettingsProvider')
  }
  return ctx
}
