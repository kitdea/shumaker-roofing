import { defineType, defineField } from 'sanity'
import { withTablePasteInput } from '../lib/table-paste'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'publishedDate', title: 'Published Date', type: 'datetime' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'author', title: 'Author Name', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      components: withTablePasteInput(),
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        { type: 'table' },
      ],
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
        ],
      }],
    }),
    defineField({ name: 'splitSection', title: 'Two-Column Sections', type: 'array', of: [{ type: 'reference', to: [{ type: 'splitSection' }] }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
