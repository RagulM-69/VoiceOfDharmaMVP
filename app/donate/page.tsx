import type { Metadata } from 'next'
import { getDonatePage, getSiteSettings } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/seo/config'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import DonationForm from '@/components/public/DonationForm'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import YogCategoryButton from '@/components/public/YogCategoryButton'
import { Suspense } from 'react'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDonatePage()
  const title = page?.seo?.metaTitle ?? 'Donate — Support the Mission | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Support the Voice of Dharma Foundation through Karma Yog, Bhakti Yog, or Gyaan Yog initiatives. All donations are eligible for 80G tax exemption.'
  return {
    title,
    description,
    alternates: { canonical: '/donate' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/donate`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Donate to Voice of Dharma Foundation' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

export default async function DonatePage() {
  const [page, settings] = await Promise.all([getDonatePage(), getSiteSettings()])

  const heroHeading    = page?.heroHeading    ?? 'Support the Mission of Voice of Dharma'
  const heroSubheading = page?.heroSubheading ?? 'Your contribution helps spread the timeless wisdom of the Bhagavad Gita through service, devotion, and education.'
  const heroBody       = page?.heroBody       ?? ''
  const whyHeading     = page?.whyHeading     ?? 'Why Your Support Matters'
  const whyBody        = page?.whyBody        ?? `Voice of Dharma Foundation runs entirely on the generosity of those who believe in the transformative power of dharmic wisdom.

Every contribution — large or small — directly funds our programs: community food service, temple preservation, educational gatherings, and the broader work of spreading the Bhagavad Gita's teachings.

When you donate, you are not merely giving money. You are participating in a larger act of dharma — contributing to the well-being of others through the spirit of selfless action.`
  const karmaHeading   = page?.karmaHeading   ?? 'Karma Yog'
  const karmaSub       = page?.karmaSubheading ?? 'Service and Community Support'
  const karmaBody      = page?.karmaBody      ?? 'Support our Annadhanam (food distribution) programs and community service initiatives. Your contribution funds meals, supplies, and the logistics of reaching those in need.'
  const bhaktiHeading  = page?.bhaktiHeading  ?? 'Bhakti Yog'
  const bhaktiSub      = page?.bhaktiSubheading ?? 'Devotion and Cultural Preservation'
  const bhaktiBody     = page?.bhaktiBody     ?? `Support our efforts to preserve and share India's devotional traditions — from temple maintenance and festival celebrations to devotional music and cultural programs.`
  const gyanHeading    = page?.gyanHeading    ?? 'Gyaan Yog'
  const gyanSub        = page?.gyanSubheading ?? 'Education and Wisdom'
  const gyanBody       = page?.gyanBody       ?? 'Support our educational programs: satsangs, study circles, access to dharmic literature, and resources that make the wisdom of the Bhagavad Gita available to all.'
  const closingText    = page?.closingText    ?? 'Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform — do that as an offering to Me. — Bhagavad Gita 9.27'

  const yogCards = [
    { heading: karmaHeading, sub: karmaSub, body: karmaBody, btn: 'Support Karma Yog', category: 'karma', img: '/images/annadhanam-service.png', imgAlt: 'Karma Yog — community service' },
    { heading: bhaktiHeading, sub: bhaktiSub, body: bhaktiBody, btn: 'Support Bhakti Yog', category: 'bhakti', img: '/images/temple-devotion.png', imgAlt: 'Bhakti Yog — temple and devotion' },
    { heading: gyanHeading, sub: gyanSub, body: gyanBody, btn: 'Support Gyaan Yog', category: 'gyan', img: '/images/gyaan-manuscripts.png', imgAlt: 'Gyaan Yog — knowledge and scripture' },
  ]

  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src="/images/meditation-silhouette.png" alt="Support the mission" fill className="object-cover opacity-25" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/60 text-4xl mb-4 select-none">॥</div>
              <h1 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-5">{heroHeading}</h1>
              {heroSubheading && <p className="text-gray-300 text-lg leading-relaxed mb-6">{heroSubheading}</p>}
              {heroBody && heroBody.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-400 text-base leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
              <Link href="#donate-form" className="inline-block mt-8 px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                Donate Now
              </Link>
            </SectionWrapper>
          </div>
        </section>

        {whyBody && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-8">{whyHeading}</h2>
                {whyBody.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        <section className="py-20 lotus-pattern" style={{ background: '#0A1F44' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-center mb-12">
                <div className="text-amber-400/60 text-3xl mb-3 select-none">॥</div>
                <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-white">Choose Your Path</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {yogCards.map((card, i) => (
                  <SectionWrapper key={card.heading} delay={i * 0.15}>
                    <div className="rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,150,12,0.25)' }}>
                      <div className="relative h-44 flex-shrink-0">
                        <Image src={card.img} alt={card.imgAlt} fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/85" />
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="font-garamond text-3xl font-semibold mb-1" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          {card.heading}
                        </h3>
                        {card.sub && <p className="text-amber-400/80 text-sm uppercase tracking-wide mb-4">{card.sub}</p>}
                        <div className="w-8 h-0.5 mb-5" style={{ background: 'rgba(200,150,12,0.5)' }} />
                        <div className="flex-1">
                          {card.body.split('\n\n').map((para, j) => (
                            <p key={j} className="text-gray-300 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                          ))}
                        </div>
                        <YogCategoryButton category={card.category} label={card.btn} />
                      </div>
                    </div>
                  </SectionWrapper>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </section>

        <section id="donate-form" className="py-16 bg-cream">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <SectionWrapper>
              <div className="card-glass p-8 md:p-10">
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>}>
                  <DonationForm />
                </Suspense>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {closingText && (
          <div className="py-10 border-t border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">&ldquo;{closingText}&rdquo;</p>
            </div>
          </div>
        )}

        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <SectionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Secure Payments', sub: 'Powered by Razorpay' },
                  { title: '80G Tax Benefits', sub: 'Receipt sent to your email' },
                  { title: 'Registered Trust', sub: 'Voice of Dharma Foundation' },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col items-center gap-2">
                    <div className="w-8 h-0.5 mb-1" style={{ background: '#C8960C' }} />
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-amber-600">Privacy Policy</Link>
                <Link href="/refund" className="hover:text-amber-600">Refund Policy</Link>
                <Link href="/terms" className="hover:text-amber-600">Terms</Link>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
