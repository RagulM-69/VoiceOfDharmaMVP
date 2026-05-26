import type { Metadata } from 'next'
import { getActivityBySlug, getAllActivitySlugs, getSiteSettings } from '@/lib/sanity/queries'
import { urlFor, urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import type { Activity } from '@/lib/sanity/types'

export const revalidate = 60
export const dynamicParams = true

// ── Static params for known slugs ─────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllActivitySlugs()
  return slugs.map((s) => ({ slug: s.slug.current }))
}

// ── SEO ───────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const activity = await getActivityBySlug(params.slug)
  if (!activity) return { title: 'Activity Not Found' }
  return {
    title: `${activity.title} — Voice of Dharma Foundation`,
    description: activity.summary ?? `${activity.title} — a dharmic activity by Voice of Dharma Foundation.`,
  }
}

// ── Pillar config ──────────────────────────────────────────────────────────────
const PILLAR_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  karma:   { bg: 'rgba(34,197,94,0.15)',  text: '#16a34a', label: '🌱 Karma' },
  bhakti:  { bg: 'rgba(251,146,60,0.15)', text: '#ea580c', label: '🪔 Bhakti' },
  gyan:    { bg: 'rgba(99,102,241,0.15)', text: '#4f46e5', label: '📖 Gyaan' },
  general: { bg: 'rgba(200,150,12,0.15)', text: '#C8960C', label: '🕉️ Dharma' },
}

// ── Date formatter ─────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── Portable Text components ───────────────────────────────────────────────────
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <Image
              src={urlForString(value, 1200, 80)}
              alt={value.alt ?? 'Activity image'}
              fill className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-gray-400 text-sm mt-2 italic">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-garamond text-2xl font-semibold text-krishna-blue mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="pl-6 py-2 my-6 border-l-4 border-amber-400/60">
        <p className="font-garamond text-xl italic text-gray-600 leading-relaxed">{children}</p>
      </blockquote>
    ),
    normal: ({ children }: any) => <p className="text-gray-700 text-lg leading-relaxed mb-5">{children}</p>,
  },
  marks: {
    link: ({ value, children }: any) => (
      <a href={value.href} target={value.blank ? '_blank' : '_self'} rel="noopener noreferrer" className="text-amber-600 hover:underline">
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong className="font-semibold text-gray-800">{children}</strong>,
    em:     ({ children }: any) => <em className="italic">{children}</em>,
  },
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const [activity, settings] = await Promise.all([
    getActivityBySlug(params.slug),
    getSiteSettings(),
  ])

  if (!activity) notFound()

  const pillar     = PILLAR_STYLE[activity.pillar] ?? PILLAR_STYLE.general
  const coverUrl   = activity.coverImage
    ? urlFor(activity.coverImage).width(1400).height(700).format('webp').url()
    : null
  const galleryImages = [
    ...(activity.coverImage ? [activity.coverImage] : []),
    ...(activity.images ?? []),
  ].filter((img, idx, arr) =>
    // dedupe cover from images array
    idx === 0 || JSON.stringify(img.asset) !== JSON.stringify(arr[0].asset)
  )

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          className="relative pt-32 pb-24 overflow-hidden"
          style={{ background: '#0A1F44' }}
        >
          {coverUrl && (
            <div className="absolute inset-0">
              <Image
                src={coverUrl}
                alt={activity.coverImage?.alt ?? activity.title}
                fill className="object-cover opacity-25"
                priority sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/40 via-[#0A1F44]/60 to-[#0A1F44]" />
            </div>
          )}

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionWrapper>
              {/* Pillar badge */}
              <div
                className="inline-block mb-5 px-4 py-1.5 rounded-full text-sm font-medium border"
                style={{ background: pillar.bg, color: pillar.text, borderColor: `${pillar.text}40` }}
              >
                {pillar.label}
              </div>

              <h1 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                {activity.title}
              </h1>

              {activity.summary && (
                <p className="font-garamond text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                  {activity.summary}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-amber-400/70">
                <time dateTime={activity.publishedAt}>
                  {formatDate(activity.publishedAt)}
                </time>
                {activity.location && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-amber-400/40 inline-block" />
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {activity.location}
                    </span>
                  </>
                )}
              </div>
            </SectionWrapper>
          </div>
        </section>

        {/* ── Cover image (large) ── */}
        {coverUrl && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
            <div className="relative w-full h-72 md:h-[440px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={coverUrl}
                alt={activity.coverImage?.alt ?? activity.title}
                fill className="object-cover"
                sizes="1100px"
              />
            </div>
          </div>
        )}

        {/* ── Article body ── */}
        <article className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {activity.body ? (
              <PortableText value={activity.body as any[]} components={ptComponents} />
            ) : activity.summary ? (
              <p className="text-gray-700 text-lg leading-relaxed">{activity.summary}</p>
            ) : (
              <p className="text-gray-400 text-center py-8">More details coming soon.</p>
            )}
          </div>
        </article>

        {/* ── Photo gallery ── */}
        {galleryImages.length > 1 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-garamond text-2xl font-semibold text-gray-800 mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryImages.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={urlFor(img).width(600).height(450).format('webp').url()}
                      alt={img.alt ?? `Photo ${i + 2}`}
                      fill className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Back nav + CTA ── */}
        <section className="py-16 text-center" style={{ background: '#0A1F44' }}>
          <SectionWrapper>
            <div className="text-amber-400/40 text-4xl mb-4 font-garamond">॥</div>
            <h2 className="font-garamond text-3xl text-white mb-3">Continue the Journey</h2>
            <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
              Explore more activities rooted in Karma, Bhakti, and Gyaan — or support the mission.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/activities"
                className="inline-block px-8 py-3 rounded-full font-semibold text-amber-400 border-2 border-amber-400/40 hover:border-amber-400 transition-all"
              >
                ← All Activities
              </Link>
              <Link
                href="/donate"
                className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
              >
                Support the Mission
              </Link>
            </div>
          </SectionWrapper>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
