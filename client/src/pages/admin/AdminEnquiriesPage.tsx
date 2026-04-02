type Enquiry = {
  id: string
  name: string
  phone: string
  course: string
}

/** Mock enquiries — replace with API data later. */
const initialEnquiries: Enquiry[] = [
  { id: 'e1', name: 'Anjali Varma', phone: '+91 98765 44102', course: 'Piano' },
  { id: 'e2', name: 'Rohit Menon', phone: '+91 98234 88190', course: 'Drums' },
  { id: 'e3', name: 'Priya Nambiar', phone: '+91 97456 22001', course: 'Vocal' },
  { id: 'e4', name: 'Karthik Raj', phone: '+91 98470 11933', course: 'Guitar' },
  { id: 'e5', name: 'Deepa Suresh', phone: '+91 94472 55680', course: 'Piano' },
]

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

function telHref(phone: string): string {
  const d = phoneDigits(phone)
  if (!d) return '#'
  return `tel:+${d}`
}

function whatsappHref(phone: string, leadName: string): string {
  const d = phoneDigits(phone)
  if (!d) return '#'
  const text = `Hi ${leadName}, this is G10 AMR — thanks for your enquiry about classes.`
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`
}

export function AdminEnquiriesPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Enquiries</h2>
        <p className="mt-1 text-sm text-primary/65">Tap Call or WhatsApp to reach out right away.</p>
      </div>

      <ul className="space-y-4">
        {initialEnquiries.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-2">
                <p className="text-xl font-bold text-primary">{row.name}</p>
                <p className="text-lg font-semibold text-primary/85 tabular-nums">{row.phone}</p>
                <p className="text-base text-primary/70">
                  <span className="font-semibold text-primary/80">Course: </span>
                  {row.course}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                <a
                  href={telHref(row.phone)}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-primary px-5 text-base font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light"
                >
                  Call
                </a>
                <a
                  href={whatsappHref(row.phone, row.name.split(' ')[0] ?? row.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#25D366] px-5 text-base font-bold text-white transition hover:bg-[#20bd5a]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
