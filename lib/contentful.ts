import { createClient } from 'contentful';
import { cache } from 'react';
import type { ContentfulLocation } from '@/types/contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

export const fetchAllServices = cache(async function fetchAllServices() {
  const res = await client.getEntries({ content_type: 'services' });
  return res.items;
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

// Fetch all active locations — used for hub page, sitemap, and generateStaticParams
export async function fetchAllLocations(): Promise<ContentfulLocation[]> {
  const res = await client.getEntries({
    content_type: 'location',
    'fields.isActive': true,
    select: ['sys.updatedAt', 'fields.cityName', 'fields.slug', 'fields.state', 'fields.fullLocationName', 'fields.isActive'],
    order: ['fields.cityName'],
    limit: 200,
  })

  return res.items as unknown as ContentfulLocation[]
}
