import { useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { authHeaders } from '../../auth/authService'
import { API_URL } from '../../lib/api'
import { apiFetch } from '../../lib/apiClient'
import { useSiteSettings, type SiteSettings } from '../../context/SettingsContext'

function emptySettings(): Omit<SiteSettings, 'map_embed_url'> & { map_embed_url: string } {
  return {
    academy_name: '',
    email: '',
    phone: '',
    address: '',
    map_embed_url: '',
    home_hero_title: '',
    home_hero_subtitle: '',
    about_text: '',
    contact_intro: '',
    admissions_message: '',
  }
}

export function AdminSettingsPage() {
  const formId = useId()
  const { reload } = useSiteSettings()
  const [form, setForm] = useState(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        const body = await apiFetch<{ success?: boolean; data?: SiteSettings; error?: string }>(
          '/api/settings',
        )
        const d = body.data
        if (d && !cancelled) {
          setForm({
            academy_name: d.academy_name ?? '',
            email: d.email ?? '',
            phone: d.phone ?? '',
            address: d.address ?? '',
            map_embed_url: d.map_embed_url ?? '',
            home_hero_title: d.home_hero_title ?? '',
            home_hero_subtitle: d.home_hero_subtitle ?? '',
            about_text: d.about_text ?? '',
            contact_intro: d.contact_intro ?? '',
            admissions_message: d.admissions_message ?? '',
          })
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

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    if (!API_URL) return
    setSaving(true)
    setError(null)
    try {
      await apiFetch('/api/settings', {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({
          academy_name: form.academy_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          map_embed_url: form.map_embed_url.trim() || null,
          home_hero_title: form.home_hero_title.trim(),
          home_hero_subtitle: form.home_hero_subtitle.trim(),
          about_text: form.about_text.trim(),
          contact_intro: form.contact_intro.trim(),
          admissions_message: form.admissions_message.trim(),
        }),
      })
      reload()
      toast.success('All settings saved')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error saving data'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-primary/60">Loading settings…</p>
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Site content &amp; settings</h2>
        <p className="mt-1 text-sm text-primary/65">
          Update public pages from one place. Empty fields use sensible defaults on the website.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="space-y-10 rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
        <section className="space-y-5">
          <h3 className="border-b border-primary/[0.08] pb-2 text-base font-bold text-primary">
            Home — hero
          </h3>
          <p className="text-sm text-primary/60">
            Headline: use one line or two lines (press Enter between lines). Leave blank to keep the built-in
            default headline.
          </p>
          <div>
            <label htmlFor={`${formId}-hero-title`} className="mb-2 block text-sm font-semibold text-primary">
              Headline
            </label>
            <textarea
              id={`${formId}-hero-title`}
              value={form.home_hero_title}
              onChange={(e) => patch('home_hero_title', e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor={`${formId}-hero-sub`} className="mb-2 block text-sm font-semibold text-primary">
              Subtitle (below headline)
            </label>
            <textarea
              id={`${formId}-hero-sub`}
              value={form.home_hero_subtitle}
              onChange={(e) => patch('home_hero_subtitle', e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="border-b border-primary/[0.08] pb-2 text-base font-bold text-primary">About page</h3>
          <div>
            <label htmlFor={`${formId}-about`} className="mb-2 block text-sm font-semibold text-primary">
              &ldquo;Our story&rdquo; main text
            </label>
            <textarea
              id={`${formId}-about`}
              value={form.about_text}
              onChange={(e) => patch('about_text', e.target.value)}
              disabled={saving}
              rows={8}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Introduce your academy in your own words…"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="border-b border-primary/[0.08] pb-2 text-base font-bold text-primary">
            Contact page
          </h3>
          <div>
            <label htmlFor={`${formId}-contact-intro`} className="mb-2 block text-sm font-semibold text-primary">
              Intro (under &ldquo;Contact us&rdquo; title)
            </label>
            <textarea
              id={`${formId}-contact-intro`}
              value={form.contact_intro}
              onChange={(e) => patch('contact_intro', e.target.value)}
              disabled={saving}
              rows={2}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className="mb-2 block text-sm font-semibold text-primary">
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              value={form.email}
              onChange={(e) => patch('email', e.target.value)}
              autoComplete="email"
              disabled={saving}
              className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-phone`} className="mb-2 block text-sm font-semibold text-primary">
              Phone number
            </label>
            <input
              id={`${formId}-phone`}
              type="tel"
              value={form.phone}
              onChange={(e) => patch('phone', e.target.value)}
              autoComplete="tel"
              disabled={saving}
              className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-address`} className="mb-2 block text-sm font-semibold text-primary">
              Address
            </label>
            <textarea
              id={`${formId}-address`}
              value={form.address}
              onChange={(e) => patch('address', e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-map`} className="mb-2 block text-sm font-semibold text-primary">
              Map embed URL
            </label>
            <input
              id={`${formId}-map`}
              type="url"
              value={form.map_embed_url}
              onChange={(e) => patch('map_embed_url', e.target.value)}
              disabled={saving}
              className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="https://maps.google.com/maps?…"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="border-b border-primary/[0.08] pb-2 text-base font-bold text-primary">Admissions</h3>
          <div>
            <label
              htmlFor={`${formId}-admissions`}
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Message under &ldquo;Admissions open&rdquo; title
            </label>
            <textarea
              id={`${formId}-admissions`}
              value={form.admissions_message}
              onChange={(e) => patch('admissions_message', e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="border-b border-primary/[0.08] pb-2 text-base font-bold text-primary">Branding</h3>
          <div>
            <label htmlFor={`${formId}-name`} className="mb-2 block text-sm font-semibold text-primary">
              Academy name
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={form.academy_name}
              onChange={(e) => patch('academy_name', e.target.value)}
              autoComplete="organization"
              disabled={saving}
              className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-primary/[0.08] pt-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
