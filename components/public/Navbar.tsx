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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Check if link is active — exact match for '/', prefix match for others
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl font-garamond font-semibold tracking-wide" style={{ color: '#C8960C' }}>
              Voice of Dharma
            </span>
            <span className={`text-xs font-inter tracking-widest uppercase transition-colors ${scrolled ? 'text-gray-500' : 'text-gray-300'}`}>
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
                    active
                      ? scrolled ? 'text-amber-600' : 'text-amber-400'
                      : scrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
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
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-gray-700' : 'bg-white'}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${scrolled ? 'bg-gray-700' : 'bg-white'}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-gray-700' : 'bg-white'}`} />
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
