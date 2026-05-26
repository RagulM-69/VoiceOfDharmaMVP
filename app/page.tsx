import type { Metadata } from 'next'
import { getHomePage, getHeroSlides, getSiteSettings } from '@/lib/sanity/queries'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HeroSlider from '@/components/public/HeroSlider'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage()
  return {
    title: page?.seo?.metaTitle ?? 'Voice of Dharma Foundation | Bhagavad Gita Inspired Trust',
    description: page?.seo?.metaDescription ?? 'A spiritual trust spreading the wisdom of Karma, Bhakti and Gyan through the Bhagavad Gita.',
  }
}

export default async function HomePage() {
  const [page, heroSlides, settings] = await Promise.all([
    getHomePage(),
    getHeroSlides(),
    getSiteSettings(),
  ])

  // Build slides for the HeroSlider component
  // If Sanity has hero slides, use those; otherwise fall back to hardcoded defaults
  const slides = heroSlides.length > 0
    ? heroSlides.map((slide) => ({
        title: slide.title,
        subtitle: slide.subtitle ?? '',
        body: slide.body ?? '',
        cta: slide.ctaText ?? 'Explore',
        ctaHref: slide.ctaHref ?? `/${slide.pillar ?? 'karma'}`,
        image: slide.backgroundImage
          ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${slide.backgroundImage.asset._ref.replace('image-', '').replace(/-\w+$/, (m) => m.replace('-', '.'))}`
          : `/images/${slide.pillar ?? 'karma'}-slide.png`,
      }))
    : [
        { title: 'Karma', subtitle: 'Act without attachment', body: '', cta: 'Explore Karma', ctaHref: '/karma', image: '/images/karma-slide.png' },
        { title: 'Bhakti', subtitle: 'Surrender in devotion', body: '', cta: 'Explore Bhakti', ctaHref: '/bhakti', image: '/images/bhakti-slide.png' },
        { title: 'Gyan', subtitle: 'Know the self', body: '', cta: 'Explore Gyaan', ctaHref: '/gyan', image: '/images/gyan-slide.png' },
      ]

  const gitaQuote    = page?.heroGitaQuote    ?? ''
  const gitaQuoteRef = page?.heroGitaQuoteRef ?? ''
  const aboutHeading = page?.aboutHeading     ?? 'A Foundation Rooted in Dharma'
  const aboutBody    = page?.aboutBody        ?? ''
  const mission      = page?.mission          ?? ''
  const whyDharma    = page?.whyDharma        ?? ''
  const whyVOD       = page?.whyVOD           ?? ''
  const supportH     = page?.supportHeading   ?? 'Support the Mission'
  const supportB     = page?.supportBody      ?? ''
  const connectH     = page?.connectHeading   ?? 'Join the Community'
  const connectB     = page?.connectBody      ?? ''

  // Quote banners — editable in Sanity, with sensible defaults
  const q1Text = page?.quoteBanner1?.text      ?? 'By devotion, by selfless action, and by knowledge, the wise come to understand the deeper truth of life.'
  const q1Ref  = page?.quoteBanner1?.reference ?? 'Bhagavad Gita'
  const q2Text = page?.quoteBanner2?.text      ?? 'Whenever righteousness declines and disorder prevails, I manifest to restore balance.'
  const q2Ref  = page?.quoteBanner2?.reference ?? 'Bhagavad Gita 4.7'
  const q3Text = page?.quoteBanner3?.text      ?? 'There is nothing in this world as purifying as knowledge.'
  const q3Ref  = page?.quoteBanner3?.reference ?? 'Bhagavad Gita 4.38'
  const cqText = page?.closingQuote?.text      ?? 'Established in yoga, perform your actions with balance and clarity.'
  const cqRef  = page?.closingQuote?.reference ?? 'Bhagavad Gita 2.48'

  return (
    <>
      <Navbar variant="dark" />
      <main>

        {/* Hero Slider */}
        <HeroSlider slides={slides} gitaQuote={gitaQuote} gitaQuoteRef={gitaQuoteRef} />

        {/* Quote Banner 1 */}
        <div className="py-12 border-b border-amber-400/20" style={{ background: 'rgba(10,31,68,0.98)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              &ldquo;{q1Text}&rdquo;
            </p>
            <p className="text-amber-400/70 text-sm mt-3 tracking-wider">— {q1Ref}</p>
          </div>
        </div>

        {/* About / Foundation Section */}
        <section className="py-0 bg-cream">
          <div className="relative h-72 md:h-96 overflow-hidden">
            <Image src="/images/about-dawn-landscape.png" alt="Varanasi ghats at dawn — the foundation of dharma" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDF6EC]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 sm:px-8 -mt-16 relative pb-20">
            <SectionWrapper>
              <div className="text-center mb-12">
                <div className="w-12 h-0.5 mx-auto mb-5" style={{ background: '#C8960C' }} />
                <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-krishna-blue mb-4">{aboutHeading}</h2>
              </div>

              {aboutBody && (
                <div className="max-w-3xl mx-auto space-y-5 mb-10">
                  {aboutBody.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 text-lg leading-relaxed">{para}</p>
                  ))}
                </div>
              )}

              {mission && (
                <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg" style={{ background: '#0A1F44' }}>
                  <div className="absolute inset-0">
                    <Image src="/images/integration-balance.png" alt="Dharma foundation mission" fill className="object-cover opacity-15" sizes="900px" />
                  </div>
                  <div className="relative px-8 py-10 md:px-12">
                    <div className="w-8 h-0.5 mb-4" style={{ background: '#C8960C' }} />
                    <h3 className="font-garamond text-2xl md:text-3xl font-semibold text-amber-400 mb-4">Our Mission</h3>
                    <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">{mission}</p>
                  </div>
                </div>
              )}

              {(whyDharma || whyVOD) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 items-stretch">
                  {whyDharma && (
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-md group h-full">
                      <div className="relative h-52 flex-shrink-0">
                        <Image src="/images/karma-hands-seed.png" alt="Why Dharma" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="500px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/60" />
                      </div>
                      <div className="flex-1 p-7" style={{ background: '#0A1F44' }}>
                        <div className="w-6 h-0.5 mb-3" style={{ background: '#C8960C' }} />
                        <h4 className="font-garamond text-xl font-semibold text-amber-400 mb-3">Why Dharma?</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{whyDharma}</p>
                      </div>
                    </div>
                  )}
                  {whyVOD && (
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-md group h-full">
                      <div className="relative h-52 flex-shrink-0">
                        <Image src="/images/temple-devotion.png" alt="Why Voice of Dharma" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="500px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/60" />
                      </div>
                      <div className="flex-1 p-7" style={{ background: '#0A1F44' }}>
                        <div className="w-6 h-0.5 mb-3" style={{ background: '#C8960C' }} />
                        <h4 className="font-garamond text-xl font-semibold text-amber-400 mb-3">Why Voice of Dharma?</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{whyVOD}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center">
                <Link href="/about" className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 border-2 border-amber-500 text-krishna-blue hover:bg-amber-500 hover:text-white">
                  Learn More About Us →
                </Link>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* Quote Banner 2 */}
        <div className="py-12 bg-cream border-t border-amber-400/20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-krishna-blue/75 leading-relaxed">
              &ldquo;{q2Text}&rdquo;
            </p>
            <p className="text-amber-600/70 text-sm mt-3 tracking-wider">— {q2Ref}</p>
          </div>
        </div>

        {/* Support Section */}
        <section className="py-0" style={{ background: '#0A1F44' }}>
          <div className="flex flex-col lg:flex-row">
            <div className="relative w-full lg:w-1/2 h-72 lg:h-auto min-h-[360px]">
              <Image src="/images/home-support-offering.png" alt="Offering — support the mission" fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A1F44]" />
            </div>
            <div className="w-full lg:w-1/2 flex items-center">
              <div className="px-10 md:px-16 py-16 max-w-xl">
                <SectionWrapper>
                  <div className="text-amber-400/50 text-4xl mb-5 select-none font-garamond">॥</div>
                  <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-6">{supportH}</h2>
                  {supportB && <p className="text-gray-300 text-lg leading-relaxed mb-10">{supportB}</p>}
                  <Link href="/donate" className="inline-block px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                    Donate Now
                  </Link>
                </SectionWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Banner 3 */}
        <div className="py-12" style={{ background: '#0A1F44', borderTop: '1px solid rgba(200,150,12,0.15)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              &ldquo;{q3Text}&rdquo;
            </p>
            <p className="text-amber-400/70 text-sm mt-3 tracking-wider">— {q3Ref}</p>
          </div>
        </div>

        {/* Connect Section */}
        <section className="py-20 bg-cream">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="w-12 h-0.5 mx-auto mb-5" style={{ background: '#C8960C' }} />
              <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-krishna-blue mb-6">{connectH}</h2>
              {connectB && <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-xl mx-auto">{connectB}</p>}
              <Link href="/contact" className="inline-block px-10 py-4 rounded-full font-semibold text-krishna-blue text-lg transition-all duration-300 hover:-translate-y-1 border-2 border-amber-500 hover:bg-amber-500 hover:text-white">
                Contact Us
              </Link>
            </SectionWrapper>
          </div>
        </section>

        {/* Closing Quote */}
        <div className="py-14" style={{ background: '#0A1F44' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="text-amber-400/30 text-4xl mb-4 font-garamond select-none">&ldquo;</div>
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              {cqText}
            </p>
            <p className="text-amber-400/60 text-sm mt-4 tracking-wider">— {cqRef}</p>
          </div>
        </div>

      </main>
      <Footer settings={settings} />
    </>
  )
}
