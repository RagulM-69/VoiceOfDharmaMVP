import type { Metadata } from 'next'
import { getSpiritualPage, getSiteSettings } from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpiritualPage('bhakti')
  return {
    title: page?.seo?.metaTitle ?? 'Bhakti — The Path of Devotion | Voice of Dharma',
    description: page?.seo?.metaDescription ?? 'Explore the principle of Bhakti: devotion, reverence and inner connection as taught in the Bhagavad Gita.',
  }
}

export default async function BhaktiPage() {
  const [page, settings] = await Promise.all([getSpiritualPage('bhakti'), getSiteSettings()])

  const heroTitle         = page?.heroTitle         ?? 'Bhakti'
  const heroSub           = page?.heroSubtitle      ?? 'The Path of Devotion'
  const mainIntro         = page?.mainIntro         ?? ''
  const gitaTeachingIntro = page?.gitaTeachingIntro ?? ''
  const gitaQuote         = page?.gitaQuote?.translation ?? ''
  const gitaRef           = page?.gitaQuote?.reference   ?? ''
  const modernH           = page?.modernHeading     ?? ''
  const modernB           = page?.modernBody        ?? ''
  const visionH           = page?.visionHeading     ?? ''
  const visionB           = page?.visionBody        ?? ''
  const serviceH          = page?.serviceHeading    ?? ''
  const serviceB          = page?.serviceBody       ?? ''
  const heroImageUrl = page?.heroImage ? urlForString(page.heroImage, 1920, 75) : '/images/devotion-puja.png'

  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src={heroImageUrl} alt={page?.heroImage?.alt ?? 'Bhakti — devotion'} fill className="object-cover opacity-30" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/60 text-4xl mb-4 select-none">॥</div>
              <h1 className="font-garamond font-semibold leading-none mb-4" style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', background: 'linear-gradient(135deg, #C8960C, #F5A623, #C8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {heroTitle}
              </h1>
              <p className="font-garamond text-xl md:text-2xl text-white/80 tracking-wide">{heroSub}</p>
            </SectionWrapper>
          </div>
        </section>

        {mainIntro && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="section-divider mb-6" />
                {mainIntro.split('\n\n').map((para, i) => <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0">{para}</p>)}
              </SectionWrapper>
            </div>
          </section>
        )}

        <section className="py-16" style={{ background: '#0A1F44' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <h2 className="font-garamond text-2xl font-semibold text-white mb-6">A Teaching from the Bhagavad Gita</h2>
              {gitaTeachingIntro && <p className="text-gray-300 text-lg leading-relaxed mb-8">{gitaTeachingIntro}</p>}
              {gitaQuote && (
                <blockquote className="pl-6 py-2" style={{ borderLeft: '3px solid #C8960C' }}>
                  <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">&ldquo;{gitaQuote}&rdquo;</p>
                  {gitaRef && <cite className="block mt-4 text-amber-400 text-sm tracking-wider not-italic">— {gitaRef}</cite>}
                </blockquote>
              )}
              <p className="text-gray-300 text-lg leading-relaxed mt-8">
                This teaching reflects a profound insight: devotion is not confined to specific acts of worship. Rather, it is an attitude that can transform all aspects of life into an offering.
              </p>
            </SectionWrapper>
          </div>
        </section>

        {modernH && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mb-6">{modernH}</h2>
                {modernB.split('\n\n').map((para, i) => <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>)}
              </SectionWrapper>
            </div>
          </section>
        )}

        {visionH && (
          <section className="py-20" style={{ background: '#f7f4ef' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mb-6">{visionH}</h2>
                {visionB.split('\n\n').map((para, i) => <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>)}
              </SectionWrapper>
            </div>
          </section>
        )}

        <section className="py-20 lotus-pattern" style={{ background: '#0A1F44' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper delay={0.1}>
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
                <Image src="/images/temple-devotion.png" alt="Temple — preserving devotional traditions" fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/70 to-transparent" />
              </div>
              {serviceH && (
                <>
                  <div className="section-divider mb-4" style={{ background: 'rgba(200,150,12,0.5)' }} />
                  <h2 className="font-garamond text-3xl font-semibold text-white mb-6">{serviceH}</h2>
                  {serviceB.split('\n\n').map((para, i) => <p key={i} className="text-gray-300 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>)}
                </>
              )}
              <div className="mt-10">
                <Link href="/donate?cause=bhakti" className="inline-block px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                  Support Temple Initiatives
                </Link>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
