import type { SanityImageSource } from '@sanity/image-url'
import { urlFor as buildImage } from '@/sanity/lib/image'

export function urlFor(source: SanityImageSource | null | undefined): string | undefined {
  if (!source) return undefined
  return buildImage(source).auto('format').fit('max').url()
}
