import { defineType, defineField } from 'sanity'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO Metadata',
  type: 'object',
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image' }),
    defineField({ name: 'noindex', title: 'No Index', type: 'boolean', initialValue: false }),
    defineField({ name: 'nofollow', title: 'No Follow', type: 'boolean', initialValue: false }),
  ],
})
