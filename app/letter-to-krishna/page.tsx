import type { Metadata } from 'next'
import LetterToKrishnaClient from './LetterToKrishnaClient'
import Footer from '@/components/public/Footer'
import { getSiteSettings } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Letter to Krishna | Voice of Dharma Foundation',
  description:
    'A private, ephemeral sanctuary to write a letter directly to Krishna. Your words are never stored — they dissolve into the divine the moment you offer them.',
  robots: { index: false, follow: false },
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
