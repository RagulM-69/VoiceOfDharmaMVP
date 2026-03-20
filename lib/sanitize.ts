// Input sanitization helpers

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return ''
  return stripHtml(input).slice(0, maxLength)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone)
}

export function validateAmount(amount: unknown): number | null {
  const num = Number(amount)
  if (!Number.isInteger(num)) return null
  if (num < 1 || num > 1000000) return null
  return num
}

export function validatePurpose(
  purpose: unknown
): 'karma' | 'bhakti' | 'gyan' | 'general' | null {
  const valid = ['karma', 'bhakti', 'gyan', 'general']
  if (typeof purpose === 'string' && valid.includes(purpose)) {
    return purpose as 'karma' | 'bhakti' | 'gyan' | 'general'
  }
  return null
}

export function validateName(name: string): boolean {
  const clean = stripHtml(name).trim()
  return clean.length >= 2 && clean.length <= 100 && /^[\w\s\-'.]+$/i.test(clean)
}

export interface SanitizedDonationInput {
  name: string
  email: string
  phone: string
  amount: number
  purpose: 'karma' | 'bhakti' | 'gyan' | 'general'
  message: string
}

export interface SanitizedContactInput {
  name: string
  email: string
  phone: string
  message: string
}

export function sanitizeDonationInput(
  body: Record<string, unknown>
): { data: SanitizedDonationInput } | { error: string } {
  const name = sanitizeText(body.name, 100)
  if (!validateName(name)) return { error: 'Invalid name' }

  const email = sanitizeText(body.email, 254).toLowerCase()
  if (!validateEmail(email)) return { error: 'Invalid email address' }

  const phone = sanitizeText(body.phone, 10).replace(/\s/g, '')
  if (!validatePhone(phone)) return { error: 'Phone must be exactly 10 digits' }

  const amount = validateAmount(body.amount)
  if (!amount) return { error: 'Amount must be between ₹1 and ₹10,00,000' }

  const purpose = validatePurpose(body.purpose)
  if (!purpose) return { error: 'Invalid purpose selected' }

  const message = sanitizeText(body.message, 1000)

  return { data: { name, email, phone, amount, purpose, message } }
}

export function sanitizeContactInput(
  body: Record<string, unknown>
): { data: SanitizedContactInput } | { error: string } {
  const name = sanitizeText(body.name, 100)
  if (!validateName(name)) return { error: 'Invalid name' }

  const email = sanitizeText(body.email, 254).toLowerCase()
  if (!validateEmail(email)) return { error: 'Invalid email address' }

  const phone = sanitizeText(body.phone, 10).replace(/\s/g, '')
  if (!validatePhone(phone)) return { error: 'Phone must be exactly 10 digits' }

  const message = sanitizeText(body.message, 2000)

  return { data: { name, email, phone, message } }
}
