import type { Metadata } from 'next'
import LetterToKrishnaClient from './LetterToKrishnaClient'
import Footer from '@/components/public/Footer'
import { getSiteSettings, getLetterToKrishnaPage } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/seo/config'

/**
 * SEO Decision: INDEXED
 *
 * Rationale: The page targets genuine spiritual search intent around
 * "write a letter to Krishna", "prayer to Krishna online", and "spiritual
 * reflection tool". These are low-competition, high-intent keywords with
 * real user value. The page has a unique concept with no competition on
 * the web. Indexing it builds topical authority around devotion and bhakti.
 *
 * The sanctuary gate and experience are JS-driven, but the metadata,
 * page title, and description are fully visible to crawlers.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLetterToKrishnaPage().catch(() => null)
  
  const title = page?.seo?.metaTitle ?? 'Letter to Krishna — Write Your Prayer Online | Voice of Dharma Foundation'
  const description = page?.seo?.metaDescription ?? 'A sacred, private digital sanctuary to write your letter to Krishna. Pour out your heart in prayer and devotion — your words dissolve into the divine, unseen by anyone.'
  
  return {
    title,
    description,
    keywords: [
      'letter to Krishna',
      'write a letter to Krishna',
      'prayer to Krishna online',
      'spiritual reflection',
      'devotional prayer writing',
      'Krishna bhakti',
      'write to God',
      'online prayer sanctuary',
      'Bhagavad Gita devotion',
    ],
    alternates: { canonical: '/letter-to-krishna' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/letter-to-krishna`,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: 'Letter to Krishna — Voice of Dharma Foundation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
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
}

export default async function LetterToKrishnaPage() {
  const settings = await getSiteSettings()
  return (
    <>
      {/*
        Inline style BEFORE any JS loads — prevents the body's cream
        background from flashing during the dark sanctuary intro.
      */}
      <style>{`html, body { background: #020509 !important; }`}</style>
      <LetterToKrishnaClient />
      <Footer settings={settings} />
    </>
  )
}
