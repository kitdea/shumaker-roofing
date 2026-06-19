import { cache } from 'react'
import { client as sanityClient } from '@/sanity/lib/client'
import { urlFor } from '@/lib/sanity-image'

const splitSectionsProjection = `"splitSections": splitSection[]->{
      _id,
      splitTitle,
      splitDescription,
      splitImage
    }`

// ─── Services ─────────────────────────────────────────────────────────────────

export const fetchAllServices = cache(async function fetchAllServices() {
  return sanityClient.fetch(`*[_type == "services"] | order(_createdAt asc)`)
})

export const fetchServicesForListing = cache(async function fetchServicesForListing() {
  return sanityClient.fetch(`*[_type == "services"]{
    _id,
    _updatedAt,
    title,
    slug,
    "excerpt": servicesContent[0].children[0].text
  } | order(title asc)`)
})

export const fetchServiceBySlug = cache(async function fetchServiceBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "services" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    servicesContent,
    additionalContent,
    servicesImage,
    ${splitSectionsProjection},
    seo
  }`, { slug })
})

// ─── Hero Banner ──────────────────────────────────────────────────────────────
// Shape matches lib/contentful.ts fetchHeroBanner() so page code doesn't need to change.

export const fetchHeroBanner = cache(async function fetchHeroBanner() {
  const banner = await sanityClient.fetch(`*[_type == "heroBanner"][0]{
    heading,
    subheading,
    tagline,
    bodyText,
    buttonText,
    buttonLink,
    backgroundImage
  }`)
  if (!banner) return null
  return {
    heading: banner.heading as string | undefined,
    subheading: banner.subheading as string | undefined,
    tagline: banner.tagline as string | undefined,
    bodyText: banner.bodyText as string | undefined,
    buttonText: banner.buttonText as string | undefined,
    buttonLink: banner.buttonLink as string | undefined,
    backgroundImageUrl: urlFor(banner.backgroundImage),
  }
})

// ─── Certification Badges ─────────────────────────────────────────────────────
// Shape matches lib/contentful.ts fetchCertificationBadges(): { id, name, logoUrl }[]

export const fetchCertificationBadges = cache(async function fetchCertificationBadges() {
  const badges = await sanityClient.fetch(`*[_type == "certificationBadge"] | order(displayOrder asc){
    _id,
    badgeName,
    logoImage,
    displayOrder
  }`)
  return (badges as Array<{ _id: string; badgeName?: string; logoImage?: unknown }>)
    .map((b) => {
      const logoUrl = urlFor(b.logoImage as never)
      if (!logoUrl) return null
      return { id: b._id, name: b.badgeName ?? '', logoUrl }
    })
    .filter((b): b is { id: string; name: string; logoUrl: string } => b !== null)
})

// ─── Project Slides ───────────────────────────────────────────────────────────
// Shape matches lib/contentful.ts fetchProjectSlides(): { id, src, alt, caption }[]

export const fetchProjectSlides = cache(async function fetchProjectSlides() {
  const slides = await sanityClient.fetch(`*[_type == "projectSlide"] | order(displayOrder asc){
    _id,
    title,
    image,
    displayOrder
  }`)
  return (slides as Array<{ _id: string; title?: string; image?: unknown }>)
    .map((s) => {
      const src = urlFor(s.image as never)
      if (!src) return null
      return { id: s._id, src, alt: s.title ?? 'Roofing project', caption: s.title ?? '' }
    })
    .filter((s): s is { id: string; src: string; alt: string; caption: string } => s !== null)
})

// ─── Job Postings ─────────────────────────────────────────────────────────────
// Shape matches lib/contentful.ts fetchJobPostings()

export const fetchJobPostings = cache(async function fetchJobPostings() {
  const postings = await sanityClient.fetch(`*[_type == "jobPosting" && isActive == true] | order(datePosted desc){
    _id,
    title,
    department,
    employmentType,
    location,
    description,
    requirements,
    datePosted
  }`)
  return (postings as Array<{
    _id: string
    title?: string
    department?: string
    employmentType?: string
    location?: string
    description?: string
    requirements?: string[]
    datePosted?: string
  }>).map((p) => ({
    id: p._id,
    title: p.title ?? '',
    department: p.department ?? '',
    type: p.employmentType ?? 'Full-Time',
    location: p.location ?? '',
    description: p.description ?? '',
    requirements: p.requirements ?? [],
    datePosted: p.datePosted ?? new Date().toISOString().split('T')[0],
  }))
})

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const fetchAllBlogPosts = cache(async function fetchAllBlogPosts() {
  return sanityClient.fetch(`*[_type == "blog"] | order(publishedDate desc){
    _id,
    title,
    slug,
    publishedDate,
    featuredImage,
    categories,
    author,
    excerpt
  }`)
})

export const fetchBlogPostBySlug = cache(async function fetchBlogPostBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "blog" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    slug,
    publishedDate,
    featuredImage,
    categories,
    author,
    excerpt,
    content,
    faqItems,
    ${splitSectionsProjection},
    seo
  }`, { slug })
})

export const fetchAllBlogSlugs = cache(async function fetchAllBlogSlugs() {
  return sanityClient.fetch(`*[_type == "blog"]{ "slug": slug.current }`)
})

// ─── Locations (Service Areas) ────────────────────────────────────────────────
// Shape matches lib/contentful.ts fetchAllLocations() / fetchLocation()

export const fetchAllLocations = cache(async function fetchAllLocations() {
  return sanityClient.fetch(`*[_type == "location" && isActive == true]{
    _id,
    _updatedAt,
    cityName,
    "slug": slug.current,
    state,
    fullLocationName,
    isActive
  } | order(cityName asc)`)
})

export const fetchLocationBySlug = cache(async function fetchLocationBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "location" && slug.current == $slug][0]{
    _id,
    cityName,
    "slug": slug.current,
    state,
    fullLocationName,
    isActive,
    heroHeadline,
    introText,
    servicesOffered,
    faqItems,
    phoneNumber,
    latitude,
    longitude,
    seo
  }`, { slug })
})
