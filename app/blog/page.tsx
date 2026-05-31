import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/config'
import { getBlogPosts, getBlogPage, getSiteSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/sanity/types'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'


export const revalidate = 60 // New blog posts appear within 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const blogPageData = await getBlogPage().catch(() => null)
  const title = blogPageData?.seo?.metaTitle ?? 'Blog — Voice of Dharma Foundation'
  const description = blogPageData?.seo?.metaDescription ?? 'Reflections on dharma, Bhagavad Gita, and conscious living from the Voice of Dharma Foundation.'
  return {
    title,
    description,
    alternates: { canonical: '/blog' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog`,
      type: 'website',
      images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: 'Voice of Dharma Foundation Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  'bhagavad-gita':  '📖 Bhagavad Gita',
  'karma-yoga':     '🌱 Karma Yoga',
  'bhakti':         '🪔 Bhakti & Devotion',
  'gyan':           '✨ Gyaan & Wisdom',
  'dharmic-living': '🕉️ Dharmic Living',
  'self-awareness': '🧘 Self-Awareness',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function BlogCard({ post }: { post: BlogPost }) {
  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(700).height(400).format('webp').url()
    : null

  return (
    <Link href={`/blog/${post.slug.current}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {imageUrl && (
        <div className="relative w-full h-52 overflow-hidden">
          <Image src={imageUrl} alt={post.coverImage?.alt ?? post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 500px" />
          {post.isFeatured && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
              ⭐ Featured
            </div>
          )}
          {post.category && (
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white bg-black/50 backdrop-blur-sm">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h2 className="font-garamond text-xl font-semibold text-gray-800 mb-2 leading-snug group-hover:text-amber-600 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="text-amber-600 font-medium group-hover:underline">Read more →</span>
        </div>
      </div>
    </Link>
  )
}

function EmptyBlog() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">✍️</div>
      <h2 className="font-garamond text-3xl text-gray-700 mb-4">Blog Coming Soon</h2>
      <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
        Reflections on the Bhagavad Gita, dharmic living, and conscious awareness are being prepared. Stay tuned.
      </p>
      <Link href="/donate" className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}>
        Support the Mission
      </Link>
    </div>
  )
}

export default async function BlogPage() {
  const [posts, blogPageData, settings] = await Promise.all([
    getBlogPosts(24).catch(() => [] as BlogPost[]),
    getBlogPage().catch(() => null),
    getSiteSettings(),
  ])

  const heroTitle    = blogPageData?.heroTitle    ?? 'Blog'
  const heroSubtitle = blogPageData?.heroSubtitle ?? 'Reflections on dharma, consciousness, and the path within'
  const quoteText    = blogPageData?.pageQuote?.text      ?? 'J\u00f1\u0101na\u1e43 vij\u00f1\u0101nam \u0101stikyam brahma karma svabh\u0101vajam'
  const quoteRef     = blogPageData?.pageQuote?.reference ?? 'Bhagavad Gita 18.42'

  const featured = posts.filter((p) => p.isFeatured)
  const regular  = posts.filter((p) => !p.isFeatured)

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image src="/images/blog-hero.png" alt="Blog — Voice of Dharma Foundation" fill className="object-cover opacity-20" priority sizes="100vw" />
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

        {/* Gita Quote Banner */}
        <div className="py-10 border-y border-amber-400/20" style={{ background: 'rgba(10,31,68,0.97)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-garamond text-xl md:text-2xl italic text-amber-300/90 leading-relaxed">
              &ldquo;{quoteText}&rdquo;
            </p>
            <p className="text-amber-500/50 text-xs tracking-widest uppercase mt-3">— {quoteRef}</p>
          </div>
        </div>

        {/* Blog Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <EmptyBlog />
            ) : (
              <div className="space-y-12">
                {/* Featured Posts */}
                {featured.length > 0 && (
                  <div>
                    <h2 className="font-garamond text-2xl text-gray-800 mb-6 pb-2 border-b border-gray-200">
                      ⭐ Featured Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featured.map((post) => (
                        <SectionWrapper key={post._id} delay={0.05}>
                          <BlogCard post={post} />
                        </SectionWrapper>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Posts */}
                {regular.length > 0 && (
                  <div>
                    {featured.length > 0 && (
                      <h2 className="font-garamond text-2xl text-gray-800 mb-6 pb-2 border-b border-gray-200">
                        All Articles
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regular.map((post, i) => (
                        <SectionWrapper key={post._id} delay={i * 0.05}>
                          <BlogCard post={post} />
                        </SectionWrapper>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        {posts.length > 0 && (
          <section className="py-16 text-center" style={{ background: '#0A1F44' }}>
            <SectionWrapper>
              <div className="text-amber-400/40 text-4xl mb-4 font-garamond">॥</div>
              <h2 className="font-garamond text-3xl text-white mb-3">Walk the Path with Us</h2>
              <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
                Support the foundation that brings dharmic wisdom to the world.
              </p>
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
