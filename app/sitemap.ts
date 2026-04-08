import { MetadataRoute } from 'next';
import { client } from '@/lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.shumakerroofing.com';

  // Fetch dynamic content
  let blogEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];

  try {
    const [blogsRes, servicesRes] = await Promise.all([
      client.getEntries({ content_type: 'blog' }),
      client.getEntries({ content_type: 'services' })
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blogEntries = blogsRes.items.map((item: any) => ({
      url: `${baseUrl}/news/${item.fields.slug || item.sys.id}`,
      lastModified: new Date(item.sys.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serviceEntries = servicesRes.items.map((item: any) => ({
      url: `${baseUrl}/services/${item.fields.url || item.sys.id}`,
      lastModified: new Date(item.sys.updatedAt),
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
      changeFrequency: 'yearly',
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
      url: `${baseUrl}/news`,
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
    ...serviceEntries,
    ...blogEntries
  ];
}
