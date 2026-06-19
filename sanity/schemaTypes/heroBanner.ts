import { defineType, defineField } from 'sanity'

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'bodyText', title: 'Body Text', type: 'text', rows: 3 }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string' }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
  ],
})
