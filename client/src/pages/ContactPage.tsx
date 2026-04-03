import { useMemo, useState, type FormEvent } from 'react'
import { Navbar } from '../components/Navbar'
import { PageHero } from '../components/PageHero'
import { PublicFooter } from '../components/PublicFooter'
import { useSiteSettings } from '../context/SettingsContext'
import { telHref, whatsappHref } from '../lib/phone'

export function ContactPage() {
  const { settings, loading } = useSiteSettings()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const displayPhone = settings?.phone ?? ''
  const email = settings?.email ?? ''
  const address = settings?.address ?? ''
  const mapEmbed = settings?.map_embed_url ?? ''
  const academyName = settings?.academy_name ?? ''

  const phoneTel = useMemo(() => telHref(displayPhone), [displayPhone])
  const whatsappHrefFull = useMemo(
    () =>
      whatsappHref(
        displayPhone,
        academyName
          ? `Hi ${academyName} — I'd like to know more about classes.`
          : "Hi — I'd like to know more about classes.",
      ),
    [displayPhone, academyName],
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <main>
        <PageHero title="Contact Us" subtitle="We're here to help you get started" />

        <section className="px-4 py-10 sm:px-6 md:px-[60px] md:py-14">
          <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-3">
            <a
              href={displayPhone ? phoneTel : undefined}
              className={`flex flex-col items-center gap-3 rounded-2xl border border-primary/[0.08] bg-white p-6 text-center shadow-[var(--shadow-card)] transition hover:border-secondary/40 hover:shadow-[var(--shadow-soft)] ${!displayPhone ? 'pointer-events-none opacity-60' : ''}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary/50">Call us</span>
              <span className="text-xl font-bold text-primary md:text-2xl">
                {loading && !displayPhone ? '…' : displayPhone || '—'}
              </span>
              <span className="text-sm font-medium text-secondary">Tap to call</span>
            </a>

            <a
              href={displayPhone ? whatsappHrefFull : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-[#25D366]/50 bg-white p-6 text-center shadow-[var(--shadow-card)] transition hover:border-[#25D366] hover:shadow-[var(--shadow-soft)] ${!displayPhone ? 'pointer-events-none opacity-60' : ''}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary/50">WhatsApp</span>
              <span className="text-lg font-bold text-primary">Message us instantly</span>
              <span className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white">Open WhatsApp</span>
            </a>

            <a
              href={email ? `mailto:${email}` : undefined}
              className={`flex flex-col items-center gap-3 rounded-2xl border border-primary/[0.08] bg-white p-6 text-center shadow-[var(--shadow-card)] transition hover:border-secondary/40 hover:shadow-[var(--shadow-soft)] ${!email ? 'pointer-events-none opacity-60' : ''}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary/50">Email</span>
              <span className="break-all text-base font-semibold text-primary md:text-lg">
                {loading && !email ? '…' : email || '—'}
              </span>
              <span className="text-sm font-medium text-secondary">Send an email</span>
            </a>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 md:px-[60px] md:pb-20">
          <div className="mx-auto max-w-[520px]">
            <h2 className="mb-8 text-center text-xl font-bold text-primary md:text-2xl">Send a quick message</h2>
            <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
              {sent ? (
                <p className="py-8 text-center text-base font-medium text-primary/80">
                  Thanks — we&apos;ll get back to you soon.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-primary">
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
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-primary">
                      Phone number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                      placeholder="+91 …"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-primary">
                      Message <span className="font-normal text-primary/50">(optional)</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3.5 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-secondary py-4 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-4 text-center text-lg font-bold text-primary md:text-xl">Visit us</h2>
            <p className="mb-6 text-center text-base text-primary/75">
              {loading && !address ? '…' : address || '—'}
            </p>
            {mapEmbed ? (
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <iframe
                  title={academyName ? `${academyName} location` : 'Location map'}
                  src={mapEmbed}
                  className="h-[280px] w-full border-0 md:h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-primary px-4 py-[60px] sm:px-6 md:px-[60px]">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="text-xl font-bold text-white md:text-2xl">Talk to us and start your journey</h2>
            {displayPhone ? (
              <a
                href={phoneTel}
                className="mt-6 inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-[8px] bg-secondary px-8 text-base font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.35)] transition hover:bg-secondary-hover"
              >
                Call Now
              </a>
            ) : (
              <p className="mt-6 text-sm text-white/70">{loading ? '…' : 'Phone number not configured.'}</p>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
