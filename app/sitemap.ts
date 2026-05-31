import { MetadataRoute } from 'next'
import { getAllBlogSlugs, getAllActivitySlugs } from '@/lib/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceofdharmafoundation.org'

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
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/activities`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/philosophy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/haridas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/letter-to-krishna`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/donate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Spiritual pillar pages
    {
      url: `${BASE_URL}/karma`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/bhakti`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/gyan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // Legal
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/refund`,
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
      url: `${BASE_URL}/blog/${slug.current}`,
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
      url: `${BASE_URL}/activities/${slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))
  } catch {
    // Sanity unavailable — degrade gracefully
  }

  // ── Future: E-book pages (uncomment when ready) ────────────────────────────
  // let ebookRoutes: MetadataRoute.Sitemap = []
  // try {
  //   const ebookSlugs = await getAllEbookSlugs()
  //   ebookRoutes = ebookSlugs.map(({ slug }) => ({
  //     url: `${BASE_URL}/ebooks/${slug.current}`,
  //     lastModified: now,
  //     changeFrequency: 'monthly' as const,
  //     priority: 0.7,
  //   }))
  // } catch {}

  return [...staticRoutes, ...blogRoutes, ...activityRoutes]
}
