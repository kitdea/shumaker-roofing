export interface ContentfulService {
  sys: { id: string }
  fields: {
    title: string
    slug: string
    shortDescription: string
  }
}

export interface ContentfulTestimonial {
  sys: { id: string }
  fields: {
    customerName: string
    quote: string
    rating: number
    reviewDate?: string
    source?: string
  }
}

export interface ContentfulFaqItem {
  sys: { id: string }
  fields: {
    question: string
    answer: string
    isGeneral?: boolean
  }
}

export interface ContentfulTwoColumnSection {
  sys: { id: string }
  fields: {
    splitTitle?: string
    splitDescription?: any
    splitImage?: Array<{
      fields: {
        title?: string
        file: { url: string; details?: { image?: { width: number; height: number } } }
      }
    }>
  }
}

export interface ContentfulLocation {
  sys: { id: string }
  fields: {
    cityName: string
    slug: string
    state: string
    fullLocationName: string
    seoTitle: string
    metaDescription: string
    heroHeadline: string
    introText: any
    twoColumn?: ContentfulTwoColumnSection[]
    servicesOffered: ContentfulService[]
    localTestimonials?: ContentfulTestimonial[]
    faqItems?: ContentfulFaqItem[]
    phoneNumber?: string
    latitude?: number
    longitude?: number
    isActive: boolean
  }
}