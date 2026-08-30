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

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function DonationForm() {
  const searchParams = useSearchParams()
  const causeParam = searchParams.get('cause')

  const [purpose, setPurpose] = useState<string>(() => {
    const valid = PURPOSES.map((p) => p.id)
    return valid.includes(causeParam ?? '') ? (causeParam as string) : 'general'
  })

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
  const [newsletterConsent, setNewsletterConsent] = useState(false)

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

  const getRecaptchaToken = async (): Promise<string | undefined> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) return undefined
    try {
      return await new Promise<string>((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: 'donate' }).then(resolve)
        })
      })
    } catch {
      return undefined
    }
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

    const amount = getAmount()

    // 1. Record donation interest lead (non-blocking)
    fetch('/api/donate-interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount,
        purpose,
        message: formData.message,
      }),
    }).catch(console.error)

    // Register newsletter subscriber if consent given (non-blocking)
    if (newsletterConsent) {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      }).catch(console.error)
    }

    try {
      // 2. Fetch reCAPTCHA token if available
      const recaptchaToken = await getRecaptchaToken()

      // 3. Create server-side Razorpay order
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount,
          purpose,
          message: formData.message,
          recaptchaToken,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setStatusMsg(data.error || 'Failed to initialize donation order. Please try again.')
        setLoading(false)
        return
      }

      // 4. Load Razorpay SDK Script
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        setStatusMsg('Could not load payment checkout script. Please check your internet connection.')
        setLoading(false)
        return
      }

      const purposeObj = PURPOSES.find((p) => p.id === purpose)
      const purposeLabel = purposeObj ? purposeObj.label : 'General Fund'

      // 5. Open Razorpay Standard Checkout modal
      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Voice of Dharma Foundation',
        description: `Offering for ${purposeLabel}`,
        order_id: data.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          purpose,
          message: formData.message || '',
        },
        theme: {
          color: '#C8960C',
        },
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          setLoading(true)
          setStatusMsg('Verifying payment signature with server...')
          try {
            const verifyRes = await fetch('/api/donate/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyRes.ok && verifyData.success) {
              window.location.href = `/donate/success?txn=${verifyData.paymentId || response.razorpay_payment_id}`
            } else {
              setStatusMsg(verifyData.error || 'Payment verification failed. Please contact support.')
              setLoading(false)
            }
          } catch {
            setStatusMsg('Network error during verification. A receipt will be sent to your email once processed.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            setStatusMsg('Checkout modal closed. Your order is reserved; you may click below to try again.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setLoading(false)
        setStatusMsg(response.error?.description || 'Payment failed. Please try a different payment method.')
      })
      rzp.open()
    } catch (err) {
      console.error('Checkout error:', err)
      setStatusMsg('An error occurred during checkout setup. Please try again.')
      setLoading(false)
    }
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

          {/* Custom amount */}
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

        {/* Newsletter consent */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <span className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={newsletterConsent}
              onChange={(e) => setNewsletterConsent(e.target.checked)}
              className="sr-only peer"
            />
            <span className="block w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 transition-all duration-200 group-hover:border-amber-400" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
              ✓
            </span>
          </span>
          <span className="text-sm text-gray-600 leading-snug">
            Subscribe me to the <strong className="text-gray-800">Voice of Dharma newsletter</strong> for spiritual updates, events, and mission news.
          </span>
        </label>

        {/* Status Message */}
        <AnimatePresence>
          {statusMsg && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-center p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
            >
              {statusMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl'
          }`}
          style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
        >
          {loading ? 'Processing Order...' : `Proceed to Donate ₹${getAmount().toLocaleString('en-IN') || '—'}`}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Encrypted 256-bit SSL transaction · Official receipt dispatched automatically
        </p>
      </form>
    </div>
  )
}

