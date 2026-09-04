'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  href: string
  label: string
  icon: (active: boolean) => React.ReactNode
}

const navLinks: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/activities',
    label: 'Activities',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: '/philosophy',
    label: 'Philosophy',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
  {
    href: '/haridas',
    label: 'Haridas',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: '/letter-to-krishna',
    label: 'Letter to Krishna',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/publications',
    label: 'Publications',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: (active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

interface NavbarProps {
  /** 'dark' = deep blue bg with white text (home hero).
   *  'light' = cream bg with dark text (all other pages). Default: 'light' */
  variant?: 'light' | 'dark'
  /** When true, navbar stays dark regardless of scroll position.
   *  Use on pages with a dark background that must never flip to cream. */
  keepDark?: boolean
}

export default function Navbar({ variant = 'light', keepDark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const [pastHero, setPastHero] = useState(false)
  // keepDark overrides the scroll-based pastHero flip — used on sanctuary pages
  const isDark = keepDark || (variant === 'dark' && !pastHero)

  // Check if link is active — exact match for '/', prefix match for others
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      // ~580px covers: navbar height + 40px top pad + 520px card + 40px bottom = hero section
      setPastHero(window.scrollY > 580)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={isDark ? {
          // ── Dark variant ──────────────────────────────
          background: keepDark
            ? (scrolled ? 'rgba(2, 5, 9, 0.98)' : '#020509')
            : (scrolled ? 'rgba(10,31,68,0.98)' : '#0A1F44'),
          borderBottom: keepDark
            ? '1px solid rgba(251, 191, 36, 0.15)'
            : '1px solid rgba(200,150,12,0.3)',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
          paddingTop: scrolled ? '0.6rem' : '0.9rem',
          paddingBottom: scrolled ? '0.6rem' : '0.9rem',
        } : {
          // ── Light variant (all other pages) ──────────────────────
          background: '#FDF6EC',
          borderBottom: '1px solid rgba(200,150,12,0.18)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          paddingTop: scrolled ? '0.6rem' : '0.9rem',
          paddingBottom: scrolled ? '0.6rem' : '0.9rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-14 h-14 md:w-16 md:h-16">
              <Image 
                src="/images/logo-transparent.png" 
                alt="Voice of Dharma Foundation Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-garamond font-semibold tracking-wide" style={{ color: '#C8960C' }}>
                Voice of Dharma
              </span>
              <span className={`text-[10px] md:text-xs font-inter tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 py-1 ${
                    isDark
                      ? active ? 'text-amber-400' : 'text-white/80 hover:text-amber-300'
                      : active ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {link.label}
                  {/* Active dot indicator */}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#C8960C' }}
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/donate"
              className={`relative text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                isActive('/donate') ? 'ring-2 ring-amber-300 ring-offset-1' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)', color: 'white' }}
            >
              Donate
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer (matching reference design in sacred theme) ── */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in Card Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-[85%] max-w-[340px] h-full shadow-2xl flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0A1F44 0%, #061329 100%)',
                borderLeft: '1px solid rgba(200, 150, 12, 0.25)',
              }}
            >
              {/* Drawer Header with Close Chevron */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-amber-400/10">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/images/logo-transparent.png"
                      alt="Voice of Dharma"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-garamond font-semibold text-lg text-amber-400">
                    Voice of Dharma
                  </span>
                </div>

                {/* Close Chevron button < */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-amber-300/80 hover:text-amber-200 hover:bg-white/10 transition-colors border border-amber-400/20"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Stack of Pill Items (Reference Design) */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
                {navLinks.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-amber-400/20 via-amber-300/15 to-transparent text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-900/20'
                          : 'bg-white/[0.04] text-gray-200 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {/* Icon container */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          active
                            ? 'bg-amber-400 text-[#0A1F44] shadow-md shadow-amber-400/20'
                            : 'bg-white/[0.06] text-amber-400/80'
                        }`}
                      >
                        {link.icon(active)}
                      </div>

                      {/* Label */}
                      <span className={`text-base font-inter tracking-wide ${active ? 'font-semibold text-amber-200' : 'font-medium'}`}>
                        {link.label}
                      </span>
                    </Link>
                  )
                })}

                {/* Donate CTA Pill */}
                <Link
                  href="/donate"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-4 py-3.5 mt-3 rounded-2xl font-inter font-semibold text-base text-white shadow-lg transition-transform active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #C8960C, #F5A623)',
                    boxShadow: '0 4px 16px rgba(200, 150, 12, 0.35)',
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>Donate Now</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
