import type { ContentMap } from '@/types'
import { getContent } from '@/lib/content'

interface TimelineProps {
  content: ContentMap
}

const TIMELINE_YEARS = ['2020', '2021', '2022', '2023', '2024']

export default function Timeline({ content }: TimelineProps) {
  const entries = TIMELINE_YEARS.map((year) => ({
    year,
    event: getContent(content, 'home', 'timeline', year, ''),
  })).filter((e) => e.event)

  if (entries.length === 0) return null

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600/20" />

      <div className="space-y-8">
        {entries.map((entry, index) => (
          <div key={entry.year} className="relative flex items-start gap-6 pl-16">
            {/* Dot */}
            <div className="absolute left-4 w-4 h-4 rounded-full border-2 border-amber-400 bg-white -translate-x-1/2 mt-0.5" />

            <div>
              <span
                className="text-sm font-bold tracking-widest"
                style={{ color: '#C8960C' }}
              >
                {entry.year}
              </span>
              <p className="text-gray-700 mt-1 leading-relaxed">{entry.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
