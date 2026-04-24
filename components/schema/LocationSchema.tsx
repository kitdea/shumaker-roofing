import type { ContentfulFaqItem } from '@/types/contentful'

interface LocationSchemaProps {
  name: string
  description: string
  url: string
  phone: string
  cityName: string
  state: string
  latitude?: number
  longitude?: number
  avgRating?: string | null
  reviewCount?: number
  faqItems?: ContentfulFaqItem[]
}

export function LocationSchema({
  name,
  description,
  url,
  phone,
  cityName,
  state,
  latitude,
  longitude,
  avgRating,
  reviewCount,
  faqItems,
}: LocationSchemaProps) {

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name,
    description,
    url,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: state,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: state,
      },
    },
    ...(latitude && longitude
      ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude,
          longitude,
        },
      }
      : {}),
    ...(avgRating && reviewCount && reviewCount > 0
      ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating,
          reviewCount,
          bestRating: '5',
          worstRating: '1',
        },
      }
      : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roof Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roof Replacement' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gutter Installation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Emergency Roof Repair' } },
      ],
    },
  }

  const faqSchema =
    faqItems && faqItems.length > 0
      ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.fields.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.fields.answer,
          },
        })),
      }
      : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.shumakerroofing.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: 'https://www.shumakerroofing.com/service-areas/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${cityName}, ${state}`,
        item: url,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}