'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
const RECAPTCHA_ENABLED = !!SITE_KEY

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [recaptchaReady, setRecaptchaReady] = useState(false)

  // Load reCAPTCHA script once
  useEffect(() => {
    if (!RECAPTCHA_ENABLED) return
    if (document.querySelector(`script[src*="recaptcha"]`)) {
      window.grecaptcha?.ready(() => setRecaptchaReady(true))
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => {
      window.grecaptcha.ready(() => setRecaptchaReady(true))
    }
    document.head.appendChild(script)
  }, [])

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!RECAPTCHA_ENABLED || !recaptchaReady) return ''
    try {
      return await window.grecaptcha.execute(SITE_KEY, { action: 'contact_form' })
    } catch {
      return ''
    }
  }, [recaptchaReady])

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!formData.name || formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) e.email = 'Enter a valid email address'
    if (!/^\d{10}$/.test(formData.phone)) e.phone = 'Enter a valid 10-digit phone number'
    return e
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setErrors({})
    setLoading(true)
    setErrorMsg(null)

    try {
      const recaptchaToken = await getRecaptchaToken()

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-5xl mb-4">🙏</div>
        <h3 className="font-garamond text-2xl font-semibold text-gray-800 mb-2">Thank you for reaching out</h3>
        <p className="text-gray-600">We&apos;ve received your message and will reply within 2–3 working days.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your name" className={`form-input ${errors.name ? 'error' : ''}`} maxLength={100} />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className={`form-input ${errors.email ? 'error' : ''}`} maxLength={254} />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className={`form-input ${errors.phone ? 'error' : ''}`} maxLength={10} />
        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
        <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Your message..." rows={4} className="form-input resize-none" maxLength={2000} />
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-red-600 text-sm p-3 rounded-lg bg-red-50 border border-red-200">
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={loading}
        className={`w-full py-4 rounded-full font-semibold text-white text-base transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}`}
        style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {RECAPTCHA_ENABLED && (
        <p className="text-xs text-gray-400 text-center">Protected by reCAPTCHA</p>
      )}
    </form>
  )
}
