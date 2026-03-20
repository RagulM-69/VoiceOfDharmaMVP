import type { Metadata } from 'next'
import { getSiteContent, getContent } from '@/lib/content'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Philosophy — Voice of Dharma Foundation',
  description: 'Reflections on dharma, action, devotion, and knowledge from the Voice of Dharma Foundation.',
}

export const revalidate = 3600

/** Full-width dark Sanskrit quote banner */
function QuoteBanner({
  sanskrit,
  meaning,
  source,
}: {
  sanskrit: string
  meaning: string
  source: string
}) {
  if (!sanskrit) return null
  return (
    <div className="py-14" style={{ background: '#0A1F44' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-amber-400/30 text-3xl font-garamond mb-4 select-none">"</div>
        <p className="font-garamond text-2xl md:text-3xl text-amber-300/90 leading-relaxed whitespace-pre-line mb-4">
          {sanskrit}
        </p>
        {meaning && (
          <p className="font-garamond text-base italic text-white/55 leading-relaxed">
            {meaning}
          </p>
        )}
        {source && (
          <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-4">— {source}</p>
        )}
      </div>
    </div>
  )
}

/** Alternating image + text section */
function PhilosophySplit({
  heading,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}: {
  heading: string
  body: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}) {
  return (
    <section className="py-0 bg-cream">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        {/* Image */}
        <div className="relative w-full lg:w-1/2 h-72 lg:h-auto min-h-[320px]">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className={`absolute inset-0 ${reverse ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#FDF6EC]/60 to-transparent`} />
        </div>
        {/* Text */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="px-8 md:px-14 py-14 max-w-xl">
            <SectionWrapper>
              <div className="w-10 h-0.5 mb-5" style={{ background: '#C8960C' }} />
              <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-6">
                {heading}
              </h2>
              {body.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Plain text-only section (no image) for shorter sections */
function PhilosophyText({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="py-16" style={{ background: '#f7f4ef' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <SectionWrapper>
          <div className="w-10 h-0.5 mb-5" style={{ background: '#C8960C' }} />
          <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-6">{heading}</h2>
          {body.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 last:mb-0">{para}</p>
          ))}
        </SectionWrapper>
      </div>
    </section>
  )
}

export default async function PhilosophyPage() {
  const content = await getSiteContent('philosophy')
  const g = (section: string, key: string, fallback = '') =>
    getContent(content, 'philosophy', section, key, fallback)

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative pt-32 pb-32 overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image
              src="/images/philosophy-hero.png"
              alt="Philosophy — ancient temple carvings"
              fill className="object-cover opacity-25" priority sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="text-amber-400/50 text-5xl mb-6 select-none font-garamond">॥</div>
              <h1 className="font-garamond text-6xl md:text-7xl font-semibold text-white mb-5 leading-tight">
                {g('hero', 'heading', 'Philosophy')}
              </h1>
              <p className="font-garamond text-xl md:text-2xl text-white/60 leading-relaxed">
                {g('hero', 'subheading', 'Reflections on Dharma, Life, and Understanding')}
              </p>
            </SectionWrapper>
          </div>
        </section>

        {/* 1 — The Nature of Dharma */}
        <PhilosophySplit
          heading={g('dharma', 'heading', 'The Nature of Dharma')}
          body={g('dharma', 'body')}
          imageSrc="/images/dharma-reflection.png"
          imageAlt="Temple reflected in a calm river — the nature of dharma"
        />
        <QuoteBanner
          sanskrit={g('dharma', 'quote_sanskrit')}
          meaning={g('dharma', 'quote_meaning')}
          source={g('dharma', 'quote_source')}
        />

        {/* 2 — The Human Quest for Meaning */}
        <PhilosophySplit
          heading={g('meaning', 'heading', 'The Human Quest for Meaning')}
          body={g('meaning', 'body')}
          imageSrc="/images/meditation-silhouette.png"
          imageAlt="Meditation at sunrise — the quest for meaning"
          reverse
        />
        <QuoteBanner
          sanskrit={g('meaning', 'quote_sanskrit')}
          meaning={g('meaning', 'quote_meaning')}
          source={g('meaning', 'quote_source')}
        />

        {/* 3 — The Role of Action */}
        <PhilosophySplit
          heading={g('action', 'heading', 'The Role of Action')}
          body={g('action', 'body')}
          imageSrc="/images/karma-hands-seed.png"
          imageAlt="Hands planting a seed — the role of karma"
        />
        <QuoteBanner
          sanskrit={g('action', 'quote_sanskrit')}
          meaning={g('action', 'quote_meaning')}
          source={g('action', 'quote_source')}
        />

        {/* 4 — The Place of Devotion */}
        <PhilosophySplit
          heading={g('devotion', 'heading', 'The Place of Devotion')}
          body={g('devotion', 'body')}
          imageSrc="/images/devotion-puja.png"
          imageAlt="Puja flowers and diyas — devotion"
          reverse
        />
        <QuoteBanner
          sanskrit={g('devotion', 'quote_sanskrit')}
          meaning={g('devotion', 'quote_meaning')}
          source={g('devotion', 'quote_source')}
        />

        {/* 5 — The Importance of Knowledge */}
        <PhilosophySplit
          heading={g('knowledge', 'heading', 'The Importance of Knowledge')}
          body={g('knowledge', 'body')}
          imageSrc="/images/knowledge-scripture.png"
          imageAlt="An open scripture — the importance of knowledge"
        />
        <QuoteBanner
          sanskrit={g('knowledge', 'quote_sanskrit')}
          meaning={g('knowledge', 'quote_meaning')}
          source={g('knowledge', 'quote_source')}
        />

        {/* 6 — The Integration of Life */}
        <PhilosophySplit
          heading={g('integration', 'heading', 'The Integration of Life')}
          body={g('integration', 'body')}
          imageSrc="/images/integration-balance.png"
          imageAlt="Balance scale — the integration of life"
          reverse
        />

        {/* 7 — Philosophy as a Living Process */}
        <PhilosophyText
          heading={g('living', 'heading', 'Philosophy as a Living Process')}
          body={g('living', 'body')}
        />

        {/* 8 — Closing Reflection (dark section) */}
        <section className="py-20" style={{ background: '#0A1F44' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="w-10 h-0.5 mx-auto mb-8" style={{ background: '#C8960C' }} />
              <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-white mb-6">
                {g('closing', 'heading', 'Closing Reflection')}
              </h2>
              {g('closing', 'body').split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-300 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
              ))}
            </SectionWrapper>
          </div>
        </section>

        {/* Grand Final Quote — Brihadaranyaka Upanishad */}
        <div className="py-20 border-t border-amber-400/10" style={{ background: 'rgba(5,15,38,1)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionWrapper>
              {/* Sanskrit lines */}
              <div className="mb-8 space-y-2">
                {g('closing', 'quote_sanskrit').split('\n').map((line, i) => (
                  <p key={i} className="font-garamond text-2xl md:text-3xl text-amber-400/85 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              {/* Divider */}
              <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: 'rgba(200,150,12,0.4)' }} />
              {/* Meaning — each phrase on its own line */}
              <div className="space-y-2">
                {['Lead me from untruth to truth,', 'from darkness to light,', 'from mortality to immortality.'].map((phrase, i) => (
                  <p key={i} className="font-garamond text-lg italic text-white/60 leading-relaxed">{phrase}</p>
                ))}
              </div>
              <p className="text-amber-500/40 text-xs tracking-widest uppercase mt-8">— {g('closing', 'quote_source', 'Brihadaranyaka Upanishad')}</p>
            </SectionWrapper>
          </div>
        </div>

        {/* CTA */}
        <section className="py-14 text-center" style={{ background: '#0A1F44' }}>
          <SectionWrapper>
            <Link
              href="/donate"
              className="inline-block px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
            >
              Support the Foundation
            </Link>
          </SectionWrapper>
        </section>

      </main>
      <Footer content={await getSiteContent()} />
    </>
  )
}
