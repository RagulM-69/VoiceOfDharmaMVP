import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceofdharma.org'
  
  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/philosophy', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/donate', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/haridas', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/refund', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
