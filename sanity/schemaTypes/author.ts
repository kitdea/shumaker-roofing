import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'e.g. "Owner & Master Roofer" — used as schema.org jobTitle.',
    }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Used on cards and as the schema.org Person description.',
      validation: (R) => R.max(300),
    }),
    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full biography shown on the author archive page.',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'string',
      description: 'e.g. "GAF Master Elite Certified, 20+ years experience".',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Topics this author is an authority on — emitted as schema.org knowsAbout.',
    }),
    defineField({
      name: 'sameAs',
      title: 'Profile / Social Links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'LinkedIn, X, Facebook, Google profile, etc. Emitted as schema.org sameAs (key for E-E-A-T).',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'jobTitle', media: 'photo' },
  },
})
