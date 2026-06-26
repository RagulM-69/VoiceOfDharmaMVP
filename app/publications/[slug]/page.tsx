import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { SITE_URL } from '@/lib/seo/config'
import {
  getPublicationBySlug,
  getAllPublicationSlugs,
  getSiteSettings,
} from '@/lib/sanity/queries'
import { urlForString } from '@/lib/sanity/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionWrapper from '@/components/public/SectionWrapper'
import PublicationHero from '@/components/publications/PublicationHero'
import PublicationSpecs from '@/components/publications/PublicationSpecs'
import PreviewReader from '@/components/publications/PreviewReader'
import RelatedPublications from '@/components/publications/RelatedPublications'
import ShareButtons from '@/components/publications/ShareButtons'
import PublicationBreadcrumb from '@/components/publications/PublicationBreadcrumb'
import { BookSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import type { PublicationListItem } from '@/lib/sanity/types'

export const revalidate = 60

// Allow slugs created after build to resolve via ISR
export const dynamicParams = true

// ── Static params ──────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPublicationSlugs()
  return slugs.map((s) => ({ slug: s.slug.current }))
}

// ── Dynamic metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const publication = await getPublicationBySlug(params.slug)
  if (!publication) return { title: 'Publication Not Found' }

  const ogImageUrl = publication.seo?.ogImage
    ? urlForString(publication.seo.ogImage, 1200, 80)
    : publication.coverImage
    ? urlForString(publication.coverImage, 1200, 80)
    : `${SITE_URL}/images/og-default.png`

  const title =
    publication.seo?.metaTitle ??
    `${publication.title} by ${publication.author} — Voice of Dharma Foundation`

  const description =
    publication.seo?.metaDescription ??
    publication.shortDescription ??
    publication.tagline ??
    `Read ${publication.title} by ${publication.author} — a dharmic publication from the Voice of Dharma Foundation.`

  const canonical =
    publication.seo?.canonicalUrl ?? `/publications/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/publications/${params.slug}`,
      type: 'book',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: publication.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

// ── Portable Text components ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ptComponents: any = {
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="font-garamond text-3xl font-semibold text-krishna-blue mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="font-garamond text-2xl font-semibold text-krishna-blue mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="pl-6 py-2 my-6 border-l-4 border-amber-400/60">
        <p className="font-garamond text-xl italic text-gray-600 leading-relaxed">{children}</p>
      </blockquote>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 text-lg leading-relaxed mb-5">{children}</p>
    ),
  },
  marks: {
    link: ({ value, children }: { value: { href: string; blank?: boolean }; children: React.ReactNode }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="text-amber-600 hover:underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
  },
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function PublicationDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const [publication, settings] = await Promise.all([
    getPublicationBySlug(params.slug),
    getSiteSettings(),
  ])

  if (!publication) notFound()

  // Compute specs for the table
  const formattedDate = publication.publicationDate
    ? new Date(publication.publicationDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  const specs = [
    { label: 'Author',       value: publication.author },
    { label: 'Publisher',    value: publication.publisher },
    { label: 'Language',     value: publication.language },
    { label: 'Published',    value: formattedDate },
    { label: 'Edition',      value: publication.edition },
    { label: 'ISBN',         value: publication.isbn },
    { label: 'Pages',        value: publication.totalPages ? `${publication.totalPages} pages` : undefined },
    { label: 'Category',     value: publication.category },
    { label: 'Format',       value: publication.bookFormat },
    { label: 'Reading Time', value: publication.readingTime },
  ]

  const coverUrl = publication.coverImage
    ? urlForString(publication.coverImage, 800, 85)
    : undefined

  const pageUrl = `${SITE_URL}/publications/${params.slug}`

  const hasPreview =
    publication.preview?.enablePreview &&
    (publication.preview.previewImages?.length ?? 0) > 0

  const hasPurchasePlatforms =
    (publication.purchasePlatforms?.filter((p) => p.enabled !== false).length ?? 0) > 0

  const hasRelated = (publication.relatedPublications?.length ?? 0) > 0

  return (
    <>
      {/* ── Structured Data ── */}
      <BookSchema
        title={publication.title}
        author={publication.author}
        description={publication.shortDescription ?? publication.tagline}
        slug={params.slug}
        imageUrl={coverUrl}
        isbn={publication.isbn}
        publisher={publication.publisher}
        numberOfPages={publication.totalPages}
        inLanguage={publication.language}
        datePublished={publication.publicationDate}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Publications', url: '/publications' },
          { name: publication.title, url: `/publications/${params.slug}` },
        ]}
      />

      <Navbar />

      <main>
        {/* ── Visual Breadcrumb ── */}
        <PublicationBreadcrumb bookTitle={publication.title} />

        {/* ── Hero: Cover + Meta + Purchase ── */}
        <PublicationHero publication={publication} />

        {/* ── About the Book ── */}
        {(publication.shortDescription || publication.fullDescription) && (
          <section className="py-14 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="flex items-center gap-3 mb-6">
                  <div className="section-divider" />
                  <h2 className="font-garamond text-2xl font-semibold text-gray-800">
                    About the Book
                  </h2>
                </div>

                {publication.shortDescription && (
                  <p className="font-garamond text-xl text-gray-700 leading-relaxed mb-6 italic">
                    {publication.shortDescription}
                  </p>
                )}

                {publication.fullDescription && (
                  <div className="prose-like">
                    <PortableText
                      value={publication.fullDescription as Parameters<typeof PortableText>[0]['value']}
                      components={ptComponents}
                    />
                  </div>
                )}
              </SectionWrapper>
            </div>
          </section>
        )}

        {/* ── Purpose & Who Should Read ── */}
        {(publication.purpose || publication.whoShouldRead) && (
          <section className="py-12 bg-amber-50/50 border-t border-amber-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {publication.purpose && (
                  <SectionWrapper>
                    <h2 className="font-garamond text-2xl font-semibold text-gray-800 mb-4">
                      Purpose of This Book
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{publication.purpose}</p>
                  </SectionWrapper>
                )}
                {publication.whoShouldRead && (
                  <SectionWrapper delay={0.1}>
                    <h2 className="font-garamond text-2xl font-semibold text-gray-800 mb-4">
                      Who Should Read This
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{publication.whoShouldRead}</p>
                  </SectionWrapper>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Book Specifications Table ── */}
        <PublicationSpecs specs={specs} />

        {/* ── Preview Reader (manga/webtoon scroll) ── */}
        {hasPreview && publication.preview && (
          <PreviewReader
            previewData={publication.preview}
            platforms={publication.purchasePlatforms}
            bookTitle={publication.title}
          />
        )}

        {/* ── Share Buttons ── */}
        <ShareButtons url={pageUrl} title={publication.title} />

        {/* ── Purchase CTA (if no preview was shown) ── */}
        {!hasPreview && hasPurchasePlatforms && (
          <section
            className="py-14 text-center border-t border-gray-100"
            style={{ background: '#0A1F44' }}
          >
            <SectionWrapper>
              <div className="text-amber-400/40 text-4xl mb-4 font-garamond">॥</div>
              <h2 className="font-garamond text-3xl text-white mb-3">
                Get Your Copy
              </h2>
              <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
                Purchase {publication.title} and begin your journey into dharmic wisdom.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {publication.purchasePlatforms
                  ?.filter((p) => p.enabled !== false)
                  .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))
                  .map((platform) => (
                    <a
                      key={platform._key}
                      href={platform.purchaseUrl}
                      target={platform.openInNewTab ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
                    >
                      {platform.buttonText}
                    </a>
                  ))}
              </div>
            </SectionWrapper>
          </section>
        )}

        {/* ── Related Publications ── */}
        {hasRelated && (
          <RelatedPublications
            publications={publication.relatedPublications as PublicationListItem[]}
          />
        )}
      </main>

      <Footer settings={settings} />
    </>
  )
}
