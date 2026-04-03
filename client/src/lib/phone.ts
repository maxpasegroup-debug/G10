/** Digits only, suitable for `tel:` and `wa.me` (include country code in source phone string). */
export function digitsOnlyPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function telHref(phone: string): string {
  const d = digitsOnlyPhone(phone)
  if (!d) return 'tel:'
  return `tel:+${d}`
}

export function whatsappHref(phone: string, presetMessage?: string): string {
  const d = digitsOnlyPhone(phone)
  if (!d) return 'https://wa.me/'
  const base = `https://wa.me/${d}`
  if (presetMessage) return `${base}?text=${encodeURIComponent(presetMessage)}`
  return base
}
