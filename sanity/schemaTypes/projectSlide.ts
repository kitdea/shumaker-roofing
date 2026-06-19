import { defineType, defineField } from 'sanity'

export const projectSlide = defineType({
  name: 'projectSlide',
  title: 'Project Slides',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
})
