import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const garamond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-garamond',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

import { getSiteSettings } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/seo/config'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  const title = settings?.seo?.metaTitle ?? 'Voice of Dharma Foundation | Preserving Dharma Through Knowledge & Service'
  const description = settings?.seo?.metaDescription ?? 'Voice of Dharma Foundation is dedicated to preserving and sharing dharmic wisdom through education, community initiatives, spiritual resources, and cultural outreach.'
  
  return {
    // ── Titles ─────────────────────────────────────────────────────────────────
    title: {
      default: title,
      template: '%s | Voice of Dharma Foundation',
    },

    // ── Primary description ────────────────────────────────────────────────────
    description: description,

    // ── Keywords ───────────────────────────────────────────────────────────────
    keywords: [
      'Voice of Dharma Foundation',
      'Bhagavad Gita',
      'Dharma',
      'Karma Yoga',
      'Bhakti Yoga',
      'Gyan Yoga',
      'Krishna',
      'Spiritual Foundation India',
      'Dharmic wisdom',
      'Hindu philosophy',
      'Hari Das',
      'spiritual trust',
    ],

    // ── Canonical / base URL ───────────────────────────────────────────────────
    metadataBase: new URL(SITE_URL),

    // ── Canonical alternates ───────────────────────────────────────────────────
    alternates: {
      canonical: '/',
      languages: {
        'en-IN': '/',
      },
    },

    // ── Open Graph ─────────────────────────────────────────────────────────────
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'Voice of Dharma Foundation',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: 'Voice of Dharma Foundation',
        },
      ],
    },

    // ── Twitter / X Card ───────────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
    },

    // ── Robots ─────────────────────────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // ── Icons ──────────────────────────────────────────────────────────────────
    icons: {
      icon: '/images/logo-symbol.jpg',
      apple: '/images/logo-symbol.jpg',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/images/logo-symbol.jpg" type="image/jpeg" />
        <meta name="theme-color" content="#0A1F44" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
