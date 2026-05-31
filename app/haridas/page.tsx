import type { Metadata } from 'next'
import { getFounderPage, getSiteSettings } from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'


export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceofdharmafoundation.org'
  const page = await getFounderPage()
  const title = page?.seo?.metaTitle ?? 'Hari Das — Founder | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Learn about Hari Das, the founder of Voice of Dharma Foundation and the spiritual guide behind the dharmic wisdom initiative.'
  return {
    title,
    description,
    alternates: { canonical: '/haridas' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/haridas`,
      type: 'profile',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Hari Das — Founder, Voice of Dharma Foundation' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

export default async function HaridasPage() {
  const [page, settings] = await Promise.all([getFounderPage(), getSiteSettings()])

  const name             = page?.name             ?? 'Hari Das'
  const founderTitle     = page?.title            ?? 'Founder – Voice of Dharma Foundation'
  const who              = page?.who              ?? ''
  const journey          = page?.journey          ?? ''
  const message          = page?.message          ?? ''
  const vision           = page?.vision           ?? ''
  const closingQuote     = page?.closingQuote     ?? ''
  const closingQuoteRef  = page?.closingQuoteRef  ?? ''
  const karmaTitle       = page?.karmaTitle       ?? 'Karma'
  const karmaSubtitle    = page?.karmaSubtitle    ?? 'Action in Life'
  const karmaBody        = page?.karmaBody        ?? ''
  const bhaktiTitle      = page?.bhaktiTitle      ?? 'Bhakti'
  const bhaktiSubtitle   = page?.bhaktiSubtitle   ?? 'Devotion and Spiritual Reflection'
  const bhaktiBody       = page?.bhaktiBody       ?? ''
  const gyanTitle        = page?.gyanTitle        ?? 'Gyaan'
  const gyanSubtitle     = page?.gyanSubtitle     ?? 'The Pursuit of Wisdom'
  const gyanBody         = page?.gyanBody         ?? ''

  const photoUrl = page?.profilePhoto ? urlForString(page.profilePhoto, 288, 90) : ''

  const pillars = [
    { title: karmaTitle, subtitle: karmaSubtitle, body: karmaBody, img: '/images/karma-hands-seed.png', imgAlt: 'Karma — action and service' },
    { title: bhaktiTitle, subtitle: bhaktiSubtitle, body: bhaktiBody, img: '/images/temple-devotion.png', imgAlt: 'Bhakti — devotion and temple' },
    { title: gyanTitle, subtitle: gyanSubtitle, body: gyanBody, img: '/images/knowledge-scripture.png', imgAlt: 'Gyaan — scripture and knowledge' },
  ]

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Hari Das', url: '/haridas' }]} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src="/images/dharma-reflection.png" alt="Hari Das — Founder of Voice of Dharma Foundation" fill className="object-cover opacity-25" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1F44]/60 to-[#0A1F44]" />
          </div>
          <SectionWrapper>
            <div className="relative text-center">
              {photoUrl ? (
                <div className="relative w-36 h-36 mx-auto rounded-full mb-6 overflow-hidden border-4 shadow-xl" style={{ borderColor: '#C8960C' }}>
                  <Image src={photoUrl} alt={name} fill className="object-cover" priority sizes="144px" />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full mb-6 flex items-center justify-center text-5xl font-garamond font-semibold text-white select-none" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                  {name.charAt(0)}
                </div>
              )}
              <div className="text-amber-400/60 text-3xl mb-3 select-none">॥</div>
              <h1 className="font-garamond text-5xl md:text-6xl font-semibold text-white mb-3">{name}</h1>
              <p className="text-amber-400 text-lg tracking-wide">{founderTitle}</p>
            </div>
          </SectionWrapper>
        </section>

        {/* Who is Hari Das */}
        {who && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-6">Who is Hari Das?</h2>
                {who.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Spiritual Journey */}
        {journey && (
          <section className="py-0" style={{ background: '#f7f4ef' }}>
            <div className="flex flex-col lg:flex-row items-stretch min-h-[480px]">
              <div className="relative lg:w-2/5 flex-shrink-0 h-72 lg:h-auto">
                <Image src="/images/meditation-silhouette.png" alt="Spiritual journey of Hari Das" fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f7f4ef] hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f7f4ef] lg:hidden" />
                <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:max-w-xs rounded-xl px-4 py-3 shadow-lg" style={{ background: 'rgba(10,31,68,0.90)', backdropFilter: 'blur(8px)' }}>
                  <p className="font-garamond italic text-white/90 text-sm leading-snug">&ldquo;The path of dharma is not a destination — it is a way of walking.&rdquo;</p>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <div className="px-8 py-16 lg:px-14 max-w-2xl">
                  <SectionWrapper delay={0.1}>
                    <div className="section-divider mb-4" />
                    <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-8">Spiritual Journey of Hari Das</h2>
                    <div className="space-y-5">
                      {journey.split('\n\n').map((para, i) => (
                        <p key={i} className="text-gray-700 text-lg leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </SectionWrapper>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Three Pillars */}
        <section className="py-20 lotus-pattern" style={{ background: '#0A1F44' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-center mb-14">
                <div className="text-amber-400/60 text-3xl mb-3 select-none">॥</div>
                <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-white">Three Pillars of His Path</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pillars.map((pillar, i) => (
                  <SectionWrapper key={pillar.title} delay={i * 0.15}>
                    <div className="rounded-2xl overflow-hidden h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,150,12,0.25)' }}>
                      <div className="relative h-44 flex-shrink-0">
                        <Image src={pillar.img} alt={pillar.imgAlt} fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/85" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="font-garamond text-3xl font-semibold mb-1" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          {pillar.title}
                        </h3>
                        <p className="text-amber-400/80 text-sm tracking-wide mb-5 uppercase">{pillar.subtitle}</p>
                        <div className="w-8 h-0.5 mb-5" style={{ background: 'rgba(200,150,12,0.5)' }} />
                        {pillar.body.split('\n\n').map((para, j) => (
                          <p key={j} className="text-gray-300 text-base leading-relaxed mb-3 last:mb-0">{para}</p>
                        ))}
                      </div>
                    </div>
                  </SectionWrapper>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Personal Message */}
        {message && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <div className="rounded-2xl p-10" style={{ background: 'rgba(200,150,12,0.06)', borderLeft: '4px solid #C8960C' }}>
                  <div className="text-amber-500 text-3xl mb-4 select-none font-garamond">&ldquo;</div>
                  <h2 className="font-garamond text-2xl font-semibold text-krishna-blue mb-6">In His Own Words</h2>
                  {message.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 text-lg leading-relaxed italic font-garamond mb-5 last:mb-0">{para}</p>
                  ))}
                </div>
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Vision */}
        {vision && (
          <section className="py-16" style={{ background: '#f7f4ef' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <SectionWrapper delay={0.1}>
                <div className="section-divider mb-4 mx-auto" />
                <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mb-6">Vision</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{vision}</p>
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Closing Quote */}
        {closingQuote && (
          <section className="py-20" style={{ background: '#0A1F44' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <blockquote className="text-center">
                  <div className="text-amber-400/40 text-5xl mb-4 select-none font-garamond">&ldquo;</div>
                  <p className="font-garamond text-2xl md:text-3xl italic text-white leading-relaxed">{closingQuote}</p>
                  {closingQuoteRef && (
                    <cite className="block mt-6 text-amber-400 font-semibold tracking-widest not-italic text-sm uppercase">— {closingQuoteRef}</cite>
                  )}
                </blockquote>
              </SectionWrapper>
            </div>
          </section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  )
}
