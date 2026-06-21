import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { getLegalPage, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@portabletext/react'
import { SITE_URL } from '@/lib/seo/config'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy').catch(() => null)
  
  const title = page?.seo?.metaTitle ?? 'Privacy Policy | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Privacy Policy for the Voice of Dharma Foundation.'
  
  return {
    title,
    description,
    alternates: { canonical: '/privacy' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/privacy`,
      type: 'website',
    },
  }
}

const hardcodedSections = [
  { heading: '1. Information We Collect', body: 'We collect information you provide directly to us when you make a donation or submit a contact form. This includes your name, email address, phone number, and payment details (processed securely by Razorpay — we never store your card details).' },
  { heading: '2. How We Use Your Information', body: 'We use the information we collect to process your donation, send you donation receipts, respond to your inquiries, and communicate with you about our activities. We do not sell or share your personal data with third parties for marketing purposes.' },
  { heading: '3. Payment Security', body: 'All payment transactions are processed by Razorpay, a PCI-DSS compliant payment gateway. We do not store your credit card, debit card, or UPI credentials on our servers.' },
  { heading: '4. Data Retention', body: 'We retain your donation records for a minimum of 7 years as required by Indian tax law (Income Tax Act). Contact form data is retained for up to 2 years.' },
  { heading: '5. Your Rights', body: 'You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us at contact@voiceofdharma.org.' },
  { heading: '6. Cookies', body: 'We use minimal cookies required for website functionality and security. We do not use third-party advertising cookies.' },
  { heading: '7. Changes to This Policy', body: 'We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.' },
  { heading: '8. Contact', body: 'If you have any questions about this Privacy Policy, please contact us at contact@voiceofdharma.org.' },
]

export default async function PrivacyPage() {
  const [page, settings] = await Promise.all([
    getLegalPage('privacy').catch(() => null),
    getSiteSettings().catch(() => null)
  ])

  const title = page?.title ?? 'Privacy Policy'
  const lastUpdated = page?.lastUpdated 
    ? new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'March 2025'

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-2">{title}</h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {lastUpdated}</p>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {page?.content ? (
              <PortableText value={page.content as any} />
            ) : (
              <>
                <p className="mb-8">Voice of Dharma Foundation (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal information and your right to privacy.</p>
                {hardcodedSections.map((s) => (
                  <div key={s.heading} className="mb-8">
                    <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">{s.heading}</h2>
                    <p>{s.body}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
