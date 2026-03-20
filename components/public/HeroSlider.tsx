'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Slide {
  title: string
  subtitle: string
  body: string
  cta: string
  ctaHref: string
  image?: string
}

interface HeroSliderProps {
  slides: Slide[]
  gitaQuote: string
  gitaQuoteRef: string
}

export default function HeroSlider({ slides, gitaQuote, gitaQuoteRef }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const pathMap: Record<string, string> = {
    karma: '/karma',
    bhakti: '/bhakti',
    gyan: '/gyan',
  }

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden lotus-pattern"
      style={{ background: '#0A1F44' }}
    >
      {/* Slide background images */}
      <AnimatePresence>
        {slides[current]?.image && (
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10,31,68,0.72)' }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(200,150,12,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.2) 0%, transparent 50%)',
        }}
      />

      {/* Main slider */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Sanskrit-style ornament */}
              <div className="mb-4 text-amber-400/60 text-4xl select-none">॥</div>

              <h1
                className="font-garamond font-semibold leading-none mb-4"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 9rem)',
                  background: 'linear-gradient(135deg, #C8960C, #F5A623, #C8960C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {slides[current]?.title}
              </h1>

              <h2 className="font-garamond text-xl md:text-2xl text-white/80 mb-6 font-normal tracking-wide">
                {slides[current]?.subtitle}
              </h2>

              <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
                {slides[current]?.body}
              </p>

              <Link
                href={pathMap[slides[current]?.title?.toLowerCase()] || '/philosophy'}
                className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #C8960C, #F5A623)',
                  boxShadow: '0 4px 20px rgba(200,150,12,0.3)',
                }}
              >
                Explore {slides[current]?.title} Yoga
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrow controls */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 p-3 rounded-full border border-white/20 text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-all"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={next}
          className="absolute right-4 md:right-8 p-3 rounded-full border border-white/20 text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-all"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-3 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-amber-400'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Gita quote strip */}
      {gitaQuote && (
        <div
          className="border-t border-amber-400/20 py-5 px-6 text-center"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <p className="font-garamond text-base md:text-lg text-white/80 italic max-w-3xl mx-auto">
            &ldquo;{gitaQuote}&rdquo;
          </p>
          {gitaQuoteRef && (
            <p className="text-amber-400/80 text-sm mt-1 tracking-wider">
              — {gitaQuoteRef}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
