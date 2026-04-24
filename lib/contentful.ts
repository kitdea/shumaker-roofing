import { createClient } from 'contentful';
import type { ContentfulLocation } from '@/types/contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Fetch a single location by slug
export async function fetchLocation(slug: string): Promise<ContentfulLocation | null> {
  const res = await client.getEntries({
    content_type: 'location',
    'fields.slug': slug,
    'fields.isActive': true,
    include: 2,
    limit: 1,
  })

  if (!res.items.length) return null
  return res.items[0] as unknown as ContentfulLocation
}

// Fetch all active location slugs — used for generateStaticParams
export async function fetchAllLocationSlugs(): Promise<string[]> {
  const res = await client.getEntries({
    content_type: 'location',
    'fields.isActive': true,
    select: ['fields.slug'],
    limit: 200,
  })

  return res.items.map((item: any) => item.fields.slug as string)
}

// Fetch all active locations — used for hub page and sitemap
export async function fetchAllLocations(): Promise<ContentfulLocation[]> {
  const res = await client.getEntries({
    content_type: 'location',
    'fields.isActive': true,
    select: ['fields.cityName', 'fields.slug', 'fields.state', 'fields.fullLocationName'],
    order: ['fields.cityName'],
    limit: 200,
  })

  return res.items as unknown as ContentfulLocation[]
}