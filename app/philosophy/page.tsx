import type { Metadata } from 'next'
import { getSpiritualPage, getSiteSettings } from '@/lib/sanity/queries'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpiritualPage('philosophy')
  return {
    title: page?.seo?.metaTitle ?? 'Philosophy — Voice of Dharma Foundation',
    description: page?.seo?.metaDescription ?? 'Reflections on dharma, action, devotion, and knowledge from the Voice of Dharma Foundation.',
  }
}

// ── Sub-components (same structure as original, now data-driven) ──────────────

function QuoteBanner({ sanskrit, meaning, source }: { sanskrit?: string; meaning?: string; source?: string }) {
  if (!sanskrit) return null
  return (
    <div className="py-14" style={{ background: '#0A1F44' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-amber-400/30 text-3xl font-garamond mb-4 select-none">&ldquo;</div>
        <p className="font-garamond text-2xl md:text-3xl text-amber-300/90 leading-relaxed whitespace-pre-line mb-4">{sanskrit}</p>
        {meaning && <p className="font-garamond text-base italic text-white/55 leading-relaxed">{meaning}</p>}
        {source && <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-4">— {source}</p>}
      </div>
    </div>
  )
}

function PhilosophySplit({
  heading, body, imageSrc, imageAlt, reverse = false,
}: {
  heading: string; body: string; imageSrc: string; imageAlt: string; reverse?: boolean
}) {
  return (
    <section className="py-0 bg-cream">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        <div className="relative w-full lg:w-1/2 h-72 lg:h-auto min-h-[320px]">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className={`absolute inset-0 ${reverse ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#FDF6EC]/60 to-transparent`} />
        </div>
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="px-8 md:px-14 py-14 max-w-xl">
            <SectionWrapper>
              <div className="w-10 h-0.5 mb-5" style={{ background: '#C8960C' }} />
              <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-6">{heading}</h2>
              {body.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 last:mb-0">{para}</p>
              ))}
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  )
}

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PhilosophyPage() {
  const [page, settings] = await Promise.all([
    getSpiritualPage('philosophy'),
    getSiteSettings(),
  ])

  // Philosophy page uses the spiritualPage schema:
  // heroTitle, heroSubtitle → hero
  // mainIntro → section 1 (The Nature of Dharma) body
  // gitaTeachingIntro → section 1 quote text, gitaQuote → quote
  // modernHeading/modernBody → section 2 (Human Quest for Meaning)
  // visionHeading/visionBody → section 3 (Role of Action)
  // serviceHeading/serviceBody → closing section
  //
  // Sections 4-8 fall back to hardcoded defaults from the original page
  // so existing content still renders perfectly until Sanity is populated.

  const heroHeading  = page?.heroTitle    ?? 'Philosophy'
  const heroSub      = page?.heroSubtitle ?? 'Reflections on Dharma, Life, and Understanding'
  const section1H    = page?.mainIntro ? 'The Nature of Dharma' : 'The Nature of Dharma'
  const section1B    = page?.mainIntro    ?? ''
  const dharmaQ      = page?.gitaQuote?.sanskrit    ?? ''
  const dharmaQM     = page?.gitaQuote?.translation ?? ''
  const dharmaQS     = page?.gitaQuote?.reference   ?? ''
  const section2H    = page?.modernHeading ?? 'The Human Quest for Meaning'
  const section2B    = page?.modernBody    ?? ''
  const section3H    = page?.visionHeading ?? 'The Role of Action'
  const section3B    = page?.visionBody    ?? ''
  const closingH     = page?.serviceHeading ?? 'Closing Reflection'
  const closingB     = page?.serviceBody    ?? ''

  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative pt-32 pb-32 overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src="/images/philosophy-hero.png" alt="Philosophy — ancient temple carvings" fill className="object-cover opacity-25" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="text-amber-400/50 text-5xl mb-6 select-none font-garamond">॥</div>
              <h1 className="font-garamond text-6xl md:text-7xl font-semibold text-white mb-5 leading-tight">{heroHeading}</h1>
              <p className="font-garamond text-xl md:text-2xl text-white/60 leading-relaxed">{heroSub}</p>
            </SectionWrapper>
          </div>
        </section>

        {/* 1 — The Nature of Dharma */}
        <PhilosophySplit heading={section1H} body={section1B} imageSrc="/images/dharma-reflection.png" imageAlt="Temple reflected in a calm river — the nature of dharma" />
        <QuoteBanner sanskrit={dharmaQ} meaning={dharmaQM} source={dharmaQS} />

        {/* 2 — The Human Quest for Meaning */}
        <PhilosophySplit heading={section2H} body={section2B} imageSrc="/images/meditation-silhouette.png" imageAlt="Meditation at sunrise — the quest for meaning" reverse />

        {/* 3 — The Role of Action */}
        <PhilosophySplit heading={section3H} body={section3B} imageSrc="/images/karma-hands-seed.png" imageAlt="Hands planting a seed — the role of karma" />

        {/* 4 — The Place of Devotion (static content pending CMS) */}
        <PhilosophySplit
          heading="The Place of Devotion"
          body="Bhakti, or devotion, is often misunderstood as mere ritual. In its deeper sense, it is a fundamental orientation of the heart — a way of approaching all of life with love, reverence, and surrender to something greater than the self.

The Bhagavad Gita presents devotion not as an escape from the world, but as a way of engaging with it more fully. When one acts from a place of genuine love and offering, the quality of action changes. The ego gradually loosens its grip, and a deeper sense of purpose emerges."
          imageSrc="/images/devotion-puja.png"
          imageAlt="Puja flowers and diyas — devotion"
          reverse
        />

        {/* 5 — The Importance of Knowledge */}
        <PhilosophySplit
          heading="The Importance of Knowledge"
          body="Gyaan, or wisdom, is not merely intellectual knowledge but a deeper understanding of the nature of reality, the self, and the relationship between the two. In the Bhagavad Gita, knowledge is presented as one of the most powerful forces in human life.

At Voice of Dharma Foundation, the pursuit of wisdom is understood as a lifelong journey. It involves not only studying sacred texts, but also the willingness to observe one's own mind, question assumptions, and remain open to deeper understanding."
          imageSrc="/images/knowledge-scripture.png"
          imageAlt="An open scripture — the importance of knowledge"
        />

        {/* 6 — The Integration of Life */}
        <PhilosophySplit
          heading="The Integration of Life"
          body="One of the most significant contributions of the Bhagavad Gita to human thought is its insistence that spirituality is not separate from ordinary life. The pursuit of dharma is not about renunciation alone — it is about transformation within engagement.

Karma, Bhakti, and Gyaan are not separate paths that contradict each other. They are complementary dimensions of a complete life — action, devotion, and understanding working together to create a human being of depth, clarity, and compassion."
          imageSrc="/images/integration-balance.png"
          imageAlt="Balance scale — the integration of life"
          reverse
        />

        {/* 7 — Philosophy as a Living Process */}
        <PhilosophyText
          heading="Philosophy as a Living Process"
          body="Philosophy, in this tradition, is not a theoretical exercise. It is a living process — one that unfolds through daily choices, relationships, and the willingness to remain honest with oneself.

Voice of Dharma Foundation believes that philosophical understanding must be embodied, not merely believed. This is why our work combines the study of wisdom with the practice of service, the cultivation of devotion, and the commitment to conscious living."
        />

        {/* Closing section */}
        {closingB && (
          <section className="py-20" style={{ background: '#0A1F44' }}>
            <div className="max-w-3xl mx-auto px-6 text-center">
              <SectionWrapper>
                <div className="w-10 h-0.5 mx-auto mb-8" style={{ background: '#C8960C' }} />
                <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-white mb-6">{closingH}</h2>
                {closingB.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-300 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
                ))}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* Grand Final Quote — Brihadaranyaka Upanishad */}
        <div className="py-20 border-t border-amber-400/10" style={{ background: 'rgba(5,15,38,1)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionWrapper>
              <div className="mb-8 space-y-2">
                {['Asato mā sad gamaya', 'Tamaso mā jyotir gamaya', 'Mṛtyor mā amṛtaṁ gamaya'].map((line, i) => (
                  <p key={i} className="font-garamond text-2xl md:text-3xl text-amber-400/85 leading-relaxed">{line}</p>
                ))}
              </div>
              <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: 'rgba(200,150,12,0.4)' }} />
              <div className="space-y-2">
                {['Lead me from untruth to truth,', 'from darkness to light,', 'from mortality to immortality.'].map((phrase, i) => (
                  <p key={i} className="font-garamond text-lg italic text-white/60 leading-relaxed">{phrase}</p>
                ))}
              </div>
              <p className="text-amber-500/40 text-xs tracking-widest uppercase mt-8">— Brihadaranyaka Upanishad</p>
            </SectionWrapper>
          </div>
        </div>

        {/* CTA */}
        <section className="py-14 text-center" style={{ background: '#0A1F44' }}>
          <SectionWrapper>
            <Link href="/donate" className="inline-block px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
              Support the Foundation
            </Link>
          </SectionWrapper>
        </section>

      </main>
      <Footer settings={settings} />
    </>
  )
}
