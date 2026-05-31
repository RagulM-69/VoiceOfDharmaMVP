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

import { SITE_URL } from '@/lib/seo/config'

export const metadata: Metadata = {
  // ── Titles ─────────────────────────────────────────────────────────────────
  title: {
    default: 'Voice of Dharma Foundation | Preserving Dharma Through Knowledge & Service',
    template: '%s | Voice of Dharma Foundation',
  },

  // ── Primary description ────────────────────────────────────────────────────
  description:
    'Voice of Dharma Foundation is dedicated to preserving and sharing dharmic wisdom through education, community initiatives, spiritual resources, and cultural outreach.',

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
  // metadataBase is required for Next.js to resolve relative OG image URLs
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
    title: 'Voice of Dharma Foundation | Preserving Dharma Through Knowledge & Service',
    description:
      'Voice of Dharma Foundation is dedicated to preserving and sharing dharmic wisdom through education, community initiatives, spiritual resources, and cultural outreach.',
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
    title: 'Voice of Dharma Foundation | Preserving Dharma Through Knowledge & Service',
    description:
      'Dedicated to preserving and sharing dharmic wisdom through education, community initiatives, and spiritual resources.',
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

  // ── Verification placeholders ──────────────────────────────────────────────
  // Uncomment and fill once verified in Search Console / Bing Webmaster
  // verification: {
  //   google: 'your-google-verification-token',
  //   yandex: 'your-yandex-verification-token',
  //   other: { 'msvalidate.01': 'your-bing-verification-token' },
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A1F44" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
