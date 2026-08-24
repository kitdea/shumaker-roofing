import { defineType, defineField } from 'sanity'
import { withTablePasteInput } from '../lib/table-paste'
import { richTextBlock } from '../lib/rich-text-block'

export const service = defineType({
  name: 'services',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (H1)',
      description: 'The heading shown at the top of the service page. Also used for the service cards on the homepage and /services.',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'menuTitle',
      title: 'Menu Title',
      description: 'Short label used in the Services navigation dropdown and the footer. Keep it under ~40 characters so the dropdown does not wrap. Leave empty to reuse the Page Title.',
      type: 'string',
      validation: (R) => R.max(40),
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({
      name: 'servicesContent',
      title: 'Main Content',
      type: 'array',
      components: withTablePasteInput(),
      of: [richTextBlock, { type: 'table' }],
    }),
    defineField({
      name: 'additionalContent',
      title: 'Additional Content',
      type: 'array',
      components: withTablePasteInput(),
      of: [richTextBlock, { type: 'table' }],
    }),
    defineField({ name: 'servicesImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'splitSection', title: 'Two-Column Sections', type: 'array', of: [{ type: 'reference', to: [{ type: 'splitSection' }] }] }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
  preview: {
    select: { title: 'title', menuTitle: 'menuTitle', media: 'servicesImage' },
    prepare({ title, menuTitle, media }) {
      return {
        title,
        subtitle: menuTitle?.trim() ? `Menu: ${menuTitle.trim()}` : 'Menu: same as page title',
        media,
      }
    },
  },
})
