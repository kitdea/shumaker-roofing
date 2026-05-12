import { createClient } from 'contentful';
import { cache } from 'react';
import { toHttpsUrl } from '@/lib/utils';
import type { ContentfulLocation } from '@/types/contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

export const fetchAllServices = cache(async function fetchAllServices() {
  const res = await client.getEntries({ content_type: 'services' });
  return res.items;
});

export const fetchHeroBanner = cache(async function fetchHeroBanner() {
  const res = await client.getEntries({
    content_type: 'heroBanner',
    limit: 1,
    include: 1,
  });
  if (!res.items.length) return null;
  return res.items[0].fields as {
    heading?: string;
    subheading?: string;
    tagline?: string;
    buttonText?: string;
    buttonLink?: string;
    bodyText?: string;
    backgroundImage?: { fields: { file: { url: string } } };
  };
});

export const fetchCertificationBadges = cache(async function fetchCertificationBadges() {
  const res = await client.getEntries({
    content_type: 'certificationBadge',
    order: ['fields.displayOrder'],
    include: 1,
    limit: 50,
  });
  const badges: { id: string; name: string; logoUrl: string }[] = [];
  for (const item of res.items) {
    const f = item.fields as {
      badgeName?: string;
      logoImage?: { fields: { file: { url: string }; title?: string } };
      displayOrder?: number;
    };
    const rawUrl = f.logoImage?.fields?.file?.url;
    if (!rawUrl) continue;
    badges.push({
      id: item.sys.id,
      name: f.badgeName ?? '',
      logoUrl: toHttpsUrl(rawUrl)!,
    });
  }
  return badges;
});

export const fetchProjectSlides = cache(async function fetchProjectSlides() {
  const res = await client.getEntries({
    content_type: 'projectSlide',
    order: ['fields.displayOrder'],
    include: 1,
    limit: 20,
  });
  const slides: { id: string; src: string; alt: string; caption: string }[] = [];
  for (const item of res.items) {
    const f = item.fields as {
      title?: string;
      image?: { fields: { file: { url: string }; title?: string } };
      displayOrder?: number;
    };
    const rawUrl = f.image?.fields?.file?.url;
    if (!rawUrl) continue;
    slides.push({
      id: item.sys.id,
      src: toHttpsUrl(rawUrl)!,
      alt: f.image?.fields?.title ?? f.title ?? 'Roofing project',
      caption: f.title ?? '',
    });
  }
  return slides;
});

export const fetchJobPostings = cache(async function fetchJobPostings() {
  const res = await client.getEntries({
    content_type: 'jobPosting',
    'fields.isActive': true,
    order: ['fields.displayOrder'],
    limit: 50,
  });
  return res.items.map((item) => {
    const f = item.fields as {
      title?: string;
      department?: string;
      employmentType?: string;
      location?: string;
      description?: string;
      requirements?: string[];
      datePosted?: string;
    };
    return {
      id: item.sys.id,
      title: f.title ?? '',
      department: f.department ?? '',
      type: f.employmentType ?? 'Full-Time',
      location: f.location ?? '',
      description: f.description ?? '',
      requirements: f.requirements ?? [],
      datePosted: f.datePosted ?? new Date().toISOString().split('T')[0],
    };
  });
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
