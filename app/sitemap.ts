import { MetadataRoute } from 'next';
import { fetchAllBlogPosts, fetchServiceSlugs, fetchAllLocations, fetchAllAuthors } from '@/lib/sanity';
import { SITE_URL } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Fetch dynamic content
  let blogEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];
  let locationUrls: MetadataRoute.Sitemap = [];
  let authorEntries: MetadataRoute.Sitemap = [];

  try {
    const [blogs, services, locations, authors] = await Promise.all([
      fetchAllBlogPosts(),
      fetchServiceSlugs(),
      fetchAllLocations(),
      fetchAllAuthors(),
    ]);

    blogEntries = blogs.map((item) => ({
      url: `${baseUrl}/blog/${item.slug?.current ?? item._id}`,
      lastModified: new Date(item._updatedAt ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    authorEntries = authors
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${baseUrl}/blog/author/${a.slug}`,
        lastModified: new Date(a._updatedAt ?? Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      }));

    serviceEntries = services.map((item) => ({
      url: `${baseUrl}/services/${item.slug?.current ?? item._id}`,
      lastModified: new Date(item._updatedAt ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    locationUrls = locations.map((loc) => ({
      url: `${baseUrl}/service-areas/${loc.slug}/`,
      lastModified: new Date(loc._updatedAt ?? Date.now()),
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
      url: `${baseUrl}/book-appointment`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service-areas/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/roofs-for-heroes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...serviceEntries,
    ...blogEntries,
    ...authorEntries,
    ...locationUrls,
  ];
}
