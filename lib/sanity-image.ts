import type { SanityImageSource } from '@sanity/image-url'
import { urlFor as buildImage } from '@/sanity/lib/image'

export function urlFor(source: unknown): string | undefined {
  if (!source) return undefined
  return buildImage(source as SanityImageSource).auto('format').fit('max').url()
}
