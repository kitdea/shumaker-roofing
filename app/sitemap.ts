import { MetadataRoute } from 'next';
import { client, fetchAllLocations } from '@/lib/contentful';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.shumakerroofing.com';

  // Fetch dynamic content
  let blogEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];
  let locationUrls: MetadataRoute.Sitemap = [];

  try {
    const [blogsRes, servicesRes, locations] = await Promise.all([
      client.getEntries({ content_type: 'blog' }),
      client.getEntries({ content_type: 'services' }),
      fetchAllLocations(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blogEntries = blogsRes.items.map((item: any) => ({
      url: `${baseUrl}/blog/${item.fields.title ? slugify(item.fields.title as string) : item.sys.id}`,
      lastModified: new Date(item.sys.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serviceEntries = servicesRes.items.map((item: any) => ({
      url: `${baseUrl}/services/${item.fields.title ? slugify(item.fields.title as string) : item.sys.id}`,
      lastModified: new Date(item.sys.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locationUrls = locations.map((loc: any) => ({
      url: `${baseUrl}/service-areas/${loc.fields.slug}/`,
      lastModified: new Date(loc.sys.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic entries for sitemap:", error);
  }

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/service-areas/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...serviceEntries,
    ...blogEntries,
    ...locationUrls,
  ];
}
