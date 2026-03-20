import type { Metadata } from 'next'
import { getSiteContent, getContent } from '@/lib/content'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Link from 'next/link'
import NextImage from 'next/image'

export const metadata: Metadata = {
  title: 'About — Voice of Dharma Foundation',
  description: 'Learn about the Voice of Dharma Foundation — its mission, areas of focus, and the vision behind it.',
}

export const revalidate = 3600

export default async function AboutPage() {
  const content = await getSiteContent('about')
  const footerContent = await getSiteContent()

  const heading    = getContent(content, 'about', 'hero',    'heading',    'About Voice of Dharma')
  const subheading = getContent(content, 'about', 'hero',    'subheading', '')
  const mainBody   = getContent(content, 'about', 'main',    'body',       '')
  const quote1     = getContent(content, 'about', 'quote1',  'text',       '')
  const quote1ref  = getContent(content, 'about', 'quote1',  'ref',        '')
  const focusIntro    = getContent(content, 'about', 'focus', 'intro',           '')
  const serviceTitle  = getContent(content, 'about', 'focus', 'service_title',   'Service and Community Support')
  const serviceBody   = getContent(content, 'about', 'focus', 'service_body',    '')
  const devotionTitle = getContent(content, 'about', 'focus', 'devotion_title',  'Preservation of Devotional Culture')
  const devotionBody  = getContent(content, 'about', 'focus', 'devotion_body',   '')
  const educationTitle= getContent(content, 'about', 'focus', 'education_title', 'Education and Knowledge')
  const educationBody = getContent(content, 'about', 'focus', 'education_body',  '')
  const whyHeading = getContent(content, 'about', 'why', 'heading', 'Why Voice of Dharma')
  const whyBody    = getContent(content, 'about', 'why', 'body',    '')
  const quote2    = getContent(content, 'about', 'quote2', 'text', '')
  const quote2ref = getContent(content, 'about', 'quote2', 'ref',  '')
  const connectHeading  = getContent(content, 'about', 'connect', 'heading',       'Connect With Voice of Dharma')
  const connectBody     = getContent(content, 'about', 'connect', 'body',          '')
  const youtubeLabel    = getContent(content, 'about', 'connect', 'youtube_label', 'YouTube')
  const youtubeDesc     = getContent(content, 'about', 'connect', 'youtube_desc',  '')
  const instagramLabel  = getContent(content, 'about', 'connect', 'instagram_label', 'Instagram')
  const instagramDesc   = getContent(content, 'about', 'connect', 'instagram_desc',  '')
  const facebookLabel   = getContent(content, 'about', 'connect', 'facebook_label',  'Facebook')
  const facebookDesc    = getContent(content, 'about', 'connect', 'facebook_desc',   '')
  const whatsappLabel   = getContent(content, 'about', 'connect', 'whatsapp_label',  'WhatsApp')
  const whatsappDesc    = getContent(content, 'about', 'connect', 'whatsapp_desc',   '')

  // Social links — read from site_content social/links section, editable from admin
  const socialContent  = await getSiteContent('social')
  const youtubeHref    = getContent(socialContent, 'social', 'links', 'youtube',    'https://youtube.com/@voice_of_dharma')
  const instagramHref  = getContent(socialContent, 'social', 'links', 'instagram',  'https://www.instagram.com/voiceofdharma.foundation')
  const facebookHref   = getContent(socialContent, 'social', 'links', 'facebook',   'https://www.facebook.com/profile.php?id=61584215592924')
  const whatsappHref   = getContent(socialContent, 'social', 'links', 'whatsapp',   'https://whatsapp.com/channel/0029Vb7QURUDDmFQStDDMg2v')

  const focusAreas = [
    {
      title: serviceTitle,   body: serviceBody,   img: '/images/karma-hands-seed.png',  alt: 'Karma — community service',
    },
    {
      title: devotionTitle,  body: devotionBody,  img: '/images/devotion-puja.png',      alt: 'Bhakti — devotion and puja',
    },
    {
      title: educationTitle, body: educationBody, img: '/images/knowledge-scripture.png', alt: 'Gyaan — knowledge and learning',
    },
  ]

  const platforms = [
    {
      label: youtubeLabel, desc: youtubeDesc, href: youtubeHref,
      color: '#FF0000',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
    {
      label: instagramLabel, desc: instagramDesc, href: instagramHref,
      color: '#E1306C',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    },
    {
      label: facebookLabel, desc: facebookDesc, href: facebookHref,
      color: '#1877F2',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      label: whatsappLabel, desc: whatsappDesc, href: whatsappHref,
      color: '#25D366',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    },
  ]

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <NextImage
              src="/images/about-dawn-landscape.png"
              alt="About Voice of Dharma — Varanasi ghats at dawn"
              fill className="object-cover opacity-20" priority sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionWrapper>
              <div className="text-amber-400/60 text-4xl mb-4 select-none">॥</div>
              <h1 className="font-garamond text-5xl md:text-6xl font-semibold text-white mb-4">{heading}</h1>
              {subheading && (
                <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">{subheading}</p>
              )}
            </SectionWrapper>
          </div>
        </section>

        {/* ── Quote 1 — above About ── */}
        {quote1 && (
          <div className="py-10 border-y border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">
                &ldquo;{quote1}&rdquo;
              </p>
              {quote1ref && (
                <p className="text-amber-400/80 text-sm mt-3 tracking-wider">— {quote1ref}</p>
              )}
            </div>
          </div>
        )}

        {/* ── About main body ── */}
        <section className="py-20 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="section-divider mb-4" />
              <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-8">
                About the Foundation
              </h2>
              {mainBody.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
              ))}
            </SectionWrapper>
          </div>
        </section>

        {/* ── Areas of Focus ── */}
        <section className="py-20" style={{ background: '#0A1F44' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-center mb-12">
                <div className="text-amber-400/60 text-3xl mb-3 select-none">॥</div>
                <h2 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-4">Areas of Focus</h2>
                {focusIntro && focusIntro.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {focusAreas.map((area, i) => (
                  <SectionWrapper key={area.title} delay={i * 0.15}>
                    <div
                      className="rounded-2xl overflow-hidden h-full flex flex-col"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,150,12,0.25)' }}
                    >
                      {/* Card image */}
                      <div className="relative h-44 flex-shrink-0">
                        <NextImage src={area.img} alt={area.alt} fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1F44]/80" />
                      </div>
                      <div className="p-7 flex-1">
                        <h3 className="font-garamond text-xl font-semibold text-white mb-3">{area.title}</h3>
                        <div className="w-8 h-0.5 mb-4" style={{ background: 'rgba(200,150,12,0.5)' }} />
                        <p className="text-gray-300 text-base leading-relaxed">{area.body}</p>
                      </div>
                    </div>
                  </SectionWrapper>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Why Voice of Dharma ── */}
        <section className="py-20 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper delay={0.1}>
              <div className="section-divider mb-4" />
              <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-8">{whyHeading}</h2>
              {whyBody.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-700 text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
              ))}
            </SectionWrapper>
          </div>
        </section>

        {/* ── Quote 2 — below Why ── */}
        {quote2 && (
          <div className="py-10 border-y border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="font-garamond text-xl md:text-2xl italic text-white/90 leading-relaxed">
                &ldquo;{quote2}&rdquo;
              </p>
              {quote2ref && (
                <p className="text-amber-400/80 text-sm mt-3 tracking-wider">— {quote2ref}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Connect ── */}
        <section className="py-20" style={{ background: '#f7f4ef' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper delay={0.1}>
              <div className="text-center mb-12">
                <div className="section-divider mb-4 mx-auto" />
                <h2 className="font-garamond text-3xl md:text-4xl font-semibold text-krishna-blue mb-4">{connectHeading}</h2>
                {connectBody.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto mb-3 last:mb-0">{para}</p>
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #0A1F44, #1a3a6e)' }}
                >
                  ✉️ Get in Touch
                </Link>
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 text-center" style={{ background: '#0A1F44' }}>
          <SectionWrapper>
            <h2 className="font-garamond text-3xl text-white mb-6">Support the Mission</h2>
            <Link
              href="/donate"
              className="inline-block px-10 py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
            >
              Donate Now
            </Link>
          </SectionWrapper>
        </section>

      </main>
      <Footer content={footerContent} />
    </>
  )
}
