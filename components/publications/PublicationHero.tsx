import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { Publication } from '@/lib/sanity/types'
import PurchasePlatforms from './PurchasePlatforms'

interface Props {
  publication: Publication
}

function Badge({ pub }: { pub: Publication }) {
  if (pub.isComingSoon) {
    return (
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
        🕐 Coming Soon
      </span>
    )
  }
  if (pub.isFeatured) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
      >
        ⭐ Featured Publication
      </span>
    )
  }
  return null
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  )
}

export default function PublicationHero({ publication }: Props) {
  const coverUrl = publication.coverImage
    ? urlFor(publication.coverImage).width(800).height(1100).format('webp').url()
    : null

  const formattedDate = publication.publicationDate
    ? new Date(publication.publicationDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
      })
    : null

  return (
    <section className="py-12 md:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* ── Left: Cover Image ── */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <div
              className="relative mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{ width: 'min(320px, 100%)', aspectRatio: '0.72' }}
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={publication.coverImage?.alt ?? publication.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 320px, 320px"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0A1F44, #1a3a6e)' }}
                >
                  <span className="text-8xl select-none">📚</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Book Info ── */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className="mb-4">
              <Badge pub={publication} />
            </div>

            {/* Category */}
            {publication.category && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200">
                  {publication.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-garamond text-4xl md:text-5xl font-semibold text-gray-900 mb-2 leading-tight">
              {publication.title}
            </h1>

            {/* Subtitle */}
            {publication.subtitle && (
              <p className="font-garamond text-xl text-gray-500 mb-4 italic">
                {publication.subtitle}
              </p>
            )}

            {/* Author */}
            <p className="text-amber-700 font-semibold text-lg mb-6">
              by {publication.author}
            </p>

            {/* Quick specs */}
            <div className="space-y-2 mb-8 p-5 rounded-xl bg-gray-50 border border-gray-100">
              {publication.language    && <SpecRow label="Language"    value={publication.language} />}
              {publication.publisher   && <SpecRow label="Publisher"   value={publication.publisher} />}
              {formattedDate           && <SpecRow label="Published"   value={formattedDate} />}
              {publication.edition     && <SpecRow label="Edition"     value={publication.edition} />}
              {publication.isbn        && <SpecRow label="ISBN"        value={publication.isbn} />}
              {publication.totalPages  && <SpecRow label="Pages"       value={`${publication.totalPages} pages`} />}
              {publication.bookFormat  && <SpecRow label="Format"      value={publication.bookFormat} />}
            </div>

            {/* Purchase Platforms */}
            {publication.purchasePlatforms && publication.purchasePlatforms.length > 0 && (
              <div className="mb-6">
                <PurchasePlatforms
                  platforms={publication.purchasePlatforms}
                  isComingSoon={publication.isComingSoon}
                />
              </div>
            )}

            {/* Back button */}
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
            >
              ← Back to Publications
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
