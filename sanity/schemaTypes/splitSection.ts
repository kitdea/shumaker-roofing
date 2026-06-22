import { defineType, defineField } from 'sanity'

export const splitSection = defineType({
  name: 'splitSection',
  title: 'Split Section',
  type: 'document',
  fields: [
    defineField({ name: 'splitTitle', title: 'Title', type: 'string' }),
    defineField({ name: 'splitDescription', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'splitImage', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
})
