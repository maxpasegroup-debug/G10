import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { useSiteSettings } from '../context/SettingsContext'
import { API_URL } from '../lib/api'
import { apiFetch } from '../lib/apiClient'
import { telHref, whatsappHref } from '../lib/phone'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=82'

export function ContactPage() {
  const { settings, loading } = useSiteSettings()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const displayPhone = (settings?.phone ?? '').trim()
  const email = (settings?.email ?? '').trim()
  const address = (settings?.address ?? '').trim()
  const mapEmbed = (settings?.map_embed_url ?? '').trim()
  const academyName = (settings?.academy_name ?? '').trim()

  const phoneTel = useMemo(() => telHref(displayPhone), [displayPhone])
  const waPreset = useMemo(
    () =>
      academyName
        ? `Hi ${academyName} — I'd like to know more about classes.`
        : "Hi — I'd like to know more about classes.",
    [academyName],
  )
  const whatsappUrl = useMemo(() => whatsappHref(displayPhone, waPreset), [displayPhone, waPreset])
  const mapsSearchUrl = useMemo(() => {
    if (!address) return ''
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }, [address])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!API_URL) {
      setSubmitError('Unable to send right now. Please try call or WhatsApp.')
      return
    }
    setSubmitting(true)
    try {
      await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      })
      setSent(true)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  const hasPhone = Boolean(displayPhone && digitsOk(displayPhone))
  const hasEmail = Boolean(email)
  const hasAddress = Boolean(address)

  return (
    <div className="min-h-dvh bg-[#0a1f35] font-sans text-white">
      <Navbar />

      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
        aria-label="Contact hero"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 42, 74, 0.85), rgba(11, 42, 74, 0.95))',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(230,179,37,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-3xl py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            G10 AMR
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            We&apos;re here to help you start your musical journey
          </p>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] via-[#0d3154] to-[#0a2440] px-5 py-16 sm:px-8 sm:py-20"
        aria-label="Contact methods"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Reach us directly</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/60">
            Tap a card—call, chat, email, or open directions.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<PhoneIcon />}
              label="Phone"
              loading={loading && !displayPhone}
              value={displayPhone}
              actionLabel="Call"
              href={hasPhone ? phoneTel : undefined}
              disabled={!hasPhone}
            />
            <ContactCard
              icon={<WhatsAppIcon />}
              label="WhatsApp"
              loading={loading && !displayPhone}
              value={hasPhone ? 'Chat with us' : ''}
              subValue={hasPhone ? displayPhone : undefined}
              actionLabel="Open WhatsApp"
              href={hasPhone ? whatsappUrl : undefined}
              disabled={!hasPhone}
              accent="whatsapp"
            />
            <ContactCard
              icon={<EmailIcon />}
              label="Email"
              loading={loading && !email}
              value={email}
              actionLabel="Send email"
              href={hasEmail ? `mailto:${email}` : undefined}
              disabled={!hasEmail}
            />
            <ContactCard
              icon={<MapPinIcon />}
              label="Address"
              loading={loading && !address}
              value={address}
              actionLabel="Open in Maps"
              href={hasAddress ? mapsSearchUrl : undefined}
              disabled={!hasAddress}
              multilineValue
            />
          </div>
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-[#081a2e] px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="contact-form-heading"
      >
        <div className="mx-auto w-full max-w-md">
          <h2 id="contact-form-heading" className="text-center text-2xl font-bold text-white sm:text-3xl">
            Send a message
          </h2>
          <p className="mx-auto mt-2 text-center text-sm text-white/60">
            We reply within one business day—often sooner.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
            {sent ? (
              <p className="py-8 text-center text-base font-semibold text-[#0B2A4A]">
                Message sent successfully
              </p>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
                {submitError ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800"
                  >
                    {submitError}
                  </p>
                ) : null}

                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    className="min-h-[48px] w-full rounded-lg border border-[#0B2A4A]/15 px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 focus:ring-2 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
                    Mobile number
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className="min-h-[48px] w-full rounded-lg border border-[#0B2A4A]/15 px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 focus:ring-2 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-[#0B2A4A]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={submitting}
                    className="w-full resize-y rounded-lg border border-[#0B2A4A]/15 px-4 py-3 text-base text-[#0B2A4A] outline-none ring-[#E6B325]/40 focus:ring-2 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[#E6B325] text-base font-bold text-black shadow-lg transition hover:bg-[#d4a420] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Sending…
                    </span>
                  ) : (
                    'Send message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {mapEmbed ? (
        <section
          className="border-t border-white/10 bg-gradient-to-b from-[#0B2A4A] to-[#081a2e] px-5 py-16 sm:px-8"
          aria-label="Location map"
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-xl font-bold text-white sm:text-2xl">Find us</h2>
            <div className="mt-8 overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10">
              <iframe
                title={academyName ? `${academyName} on the map` : 'Studio location'}
                src={mapEmbed}
                className="aspect-video min-h-[240px] w-full border-0 sm:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-white/10 bg-[#0B2A4A] px-5 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Call us today and start your journey
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {hasPhone ? (
              <>
                <a
                  href={phoneTel}
                  className="inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-lg bg-[#E6B325] px-8 text-base font-semibold text-black shadow-lg transition hover:scale-[1.02] hover:bg-[#d4a420] sm:w-auto"
                >
                  Call Now
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] w-full min-w-[200px] items-center justify-center rounded-lg border-2 border-[#25D366] bg-[#25D366]/10 px-8 text-base font-semibold text-white transition hover:bg-[#25D366]/20 sm:w-auto"
                >
                  WhatsApp
                </a>
              </>
            ) : (
              <p className="text-sm text-white/70">
                {loading ? 'Loading contact options…' : 'Use the form above—we’ll reach out shortly.'}
              </p>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

function digitsOk(phone: string) {
  return phone.replace(/\D/g, '').length >= 8
}

function ContactCard({
  icon,
  label,
  value,
  subValue,
  actionLabel,
  href,
  disabled,
  loading,
  accent,
  multilineValue,
}: {
  icon: ReactNode
  label: string
  value: string
  subValue?: string
  actionLabel: string
  href: string | undefined
  disabled: boolean
  loading?: boolean
  accent?: 'whatsapp'
  multilineValue?: boolean
}) {
  const inner = (
    <>
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          accent === 'whatsapp' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-[#E6B325]/15 text-[#E6B325]'
        }`}
      >
        {icon}
      </span>
      <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#0B2A4A]/50">{label}</span>
      {loading ? (
        <span className="mt-2 h-6 w-full max-w-[200px] animate-pulse rounded-md bg-[#0B2A4A]/10" />
      ) : (
        <span
          className={`mt-2 text-left text-base font-semibold text-[#0B2A4A] ${multilineValue ? 'whitespace-pre-line leading-snug' : ''}`}
        >
          {value || '—'}
        </span>
      )}
      {subValue && !loading ? (
        <span className="mt-1 text-sm text-[#0B2A4A]/60">{subValue}</span>
      ) : null}
      <span
        className={`mt-4 text-sm font-semibold ${
          disabled ? 'text-[#0B2A4A]/35' : accent === 'whatsapp' ? 'text-[#25D366]' : 'text-[#E6B325]'
        }`}
      >
        {disabled ? 'Not available' : actionLabel}
      </span>
    </>
  )

  const cardClass =
    'flex min-h-[220px] flex-col rounded-xl border border-[#0B2A4A]/10 bg-white p-6 shadow-md transition hover:shadow-lg sm:min-h-[240px]' +
    (disabled || !href ? ' opacity-80' : ' hover:-translate-y-0.5')

  if (href && !disabled) {
    return (
      <a href={href} className={`${cardClass} block no-underline`} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {inner}
      </a>
    )
  }

  return <div className={cardClass}>{inner}</div>
}

function PhoneIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
