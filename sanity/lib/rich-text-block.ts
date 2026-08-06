import { defineArrayMember } from 'sanity'

/**
 * Portable Text block with link annotations enabled:
 *  - `link` — external URLs, plus relative paths like `/services/roof-repair`
 *  - `internalLink` — reference to another document; the href is resolved at query time
 */
export const richTextBlock = defineArrayMember({
  type: 'block',
  marks: {
    annotations: [
      {
        name: 'link',
        title: 'URL',
        type: 'object',
        fields: [
          {
            name: 'href',
            title: 'URL',
            type: 'url',
            description: 'External URL (https://…), a relative path (/services/roof-repair), mailto: or tel:',
            validation: (R: any) =>
              R.uri({
                allowRelative: true,
                scheme: ['http', 'https', 'mailto', 'tel'],
              }),
          },
        ],
      },
      {
        name: 'internalLink',
        title: 'Internal Link',
        type: 'object',
        fields: [
          {
            name: 'reference',
            title: 'Page',
            type: 'reference',
            to: [{ type: 'services' }, { type: 'blog' }, { type: 'location' }],
            validation: (R: any) => R.required(),
          },
        ],
      },
    ],
  },
})
