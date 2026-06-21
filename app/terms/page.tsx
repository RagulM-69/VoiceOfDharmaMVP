import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { getLegalPage, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@portabletext/react'
import { SITE_URL } from '@/lib/seo/config'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('terms').catch(() => null)
  
  const title = page?.seo?.metaTitle ?? 'Terms of Service | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Terms of Service for the Voice of Dharma Foundation.'
  
  return {
    title,
    description,
    alternates: { canonical: '/terms' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/terms`,
      type: 'website',
    },
  }
}

const hardcodedSections = [
  { heading: '1. Acceptance of Terms', body: 'By accessing or using the Voice of Dharma Foundation website, you agree to be bound by these Terms of Service.' },
  { heading: '2. Use of Website', body: 'You agree to use this website for lawful purposes only and in a way that does not infringe the rights of others. You must not use our website to transmit any harmful, offensive, or fraudulent content.' },
  { heading: '3. Donations', body: 'All donations made through this website are voluntary contributions to Voice of Dharma Foundation, a registered charitable trust. Donations are used exclusively for the Foundation\'s charitable activities.' },
  { heading: '4. Tax Exemption', body: 'Donations may be eligible for tax exemption under Section 80G of the Income Tax Act, 1961, subject to applicable rules and limits. We provide donation receipts for all successful donations.' },
  { heading: '5. Intellectual Property', body: 'All content on this website, including text, images, and logos, is the property of Voice of Dharma Foundation and is protected by applicable intellectual property laws.' },
  { heading: '6. Disclaimer', body: 'This website is provided "as is" without any warranties. We do not guarantee uninterrupted or error-free service. We are not responsible for any loss arising from your use of the website.' },
  { heading: '7. Governing Law', body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.' },
  { heading: '8. Contact', body: 'For any queries regarding these Terms, please contact us at contact@voiceofdharma.org.' },
]

export default async function TermsPage() {
  const [page, settings] = await Promise.all([
    getLegalPage('terms').catch(() => null),
    getSiteSettings().catch(() => null)
  ])

  const title = page?.title ?? 'Terms of Service'
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
          <div className="space-y-8 text-gray-700 leading-relaxed prose prose-lg max-w-none">
            {page?.content ? (
              <PortableText value={page.content as any} />
            ) : (
              hardcodedSections.map((s) => (
                <div key={s.heading}>
                  <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">{s.heading}</h2>
                  <p>{s.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
