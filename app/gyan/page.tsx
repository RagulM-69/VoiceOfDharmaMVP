import type { Metadata } from 'next'
import { getSpiritualPage, getSiteSettings } from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import Image from 'next/image'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/seo/config'



export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpiritualPage('gyan')

  const title = page?.seo?.metaTitle ?? 'Gyaan Yoga — The Path of Knowledge & Wisdom | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Explore the principle of Gyaan Yoga: the pursuit of wisdom and spiritual knowledge as taught in the Bhagavad Gita. Learn through satsangs, study circles, and dharmic texts.'
  return {
    title,
    description,
    alternates: { canonical: '/gyan' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/gyan`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Gyaan Yoga — Voice of Dharma Foundation' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/images/og-default.png`] },
  }
}

export default async function GyanPage() {
  const [page, settings] = await Promise.all([getSpiritualPage('gyan'), getSiteSettings()])

  const heroTitle         = page?.heroTitle         ?? 'Gyaan'
  const heroSub           = page?.heroSubtitle      ?? 'The Path of Knowledge'
  const mainIntro         = page?.mainIntro         ?? `Gyaan, or wisdom, is one of the foundational pillars of dharmic understanding. In the Bhagavad Gita, it is described as the highest purifier — the light that dispels the darkness of ignorance and confusion.

Unlike ordinary knowledge, which accumulates facts and information, Gyaan refers to a deeper understanding: the clarity that arises when one sees reality as it truly is, without the distortions of ego, desire, or fear.

At Voice of Dharma Foundation, the pursuit of Gyaan is understood not as an intellectual exercise, but as a lived process of inquiry, reflection, and transformation.`
  const gitaTeachingIntro = page?.gitaTeachingIntro ?? 'The Bhagavad Gita’s teaching on knowledge points to its transformative power:'
  const gitaQuote         = page?.gitaQuote?.translation ?? 'There is nothing in this world as purifying as knowledge. One who becomes perfected in the practice of devotion will in time discover this within himself.'
  const gitaRef           = page?.gitaQuote?.reference   ?? 'Bhagavad Gita 4.38'
  const modernH           = page?.modernHeading     ?? 'Gyaan in Contemporary Life'
  const modernB           = page?.modernBody        ?? `In an age of information overload, true wisdom is rare. We are surrounded by data, opinions, and noise — yet clarity about what truly matters remains elusive.

Gyaan offers a different approach: not the acquisition of more information, but the development of discernment. The ability to distinguish between what is real and what is merely appearance; between what is permanent and what is transient.

This kind of wisdom does not come from books alone. It arises through sustained reflection, honest self-examination, and a willingness to question one’s assumptions and habits of mind.`
  const visionH           = page?.visionHeading     ?? 'Education as Dharma'
  const visionB           = page?.visionBody        ?? `Voice of Dharma Foundation believes that access to wisdom teachings is a fundamental need of every human being. Our educational initiatives are rooted in this conviction.

We do not teach Gyaan as a subject to be studied, but as a way of seeing — a shift in perspective that can be cultivated through sustained engagement with dharmic texts, teachings, and practice.`
  const serviceH          = page?.serviceHeading    ?? 'Educational Initiatives'
  const serviceB          = page?.serviceBody       ?? `Our Gyaan programs include satsangs, study circles, and access to dharmic literature — offered freely to those who seek them.

We believe that when wisdom is shared generously, it multiplies. This is the essence of Gyaan Yog: knowledge offered as service, in the spirit of dharma.`
  const heroImageUrl = page?.heroImage ? urlForString(page.heroImage, 1920, 75) : '/images/gyaan-manuscripts.png'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Gyaan Yoga', url: '/gyan' }]} />
      <Navbar />
      <main>
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src={heroImageUrl} alt={page?.heroImage?.alt ?? 'Gyaan — ancient wisdom'} fill className="object-cover opacity-30" priority sizes="100vw" />
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
              {page?.gitaTeachingExplanation ? (
                page.gitaTeachingExplanation.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-300 text-lg leading-relaxed mt-8">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-gray-300 text-lg leading-relaxed mt-8">
                  Knowledge, in this sense, is not separate from spiritual growth. It becomes an instrument through which one develops a deeper awareness of the interconnected nature of existence.
                </p>
              )}
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
                <Image src="/images/gyaan-manuscripts.png" alt="Ancient manuscripts — the path of knowledge" fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
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
                <Link href="/donate?cause=gyan" className="inline-block px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                  Support Educational Initiatives
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
