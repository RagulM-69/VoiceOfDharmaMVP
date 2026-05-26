import type { Metadata } from 'next'
import { getSpiritualPage } from '@/lib/sanity/queries'
import { getSiteSettings } from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpiritualPage('karma')
  return {
    title: page?.seo?.metaTitle ?? 'Karma — The Path of Responsible Action | Voice of Dharma',
    description: page?.seo?.metaDescription ?? 'Explore the principle of Karma: conscious, responsible action as taught in the Bhagavad Gita and dharmic philosophy.',
  }
}

export default async function KarmaPage() {
  const [page, settings] = await Promise.all([
    getSpiritualPage('karma'),
    getSiteSettings(),
  ])

  const heroTitle         = page?.heroTitle         ?? 'Karma'
  const heroSub           = page?.heroSubtitle      ?? 'The Path of Responsible Action'
  const mainIntro         = page?.mainIntro         ?? `Karma, as understood in the Bhagavad Gita, is far more than the popular notion of cause and effect. It refers to the principle of conscious, intentional action — action performed with awareness of its purpose and responsibility.

The word karma comes from the Sanskrit root kri, meaning to do or to act. In its deepest sense, it refers to the quality and intention behind every action we take — not just the action itself.

At Voice of Dharma Foundation, the principle of Karma guides our approach to service. We believe that selfless action — performed without attachment to personal gain — is one of the most direct paths toward both individual growth and social transformation.`
  const gitaTeachingIntro = page?.gitaTeachingIntro ?? 'One of the most well-known teachings of the Bhagavad Gita addresses the nature of action directly:'
  const gitaQuote         = page?.gitaQuote?.translation ?? 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.'
  const gitaRef           = page?.gitaQuote?.reference   ?? 'Bhagavad Gita 2.47'
  const modernH           = page?.modernHeading     ?? 'Karma in Daily Life'
  const modernB           = page?.modernBody        ?? `The teaching of Karma Yoga invites individuals to engage fully with the world — not to withdraw from it. It encourages action that is thoughtful, honest, and motivated by a genuine wish to contribute rather than to accumulate.

In modern life, this principle can be applied in many ways: in the care we bring to our work, in how we treat others, in the responsibility we take for our communities, and in the awareness with which we make daily choices.

When action is guided by clarity rather than ego, it becomes a means of growth rather than a source of entanglement.`
  const visionH           = page?.visionHeading     ?? 'Our Commitment to Service'
  const visionB           = page?.visionBody        ?? `Voice of Dharma Foundation expresses Karma through direct community service — from food distribution programs to supporting individuals in moments of difficulty.

Every act of service is understood as an offering — not a transaction. This approach transforms the act of giving from charity into dharma.`
  const serviceH          = page?.serviceHeading    ?? 'Annadhanam — The Gift of Food'
  const serviceB          = page?.serviceBody       ?? `Annadhanam, the offering of food, is one of the most ancient expressions of Karma Yoga. At Voice of Dharma Foundation, we organise food distribution programs that serve communities in need — not merely as social work, but as a sacred act of giving.

Every meal offered is understood as prasad — a blessing extended from the heart, without expectation.`

  const heroImageUrl = page?.heroImage
    ? urlForString(page.heroImage, 1920, 75)
    : '/images/karma-slide.png'

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={page?.heroImage?.alt ?? 'Karma — community service and dharmic action'}
              fill className="object-cover opacity-30" priority sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/60 text-4xl mb-4 select-none">॥</div>
              <h1
                className="font-garamond font-semibold leading-none mb-4"
                style={{
                  fontSize: 'clamp(4rem, 10vw, 7rem)',
                  background: 'linear-gradient(135deg, #C8960C, #F5A623, #C8960C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {heroTitle}
              </h1>
              <p className="font-garamond text-xl md:text-2xl text-white/80 tracking-wide">{heroSub}</p>
            </SectionWrapper>
          </div>
        </section>

        {/* Main body */}
        {mainIntro && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="section-divider mb-6" />
                {mainIntro.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Gita quote section */}
        <section className="py-16" style={{ background: '#0A1F44' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <h2 className="font-garamond text-2xl font-semibold text-white mb-6">A Teaching from the Bhagavad Gita</h2>
              {gitaTeachingIntro && <p className="text-gray-300 text-lg leading-relaxed mb-8">{gitaTeachingIntro}</p>}
              {gitaQuote && (
                <blockquote className="pl-6 py-2" style={{ borderLeft: '3px solid #C8960C' }}>
                  <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">
                    &ldquo;{gitaQuote}&rdquo;
                  </p>
                  {gitaRef && (
                    <cite className="block mt-4 text-amber-400 text-sm tracking-wider not-italic">— {gitaRef}</cite>
                  )}
                </blockquote>
              )}
              <p className="text-gray-300 text-lg leading-relaxed mt-8">
                This teaching does not discourage effort or commitment. Rather, it invites individuals to focus on the quality of action itself, without becoming psychologically dependent on outcomes.
              </p>
            </SectionWrapper>
          </div>
        </section>

        {/* Modern relevance */}
        {modernH && (
          <section className="py-20 bg-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mb-6">{modernH}</h2>
                {modernB.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Foundation vision */}
        {visionH && (
          <section className="py-20" style={{ background: '#f7f4ef' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper delay={0.1}>
                <div className="section-divider mb-4" />
                <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mb-6">{visionH}</h2>
                {visionB.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Service CTA */}
        <section className="py-20 lotus-pattern" style={{ background: '#0A1F44' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper delay={0.1}>
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
                <Image src="/images/annadhanam-service.png" alt="Annadhanam — community food distribution"
                  fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/70 to-transparent" />
              </div>
              {serviceH && (
                <>
                  <div className="section-divider mb-4" style={{ background: 'rgba(200,150,12,0.5)' }} />
                  <h2 className="font-garamond text-3xl font-semibold text-white mb-6">{serviceH}</h2>
                  {serviceB.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-300 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                  ))}
                </>
              )}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/donate?cause=karma"
                  className="inline-block px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center"
                  style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                  Support Annadhanam
                </Link>
                <Link href="/donate?cause=karma"
                  className="inline-block px-10 py-4 rounded-full font-semibold text-amber-400 text-base transition-all duration-300 hover:-translate-y-1 border border-amber-400/40 hover:border-amber-400 text-center">
                  Donate
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
