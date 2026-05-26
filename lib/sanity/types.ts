/**
 * TypeScript types for all Sanity document shapes consumed by the frontend.
 * These mirror the schemaTypes defined in vod-cms/.
 */

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; width: number; height: number }
  alt?: string
  caption?: string
}

export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

export interface GitaQuote {
  sanskrit?: string
  translation?: string
  reference?: string
}

// ── Site Settings ─────────────────────────────────────────────────────────────
export interface SiteSettings {
  _id: string
  siteName: string
  tagline: string
  email?: string
  phone?: string
  address?: string
  registrationNumber?: string
  pan?: string
  socialLinks?: {
    youtube?: string
    instagram?: string
    facebook?: string
    whatsapp?: string
    twitter?: string
    linkedin?: string
    telegram?: string
  }
  seo?: SeoFields
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export interface HomePage {
  _id: string
  heroGitaQuote?: string
  heroGitaQuoteRef?: string
  aboutHeading?: string
  aboutBody?: string
  mission?: string
  whyDharma?: string
  whyVOD?: string
  supportHeading?: string
  supportBody?: string
  connectHeading?: string
  connectBody?: string
  seo?: SeoFields
}

// ── Hero Slide ────────────────────────────────────────────────────────────────
export interface HeroSlide {
  _id: string
  title: string
  subtitle?: string
  body?: string
  ctaText?: string
  ctaHref?: string
  backgroundImage?: SanityImage
  pillar?: 'karma' | 'bhakti' | 'gyan'
  order?: number
}

// ── Spiritual Page ────────────────────────────────────────────────────────────
export interface SpiritualPage {
  _id: string
  slug: 'karma' | 'bhakti' | 'gyan' | 'philosophy'
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  mainIntro?: string
  gitaTeachingIntro?: string
  gitaQuote?: GitaQuote
  modernHeading?: string
  modernBody?: string
  visionHeading?: string
  visionBody?: string
  serviceHeading?: string
  serviceBody?: string
  seo?: SeoFields
}

// ── About Page ────────────────────────────────────────────────────────────────
export interface AboutPage {
  _id: string
  heroHeading?: string
  heroSubheading?: string
  heroImage?: SanityImage
  mainBody?: string
  quote1?: GitaQuote
  focusIntro?: string
  serviceTitle?: string
  serviceBody?: string
  devotionTitle?: string
  devotionBody?: string
  educationTitle?: string
  educationBody?: string
  whyHeading?: string
  whyBody?: string
  quote2?: GitaQuote
  connectHeading?: string
  connectBody?: string
  seo?: SeoFields
}

// ── Founder Page ──────────────────────────────────────────────────────────────
export interface FounderPage {
  _id: string
  name?: string
  title?: string
  profilePhoto?: SanityImage
  who?: string
  journey?: string
  message?: string
  vision?: string
  closingQuote?: string
  closingQuoteRef?: string
  karmaTitle?: string
  karmaSubtitle?: string
  karmaBody?: string
  bhaktiTitle?: string
  bhaktiSubtitle?: string
  bhaktiBody?: string
  gyanTitle?: string
  gyanSubtitle?: string
  gyanBody?: string
  seo?: SeoFields
}

// ── Donate Page ───────────────────────────────────────────────────────────────
export interface DonatePage {
  _id: string
  heroHeading?: string
  heroSubheading?: string
  heroBody?: string
  whyHeading?: string
  whyBody?: string
  karmaHeading?: string
  karmaSubheading?: string
  karmaBody?: string
  bhaktiHeading?: string
  bhaktiSubheading?: string
  bhaktiBody?: string
  gyanHeading?: string
  gyanSubheading?: string
  gyanBody?: string
  closingText?: string
  seo?: SeoFields
}

// ── Activity ──────────────────────────────────────────────────────────────────
export interface Activity {
  _id: string
  title: string
  slug: { current: string }
  pillar: 'karma' | 'bhakti' | 'gyan' | 'general'
  summary?: string
  body?: unknown[] // Portable Text
  images?: (SanityImage & { alt?: string; caption?: string })[]
  coverImage?: SanityImage
  location?: string
  isFeatured?: boolean
  publishedAt: string
}

// ── Blog Post ─────────────────────────────────────────────────────────────────
export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: SanityImage
  category?: string
  body?: unknown[] // Portable Text
  gitaQuote?: GitaQuote
  publishedAt: string
  isFeatured?: boolean
  seo?: SeoFields
}
