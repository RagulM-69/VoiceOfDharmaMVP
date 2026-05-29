'use client'

import { useState } from 'react'

export default function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidEmail = (v: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !isValidEmail(email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Subscription failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <h4 className="font-garamond text-lg font-semibold text-amber-400 mb-2">
        Stay Connected
      </h4>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Receive spiritual wisdom, event updates, and mission news.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <span className="text-lg">🙏</span>
          <span>You&apos;re subscribed. Welcome to the community.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="your@email.com"
              aria-label="Newsletter email address"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-white/95 placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#0A1F44] transition-all duration-200 hover:brightness-110 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#C8960C,#F5A623)' }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && errorMsg && (
            <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
          )}
          <p className="mt-2 text-xs text-gray-600">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  )
}
