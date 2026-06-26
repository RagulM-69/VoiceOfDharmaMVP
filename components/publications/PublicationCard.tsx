import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { PublicationListItem } from '@/lib/sanity/types'

interface Props {
  publication: PublicationListItem
}

function Badge({ type }: { type: 'featured' | 'new' | 'coming-soon' }) {
  if (type === 'featured') {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
      >
        ⭐ Featured
      </span>
    )
  }
  if (type === 'coming-soon') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        🕐 Coming Soon
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      ✨ New
    </span>
  )
}

export default function PublicationCard({ publication }: Props) {
  const imageSource = publication.thumbnail ?? publication.coverImage
  const imageUrl = imageSource
    ? urlFor(imageSource).width(600).height(800).format('webp').url()
    : null

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Cover image */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '140%' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageSource?.alt ?? publication.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A1F44, #1a3a6e)' }}
          >
            <span className="text-6xl select-none">📚</span>
          </div>
        )}

        {/* Badge overlay */}
        {(publication.isComingSoon || publication.isFeatured) && (
          <div className="absolute top-3 left-3 z-10">
            {publication.isComingSoon ? (
              <Badge type="coming-soon" />
            ) : (
              <Badge type="featured" />
            )}
          </div>
        )}

        {/* Gradient overlay at bottom for readability */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-garamond text-xl font-semibold text-gray-800 mb-1 leading-tight group-hover:text-amber-600 transition-colors">
          {publication.title}
        </h2>

        <p className="text-sm text-amber-700 font-medium mb-2">by {publication.author}</p>

        {publication.tagline && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {publication.tagline}
          </p>
        )}

        {!publication.tagline && <div className="flex-1" />}

        <Link
          href={`/publications/${publication.slug.current}`}
          className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)', color: 'white' }}
          aria-label={`View details for ${publication.title}`}
        >
          View Details →
        </Link>
      </div>
    </article>
  )
}
