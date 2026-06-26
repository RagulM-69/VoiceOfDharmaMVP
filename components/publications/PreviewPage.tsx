import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

interface Props {
  image: SanityImage & { alt?: string; caption?: string }
  pageNumber: number
  bookTitle: string
}

export default function PreviewPage({ image, pageNumber, bookTitle }: Props) {
  if (!image?.asset) return null

  // Full-width high-quality image — optimised for reading
  const imageUrl = urlFor(image)
    .width(1200)
    .quality(90)
    .format('webp')
    .url()

  const altText = image.alt ?? `Page ${pageNumber} of ${bookTitle} preview`

  return (
    <figure className="w-full" aria-label={altText}>
      <div className="relative w-full">
        <Image
          src={imageUrl}
          alt={altText}
          width={1200}
          height={1696} // approximated A4 ratio — actual dimensions come from Sanity
          className="w-full h-auto block"
          loading="lazy"
          sizes="(max-width: 672px) 100vw, 672px"
          style={{ display: 'block' }}
        />
      </div>
      {image.caption && (
        <figcaption className="text-center text-xs text-gray-400 py-1">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}
