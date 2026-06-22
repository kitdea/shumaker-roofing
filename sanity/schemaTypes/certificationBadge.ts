import { defineType, defineField } from 'sanity'

export const certificationBadge = defineType({
  name: 'certificationBadge',
  title: 'Certification Badges',
  type: 'document',
  fields: [
    defineField({ name: 'badgeName', title: 'Badge Name', type: 'string' }),
    defineField({ name: 'logoImage', title: 'Logo Image', type: 'image' }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
})
