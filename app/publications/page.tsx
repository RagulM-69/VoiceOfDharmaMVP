import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/config'
import { getPublications, getSiteSettings } from '@/lib/sanity/queries'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import PublicationGrid from '@/components/publications/PublicationGrid'
import { BreadcrumbSchema, CollectionPageSchema } from '@/components/seo/JsonLd'
import type { PublicationListItem } from '@/lib/sanity/types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Publications — Voice of Dharma Foundation'
  const description =
    'Discover spiritual publications from the Voice of Dharma Foundation — books rooted in the wisdom of the Bhagavad Gita, dharmic living, and conscious awareness.'

  return {
    title,
    description,
    alternates: { canonical: '/publications' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/publications`,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: 'Voice of Dharma Foundation Publications',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

export default async function PublicationsPage() {
  const [publications, settings] = await Promise.all([
    getPublications().catch(() => [] as PublicationListItem[]),
    getSiteSettings(),
  ])

  const pageTitle = 'Publications'
  const pageSubtitle = 'Books rooted in the wisdom of the Bhagavad Gita and dharmic living'
  const description = 'Discover spiritual publications from the Voice of Dharma Foundation.'

  return (
    <>
      {/* JSON-LD Structured Data */}
      <CollectionPageSchema title={pageTitle} description={description} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Publications', url: '/publications' },
        ]}
      />

      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section
          className="relative pt-32 pb-24 text-center overflow-hidden"
          style={{ background: '#0A1F44' }}
        >
          {/* Lotus pattern overlay */}
          <div className="absolute inset-0 lotus-pattern opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/20 via-transparent to-[#0A1F44]" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/50 text-5xl mb-6 select-none font-garamond">॥</div>
              <h1 className="font-garamond text-5xl md:text-6xl font-semibold text-white mb-5">
                {pageTitle}
              </h1>
              <p className="font-garamond text-xl md:text-2xl text-white/60 leading-relaxed">
                {pageSubtitle}
              </p>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Gita Quote Banner ── */}
        <div
          className="py-10 border-y border-amber-400/20"
          style={{ background: 'rgba(10,31,68,0.97)' }}
        >
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-amber-300/90 leading-relaxed">
              &ldquo;Yogaḥ karmasu kauśalam&rdquo;
            </p>
            <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-3">
              — Bhagavad Gita 2.50
            </p>
          </div>
        </div>

        {/* ── Publications Grid ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PublicationGrid publications={publications} />
          </div>
        </section>

        {/* ── Closing CTA ── */}
        {publications.length > 0 && (
          <section
            className="py-16 text-center"
            style={{ background: '#0A1F44' }}
          >
            <SectionWrapper>
              <div className="text-amber-400/40 text-4xl mb-4 font-garamond">॥</div>
              <h2 className="font-garamond text-3xl text-white mb-3">
                Support the Mission
              </h2>
              <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
                Help us create and distribute dharmic wisdom to seekers around the world.
              </p>
              <a
                href="/donate"
                className="inline-block px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
              >
                Donate Now
              </a>
            </SectionWrapper>
          </section>
        )}
      </main>

      <Footer settings={settings} />
    </>
  )
}
