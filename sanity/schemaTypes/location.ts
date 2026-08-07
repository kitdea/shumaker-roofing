import { defineType, defineField } from 'sanity'
import { richTextBlock } from '../lib/rich-text-block'

export const location = defineType({
  name: 'location',
  title: 'Locations',
  type: 'document',
  fields: [
    defineField({ name: 'cityName', title: 'City Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'cityName', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'state', title: 'State', type: 'string' }),
    defineField({ name: 'fullLocationName', title: 'Full Location Name', type: 'string' }),
    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({
      name: 'introText',
      title: 'Intro Text (plain, legacy)',
      type: 'text',
      rows: 4,
      description: 'Used only when "Intro Content" below is empty. Add rich text there to use links.',
    }),
    defineField({
      name: 'introContent',
      title: 'Intro Content',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text intro supporting internal and external links. Takes precedence over the plain Intro Text above.',
    }),
    defineField({ name: 'servicesOffered', title: 'Services Offered', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
    defineField({ name: 'phoneNumber', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
    defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
