import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shumaker Roofing')
    .items([
      S.documentTypeListItem('services').title('Services'),
      S.documentTypeListItem('blog').title('Blog Posts'),
      S.documentTypeListItem('location').title('Service Areas'),
      S.divider(),
      S.documentTypeListItem('heroBanner').title('Hero Banner'),
      S.documentTypeListItem('splitSection').title('Split Sections'),
      S.documentTypeListItem('certificationBadge').title('Certification Badges'),
      S.documentTypeListItem('projectSlide').title('Project Slides'),
      S.documentTypeListItem('jobPosting').title('Job Postings'),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            'services',
            'blog',
            'location',
            'heroBanner',
            'splitSection',
            'certificationBadge',
            'projectSlide',
            'jobPosting',
            'teamMember',
          ].includes(item.getId()!),
      ),
    ])
