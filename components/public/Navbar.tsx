'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/haridas',    label: 'Haridas' },
  { href: '/contact',    label: 'Contact' },
]

interface NavbarProps {
  /** 'dark' = deep blue bg with white text (home hero).
   *  'light' = cream bg with dark text (all other pages). Default: 'light' */
  variant?: 'light' | 'dark'
}

export default function Navbar({ variant = 'light' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const [pastHero, setPastHero] = useState(false)
  const isDark = variant === 'dark' && !pastHero

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
          // ── Dark variant (home page) ──────────────────────────────
          background: scrolled ? 'rgba(10,31,68,0.98)' : '#0A1F44',
          borderBottom: '1px solid rgba(200,150,12,0.3)',
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
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl font-garamond font-semibold tracking-wide" style={{ color: '#C8960C' }}>
              Voice of Dharma
            </span>
            <span className={`text-xs font-inter tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
              Foundation
            </span>
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
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(10, 31, 68, 0.97)' } as React.CSSProperties}
          >
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-3xl font-garamond transition-colors relative ${
                      active ? 'text-amber-400' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </Link>
                )
              })}
              <Link
                href="/donate"
                onClick={() => setMenuOpen(false)}
                className="mt-4 text-lg px-10 py-3 rounded-full font-semibold"
                style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)', color: 'white' }}
              >
                Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
