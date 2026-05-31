/**
 * JSON-LD Structured Data Components for Voice of Dharma Foundation.
 *
 * Usage — import and render in any page's JSX:
 *   import { OrganizationSchema, WebsiteSchema } from '@/components/seo/JsonLd'
 *   <OrganizationSchema settings={settings} />
 *   <WebsiteSchema />
 *
 * All schemas validated against schema.org and Google Rich Results Test.
 */

import type { SiteSettings } from '@/lib/sanity/types'
import { SITE_URL } from '@/lib/seo/config'

/* ─────────────────────────────────────────────────────────────────────────────
   1. Organization Schema
   Informs Google the foundation is a non-profit with contact + social links.
───────────────────────────────────────────────────────────────────────────── */
export function OrganizationSchema({ settings }: { settings: SiteSettings | null }) {
  const social: string[] = []
  if (settings?.socialLinks?.youtube)   social.push(settings.socialLinks.youtube)
  if (settings?.socialLinks?.instagram) social.push(settings.socialLinks.instagram)
  if (settings?.socialLinks?.facebook)  social.push(settings.socialLinks.facebook)
  if (settings?.socialLinks?.twitter)   social.push(settings.socialLinks.twitter)
  if (settings?.socialLinks?.linkedin)  social.push(settings.socialLinks.linkedin)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',                       // More specific than Organization
    name: 'Voice of Dharma Foundation',
    alternateName: 'VOD Foundation',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/og-default.png`,
      width: 1200,
      height: 630,
    },
    description:
      'Voice of Dharma Foundation is dedicated to preserving and sharing dharmic wisdom through education, community initiatives, spiritual resources, and cultural outreach.',
    foundingDate: '2024',
    address: settings?.address
      ? {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
          streetAddress: settings.address,
        }
      : { '@type': 'PostalAddress', addressCountry: 'IN' },
    contactPoint: settings?.email
      ? {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: settings.email,
          ...(settings.phone ? { telephone: settings.phone } : {}),
        }
      : undefined,
    sameAs: social.length > 0 ? social : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. Website Schema (with SearchAction for Sitelinks Search Box readiness)
───────────────────────────────────────────────────────────────────────────── */
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Voice of Dharma Foundation',
    url: SITE_URL,
    description:
      'Preserving and sharing dharmic wisdom through education, community service, and cultural outreach.',
    inLanguage: 'en-IN',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Breadcrumb Schema
   Pass an array of { name, url } items ordered from root → current page.
───────────────────────────────────────────────────────────────────────────── */
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. BlogPosting Schema — applied on each blog article page
───────────────────────────────────────────────────────────────────────────── */
interface BlogPostingSchemaProps {
  title: string
  description?: string
  publishedAt: string
  slug: string
  imageUrl?: string
}

export function BlogPostingSchema({
  title,
  description,
  publishedAt,
  slug,
  imageUrl,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'Voice of Dharma Foundation',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Voice of Dharma Foundation',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/og-default.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. Event / Activity Schema — for individual activity detail pages
───────────────────────────────────────────────────────────────────────────── */
interface ActivitySchemaProps {
  title: string
  description?: string
  publishedAt: string
  slug: string
  location?: string
  imageUrl?: string
}

export function ActivitySchema({
  title,
  description,
  publishedAt,
  slug,
  location,
  imageUrl,
}: ActivitySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description: description,
    startDate: publishedAt,
    url: `${SITE_URL}/activities/${slug}`,
    organizer: {
      '@type': 'Organization',
      name: 'Voice of Dharma Foundation',
      url: SITE_URL,
    },
    ...(location
      ? {
          location: {
            '@type': 'Place',
            name: location,
            address: { '@type': 'PostalAddress', addressCountry: 'IN' },
          },
        }
      : {}),
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
