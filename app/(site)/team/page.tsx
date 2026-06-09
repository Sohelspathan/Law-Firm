import type { Metadata } from 'next'
import { getAttorneysSummary } from '@/sanity/lib/queries'
import { AttorneyCard } from '@/components/Cards'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the experienced attorneys at our firm. Each brings decades of focused expertise and a commitment to client outcomes.',
}

export default async function TeamPage() {
  const attorneys = await getAttorneysSummary()

  // Group by seniority (partners vs associates) if needed — simple split for now
  const partners = attorneys.filter(
    (a) =>
      a.role.toLowerCase().includes('partner') ||
      a.role.toLowerCase().includes('principal')
  )
  const associates = attorneys.filter(
    (a) =>
      !a.role.toLowerCase().includes('partner') &&
      !a.role.toLowerCase().includes('principal')
  )

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 bg-navy-950 noise-overlay">
        <div className="container-site">
          <div className="section-label">The People Behind the Work</div>
          <h1 className="heading-display text-6xl md:text-7xl max-w-2xl">
            Our Attorneys
          </h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-lg max-w-xl leading-relaxed">
            Our attorneys are practitioners, not just advisors. They bring trial experience,
            negotiation acumen, and deep subject-matter knowledge to every matter.
          </p>
        </div>
      </section>

      {attorneys.length === 0 ? (
        <section className="section-padding bg-navy-900 text-center">
          <div className="container-site">
            <p className="text-warm-500 py-20">
              Attorney profiles coming soon — please{' '}
              <Link href="/contact" className="text-gold-400 hover:underline">
                contact us
              </Link>{' '}
              in the meantime.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Partners */}
          {partners.length > 0 && (
            <section className="section-padding bg-navy-900">
              <div className="container-site">
                <div className="section-label">Leadership</div>
                <h2 className="heading-serif text-4xl mb-10">
                  Partners &{' '}
                  <span className="font-light italic">Principals</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((attorney) => (
                    <AttorneyCard key={attorney._id} attorney={attorney} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Associates */}
          {associates.length > 0 && (
            <section className={`section-padding ${partners.length > 0 ? 'bg-navy-800' : 'bg-navy-900'}`}>
              <div className="container-site">
                {partners.length > 0 && (
                  <>
                    <div className="section-label">Counsel</div>
                    <h2 className="heading-serif text-4xl mb-10">
                      Associates &{' '}
                      <span className="font-light italic">Of Counsel</span>
                    </h2>
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {associates.map((attorney) => (
                    <AttorneyCard key={attorney._id} attorney={attorney} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Why Join / Culture strip */}
      <section className="py-20 bg-navy-950 border-t border-navy-700">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700">
            {[
              {
                label: 'Client-First Philosophy',
                body: 'Every decision we make is filtered through one question: what is best for the client?',
              },
              {
                label: 'Cross-Practice Collaboration',
                body: 'Complex matters benefit from attorneys who consult across practice groups.',
              },
              {
                label: 'Confidential by Design',
                body: 'Attorney-client privilege is not just a legal concept — it is a commitment we take seriously.',
              },
            ].map((item) => (
              <div key={item.label} className="bg-navy-900 p-10">
                <div className="gold-line" />
                <h3 className="font-display text-xl font-medium text-cream-200 mb-3">
                  {item.label}
                </h3>
                <p className="text-warm-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
