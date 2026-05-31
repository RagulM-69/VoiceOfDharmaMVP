import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceofdharmafoundation.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All standard crawlers — allow everything public, protect admin/API
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/unsubscribe',
        ],
      },
      {
        // Explicitly support Googlebot (inherits above but listed for GSC clarity)
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/unsubscribe'],
      },
      {
        // Bingbot
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/unsubscribe'],
      },
      {
        // Yandex
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/unsubscribe'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
