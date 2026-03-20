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

export const metadata: Metadata = {
  title: {
    default: 'Voice of Dharma Foundation | Bhagavad Gita Inspired Trust',
    template: '%s | Voice of Dharma Foundation',
  },
  description:
    'A spiritual trust spreading the wisdom of Karma, Bhakti and Gyan through the Bhagavad Gita.',
  keywords: ['Bhagavad Gita', 'Dharma', 'Karma Yoga', 'Bhakti Yoga', 'Gyan Yoga', 'Krishna', 'Spiritual', 'Foundation', 'India'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'Voice of Dharma Foundation',
    description:
      'Spreading the light of Bhagavad Gita through Karma, Bhakti and Gyan.',
    siteName: 'Voice of Dharma Foundation',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
