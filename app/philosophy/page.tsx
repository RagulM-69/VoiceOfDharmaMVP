import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/config'
import { getSpiritualPage, getSiteSettings } from '@/lib/sanity/queries'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'


export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpiritualPage('philosophy')
  const title = page?.seo?.metaTitle ?? 'Philosophy of Dharma — Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'Explore the philosophy of Dharma — the nature of action, devotion, and wisdom through the Bhagavad Gita and ancient Indian thought.'
  return {
    title,
    description,
    alternates: { canonical: '/philosophy' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/philosophy`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Philosophy — Voice of Dharma Foundation' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/images/og-default.png`] },
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function QuoteBanner({
  sanskrit, meaning, source,
}: { sanskrit?: string; meaning?: string; source?: string }) {
  if (!sanskrit && !meaning) return null
  return (
    <div className="py-14" style={{ background: '#0A1F44' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-amber-400/30 text-3xl font-garamond mb-4 select-none">&ldquo;</div>
        {sanskrit && (
          <p className="font-garamond text-2xl md:text-3xl text-amber-300/90 leading-relaxed whitespace-pre-line mb-4">{sanskrit}</p>
        )}
        {meaning && (
          <p className="font-garamond text-base italic text-white/55 leading-relaxed">{meaning}</p>
        )}
        {source && (
          <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-4">— {source}</p>
        )}
      </div>
    </div>
  )
}

function PhilosophySplit({
  heading, body, imageSrc, imageAlt, reverse = false,
}: {
  heading: string; body: string; imageSrc: string; imageAlt: string; reverse?: boolean
}) {
  if (!body && !heading) return null
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
  if (!body && !heading) return null
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

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroHeading = page?.heroTitle    ?? 'Philosophy'
  const heroSub     = page?.heroSubtitle ?? 'Reflections on Dharma, Life, and Understanding'

  // ── Section 1: The Nature of Dharma ──────────────────────────────────────
  const s1H = 'The Nature of Dharma'
  const s1B = page?.mainIntro ?? `Dharma is often understood as duty or righteousness, but its meaning extends far beyond these interpretations. It refers to the underlying principle that sustains order, balance, and harmony within both the individual and the larger fabric of existence.

In human life, dharma expresses itself as the responsibility to act with awareness, integrity, and alignment with truth. It is not imposed from outside, but discovered through reflection and understanding.

To live in accordance with dharma is to participate consciously in the natural order of life.`

  // ── Quote after Section 1 (Rig Veda) ─────────────────────────────────────
  const q1Sanskrit = page?.gitaQuote?.sanskrit    ?? 'आ नो भद्राः क्रतवो यन्तु विश्वतः।'
  const q1Meaning  = page?.gitaQuote?.translation ?? 'Let noble thoughts come to us from all directions.'
  const q1Source   = page?.gitaQuote?.reference   ?? 'Rig Veda'

  // ── Section 2: The Human Quest for Meaning ───────────────────────────────
  const s2H = page?.modernHeading ?? 'The Human Quest for Meaning'
  const s2B = page?.modernBody    ?? `Human beings have always sought to understand the deeper questions of existence — Who am I? What is the purpose of life? What governs our actions and experiences?

These questions are not merely intellectual; they arise from direct experience. Moments of uncertainty, suffering, and reflection often lead individuals to look beyond immediate circumstances and search for a deeper understanding of life.

Philosophy, in this sense, is not abstract speculation. It is a response to the fundamental human need for clarity and meaning.`

  // ── Quote after Section 2 (Katha Upanishad) ─────────────────────────────────
  const q2Sanskrit = page?.quote2?.sanskrit    ?? `नायमात्मा प्रवचनेन लभ्यो
न मेधया न बहुना श्रुतेन।`
  const q2Meaning  = page?.quote2?.translation ?? 'The Self is not attained by discourse, nor by intellect, nor by much learning.'
  const q2Source   = page?.quote2?.reference   ?? 'Katha Upanishad'

  // ── Section 3: The Role of Action ───────────────────────────────────────────
  const s3H = page?.visionHeading ?? 'The Role of Action'
  const s3B = page?.visionBody    ?? `Life inevitably involves action. Every choice, whether small or significant, shapes both individual experience and the world around us.

The philosophical traditions of dharma emphasize that action becomes meaningful when it is performed with awareness and responsibility. When action is driven solely by personal desire or fear, it often leads to imbalance. When guided by clarity and a sense of purpose, it contributes to both personal growth and collective well-being.`

  // ── Quote after Section 3 (Bhagavad Gita 2.47) ─────────────────────────────
  const q3Sanskrit = page?.quote3?.sanskrit    ?? 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।'
  const q3Meaning  = page?.quote3?.translation ?? 'You have a right to action alone, not to its results.'
  const q3Source   = page?.quote3?.reference   ?? 'Bhagavad Gita 2.47'

  // ── Section 4: The Place of Devotion ───────────────────────────────────────
  const s4H = page?.devotionHeading ?? 'The Place of Devotion'
  const s4B = page?.devotionBody    ?? `Beyond action and intellect lies another dimension of human experience — the capacity for devotion. Devotion is not limited to ritual; it is the ability to recognize something greater than oneself and to relate to it with humility and reverence.

This dimension brings emotional depth to life. It allows individuals to experience connection, trust, and a sense of belonging within the larger whole of existence.`

  // ── Quote after Section 4 (Bhagavata Purana) ──────────────────────────────
  const q4Sanskrit = page?.quote4?.sanskrit    ?? `स वै पुंसां परो धर्मो
यतो भक्तिरधोक्षजे।`
  const q4Meaning  = page?.quote4?.translation ?? 'The highest dharma is that which leads to loving devotion to the Divine.'
  const q4Source   = page?.quote4?.reference   ?? 'Bhagavata Purana'

  // ── Section 5: The Importance of Knowledge ─────────────────────────────────
  const s5H = page?.knowledgeHeading ?? 'The Importance of Knowledge'
  const s5B = page?.knowledgeBody    ?? `Knowledge plays a crucial role in shaping understanding. However, true knowledge is not merely the accumulation of information. It is the clarity that arises when one examines life with attention and insight.

Through inquiry, reflection, and learning, individuals gradually move beyond confusion and develop a more accurate perception of reality. This clarity influences how one thinks, acts, and responds to life.`

  // ── Quote after Section 5 (Bhagavad Gita 4.38) ───────────────────────────
  const q5Sanskrit = page?.quote5?.sanskrit    ?? 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।'
  const q5Meaning  = page?.quote5?.translation ?? 'There is nothing in this world as purifying as knowledge.'
  const q5Source   = page?.quote5?.reference   ?? 'Bhagavad Gita 4.38'

  // ── Section 6: The Integration of Life ───────────────────────────────────
  const s6H = page?.integrationHeading ?? 'The Integration of Life'
  const s6B = page?.integrationBody    ?? `Action, devotion, and knowledge are not separate paths but interconnected aspects of human life. A balanced life is one in which these dimensions support and refine one another.

When action is guided by knowledge, it becomes purposeful. When knowledge is supported by devotion, it becomes grounded. When devotion is expressed through action, it becomes complete.`

  // ── Section 7: Philosophy as a Living Process ────────────────────────────
  const s7H = page?.livingProcessHeading ?? 'Philosophy as a Living Process'
  const s7B = page?.livingProcessBody    ?? `Philosophy is not a fixed system of beliefs. It is a continuous process of questioning, understanding, and living with awareness.

It does not demand conclusions, but invites clarity. It does not impose answers, but encourages inquiry.

In this way, philosophy becomes not something to study alone, but something to live.`

  // ── Closing Reflection ────────────────────────────────────────────────────
  const closingH = page?.serviceHeading ?? 'Closing Reflection'
  const closingB = page?.serviceBody    ?? `To engage with philosophy is to engage with life itself — with its questions, its uncertainties, and its possibilities.

It is an invitation to observe more carefully, to act more consciously, and to understand more deeply.`

  // ── Grand Final Closing Quote (Brihadaranyaka Upanishad) ──────────────────
  const finalLines = (page?.closingQuoteLines && page.closingQuoteLines.length > 0)
    ? page.closingQuoteLines
    : ['असतो मा सद्गमय', 'तमसो मा ज्योतिर्गमय', 'मृत्योर्मा अमृतं गमय।']

  const finalTranslation = (page?.closingQuoteTranslation && page.closingQuoteTranslation.length > 0)
    ? page.closingQuoteTranslation
    : ['Lead me from untruth to truth,', 'from darkness to light,', 'from mortality to immortality.']

  const finalSource = page?.closingQuoteSource ?? 'Brihadaranyaka Upanishad'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Philosophy', url: '/philosophy' }]} />
      <Navbar />
      <main>

        {/* ── Hero ── */}
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

        {/* ── 1: The Nature of Dharma ── */}
        <PhilosophySplit heading={s1H} body={s1B} imageSrc="/images/dharma-reflection.png" imageAlt="Temple reflected in a calm river — the nature of dharma" />
        <QuoteBanner sanskrit={q1Sanskrit} meaning={q1Meaning} source={q1Source} />

        {/* ── 2: The Human Quest for Meaning ── */}
        <PhilosophySplit heading={s2H} body={s2B} imageSrc="/images/meditation-silhouette.png" imageAlt="Meditation at sunrise — the quest for meaning" reverse />
        <QuoteBanner sanskrit={q2Sanskrit} meaning={q2Meaning} source={q2Source} />

        {/* ── 3: The Role of Action ── */}
        <PhilosophySplit heading={s3H} body={s3B} imageSrc="/images/karma-hands-seed.png" imageAlt="Hands planting a seed — the role of karma" />
        <QuoteBanner sanskrit={q3Sanskrit} meaning={q3Meaning} source={q3Source} />

        {/* ── 4: The Place of Devotion ── */}
        <PhilosophySplit heading={s4H} body={s4B} imageSrc="/images/devotion-puja.png" imageAlt="Puja flowers and diyas — devotion" reverse />
        <QuoteBanner sanskrit={q4Sanskrit} meaning={q4Meaning} source={q4Source} />

        {/* ── 5: The Importance of Knowledge ── */}
        <PhilosophySplit heading={s5H} body={s5B} imageSrc="/images/knowledge-scripture.png" imageAlt="An open scripture — the importance of knowledge" />
        <QuoteBanner sanskrit={q5Sanskrit} meaning={q5Meaning} source={q5Source} />

        {/* ── 6: The Integration of Life ── */}
        <PhilosophySplit heading={s6H} body={s6B} imageSrc="/images/integration-balance.png" imageAlt="Balance scale — the integration of life" reverse />

        {/* ── 7: Philosophy as a Living Process ── */}
        <PhilosophyText heading={s7H} body={s7B} />

        {/* ── Closing Reflection ── */}
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

        {/* ── Grand Final Quote — Brihadaranyaka Upanishad ── */}
        <div className="py-20 border-t border-amber-400/10" style={{ background: 'rgba(5,15,38,1)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionWrapper>
              {/* Sanskrit / original lines */}
              <div className="mb-8 space-y-2">
                {finalLines.map((line, i) => (
                  <p key={i} className="font-garamond text-2xl md:text-3xl text-amber-400/85 leading-relaxed">{line}</p>
                ))}
              </div>
              <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: 'rgba(200,150,12,0.4)' }} />
              {/* Translation lines */}
              <div className="space-y-2">
                {finalTranslation.map((phrase, i) => (
                  <p key={i} className="font-garamond text-lg italic text-white/60 leading-relaxed">{phrase}</p>
                ))}
              </div>
              <p className="text-amber-500/40 text-xs tracking-widest uppercase mt-8">— {finalSource}</p>
            </SectionWrapper>
          </div>
        </div>

        {/* ── CTA ── */}
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
      <Footer settings={settings} />
    </>
  )
}
