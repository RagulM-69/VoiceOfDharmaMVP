import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityClient } from './client'

const builder = createImageUrlBuilder(sanityClient)

/**
 * Build optimised Sanity CDN image URLs.
 *
 * Usage:
 *   urlFor(image).width(800).url()
 *   urlFor(image).width(400).height(300).format('webp').url()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * Convenience helper — returns a plain string URL for common dimensions.
 * Falls back to '' if no source provided.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForString(
  source: any,
  width = 1200,
  quality = 80
): string {
  if (!source) return ''
  return builder.image(source).width(width).quality(quality).format('webp').url()
}
