
import Link from 'next/link'
import type { SiteSettings } from '@/types'

const PRACTICE_LINKS = [
  { href: '/practice-areas/corporate-law', label: 'Corporate Law' },
  { href: '/practice-areas/litigation', label: 'Litigation' },
  { href: '/practice-areas/real-estate', label: 'Real Estate' },
  { href: '/practice-areas/employment-law', label: 'Employment Law' },
]

interface FooterProps {
  settings: SiteSettings | null
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()
  const firmName = settings?.firmName ?? 'The Firm'
  const founded = settings?.foundedYear

  return (
    <footer className="bg-navy-950 border-t border-navy-700">
      {/* Top CTA strip */}
      <div className="border-b border-navy-700">
        <div className="container-site py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gold-rule mb-2">Ready to Speak with Us?</p>
            <h2 className="font-display text-3xl font-light italic text-cream-200">
              Schedule a Confidential Consultation
            </h2>
          </div>
          <div className="flex gap-4 shrink-0">
            <a href={`tel:${settings?.phone}`} className="btn-outline">
              Call Now
            </a>
            <Link href="/contact" className="btn-primary">
              Book a Meeting
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-site py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="font-display text-xl font-medium text-cream-200 tracking-wide">
            {firmName}
          </Link>
          {founded && (
            <p className="text-warm-500 text-sm mt-1">Established {founded}</p>
          )}
          <div className="gold-line" />
          <p className="text-warm-500 text-sm leading-relaxed max-w-xs">
            {settings?.description ??
              'Committed to delivering exceptional legal representation with integrity and precision.'}
          </p>

          {/* Contact info & Socials */}
          <div className="mt-6 space-y-3 text-sm">
            {settings?.address && (
              <p className="text-warm-400">{settings.address}</p>
            )}
            {settings?.city && (
              <p className="text-warm-400">{settings.city}</p>
            )}
            
            <div className="pt-2 space-y-3">
              {/* Phone with SVG */}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{settings.phone}</span>
                </a>
              )}

              {/* Email with SVG */}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{settings.email}</span>
                </a>
              )}
              
              {/* LinkedIn Integration */}
              {settings?.linkedIn && (
                <a
                  href={settings.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-500 hover:text-gold-400 transition-colors"
                  aria-label={`Follow ${firmName} on LinkedIn`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Connect on LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div>
          <h3 className="text-gold-rule mb-4">Practice Areas</h3>
          <ul className="space-y-3">
            {PRACTICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-warm-500 hover:text-cream-200 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/practice-areas"
                className="text-gold-500 hover:text-gold-400 text-sm transition-colors"
              >
                View All →
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-gold-rule mb-4">Firm</h3>
          <ul className="space-y-3">
            {[
              { href: '/team', label: 'Our Attorneys' },
              { href: '/results', label: 'Case Results' },
              { href: '/insights', label: 'Legal Insights' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/studio', label: 'Client Portal' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-warm-500 hover:text-cream-200 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-700">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-600">
          <p>
            © {year} {firmName}. All rights reserved.
          </p>
          <p className="text-center">
            Attorney advertising. Prior results do not guarantee a similar outcome.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-warm-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-warm-400 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
