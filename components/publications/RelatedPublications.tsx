import Link from 'next/link'
import SectionWrapper from '@/components/public/SectionWrapper'
import PublicationCard from './PublicationCard'
import type { PublicationListItem } from '@/lib/sanity/types'

interface Props {
  publications: PublicationListItem[]
  title?: string
}

export default function RelatedPublications({
  publications,
  title = 'Related Publications',
}: Props) {
  if (!publications || publications.length === 0) return null

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionWrapper>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="section-divider" />
              <h2 className="font-garamond text-3xl font-semibold text-gray-800">{title}</h2>
              <div className="section-divider" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <p className="text-gray-500 text-sm mt-2">
              More from the Voice of Dharma Foundation
            </p>
          </div>
        </SectionWrapper>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publications.map((pub, i) => (
            <SectionWrapper key={pub._id} delay={i * 0.08}>
              <PublicationCard publication={pub} />
            </SectionWrapper>
          ))}
        </div>

        {/* CTA link */}
        <SectionWrapper delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors"
            >
              View All Publications →
            </Link>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
