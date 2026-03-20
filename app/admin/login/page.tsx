'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createSupabaseClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    // Verify user is in admin_users table
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Authentication failed. Please try again.')
      setLoading(false)
      return
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      await supabase.auth.signOut()
      setError('You do not have admin access. Contact your administrator.')
      setLoading(false)
      return
    }

    const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A1F44' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-garamond text-3xl font-semibold text-krishna-blue">Voice of Dharma</h1>
            <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
            <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-3" />
          </div>

          {searchParams.get('error') === 'unauthorized' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              Your session expired or you don&apos;t have access. Please log in again.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@voiceofdharma.org"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg'
              }`}
              style={{ background: 'linear-gradient(135deg, #0A1F44, #1a3a6e)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Forgot password? Ask your Supabase admin to send a reset link.
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          <a href="/" className="hover:text-amber-400 transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1F44' }}><p className="text-white">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
