import { MetadataRoute } from 'next'
import { getAllBlogSlugs, getAllActivitySlugs, getAllPublicationSlugs } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/seo/config'


/**
 * Automatic sitemap generation.
 *
 * Static routes are hardcoded with priority/frequency.
 * Dynamic routes (blog posts, activities) are fetched from Sanity at build/revalidation time.
 * Adding new Sanity document types requires no manual sitemap changes —
 * just add a new getAllXSlugs() call below and map it to routes.
 *
 * Future: E-book pages — add getAllEbookSlugs() call here when schema is ready.
 */
export const revalidate = 3600 // Regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static routes ───────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/activities`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/philosophy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/haridas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/letter-to-krishna`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/publications`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Spiritual pillar pages
    {
      url: `${SITE_URL}/karma`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/bhakti`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/gyan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // Legal
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // ── Dynamic: Blog posts from Sanity ────────────────────────────────────────
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogSlugs = await getAllBlogSlugs()
    blogRoutes = blogSlugs.map(({ slug }) => ({
      url: `${SITE_URL}/blog/${slug.current}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // Sanity unavailable — degrade gracefully; static routes still served
  }

  // ── Dynamic: Activity pages from Sanity ────────────────────────────────────
  let activityRoutes: MetadataRoute.Sitemap = []
  try {
    const activitySlugs = await getAllActivitySlugs()
    activityRoutes = activitySlugs.map(({ slug }) => ({
      url: `${SITE_URL}/activities/${slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))
  } catch {
    // Sanity unavailable — degrade gracefully
  }

  // ── Dynamic: Publication pages from Sanity ─────────────────────────────────
  let publicationRoutes: MetadataRoute.Sitemap = []
  try {
    const publicationSlugs = await getAllPublicationSlugs()
    publicationRoutes = publicationSlugs.map(({ slug }) => ({
      url: `${SITE_URL}/publications/${slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  } catch {
    // Sanity unavailable — degrade gracefully
  }

  return [...staticRoutes, ...blogRoutes, ...activityRoutes, ...publicationRoutes]
}
