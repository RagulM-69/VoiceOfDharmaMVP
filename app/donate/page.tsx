import type { Metadata } from 'next'
import { getSiteContent, getContent } from '@/lib/content'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import DonationForm from '@/components/public/DonationForm'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import { Suspense } from 'react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Support the Mission — Donate | Voice of Dharma Foundation',
  description: 'Support the Voice of Dharma Foundation through Karma Yog, Bhakti Yog, or Gyaan Yog initiatives.',
}

export const revalidate = 3600

export default async function DonatePage() {
  const content = await getSiteContent('donate')
  const footerContent = await getSiteContent()

  const heroHeading    = getContent(content, 'donate', 'hero',   'heading',    'Support the Mission of Voice of Dharma')
  const heroSubheading = getContent(content, 'donate', 'hero',   'subheading', '')
  const heroBody       = getContent(content, 'donate', 'hero',   'body',       '')
  const whyHeading     = getContent(content, 'donate', 'why',    'heading',    'Why Donate')
  const whyBody        = getContent(content, 'donate', 'why',    'body',       '')
  const karmaHeading   = getContent(content, 'donate', 'karma',  'heading',    'Karma Yog')
  const karmaSub       = getContent(content, 'donate', 'karma',  'subheading', '')
  const karmaBody      = getContent(content, 'donate', 'karma',  'body',       '')
  const bhaktiHeading  = getContent(content, 'donate', 'bhakti', 'heading',    'Bhakti Yog')
  const bhaktiSub      = getContent(content, 'donate', 'bhakti', 'subheading', '')
  const bhaktiBody     = getContent(content, 'donate', 'bhakti', 'body',       '')
  const gyanHeading    = getContent(content, 'donate', 'gyan',   'heading',    'Gyaan Yog')
  const gyanSub        = getContent(content, 'donate', 'gyan',   'subheading', '')
  const gyanBody       = getContent(content, 'donate', 'gyan',   'body',       '')
  const closingText    = getContent(content, 'donate', 'closing','text',        '')

  const yogCards = [
    {
      heading: karmaHeading,  sub: karmaSub,  body: karmaBody,
      btn: 'Support Karma Yog',  category: 'karma',
      img: '/images/annadhanam-service.png', imgAlt: 'Karma Yog — community service',
    },
    {
      heading: bhaktiHeading, sub: bhaktiSub, body: bhaktiBody,
      btn: 'Support Bhakti Yog', category: 'bhakti',
      img: '/images/temple-devotion.png', imgAlt: 'Bhakti Yog — temple and devotion',
    },
    {
      heading: gyanHeading,   sub: gyanSub,   body: gyanBody,
      btn: 'Support Gyaan Yog',  category: 'gyan',
      img: '/images/gyaan-manuscripts.png', imgAlt: 'Gyaan Yog — knowledge and scripture',
    },
  ]

  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image
              src="/images/meditation-silhouette.png"
              alt="Support the mission — voice of dharma"
              fill className="object-cover opacity-25" priority sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/60 text-4xl mb-4 select-none">॥</div>
              <h1 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-5">{heroHeading}</h1>
              {heroSubheading && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{heroSubheading}</p>
              )}
              {heroBody && heroBody.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-400 text-base leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
              <Link
                href="#donate-form"
                className="inline-block mt-8 px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
              >
                Donate Now
              </Link>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Why Donate ── */}
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

        {/* ── Three Yog Cards ── */}
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
                    <div
                      className="rounded-2xl overflow-hidden flex flex-col h-full"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,150,12,0.25)' }}
                    >
                      {/* Card image */}
                      <div className="relative h-44 flex-shrink-0">
                        <Image src={card.img} alt={card.imgAlt} fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/85" />
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h3
                          className="font-garamond text-3xl font-semibold mb-1"
                          style={{
                            background: 'linear-gradient(135deg, #C8960C, #F5A623)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {card.heading}
                        </h3>
                        <p className="text-amber-400/80 text-sm uppercase tracking-wide mb-4">{card.sub}</p>
                        <div className="w-8 h-0.5 mb-5" style={{ background: 'rgba(200,150,12,0.5)' }} />
                        <div className="flex-1">
                          {card.body.split('\n\n').map((para, j) => (
                            <p key={j} className="text-gray-300 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                          ))}
                        </div>
                        <Link
                          href={`/donate?cause=${card.category}`}
                          className="mt-6 block text-center px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
                        >
                          {card.btn}
                        </Link>
                      </div>
                    </div>
                  </SectionWrapper>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Donation Form */}
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

        {/* ── Closing line ── */}
        {closingText && (
          <div className="py-10 border-t border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">
                &ldquo;{closingText}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* ── Trust signals ── */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <SectionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-0.5 mb-1" style={{ background: '#C8960C' }} />
                  <p className="font-semibold text-gray-800 text-sm">Secure Payments</p>
                  <p className="text-gray-500 text-xs">Powered by Razorpay</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-0.5 mb-1" style={{ background: '#C8960C' }} />
                  <p className="font-semibold text-gray-800 text-sm">80G Tax Benefits</p>
                  <p className="text-gray-500 text-xs">Receipt sent to your email</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-0.5 mb-1" style={{ background: '#C8960C' }} />
                  <p className="font-semibold text-gray-800 text-sm">Registered Trust</p>
                  <p className="text-gray-500 text-xs">Voice of Dharma Foundation</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-amber-600">Privacy Policy</Link>
                <Link href="/refund"  className="hover:text-amber-600">Refund Policy</Link>
                <Link href="/terms"   className="hover:text-amber-600">Terms</Link>
              </div>
            </SectionWrapper>
          </div>
        </section>

      </main>
      <Footer content={footerContent} />
    </>
  )
}
