import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/config'


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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
