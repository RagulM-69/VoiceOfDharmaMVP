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
  const page = await getSpiritualPage('bhakti')

  const title = page?.seo?.metaTitle ?? 'Bhakti Yoga — The Path of Devotion | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Explore the principle of Bhakti Yoga: devotion, reverence, and inner connection as taught in the Bhagavad Gita. Discover how devotion transforms daily life.'
  return {
    title,
    description,
    alternates: { canonical: '/bhakti' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/bhakti`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Bhakti Yoga — Voice of Dharma Foundation' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/images/og-default.png`] },
  }
}

export default async function BhaktiPage() {
  const [page, settings] = await Promise.all([getSpiritualPage('bhakti'), getSiteSettings()])

  const heroTitle         = page?.heroTitle         ?? 'Bhakti'
  const heroSub           = page?.heroSubtitle      ?? 'The Path of Devotion'
  const mainIntro         = page?.mainIntro         ?? `Bhakti, in its truest sense, is not merely ritual worship or religious observance. It is a fundamental orientation of the heart — a way of approaching life with love, reverence, and the recognition of something greater than oneself.

The word bhakti comes from the Sanskrit root bhaj, meaning to share, to participate in, or to be devoted to. It is an active, living connection — not passive belief, but a dynamic relationship with the sacred dimension of existence.

At Voice of Dharma Foundation, Bhakti is understood as a path that transforms ordinary life into an act of offering — where each moment, each interaction, and each experience becomes an opportunity to deepen one’s connection with the divine.`
  const gitaTeachingIntro = page?.gitaTeachingIntro ?? 'The Bhagavad Gita speaks directly to the nature of devotion:'
  const gitaQuote         = page?.gitaQuote?.translation ?? 'Fix your mind on Me, be devoted to Me, worship Me, bow down to Me. So shall you come to Me. I promise you truly, for you are dear to Me.'
  const gitaRef           = page?.gitaQuote?.reference   ?? 'Bhagavad Gita 18.65'
  const modernH           = page?.modernHeading     ?? 'Bhakti in Modern Life'
  const modernB           = page?.modernBody        ?? `In today’s world, bhakti is often misunderstood as emotionalism or superstition. In reality, it represents one of the most profound capacities of the human being: the ability to love unconditionally and to act with complete dedication.

Bhakti does not require renunciation of the world. Rather, it invites full engagement with life — but with a different quality of attention. When actions are performed as an offering, they lose their burden and become a source of joy.

Voice of Dharma Foundation encourages the practice of Bhakti not merely through prayer or ritual, but through the daily cultivation of reverence, gratitude, and love in all areas of life.`
  const visionH           = page?.visionHeading     ?? 'Preserving Devotional Traditions'
  const visionB           = page?.visionBody        ?? `India’s devotional traditions — its music, its temple arts, its festivals, its storytelling — carry within them centuries of wisdom about the nature of the human heart. These traditions are not mere cultural heritage; they are living pathways to inner transformation.

Voice of Dharma Foundation is committed to preserving and sharing these traditions, ensuring that future generations have access to the richness of devotional culture.`
  const serviceH          = page?.serviceHeading    ?? 'Temple and Cultural Initiatives'
  const serviceB          = page?.serviceBody       ?? `Our Bhakti initiatives support temple preservation, devotional gatherings, and cultural programs that bring communities together around the shared experience of the sacred.

Through music, storytelling, and collective prayer, we create spaces where the spirit of Bhakti can be experienced directly — not merely learned about.`
  const heroImageUrl = page?.heroImage ? urlForString(page.heroImage, 1920, 75) : '/images/devotion-puja.png'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Bhakti Yoga', url: '/bhakti' }]} />
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
