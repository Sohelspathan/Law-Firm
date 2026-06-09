import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Returns a typed URL string for use with next/image.
 * Applies quality 85 and auto=format for WebP support.
 */
export function sanitysImage(
  source: SanityImageSource,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  const { width = 800, height, quality = 85 } = options

  let img = builder.image(source).width(width).quality(quality).auto('format')
  if (height) img = img?.height(height)
  return img?.url()
}
export function sanityImage(
  source: SanityImageSource,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!source || !(source as any).asset?._ref) {
    return ''
  }

  const { width = 800, height, quality = 85 } = options
  let img = builder.image(source).width(width).quality(quality).auto('format')
  if (height) img = img.height(height)
  return img.url()
}
