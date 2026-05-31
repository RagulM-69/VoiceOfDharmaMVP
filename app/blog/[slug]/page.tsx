import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/config'
import { getBlogPostBySlug, getAllBlogSlugs, getSiteSettings } from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { BlogPostingSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'


export const revalidate = 60

// CRITICAL: allow new slugs created after build to render via ISR
// Without this, new blog posts return 404 until the next build
export const dynamicParams = true

// ── Static params for SSG ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((s) => ({ slug: s.slug.current }))
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }

  const ogImage = post.seo?.ogImage
    ? urlForString(post.seo.ogImage, 1200, 80)
    : post.coverImage
      ? urlForString(post.coverImage, 1200, 80)
      : `${SITE_URL}/images/og-default.png`

  const title = post.seo?.metaTitle ?? `${post.title} — Voice of Dharma Foundation`
  const description = post.seo?.metaDescription ?? post.excerpt ?? ''

  return {
    title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Voice of Dharma Foundation'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ── Portable Text component overrides ────────────────────────────────────────
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <Image
              src={urlForString(value, 1200, 80)}
              alt={value.alt ?? 'Article image'}
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
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const CATEGORY_LABELS: Record<string, string> = {
  'bhagavad-gita':  '📖 Bhagavad Gita',
  'karma-yoga':     '🌱 Karma Yoga',
  'bhakti':         '🪔 Bhakti & Devotion',
  'gyan':           '✨ Gyaan & Wisdom',
  'dharmic-living': '🕉️ Dharmic Living',
  'self-awareness': '🧘 Self-Awareness',
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, settings] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getSiteSettings(),
  ])

  if (!post) notFound()

  const coverUrl = post.coverImage ? urlForString(post.coverImage, 1400, 80) : null

  return (
    <>
      <BlogPostingSchema
        title={post.title}
        description={post.excerpt}
        publishedAt={post.publishedAt}
        slug={post.slug.current}
        imageUrl={coverUrl ?? undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug.current}` },
        ]}
      />
      <Navbar />
      <main>
        {/* Hero / Cover */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: '#0A1F44' }}>
          {coverUrl && (
            <div className="absolute inset-0">
              <Image src={coverUrl} alt={post.coverImage?.alt ?? post.title} fill className="object-cover opacity-25" priority sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1F44]/60 to-[#0A1F44]" />
            </div>
          )}
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionWrapper>
              {post.category && (
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium text-amber-400 border border-amber-400/30 bg-amber-400/10">
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </div>
              )}
              <h1 className="font-garamond text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">{post.title}</h1>
              {post.excerpt && (
                <p className="font-garamond text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">{post.excerpt}</p>
              )}
              <p className="text-amber-400/60 text-sm mt-5 tracking-wider">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
            </SectionWrapper>
          </div>
        </section>

        {/* Gita Quote (if any) */}
        {post.gitaQuote?.translation && (
          <div className="py-10 border-y border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
            <div className="max-w-2xl mx-auto px-6 text-center">
              <p className="font-garamond text-xl italic text-amber-300/90 leading-relaxed">&ldquo;{post.gitaQuote.translation}&rdquo;</p>
              {post.gitaQuote.reference && (
                <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-3">— {post.gitaQuote.reference}</p>
              )}
            </div>
          </div>
        )}

        {/* Cover image (large, below hero strip) */}
        {coverUrl && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
            <div className="relative w-full h-72 md:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={coverUrl} alt={post.coverImage?.alt ?? post.title} fill className="object-cover" sizes="900px" />
            </div>
          </div>
        )}

        {/* Article body */}
        <article className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {post.body && (
              <div className="prose-like">
                <PortableText value={post.body as any[]} components={ptComponents} />
              </div>
            )}

            {/* Nav back to blog */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <Link href="/blog" className="text-amber-600 hover:underline text-sm font-medium flex items-center gap-1">
                ← Back to Blog
              </Link>
              <Link href="/donate" className="px-6 py-2 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
                Support the Mission
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer settings={settings} />
    </>
  )
}
