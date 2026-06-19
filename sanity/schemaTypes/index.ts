import { type SchemaTypeDefinition } from 'sanity'

import { seoMetadata } from './seoMetadata'
import { splitSection } from './splitSection'
import { service } from './service'
import { blog } from './blog'
import { location } from './location'
import { heroBanner } from './heroBanner'
import { certificationBadge } from './certificationBadge'
import { projectSlide } from './projectSlide'
import { jobPosting } from './jobPosting'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    seoMetadata,
    splitSection,
    service,
    blog,
    location,
    heroBanner,
    certificationBadge,
    projectSlide,
    jobPosting,
  ],
}
