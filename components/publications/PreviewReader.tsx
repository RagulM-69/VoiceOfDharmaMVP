import type { PublicationPreview, PurchasePlatform } from '@/lib/sanity/types'
import EndPreviewCTA from './EndPreviewCTA'
import PreviewPage from './PreviewPage'

interface Props {
  previewData: PublicationPreview
  platforms?: PurchasePlatform[]
  bookTitle: string
}

export default function PreviewReader({ previewData, platforms, bookTitle }: Props) {
  if (!previewData.enablePreview) return null

  const pages = previewData.previewImages ?? []

  return (
    <section className="py-12 bg-white border-t border-gray-100" aria-label="Book preview reader">
      {/* Section header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="section-divider" />
          <h2 className="font-garamond text-3xl font-semibold text-gray-800">
            {previewData.previewTitle ?? 'Free Preview'}
          </h2>
          <div className="section-divider" style={{ transform: 'scaleX(-1)' }} />
        </div>
        {previewData.previewDescription && (
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
            {previewData.previewDescription}
          </p>
        )}
        {pages.length > 0 && (
          <p className="mt-2 text-xs text-gray-400 tracking-wide">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'} · Scroll to read
          </p>
        )}
      </div>

      {/* Pages — manga/webtoon vertical scroll */}
      {pages.length > 0 ? (
        <div className="max-w-2xl mx-auto px-2 sm:px-4 space-y-1">
          {pages.map((page, index) => (
            <PreviewPage
              key={`page-${index}`}
              image={page}
              pageNumber={index + 1}
              bookTitle={bookTitle}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 text-center py-16 text-gray-400">
          Preview pages coming soon.
        </div>
      )}

      {/* End of preview CTA */}
      <EndPreviewCTA previewData={previewData} platforms={platforms} />
    </section>
  )
}
