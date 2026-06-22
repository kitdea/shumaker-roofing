import { defineType, defineField } from 'sanity'
import { withTablePasteInput } from '../lib/table-paste'

export const service = defineType({
  name: 'services',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({
      name: 'servicesContent',
      title: 'Main Content',
      type: 'array',
      components: withTablePasteInput(),
      of: [{ type: 'block' }, { type: 'table' }],
    }),
    defineField({
      name: 'additionalContent',
      title: 'Additional Content',
      type: 'array',
      components: withTablePasteInput(),
      of: [{ type: 'block' }, { type: 'table' }],
    }),
    defineField({ name: 'servicesImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'splitSection', title: 'Two-Column Sections', type: 'array', of: [{ type: 'reference', to: [{ type: 'splitSection' }] }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
