import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { getSiteSettings } from '@/lib/sanity/queries'
import { Resend } from 'resend'

export const metadata: Metadata = {
  title: 'Unsubscribe — Voice of Dharma Foundation',
  description: 'Unsubscribe from the Voice of Dharma Foundation newsletter.',
}

// Remove contact from Resend Audience
async function removeFromAudience(email: string): Promise<boolean> {
  const audienceId = process.env.RESEND_AUDIENCE_ID
  const apiKey     = process.env.RESEND_API_KEY
  if (!audienceId || !apiKey) return false

  try {
    // First look up the contact ID by email
    const listRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    if (!listRes.ok) return false
    const listData = await listRes.json()
    const contact = (listData.data ?? []).find(
      (c: { email: string; id: string }) => c.email.toLowerCase() === email.toLowerCase()
    )
    if (!contact) return true // already gone

    // Mark as unsubscribed (GDPR-safe: keeps the record but stops emails)
    const patchRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${contact.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unsubscribed: true }),
      }
    )
    return patchRes.ok
  } catch {
    return false
  }
}

interface UnsubscribePageProps {
  searchParams: { email?: string }
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const settings = await getSiteSettings()
  const email = searchParams.email ?? ''

  let status: 'success' | 'invalid' | 'error' = 'invalid'

  if (email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    const ok = await removeFromAudience(email)
    status = ok ? 'success' : 'error'
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-32 px-4" style={{ background: '#FDF6EC' }}>
        <div className="max-w-lg w-full text-center">
          <div className="text-amber-400/50 text-5xl mb-4 select-none font-garamond">॥</div>

          {status === 'success' && (
            <>
              <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-4">
                You have been unsubscribed
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-2">
                <strong className="text-gray-800">{email}</strong> has been removed from our mailing list.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-10">
                You will no longer receive newsletters from Voice of Dharma Foundation.
                Your contact information remains private and will never be shared.
              </p>
            </>
          )}

          {status === 'invalid' && (
            <>
              <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-4">
                Invalid unsubscribe link
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-10">
                This unsubscribe link appears to be invalid or has already been processed.
                If you continue to receive emails, please contact us directly.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-10">
                We couldn&apos;t process your unsubscribe request. Please try again or contact us
                and we will remove you manually.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full font-semibold text-krishna-blue border-2 border-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 text-sm"
            >
              Return Home
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-full font-semibold text-white text-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg,#C8960C,#F5A623)' }}
            >
              Contact Us
            </Link>
          </div>

          <p className="font-garamond text-base italic text-gray-400 mt-16 leading-relaxed">
            &ldquo;The soul is never born nor dies at any time.&rdquo;<br />
            <span className="text-xs not-italic">— Bhagavad Gita 2.20</span>
          </p>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
