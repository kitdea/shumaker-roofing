import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Members',
  type: 'document',
  fields: [
    defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
    defineField({ name: 'jobPosition', title: 'Job Position', type: 'string' }),
    defineField({ name: 'teamThumbnail', title: 'Photo', type: 'image' }),
    defineField({ name: 'teamInfo', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'socialMedia', title: 'Social Media URL', type: 'url' }),
    defineField({ name: 'phoneNumber', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'salesmanTag', title: 'Salesman Tag', type: 'string' }),
    defineField({ name: 'retired', title: 'Retired', type: 'boolean', initialValue: false }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
})
