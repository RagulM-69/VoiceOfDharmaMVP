'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const txn = searchParams.get('txn')

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ backgroundImage: 'linear-gradient(135deg, #C8960C, #F5A623)' } as React.CSSProperties}
        >
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-4">
            Thank You for Your Support
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Your offering has been received. May this act of giving return to you manifold, in accordance with the eternal law of Dharma.
          </p>

          {txn && (
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Transaction ID</p>
              <p className="font-mono text-sm text-gray-700 break-all">{txn}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-8">
            A donation receipt has been sent to your email address.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
            >
              Return Home
            </Link>
            <Link
              href="/philosophy"
              className="px-8 py-3 rounded-full font-semibold text-krishna-blue border-2 border-krishna-blue hover:bg-krishna-blue hover:text-white transition-all duration-300"
            >
              Explore Philosophy
            </Link>
          </div>

          <p className="mt-10 font-garamond text-lg italic text-gray-400">
            &ldquo;Whatever you do, whatever you eat, whatever you offer or give away... do it as an offering to Me.&rdquo;
          </p>
          <p className="text-amber-600 text-sm mt-1">— Bhagavad Gita 9.27</p>
        </motion.div>
      </div>
    </div>
  )
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><p className="text-gray-500">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
