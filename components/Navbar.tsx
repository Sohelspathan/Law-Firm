'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/practice-areas', label: 'Practice Areas' },
  { href: '/team', label: 'Our Team' },
  { href: '/results', label: 'Results' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  firmName: string
}

export function Navbar({ firmName }: NavbarProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-navy-900/95 backdrop-blur-sm border-b border-navy-700'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="container-site flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-medium text-cream-200 tracking-wide hover:text-gold-400 transition-colors"
        >
          {firmName}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm uppercase tracking-[0.1em] transition-colors duration-200 ${
                  isActive
                    ? 'text-gold-400'
                    : 'text-warm-400 hover:text-cream-200'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link href="/contact" className="btn-primary">
            Free Consultation
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation"
        >
          <span
            className={`block w-6 h-px bg-cream-200 transition-all duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-cream-200 transition-all duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-cream-200 transition-all duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-navy-800 border-t border-navy-700 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-site py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm uppercase tracking-[0.1em] text-warm-400 hover:text-gold-400 transition-colors py-2 border-b border-navy-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary mt-4 justify-center">
            Free Consultation
          </Link>
        </nav>
      </div>
    </header>
  )
}
