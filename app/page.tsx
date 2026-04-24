import type { Metadata } from 'next'
import { getSiteContent, getContent } from '@/lib/content'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HeroSlider from '@/components/public/HeroSlider'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Voice of Dharma Foundation | Bhagavad Gita Inspired Trust',
  description: 'A spiritual trust spreading the wisdom of Karma, Bhakti and Gyan through the Bhagavad Gita.',
}

export const revalidate = 3600

export default async function HomePage() {
  const content = await getSiteContent()

  const slides = [
    {
      title: getContent(content, 'home', 'hero_slide_1', 'title', 'Karma'),
      subtitle: getContent(content, 'home', 'hero_slide_1', 'subtitle', 'Act without attachment'),
      body: getContent(content, 'home', 'hero_slide_1', 'body', ''),
      cta: 'Explore Karma',
      ctaHref: '/karma',
      image: '/images/karma-slide.png',
    },
    {
      title: getContent(content, 'home', 'hero_slide_2', 'title', 'Bhakti'),
      subtitle: getContent(content, 'home', 'hero_slide_2', 'subtitle', 'Surrender in devotion'),
      body: getContent(content, 'home', 'hero_slide_2', 'body', ''),
      cta: 'Explore Bhakti',
      ctaHref: '/bhakti',
      image: '/images/bhakti-slide.png',
    },
    {
      title: getContent(content, 'home', 'hero_slide_3', 'title', 'Gyan'),
      subtitle: getContent(content, 'home', 'hero_slide_3', 'subtitle', 'Know the self'),
      body: getContent(content, 'home', 'hero_slide_3', 'body', ''),
      cta: 'Explore Gyaan',
      ctaHref: '/gyan',
      image: '/images/gyan-slide.png',
    },
  ]

  const gitaQuote       = getContent(content, 'home', 'hero',    'gita_quote',     '')
  const gitaQuoteRef    = getContent(content, 'home', 'hero',    'gita_quote_ref', '')
  const aboutHeading    = getContent(content, 'home', 'about',   'heading',        'A Foundation Rooted in Dharma')
  const aboutBody       = getContent(content, 'home', 'about',   'body',           '')
  const mission         = getContent(content, 'home', 'about',   'mission',        '')
  const whyGita         = getContent(content, 'home', 'about',   'why_gita',       '')
  const whyKrishna      = getContent(content, 'home', 'about',   'why_krishna',    '')
  const supportHeading  = getContent(content, 'home', 'support', 'heading',        'Support the Mission')
  const supportBody     = getContent(content, 'home', 'support', 'body',           '')
  const connectHeading  = getContent(content, 'home', 'connect', 'heading',        'Join the Community')
  const connectBody     = getContent(content, 'home', 'connect', 'body',           '')

  return (
    <>
      <Navbar variant="dark" />
      <main>

        {/* ── Hero Slider ── */}
        <HeroSlider slides={slides} gitaQuote={gitaQuote} gitaQuoteRef={gitaQuoteRef} />

        {/* ── Quote Banner ── */}
        <div className="py-12 border-b border-amber-400/20" style={{ background: 'rgba(10,31,68,0.98)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              &ldquo;By devotion, by selfless action, and by knowledge, the wise come to understand the deeper truth of life.&rdquo;
            </p>
            <p className="text-amber-400/70 text-sm mt-3 tracking-wider">— Bhagavad Gita</p>
          </div>
        </div>

        {/* ── About / Foundation Section ── */}
        <section className="py-0 bg-cream">
          {/* Top image banner */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <Image
              src="/images/about-dawn-landscape.png"
              alt="Varanasi ghats at dawn — the foundation of dharma"
              fill className="object-cover" sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDF6EC]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 sm:px-8 -mt-16 relative pb-20">
            <SectionWrapper>
              {/* Heading centred over the image fade */}
              <div className="text-center mb-12">
                <div className="w-12 h-0.5 mx-auto mb-5" style={{ background: '#C8960C' }} />
                <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-krishna-blue mb-4">
                  {aboutHeading}
                </h2>
              </div>

              {/* Body paragraphs */}
              <div className="max-w-3xl mx-auto space-y-5 mb-10">
                {aboutBody.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed">{para}</p>
                ))}
              </div>

              {/* Mission — full-width dark banner with image accent */}
              {mission && (
                <div
                  className="relative rounded-2xl overflow-hidden mb-10 shadow-lg"
                  style={{ background: '#0A1F44' }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src="/images/integration-balance.png"
                      alt="Dharma foundation mission"
                      fill className="object-cover opacity-15"
                      sizes="900px"
                    />
                  </div>
                  <div className="relative px-8 py-10 md:px-12">
                    <div className="w-8 h-0.5 mb-4" style={{ background: '#C8960C' }} />
                    <h3 className="font-garamond text-2xl md:text-3xl font-semibold text-amber-400 mb-4">Our Mission</h3>
                    <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">{mission}</p>
                  </div>
                </div>
              )}

              {/* Why Dharma + Why Voice of Dharma — tall image cards */}
              {(whyGita || whyKrishna) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 items-stretch">
                {whyGita && (
                  <div className="flex flex-col rounded-2xl overflow-hidden shadow-md group h-full">
                    <div className="relative h-52 flex-shrink-0">
                      <Image
                        src="/images/karma-hands-seed.png"
                        alt="Why Dharma — action and meaning"
                        fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="500px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/60" />
                    </div>
                    <div className="flex-1 p-7" style={{ background: '#0A1F44' }}>
                      <div className="w-6 h-0.5 mb-3" style={{ background: '#C8960C' }} />
                      <h4 className="font-garamond text-xl font-semibold text-amber-400 mb-3">Why Dharma?</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{whyGita}</p>
                    </div>
                  </div>
                )}
                {whyKrishna && (
                  <div className="flex flex-col rounded-2xl overflow-hidden shadow-md group h-full">
                    <div className="relative h-52 flex-shrink-0">
                      <Image
                        src="/images/temple-devotion.png"
                        alt="Why Voice of Dharma — devotion and purpose"
                        fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="500px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/60" />
                    </div>
                    <div className="flex-1 p-7" style={{ background: '#0A1F44' }}>
                      <div className="w-6 h-0.5 mb-3" style={{ background: '#C8960C' }} />
                      <h4 className="font-garamond text-xl font-semibold text-amber-400 mb-3">Why Voice of Dharma?</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{whyKrishna}</p>
                    </div>
                  </div>
                )}
              </div>
              )}

              <div className="text-center">
                <Link
                  href="/about"
                  className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 border-2 border-amber-500 text-krishna-blue hover:bg-amber-500 hover:text-white"
                >
                  Learn More About Us →
                </Link>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Gita Quote ── */}
        <div className="py-12 bg-cream border-t border-amber-400/20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-krishna-blue/75 leading-relaxed">
              &ldquo;Whenever righteousness declines and disorder prevails, I manifest to restore balance.&rdquo;
            </p>
            <p className="text-amber-600/70 text-sm mt-3 tracking-wider">— Bhagavad Gita 4.7</p>
          </div>
        </div>

        {/* ── Support Section — with full split image ── */}
        <section className="py-0" style={{ background: '#0A1F44' }}>
          <div className="flex flex-col lg:flex-row">
            {/* Left image */}
            <div className="relative w-full lg:w-1/2 h-72 lg:h-auto min-h-[360px]">
              <Image
                src="/images/home-support-offering.png"
                alt="Offering — support the mission"
                fill className="object-cover opacity-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A1F44]" />
            </div>
            {/* Right text */}
            <div className="w-full lg:w-1/2 flex items-center">
              <div className="px-10 md:px-16 py-16 max-w-xl">
                <SectionWrapper>
                  <div className="text-amber-400/50 text-4xl mb-5 select-none font-garamond">॥</div>
                  <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-6">
                    {supportHeading}
                  </h2>
                  {supportBody && (
                    <p className="text-gray-300 text-lg leading-relaxed mb-10">{supportBody}</p>
                  )}
                  <Link
                    href="/donate"
                    className="inline-block px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
                  >
                    Donate Now
                  </Link>
                </SectionWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quote ── */}
        <div className="py-12" style={{ background: '#0A1F44', borderTop: '1px solid rgba(200,150,12,0.15)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              &ldquo;There is nothing in this world as purifying as knowledge.&rdquo;
            </p>
            <p className="text-amber-400/70 text-sm mt-3 tracking-wider">— Bhagavad Gita 4.38</p>
          </div>
        </div>

        {/* ── Connect Section ── */}
        <section className="py-20 bg-cream">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="w-12 h-0.5 mx-auto mb-5" style={{ background: '#C8960C' }} />
              <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-krishna-blue mb-6">
                {connectHeading}
              </h2>
              {connectBody && (
                <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-xl mx-auto">{connectBody}</p>
              )}
              <Link
                href="/contact"
                className="inline-block px-10 py-4 rounded-full font-semibold text-krishna-blue text-lg transition-all duration-300 hover:-translate-y-1 border-2 border-amber-500 hover:bg-amber-500 hover:text-white"
              >
                Contact Us
              </Link>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Closing Quote ── */}
        <div className="py-14" style={{ background: '#0A1F44' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="text-amber-400/30 text-4xl mb-4 font-garamond select-none">"</div>
            <p className="font-garamond text-xl md:text-2xl italic text-white/80 leading-relaxed">
              Established in yoga, perform your actions with balance and clarity.
            </p>
            <p className="text-amber-400/60 text-sm mt-4 tracking-wider">— Bhagavad Gita 2.48</p>
          </div>
        </div>

      </main>
      <Footer content={content} />
    </>
  )
}
