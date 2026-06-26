/**
 * All GROQ queries for the Voice of Dharma Foundation frontend.
 * Centralised here — import from this file in page Server Components.
 *
 * Key rules:
 * - Always filter out drafts: !(_id in path("drafts.**"))
 * - Use sanityServerClient (no CDN) for ISR pages so data is always fresh
 * - Keep revalidation short for content-heavy pages
 */

import { sanityServerClient } from './client'
import type {
  SiteSettings,
  HomePage,
  HeroSlide,
  SpiritualPage,
  AboutPage,
  FounderPage,
  DonatePage,
  Activity,
  BlogPost,
  LegalPage,
  LetterToKrishnaPage,
  Publication,
  PublicationListItem,
} from './types'

// ─── Shared image projection ──────────────────────────────────────────────────
const IMAGE_FIELDS = `
  asset,
  hotspot,
  alt,
  caption
`

// ─── SEO projection ───────────────────────────────────────────────────────────
const SEO_FIELDS = `
  seo {
    metaTitle,
    metaDescription,
    ogImage { ${IMAGE_FIELDS} }
  }
`

// ─── Draft filter — ALWAYS include this in every query ───────────────────────
// Sanity stores unpublished drafts as documents with _id prefixed "drafts."
// Without this filter, draft documents can bleed into production queries.
const NO_DRAFTS = `!(_id in path("drafts.**"))`

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS (Footer, Social Links)
// ─────────────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityServerClient.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings" && ${NO_DRAFTS}][0] {
      _id,
      siteName,
      tagline,
      email,
      phone,
      address,
      registrationNumber,
      pan,
      taxExemptionNote,
      footerBottomText,
      footerQuickLinks[] { label, href },
      contactHeroTitle,
      contactHeroSubtitle,
      contactSidebarQuote { text, reference },
      socialLinks,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage | null> {
  return sanityServerClient.fetch(
    `*[_type == "homePage" && _id == "homePage" && ${NO_DRAFTS}][0] {
      _id,
      heroGitaQuote,
      heroGitaQuoteRef,
      aboutHeading,
      aboutBody,
      mission,
      whyDharma,
      whyVOD,
      quoteBanner1 { text, reference },
      quoteBanner2 { text, reference },
      quoteBanner3 { text, reference },
      closingQuote  { text, reference },
      supportHeading,
      supportBody,
      connectHeading,
      connectBody,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return sanityServerClient.fetch(
    `*[_type == "heroSlide" && ${NO_DRAFTS}] | order(order asc) {
      _id,
      title,
      subtitle,
      body,
      ctaText,
      ctaHref,
      backgroundImage { ${IMAGE_FIELDS} },
      pillar,
      order
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SPIRITUAL PAGES (Karma, Bhakti, Gyan, Philosophy)
// CRITICAL FIX: slug is a Sanity slug object — must query slug.current
// ─────────────────────────────────────────────────────────────────────────────

export async function getSpiritualPage(slug: string): Promise<SpiritualPage | null> {
  return sanityServerClient.fetch(
    // slug is stored as a plain string (schema type:'string'), NOT a Sanity slug object
    // so we must match slug == $slug, NOT slug.current == $slug
    `*[_type == "spiritualPage" && slug == $slug && ${NO_DRAFTS}][0] {
      _id,
      slug,
      heroTitle,
      heroSubtitle,
      heroImage { ${IMAGE_FIELDS} },
      mainIntro,
      gitaTeachingIntro,
      gitaQuote { sanskrit, translation, reference },
      gitaTeachingExplanation,
      modernHeading,
      modernBody,
      quote2 { sanskrit, translation, reference },
      visionHeading,
      visionBody,
      quote3 { sanskrit, translation, reference },
      devotionHeading,
      devotionBody,
      quote4 { sanskrit, translation, reference },
      knowledgeHeading,
      knowledgeBody,
      quote5 { sanskrit, translation, reference },
      integrationHeading,
      integrationBody,
      livingProcessHeading,
      livingProcessBody,
      closingQuoteLines,
      closingQuoteTranslation,
      closingQuoteSource,
      serviceHeading,
      serviceBody,
      ${SEO_FIELDS}
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "aboutPage" && _id == "aboutPage" && ${NO_DRAFTS}][0] {
      _id,
      heroHeading,
      heroSubheading,
      heroImage { ${IMAGE_FIELDS} },
      mainBody,
      quote1 { sanskrit, translation, reference },
      focusIntro,
      serviceTitle, serviceBody,
      devotionTitle, devotionBody,
      educationTitle, educationBody,
      whyHeading, whyBody,
      quote2 { sanskrit, translation, reference },
      connectHeading, connectBody,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER PAGE (Haridas)
// ─────────────────────────────────────────────────────────────────────────────

export async function getFounderPage(): Promise<FounderPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "founderPage" && _id == "founderPage" && ${NO_DRAFTS}][0] {
      _id,
      name,
      title,
      profilePhoto { ${IMAGE_FIELDS} },
      who, journey, message, vision,
      closingQuote, closingQuoteRef,
      karmaTitle, karmaSubtitle, karmaBody,
      bhaktiTitle, bhaktiSubtitle, bhaktiBody,
      gyanTitle, gyanSubtitle, gyanBody,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DONATE PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getDonatePage(): Promise<DonatePage | null> {
  return sanityServerClient.fetch(
    `*[_type == "donatePage" && _id == "donatePage" && ${NO_DRAFTS}][0] {
      _id,
      heroHeading, heroSubheading, heroBody,
      whyHeading, whyBody,
      karmaHeading, karmaSubheading, karmaBody,
      bhaktiHeading, bhaktiSubheading, bhaktiBody,
      gyanHeading, gyanSubheading, gyanBody,
      formHeading,
      donationAmounts,
      closingText,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITIES PAGE SINGLETON
// ─────────────────────────────────────────────────────────────────────────────

export async function getActivitiesPage(): Promise<any | null> {
  return sanityServerClient.fetch(
    `*[_type == "activitiesPage" && ${NO_DRAFTS}][0] {
      _id,
      heroTitle,
      heroSubtitle,
      pageQuote { text, reference },
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG PAGE SINGLETON
// ─────────────────────────────────────────────────────────────────────────────

export async function getBlogPage(): Promise<any | null> {
  return sanityServerClient.fetch(
    `*[_type == "blogPage" && ${NO_DRAFTS}][0] {
      _id,
      heroTitle,
      heroSubtitle,
      pageQuote { text, reference },
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITIES FEED
// CRITICAL FIX: filter drafts, use publishedAt filter for only past/present
// ─────────────────────────────────────────────────────────────────────────────

export async function getActivities(limit = 24): Promise<Activity[]> {
  return sanityServerClient.fetch(
    `*[_type == "activity" && ${NO_DRAFTS}]
      | order(isFeatured desc, publishedAt desc)
      [0...${limit}] {
      _id,
      title,
      slug,
      pillar,
      summary,
      images[] { ${IMAGE_FIELDS} },
      coverImage { ${IMAGE_FIELDS} },
      location,
      isFeatured,
      publishedAt
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getAllActivitySlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityServerClient.fetch(
    `*[_type == "activity" && ${NO_DRAFTS} && defined(slug.current)] { slug }`,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  return sanityServerClient.fetch(
    `*[_type == "activity" && slug.current == $slug && ${NO_DRAFTS}][0] {
      _id,
      title,
      slug,
      pillar,
      summary,
      body,
      images[] { ${IMAGE_FIELDS} },
      coverImage { ${IMAGE_FIELDS} },
      location,
      isFeatured,
      publishedAt
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGAL PAGES
// ─────────────────────────────────────────────────────────────────────────────

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "legalPage" && slug == $slug && ${NO_DRAFTS}][0] {
      _id,
      slug,
      title,
      lastUpdated,
      content,
      ${SEO_FIELDS}
    }`,
    { slug },
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LETTER TO KRISHNA PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getLetterToKrishnaPage(): Promise<LetterToKrishnaPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "letterToKrishnaPage" && _id == "letterToKrishnaPage" && ${NO_DRAFTS}][0] {
      _id,
      heroTitle,
      heroSubtitle,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS
// CRITICAL FIX: filter drafts, parameterise limit properly
// ─────────────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit = 24): Promise<BlogPost[]> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost" && ${NO_DRAFTS}]
      | order(isFeatured desc, publishedAt desc)
      [0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      coverImage { ${IMAGE_FIELDS} },
      category,
      publishedAt,
      isFeatured
    }`,
    {},
    // Short revalidation — new blog posts should appear quickly
    { next: { revalidate: 60 } }
  )
}

export async function getAllBlogSlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost" && ${NO_DRAFTS} && defined(slug.current)] { slug }`,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug && ${NO_DRAFTS}][0] {
      _id,
      title,
      slug,
      excerpt,
      coverImage { ${IMAGE_FIELDS} },
      category,
      body,
      gitaQuote { sanskrit, translation, reference },
      publishedAt,
      isFeatured,
      ${SEO_FIELDS}
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLICATIONS
// Filter: isPublished == true && !isHidden && no drafts
// ─────────────────────────────────────────────────────────────────────────────

// Shared image projection reused in publication queries
const IMAGE_FIELDS_PUB = `
  asset,
  hotspot,
  alt,
  caption
`

export async function getPublications(limit = 100): Promise<PublicationListItem[]> {
  return sanityServerClient.fetch(
    `*[_type == "publication" && isPublished == true && isHidden != true && ${NO_DRAFTS}]
      | order(displayOrder asc, _createdAt desc)
      [0...${limit}] {
      _id,
      title,
      slug,
      author,
      tagline,
      coverImage { ${IMAGE_FIELDS_PUB} },
      thumbnail  { ${IMAGE_FIELDS_PUB} },
      isFeatured,
      isComingSoon,
      displayOrder
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getAllPublicationSlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityServerClient.fetch(
    `*[_type == "publication" && ${NO_DRAFTS} && defined(slug.current)] { slug }`,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  return sanityServerClient.fetch(
    `*[_type == "publication" && slug.current == $slug && ${NO_DRAFTS}][0] {
      _id,
      title,
      slug,
      author,
      subtitle,
      tagline,
      coverImage    { ${IMAGE_FIELDS_PUB} },
      thumbnail     { ${IMAGE_FIELDS_PUB} },
      shortDescription,
      fullDescription,
      purpose,
      whoShouldRead,
      category,
      language,
      publisher,
      publicationDate,
      edition,
      isbn,
      totalPages,
      readingTime,
      bookFormat,
      tags,
      isPublished,
      isHidden,
      isFeatured,
      isComingSoon,
      displayOrder,
      purchasePlatforms[] {
        _key,
        platformName,
        platformLogo { ${IMAGE_FIELDS_PUB} },
        buttonText,
        purchaseUrl,
        openInNewTab,
        enabled,
        displayOrder
      },
      preview {
        enablePreview,
        previewTitle,
        previewDescription,
        previewImages[] { ${IMAGE_FIELDS_PUB} },
        endPreviewMessage,
        endPreviewButtonText,
        endPreviewButtonUrl
      },
      relatedPublications[]->{
        _id,
        title,
        slug,
        author,
        tagline,
        coverImage { ${IMAGE_FIELDS_PUB} },
        isFeatured,
        isComingSoon
      },
      seo {
        metaTitle,
        metaDescription,
        ogImage { ${IMAGE_FIELDS_PUB} },
        canonicalUrl
      }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}
