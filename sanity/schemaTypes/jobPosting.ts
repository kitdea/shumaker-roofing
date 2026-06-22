import { defineType, defineField } from 'sanity'

export const jobPosting = defineType({
  name: 'jobPosting',
  title: 'Job Postings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Job Title', type: 'string' }),
    defineField({ name: 'department', title: 'Department', type: 'string' }),
    defineField({ name: 'employmentType', title: 'Employment Type', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
    defineField({ name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'datePosted', title: 'Date Posted', type: 'date' }),
    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
  ],
})
