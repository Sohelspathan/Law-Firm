import type { Metadata } from 'next'
import { getPracticeAreasSummary } from '@/sanity/lib/queries'
import { PracticeAreaCard } from '@/components/Cards'

export const metadata: Metadata = {
  title: 'Practice Areas',
  description:
    'Explore our full range of legal services — from corporate law and litigation to real estate and employment.',
}

export default async function PracticeAreasPage() {
  const practiceAreas = await getPracticeAreasSummary()

  return (
    <>
      {/* Page Header */}
      <section className="pt-40 pb-20 bg-navy-950 noise-overlay">
        <div className="container-site">
          <div className="section-label">Legal Services</div>
          <h1 className="heading-display text-6xl md:text-7xl max-w-2xl">
            Our Practice Areas
          </h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-lg max-w-xl leading-relaxed">
            Decades of focused expertise across the areas that matter most to our clients — businesses,
            families, and individuals.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-navy-900">
        <div className="container-site">
          {practiceAreas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-700">
              {practiceAreas.map((area) => (
                <PracticeAreaCard key={area._id} area={area} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-warm-500">
                Practice areas are being updated — please check back shortly or{' '}
                <a href="/contact" className="text-gold-400 hover:underline">
                  contact us
                </a>{' '}
                directly.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
