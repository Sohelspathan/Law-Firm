import type { Metadata } from 'next'
import { getSiteSettings, getPracticeAreasSummary } from '@/sanity/lib/queries'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Schedule a confidential consultation with one of our attorneys. Initial consultations are free.',
}

export default async function ContactPage() {
  const [settings, practiceAreas] = await Promise.all([
    getSiteSettings(),
    getPracticeAreasSummary(),
  ])

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 bg-navy-950 noise-overlay">
        <div className="container-site">
          <div className="section-label">Start the Conversation</div>
          <h1 className="heading-display text-6xl md:text-7xl max-w-2xl">
            Contact Us
          </h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-lg max-w-xl leading-relaxed">
            Every matter begins with a conversation. Tell us about your situation and we&rsquo;ll
            connect you with the right attorney — no obligation, no fee for the initial consultation.
          </p>
        </div>
      </section>

      <section className="section-padding bg-navy-900">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">

            {/* Form */}
            <div>
              <div className="section-label mb-6">Request a Consultation</div>
              <ContactForm practiceAreas={practiceAreas} />
            </div>

            {/* Office Info Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28">

              {/* Direct contact */}
              <div className="card-dark p-8">
                <p className="text-gold-rule mb-6">Prefer to Reach Out Directly?</p>

                {settings?.phone && (
                  <div className="mb-6">
                    <p className="text-warm-600 text-xs uppercase tracking-widest mb-1">
                      Call or Text
                    </p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="font-display text-2xl text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      {settings.phone}
                    </a>
                    <p className="text-warm-600 text-xs mt-1">Mon–Fri 9am–6pm</p>
                  </div>
                )}

                {settings?.email && (
                  <div className="mb-6">
                    <p className="text-warm-600 text-xs uppercase tracking-widest mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-gold-400 hover:text-gold-300 transition-colors text-sm break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                )}

                <div className="border-t border-navy-600 pt-6">
                  <p className="text-warm-600 text-xs uppercase tracking-widest mb-2">
                    Office Address
                  </p>
                  {settings?.address && (
                    <p className="text-warm-400 text-sm">{settings.address}</p>
                  )}
                  {settings?.city && (
                    <p className="text-warm-400 text-sm">{settings.city}</p>
                  )}
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-navy-800 border border-navy-600 p-8">
                <p className="text-gold-rule mb-4">What to Expect</p>
                <ul className="space-y-4">
                  {[
                    {
                      step: '01',
                      text: 'Submit the form — we respond within one business day.',
                    },
                    {
                      step: '02',
                      text: 'We schedule a 30-minute consultation at your convenience.',
                    },
                    {
                      step: '03',
                      text: 'An attorney reviews your matter and advises on next steps.',
                    },
                    {
                      step: '04',
                      text: 'If we are the right fit, we begin the engagement process.',
                    },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="font-display text-gold-600 text-lg leading-none mt-0.5 shrink-0">
                        {item.step}
                      </span>
                      <p className="text-warm-400 text-sm leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confidentiality note */}
              <div className="bg-navy-700/50 border border-navy-600 p-6 rounded-sm">
                <div className="flex gap-3">
                  <span className="text-gold-500 text-xl shrink-0" aria-hidden="true">
                    🔒
                  </span>
                  <p className="text-warm-500 text-xs leading-relaxed">
                    All communications are protected by attorney-client privilege. We never share
                    your information without explicit consent.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Map placeholder + directions */}
      <section className="bg-navy-950 border-t border-navy-800">
        <div className="h-72 bg-navy-800 flex items-center justify-center relative overflow-hidden">
          {/* Replace the block below with an actual <iframe> Google Map embed */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 40px, #1A1F35 40px, #1A1F35 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #1A1F35 40px, #1A1F35 41px)',
            }}
          />
          <div className="relative z-10 text-center">
            <span className="text-4xl block mb-3" aria-hidden="true">📍</span>
            <p className="text-warm-400 text-sm">
              {settings?.address}
              {settings?.city ? `, ${settings.city}` : ''}
            </p>
            {settings?.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${settings.address} ${settings.city ?? ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-4 text-xs"
              >
                Open in Google Maps
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Tip: Replace the div above with: */}
        <iframe className="px-4 md:px-8 lg:px-40"
          src="https://maps.google.com/maps?q=20.000986,73.783117&z=15&output=embed"
           width="100%"
          height="288"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
