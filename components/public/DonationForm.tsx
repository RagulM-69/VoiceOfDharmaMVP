'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const PURPOSES = [
  { id: 'karma',   label: 'Karma Yog',   description: 'Service & selfless action' },
  { id: 'bhakti',  label: 'Bhakti Yog',  description: 'Temples & devotion' },
  { id: 'gyan',    label: 'Gyaan Yog',   description: 'Education & knowledge' },
  { id: 'general', label: 'General Fund', description: 'Support all programs' },
]

const PRESET_AMOUNTS = [500, 1000, 2500, 5000]

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  customAmount: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  amount?: string
  purpose?: string
}

export default function DonationForm() {
  const searchParams = useSearchParams()
  const causeParam = searchParams.get('cause')

  const [purpose, setPurpose] = useState<string>(() => {
    const valid = PURPOSES.map((p) => p.id)
    return valid.includes(causeParam ?? '') ? (causeParam as string) : 'general'
  })

  // Keep in sync if URL changes (e.g. back navigation)
  useEffect(() => {
    const valid = PURPOSES.map((p) => p.id)
    if (causeParam && valid.includes(causeParam)) {
      setPurpose(causeParam)
    }
  }, [causeParam])

  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    customAmount: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const getAmount = useCallback((): number => {
    if (formData.customAmount) return parseInt(formData.customAmount, 10) || 0
    return selectedAmount || 0
  }, [formData.customAmount, selectedAmount])

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!formData.name || formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) e.email = 'Enter a valid email address'
    if (!/^\d{10}$/.test(formData.phone)) e.phone = 'Enter a valid 10-digit phone number'
    const amt = getAmount()
    if (!amt || amt < 1 || amt > 1000000) e.amount = 'Enter an amount between ₹1 and ₹10,00,000'
    if (!purpose) e.purpose = 'Please select a purpose'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }
    setErrors({})
    setLoading(true)
    setStatusMsg(null)

    // Simulate a brief processing moment, then save interest and show coming-soon screen
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Save donation interest to DB (non-blocking for UX, but awaited)
    try {
      await fetch('/api/donate-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: getAmount(),
          purpose,
          message: formData.message,
        }),
      })
    } catch { /* non-critical, ignore */ }

    setLoading(false)
    setStatusMsg('PAYMENT_COMING_SOON')
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">

        {/* Purpose selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">
            Choose Your Path
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PURPOSES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPurpose(p.id)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  purpose === p.id
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300'
                }`}
              >
                <span className="font-garamond font-semibold text-sm">{p.label}</span>
                <span className="text-xs mt-1 opacity-70">{p.description}</span>
              </button>
            ))}
          </div>
          {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
        </div>

        {/* Amount selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">
            Select Amount
          </label>
          <div className="flex flex-wrap gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt)
                  setFormData((p) => ({ ...p, customAmount: '' }))
                  if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }))
                }}
                className={`px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${
                  selectedAmount === amt && !formData.customAmount
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-amber-400'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Custom amount — fixed ₹ symbol spacing */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold select-none pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={formData.customAmount}
              onChange={(e) => {
                updateField('customAmount', e.target.value)
                setSelectedAmount(null)
              }}
              min={1}
              max={1000000}
              className={`form-input-prefix ${errors.amount ? 'error' : ''}`}
            />
          </div>
          {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
        </div>

        {/* Donor details */}
        <div className="space-y-4">
          <h3 className="font-garamond text-xl font-semibold text-gray-800">Your Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your full name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              maxLength={100}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="your@email.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              maxLength={254}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              maxLength={10}
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Share your intention or message..."
              rows={3}
              className="form-input resize-none"
              maxLength={1000}
            />
          </div>
        </div>

        {/* Status / Coming Soon */}
        <AnimatePresence>
          {statusMsg === 'PAYMENT_COMING_SOON' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(10,31,68,0.04)', border: '2px solid rgba(200,150,12,0.3)' }}
            >
              <div className="text-4xl mb-4 select-none">🙏</div>
              <h3 className="font-garamond text-2xl font-semibold text-krishna-blue mb-3">
                The thought of giving is itself a sacred act.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dear <strong>{formData.name}</strong>, your intention to support the Voice of Dharma Foundation
                {purpose !== 'general' ? ` through ${PURPOSES.find(p => p.id === purpose)?.label}` : ''} is deeply appreciated.
              </p>
              <div
                className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-4"
                style={{ background: 'rgba(200,150,12,0.12)', color: '#C8960C', border: '1px solid rgba(200,150,12,0.3)' }}
              >
                ₹{getAmount().toLocaleString('en-IN')} — {PURPOSES.find(p => p.id === purpose)?.label}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Our secure payment gateway is currently being set up as part of the foundation&apos;s legal registration process.
                We will notify you as soon as it is live. Your details have been noted.
              </p>
              <p className="text-gray-400 text-xs italic">
                &ldquo;Whoever offers Me with devotion a leaf, a flower, fruit, or water — that I accept.&rdquo; — Bhagavad Gita 9.26
              </p>
              <button
                onClick={() => { setStatusMsg(null); setFormData({ name: '', email: '', phone: '', message: '', customAmount: '' }) }}
                className="mt-6 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
              >
                Reset form
              </button>
            </motion.div>
          ) : statusMsg ? (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-center p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
            >
              {statusMsg}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {/* Submit — only show if no coming-soon state */}
        {statusMsg !== 'PAYMENT_COMING_SOON' && (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl'
            }`}
            style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
          >
            {loading ? 'Processing...' : `Proceed to Donate ₹${getAmount().toLocaleString('en-IN') || '—'}`}
          </button>
        )}

        <p className="text-xs text-gray-500 text-center">
          Secure payment gateway coming soon · All details are kept private
        </p>
      </form>
    </div>
  )
}
