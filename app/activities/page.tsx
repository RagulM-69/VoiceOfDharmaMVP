import type { Metadata } from 'next'
import { getActivities, getActivitiesPage, getSiteSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import type { Activity } from '@/lib/sanity/types'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'


export const revalidate = 60 // New activities appear within 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceofdharmafoundation.org'
  const pageData = await getActivitiesPage().catch(() => null)
  const title = pageData?.seo?.metaTitle ?? 'Activities — Voice of Dharma Foundation'
  const description = pageData?.seo?.metaDescription ?? 'Follow our activities — community service, devotional events, and spiritual programmes rooted in the path of Karma, Bhakti, and Gyaan.'
  return {
    title,
    description,
    alternates: { canonical: '/activities' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/activities`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Voice of Dharma Activities' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

// ── Relative timestamp helper ─────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60)       return 'Just now'
  if (diff < 3600)     return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400)    return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800)   return `${Math.floor(diff / 86400)} days ago`
  if (diff < 2592000)  return `${Math.floor(diff / 604800)} weeks ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
  return `${Math.floor(diff / 31536000)} years ago`
}

// ── Pillar badge colours ──────────────────────────────────────────────────────
const PILLAR_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  karma:   { bg: 'rgba(34,197,94,0.15)',   text: '#16a34a', label: '🌱 Karma' },
  bhakti:  { bg: 'rgba(251,146,60,0.15)',  text: '#ea580c', label: '🪔 Bhakti' },
  gyan:    { bg: 'rgba(99,102,241,0.15)',  text: '#4f46e5', label: '📖 Gyaan' },
  general: { bg: 'rgba(200,150,12,0.15)',  text: '#C8960C', label: '🕉️ Dharma' },
}

// ── Single Activity Card ──────────────────────────────────────────────────────
function ActivityCard({ activity }: { activity: Activity }) {
  const pillar = PILLAR_STYLE[activity.pillar] ?? PILLAR_STYLE.general
  const mainImage = activity.coverImage ?? activity.images?.[0]
  const extraImages = activity.images?.slice(1, 4) ?? []
  const hasSlug = Boolean(activity.slug?.current)

  const cardContent = (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col"
      aria-label={activity.title}
    >
      {/* Primary image */}
      {mainImage && (
        <div className="relative w-full h-56 md:h-64 overflow-hidden flex-shrink-0">
          <Image
            src={urlFor(mainImage).width(800).height(450).format('webp').url()}
            alt={mainImage.alt ?? activity.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          {activity.isFeatured && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
              ⭐ Featured
            </div>
          )}
          {/* Pillar badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: pillar.bg, color: pillar.text, backdropFilter: 'blur(8px)', border: `1px solid ${pillar.text}40` }}>
            {pillar.label}
          </div>
        </div>
      )}

      {/* Extra images strip */}
      {extraImages.length > 0 && (
        <div className="grid grid-cols-3 gap-1 px-1 -mt-1 flex-shrink-0">
          {extraImages.map((img, i) => (
            <div key={i} className="relative h-20 overflow-hidden rounded">
              <Image
                src={urlFor(img).width(300).height(150).format('webp').url()}
                alt={img.alt ?? `Photo ${i + 2}`}
                fill className="object-cover"
                sizes="200px"
              />
              {i === 2 && (activity.images?.length ?? 0) > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">+{(activity.images?.length ?? 0) - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-garamond text-xl font-semibold text-gray-800 leading-snug flex-1">
            {activity.title}
          </h2>
        </div>

        {activity.summary && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{activity.summary}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <time dateTime={activity.publishedAt}>{timeAgo(activity.publishedAt)}</time>
          </div>
          <span className="text-amber-600 font-semibold text-xs">
            {hasSlug ? 'Read more →' : (activity.location ?? '')}
          </span>
        </div>
      </div>
    </article>
  )

  // Wrap in Link only if the activity has a slug
  if (hasSlug) {
    return (
      <Link href={`/activities/${activity.slug.current}`} className="group block h-full">
        {cardContent}
      </Link>
    )
  }
  return cardContent
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyFeed() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">🌿</div>
      <h2 className="font-garamond text-3xl text-gray-700 mb-4">Activities Coming Soon</h2>
      <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
        We are preparing to share our activities with you. Service, devotion, and wisdom — our journey continues.
      </p>
      <Link href="/donate" className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
        Support the Mission
      </Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ActivitiesPage() {
  const [activities, activitiesPageData, settings] = await Promise.all([
    getActivities(24).catch(() => [] as Activity[]),
    getActivitiesPage().catch(() => null),
    getSiteSettings(),
  ])

  const heroTitle    = activitiesPageData?.heroTitle    ?? 'Activities'
  const heroSubtitle = activitiesPageData?.heroSubtitle ?? 'Service, devotion, and wisdom \u2014 every action an offering'
  const quoteText    = activitiesPageData?.pageQuote?.text      ?? 'Yoga\u1e25 karmasu kau\u015balam \u2014 Excellence in action is Yoga.'
  const quoteRef     = activitiesPageData?.pageQuote?.reference ?? 'Bhagavad Gita 2.50'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Activities', url: '/activities' }]} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src="/images/activities-hero.png" alt="Activities — Voice of Dharma Foundation" fill className="object-cover opacity-25" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
              <div className="text-amber-400/50 text-5xl mb-6 select-none font-garamond">॥</div>
              <h1 className="font-garamond text-5xl md:text-6xl font-semibold text-white mb-5">{heroTitle}</h1>
              <p className="font-garamond text-xl md:text-2xl text-white/60 leading-relaxed">
                {heroSubtitle}
              </p>
            </SectionWrapper>
          </div>
        </section>

        {/* Intro Quote */}
        <div className="py-10 border-y border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-amber-300/90 leading-relaxed">
              &ldquo;{quoteText}&rdquo;
            </p>
            <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-3">— {quoteRef}</p>
          </div>
        </div>

        {/* Pillar filter legend */}
        <div className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(PILLAR_STYLE).map(([key, val]) => (
                <span key={key} className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: val.bg, color: val.text }}>
                  {val.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Activities Feed */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {activities.length === 0 ? (
              <EmptyFeed />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <SectionWrapper key={activity._id} delay={0.05}>
                    <ActivityCard activity={activity} />
                  </SectionWrapper>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        {activities.length > 0 && (
          <section className="py-16 text-center" style={{ background: '#0A1F44' }}>
            <SectionWrapper>
              <div className="text-amber-400/40 text-4xl mb-4 font-garamond">॥</div>
              <h2 className="font-garamond text-3xl text-white mb-3">Be Part of Something Meaningful</h2>
              <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">Support our activities through donation — every contribution furthers the mission of dharmic service.</p>
              <Link href="/donate" className="inline-block px-10 py-4 rounded-full font-semibold text-white text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                Support the Mission
              </Link>
            </SectionWrapper>
          </section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  )
}
