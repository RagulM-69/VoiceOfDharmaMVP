import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { PurchasePlatform } from '@/lib/sanity/types'

interface Props {
  platforms: PurchasePlatform[]
  isComingSoon?: boolean
  /** Compact mode — used inside EndPreviewCTA */
  compact?: boolean
}

export default function PurchasePlatforms({ platforms, isComingSoon = false, compact = false }: Props) {
  const enabledPlatforms = platforms
    .filter((p) => p.enabled !== false)
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))

  if (enabledPlatforms.length === 0) return null

  return (
    <div className={compact ? 'flex flex-wrap gap-3 justify-center' : 'flex flex-col sm:flex-row flex-wrap gap-3'}>
      {enabledPlatforms.map((platform) => {
        const logoUrl = platform.platformLogo
          ? urlFor(platform.platformLogo).width(100).height(100).format('webp').url()
          : null

        if (isComingSoon) {
          return (
            <div
              key={platform._key}
              className={`
                inline-flex items-center gap-2.5 rounded-full font-semibold text-sm
                bg-gray-100 text-gray-400 cursor-not-allowed select-none
                ${compact ? 'px-5 py-2.5' : 'px-6 py-3'}
              `}
              aria-disabled="true"
              title="This book is coming soon"
            >
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={platform.platformName}
                  width={18}
                  height={18}
                  className="opacity-40 grayscale rounded"
                />
              )}
              {platform.buttonText}
              <span className="text-xs font-normal">(Coming Soon)</span>
            </div>
          )
        }

        return (
          <a
            key={platform._key}
            href={platform.purchaseUrl}
            target={platform.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2.5 rounded-full font-semibold text-sm text-white
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
              focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
              ${compact ? 'px-5 py-2.5' : 'px-6 py-3'}
            `}
            style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
            aria-label={`${platform.buttonText} on ${platform.platformName}`}
          >
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={platform.platformName}
                width={18}
                height={18}
                className="rounded object-contain brightness-0 invert"
              />
            )}
            {platform.buttonText}
          </a>
        )
      })}
    </div>
  )
}
