import type { PublicationPreview, PurchasePlatform } from '@/lib/sanity/types'
import PurchasePlatforms from './PurchasePlatforms'

interface Props {
  previewData: PublicationPreview
  platforms?: PurchasePlatform[]
}

export default function EndPreviewCTA({ previewData, platforms }: Props) {
  const enabledPlatforms = (platforms ?? []).filter((p) => p.enabled !== false)

  return (
    <div className="max-w-2xl mx-auto px-4 mt-2">
      {/* Decorative top border */}
      <div
        className="w-full h-px mb-8"
        style={{ background: 'linear-gradient(90deg, transparent, #C8960C 30%, #F5A623 70%, transparent)' }}
      />

      {/* End-of-preview panel */}
      <div
        className="rounded-2xl px-8 py-10 text-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1a3a6e 100%)' }}
      >
        {/* Icon */}
        <div className="text-5xl mb-4 select-none">📚</div>

        {/* Heading */}
        <h3 className="font-garamond text-2xl md:text-3xl font-semibold text-white mb-3">
          End of Free Preview
        </h3>

        {/* Message */}
        <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-md mx-auto">
          {previewData.endPreviewMessage ??
            "You've reached the end of the free preview. Purchase the full book to continue reading."}
        </p>

        {/* Purchase platforms */}
        {enabledPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <PurchasePlatforms platforms={enabledPlatforms} compact />
          </div>
        )}

        {/* Fallback direct button if endPreviewButtonUrl provided and no platforms */}
        {enabledPlatforms.length === 0 && previewData.endPreviewButtonUrl && (
          <a
            href={previewData.endPreviewButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
          >
            {previewData.endPreviewButtonText ?? 'Buy Now'}
          </a>
        )}

        {/* Decorative Sanskrit symbol */}
        <p className="text-amber-400/30 text-3xl mt-6 select-none font-garamond">॥</p>
      </div>
    </div>
  )
}
