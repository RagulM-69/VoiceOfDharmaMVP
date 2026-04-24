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

  // Custom focus properties for desktop where heavy cropping happens on landscape
  const desktopFocusMap: Record<string, string> = {
    karma: 'center 45%', // shifted up to show full heads
    bhakti: 'center 40%', // shifted up for woman's head
    gyan: 'center 80%',  // shifted up to include monk's head securely
  }

  // Shared background image renderer
  const BgImage = ({ keyPrefix, isDesktop = false }: { keyPrefix: string; isDesktop?: boolean }) => {
    const slideTitle = slides[current]?.title?.toLowerCase() || ''
    // Mobile is perfectly framed at 'center 60%', desktop uses custom crop points
    const bgPosition = isDesktop ? (desktopFocusMap[slideTitle] || 'center') : 'center 60%'

    return (
      <AnimatePresence>
        {slides[current]?.image && (
          <motion.div
            key={`${keyPrefix}-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: 'cover',
              backgroundPosition: bgPosition,
            }}
          />
        )}
      </AnimatePresence>
    )
  }

  return (
    <section
      style={{ background: '#FDF6EC' }}
      className="pt-[var(--navbar-h,80px)] pb-8"
    >
      {/* Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 12px' }}>

        {/* Outer card wrapper — NO background image here, each section owns its own */}
        <div
          className="overflow-hidden"
          style={{ background: '#0A1F44', border: '1px solid rgba(255,255,255,0.1)' }}
        >

          {/* ═══════════════════════════════════════════════════
              MOBILE  (< md) — image-dominant, fixed 380px,
              image contained & clipped within this div only
          ═══════════════════════════════════════════════════ */}
          <div
            className="block md:hidden relative overflow-hidden"
            style={{ height: '380px' }}
          >
            {/* Background image clipped to 380px */}
            <BgImage keyPrefix="mob" />

            {/* Bottom-to-top gradient for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(10,31,68,0.1) 0%, rgba(10,31,68,0.15) 35%, rgba(10,31,68,0.80) 68%, rgba(10,31,68,0.96) 100%)',
              }}
            />

            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full border border-white/25 text-white/80 hover:text-amber-400 hover:border-amber-400/50 transition-all"
              aria-label="Previous slide"
            >←</button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full border border-white/25 text-white/80 hover:text-amber-400 hover:border-amber-400/50 transition-all"
              aria-label="Next slide"
            >→</button>

            {/* Bottom overlay content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`mob-content-${current}`}
                custom={direction}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5"
              >
                <div className="text-amber-400/70 text-xl select-none mb-1">॥</div>
                <h1
                  className="font-garamond font-semibold leading-tight mb-1.5"
                  style={{
                    fontSize: 'clamp(2rem, 10vw, 2.6rem)',
                    background: 'linear-gradient(135deg, #C8960C, #F5A623, #C8960C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {slides[current]?.title}
                </h1>
                <p className="text-white/75 text-sm mb-3 leading-snug">
                  {slides[current]?.subtitle}
                </p>
                <Link
                  href={pathMap[slides[current]?.title?.toLowerCase()] || '/philosophy'}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-300 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #C8960C, #F5A623)',
                    boxShadow: '0 3px 14px rgba(200,150,12,0.4)',
                  }}
                >
                  Explore {slides[current]?.title} <span className="text-base">›</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══════════════════════════════════════════════════
              DESKTOP (≥ md) — centered text, min 520px,
              image also self-contained in this div
          ═══════════════════════════════════════════════════ */}
          <div
            className="hidden md:block relative overflow-hidden"
            style={{ minHeight: '540px' }}
          >
            {/* Background image — focused specifically per-slide for desktop */}
            <BgImage keyPrefix="desk" isDesktop={true} />

            {/* Minimal bottom-weighted gradient — same approach as mobile */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(10,31,68,0.08) 0%, rgba(10,31,68,0.15) 30%, rgba(10,31,68,0.55) 60%, rgba(10,31,68,0.80) 80%, rgba(10,31,68,0.90) 100%)',
              }}
            />

            {/* Centered content */}
            <div className="relative py-12 flex items-center justify-center px-6 lg:px-12" style={{ minHeight: '540px' }}>
              <div className="max-w-4xl mx-auto text-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`desk-content-${current}`}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-4 text-amber-400/60 text-4xl select-none">॥</div>

                    <h1
                      className="font-garamond font-semibold leading-none mb-4"
                      style={{
                        fontSize: 'clamp(3rem, 7vw, 6rem)',
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

              {/* Desktop arrows */}
              <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/20 text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-all"
                aria-label="Previous slide"
              >←</button>
              <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/20 text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-all"
                aria-label="Next slide"
              >→</button>
            </div>
          </div>

          {/* ─── Dot indicators — solid dark bg, no image bleed ─── */}
          <div
            className="flex justify-center gap-3 py-4"
            style={{ background: '#0A1F44', borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
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

        </div>{/* /outer card */}
      </div>{/* /container */}
    </section>
  )
}
