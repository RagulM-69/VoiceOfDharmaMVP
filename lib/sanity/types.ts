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
export interface FooterQuickLink {
  label: string
  href: string
}

export interface SiteSettings {
  _id: string
  siteName: string
  tagline: string
  email?: string
  phone?: string
  address?: string
  registrationNumber?: string
  pan?: string
  taxExemptionNote?: string
  footerBottomText?: string
  footerQuickLinks?: FooterQuickLink[]
  // Contact page fields
  contactHeroTitle?: string
  contactHeroSubtitle?: string
  contactSidebarQuote?: { text?: string; reference?: string }
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
export interface QuoteBanner {
  text?: string
  reference?: string
}

export interface HomePage {
  _id: string
  heroGitaQuote?: string
  heroGitaQuoteRef?: string
  aboutHeading?: string
  aboutBody?: string
  mission?: string
  whyDharma?: string
  whyVOD?: string
  quoteBanner1?: QuoteBanner
  quoteBanner2?: QuoteBanner
  quoteBanner3?: QuoteBanner
  closingQuote?: QuoteBanner
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
  gitaQuote?: GitaQuote    // quote after section 1
  gitaTeachingExplanation?: string
  modernHeading?: string
  modernBody?: string
  quote2?: GitaQuote       // quote after section 2 (Katha Upanishad)
  visionHeading?: string
  visionBody?: string
  quote3?: GitaQuote       // quote after section 3 (BG 2.47)
  // Philosophy-only extended sections
  devotionHeading?: string
  devotionBody?: string
  quote4?: GitaQuote       // quote after section 4 (Bhagavata Purana)
  knowledgeHeading?: string
  knowledgeBody?: string
  quote5?: GitaQuote       // quote after section 5 (BG 4.38)
  integrationHeading?: string
  integrationBody?: string
  livingProcessHeading?: string
  livingProcessBody?: string
  closingQuoteLines?: string[]
  closingQuoteTranslation?: string[]
  closingQuoteSource?: string
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
  formHeading?: string
  donationAmounts?: number[]
  closingText?: string
  seo?: SeoFields
}

// ── Activities Page Singleton ─────────────────────────────────────────────────
export interface ActivitiesPage {
  _id: string
  heroTitle?: string
  heroSubtitle?: string
  pageQuote?: { text?: string; reference?: string }
  seo?: SeoFields
}

// ── Blog Page Singleton ───────────────────────────────────────────────────────
export interface BlogPage {
  _id: string
  heroTitle?: string
  heroSubtitle?: string
  pageQuote?: { text?: string; reference?: string }
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

// ── Legal Page ────────────────────────────────────────────────────────────────
export interface LegalPage {
  _id: string
  slug: 'privacy' | 'terms' | 'refund'
  title?: string
  lastUpdated?: string
  content?: unknown[] // Portable Text
  seo?: SeoFields
}

// ── Letter to Krishna Page ────────────────────────────────────────────────────
export interface LetterToKrishnaPage {
  _id: string
  heroTitle?: string
  heroSubtitle?: string
  seo?: SeoFields
}

// ── Publications ──────────────────────────────────────────────────────────────

export interface PurchasePlatform {
  _key: string
  platformName: string
  platformLogo?: SanityImage
  buttonText: string
  purchaseUrl: string
  openInNewTab?: boolean
  enabled?: boolean
  displayOrder?: number
}

export interface PublicationPreview {
  enablePreview?: boolean
  previewTitle?: string
  previewDescription?: string
  previewImages?: (SanityImage & { alt?: string; caption?: string })[]
  endPreviewMessage?: string
  endPreviewButtonText?: string
  endPreviewButtonUrl?: string
}

/** Full Publication — used on the detail page */
export interface Publication {
  _id: string
  title: string
  slug: { current: string }
  author: string
  subtitle?: string
  tagline?: string
  coverImage?: SanityImage
  thumbnail?: SanityImage
  shortDescription?: string
  fullDescription?: unknown[]  // Portable Text
  purpose?: string
  whoShouldRead?: string
  category?: string
  language?: string
  publisher?: string
  publicationDate?: string
  edition?: string
  isbn?: string
  totalPages?: number
  readingTime?: string
  bookFormat?: string
  tags?: string[]
  isPublished?: boolean
  isHidden?: boolean
  isFeatured?: boolean
  isComingSoon?: boolean
  displayOrder?: number
  purchasePlatforms?: PurchasePlatform[]
  preview?: PublicationPreview
  relatedPublications?: PublicationListItem[]
  seo?: SeoFields & { canonicalUrl?: string }
}

/** Lightweight Publication — used on listing page / related books cards */
export interface PublicationListItem {
  _id: string
  title: string
  slug: { current: string }
  author: string
  tagline?: string
  coverImage?: SanityImage
  thumbnail?: SanityImage
  isFeatured?: boolean
  isComingSoon?: boolean
  displayOrder?: number
}
