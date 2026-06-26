import Link from 'next/link'
import SectionWrapper from '@/components/public/SectionWrapper'
import PublicationCard from './PublicationCard'
import type { PublicationListItem } from '@/lib/sanity/types'

interface Props {
  publications: PublicationListItem[]
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="text-7xl mb-6 select-none">📚</div>
      <h2 className="font-garamond text-3xl text-gray-700 mb-4">
        Publications Coming Soon
      </h2>
      <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
        The Voice of Dharma Foundation is preparing spiritual publications rooted in
        the wisdom of the Bhagavad Gita. Stay connected for updates.
      </p>
      <Link
        href="/contact"
        className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-1"
        style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
      >
        Stay Connected
      </Link>
    </div>
  )
}

export default function PublicationGrid({ publications }: Props) {
  if (publications.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {publications.map((pub, i) => (
        <SectionWrapper key={pub._id} delay={i * 0.06}>
          <PublicationCard publication={pub} />
        </SectionWrapper>
      ))}
    </div>
  )
}
