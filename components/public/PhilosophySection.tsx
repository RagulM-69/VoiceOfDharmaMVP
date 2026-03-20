interface PhilosophySectionProps {
  id: string
  heading: string
  body: string
  quote: string
  quoteRef: string
  color: string
  icon: string
}

export default function PhilosophySection({
  id,
  heading,
  body,
  quote,
  quoteRef,
  color,
  icon,
}: PhilosophySectionProps) {
  return (
    <section id={id} className="py-20 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6">
          <div className="section-divider mb-3" />
          <h2
            className="font-garamond text-4xl md:text-5xl font-semibold"
            style={{ color: '#0A1F44' }}
          >
            {heading}
          </h2>
        </div>

        {/* Body */}
        <p className="text-gray-700 text-lg leading-relaxed mb-10">{body}</p>

        {/* Quote */}
        {quote && (
          <blockquote
            className="gita-quote"
            style={{ borderColor: color }}
          >
            <p
              className="font-garamond text-xl md:text-2xl italic leading-relaxed"
              style={{ color: '#1A1A1A' }}
            >
              &ldquo;{quote}&rdquo;
            </p>
            {quoteRef && (
              <cite
                className="block mt-3 text-sm font-semibold tracking-wider not-italic"
                style={{ color }}
              >
                — {quoteRef}
              </cite>
            )}
          </blockquote>
        )}
      </div>
    </section>
  )
}
