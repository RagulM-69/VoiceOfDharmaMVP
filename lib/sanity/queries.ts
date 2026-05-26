/**
 * All GROQ queries for the Voice of Dharma Foundation frontend.
 * Centralised here — import from this file in page Server Components.
 *
 * Pattern: each query fetches exactly what the page needs — no over-fetching.
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

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS (Footer, Social Links)
// ─────────────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityServerClient.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0] {
      _id,
      siteName,
      tagline,
      email,
      phone,
      address,
      registrationNumber,
      pan,
      socialLinks,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage | null> {
  return sanityServerClient.fetch(
    `*[_type == "homePage" && _id == "homePage"][0] {
      _id,
      heroGitaQuote,
      heroGitaQuoteRef,
      aboutHeading,
      aboutBody,
      mission,
      whyDharma,
      whyVOD,
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
    `*[_type == "heroSlide"] | order(order asc) {
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
// ─────────────────────────────────────────────────────────────────────────────

export async function getSpiritualPage(slug: string): Promise<SpiritualPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "spiritualPage" && slug == $slug][0] {
      _id,
      slug,
      heroTitle,
      heroSubtitle,
      heroImage { ${IMAGE_FIELDS} },
      mainIntro,
      gitaTeachingIntro,
      gitaQuote { sanskrit, translation, reference },
      modernHeading,
      modernBody,
      visionHeading,
      visionBody,
      serviceHeading,
      serviceBody,
      ${SEO_FIELDS}
    }`,
    { slug },
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityServerClient.fetch(
    `*[_type == "aboutPage" && _id == "aboutPage"][0] {
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
    `*[_type == "founderPage" && _id == "founderPage"][0] {
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
    `*[_type == "donatePage" && _id == "donatePage"][0] {
      _id,
      heroHeading, heroSubheading, heroBody,
      whyHeading, whyBody,
      karmaHeading, karmaSubheading, karmaBody,
      bhaktiHeading, bhaktiSubheading, bhaktiBody,
      gyanHeading, gyanSubheading, gyanBody,
      closingText,
      ${SEO_FIELDS}
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITIES FEED
// ─────────────────────────────────────────────────────────────────────────────

export async function getActivities(limit = 12): Promise<Activity[]> {
  return sanityServerClient.fetch(
    `*[_type == "activity"] | order(isFeatured desc, publishedAt desc) [0...$limit] {
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
    { limit },
    { next: { revalidate: 300 } } // revalidate every 5 min for fresh feed
  )
}

export async function getAllActivitySlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityServerClient.fetch(
    `*[_type == "activity"] { slug }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  return sanityServerClient.fetch(
    `*[_type == "activity" && slug.current == $slug][0] {
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
    { next: { revalidate: 300 } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit = 12): Promise<BlogPost[]> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost"] | order(isFeatured desc, publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      coverImage { ${IMAGE_FIELDS} },
      category,
      publishedAt,
      isFeatured
    }`,
    { limit },
    { next: { revalidate: 3600 } }
  )
}

export async function getAllBlogSlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost"] { slug }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityServerClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
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
    { next: { revalidate: 3600 } }
  )
}
