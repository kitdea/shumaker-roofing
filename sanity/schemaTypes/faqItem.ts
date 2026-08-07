import { defineType, defineField } from 'sanity'
import { richTextBlock } from '../lib/rich-text-block'

/**
 * A single FAQ entry, shared by `blog` and `location`.
 *
 * `answer` is the legacy plain-text field kept so existing published FAQs keep
 * rendering. `answerContent` is the rich-text replacement and takes precedence
 * whenever it has blocks — same pattern as location's introText/introContent.
 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({
      name: 'answerContent',
      title: 'Answer',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text answer supporting internal and external links. Takes precedence over the plain answer below.',
    }),
    defineField({
      name: 'answer',
      title: 'Answer (plain, legacy)',
      type: 'text',
      rows: 4,
      description: 'Used only when the rich-text Answer above is empty.',
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})
