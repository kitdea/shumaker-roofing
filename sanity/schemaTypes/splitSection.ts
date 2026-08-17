import { defineType, defineField } from 'sanity'
import { richTextBlock } from '../lib/rich-text-block'

/**
 * `splitDescription` is the legacy plain-text field kept so existing sections
 * keep rendering. `splitDescriptionContent` is the rich-text replacement and
 * takes precedence whenever it has blocks — same pattern as faqItem's answer/
 * answerContent.
 */
export const splitSection = defineType({
  name: 'splitSection',
  title: 'Split Section',
  type: 'document',
  fields: [
    defineField({ name: 'splitTitle', title: 'Title', type: 'string' }),
    defineField({
      name: 'splitDescriptionContent',
      title: 'Description',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text description supporting internal and external links. Takes precedence over the plain description below.',
    }),
    defineField({
      name: 'splitDescription',
      title: 'Description (plain, legacy)',
      type: 'text',
      rows: 4,
      description: 'Used only when the rich-text Description above is empty.',
    }),
    defineField({ name: 'splitImage', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
})
