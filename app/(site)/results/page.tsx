import type { Metadata } from 'next'
import Link from 'next/link'
import { getCaseResults, getPracticeAreasSummary } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Case Results',
  description:
    'A selection of notable outcomes achieved for our clients across all practice areas.',
}

export default async function ResultsPage() {
  const [results, practiceAreas] = await Promise.all([
    getCaseResults(),
    getPracticeAreasSummary(),
  ])

  const featured = results.filter((r) => r.featured)
  const others = results.filter((r) => !r.featured)

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 bg-navy-950 noise-overlay">
        <div className="container-site">
          <div className="section-label">Proven Performance</div>
          <h1 className="heading-display text-6xl md:text-7xl max-w-2xl">
            Case Results
          </h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-lg max-w-xl leading-relaxed">
            Outcomes speak louder than credentials. Below is a selection of notable results
            across our practice areas — each one representing a real client with real stakes.
          </p>
          <p className="text-warm-600 text-xs mt-4 max-w-lg">
            Past results do not guarantee a similar outcome. Every matter is unique.
          </p>
        </div>
      </section>

      {results.length === 0 ? (
        <section className="section-padding bg-navy-900 text-center">
          <div className="container-site">
            <p className="text-warm-500 py-20">
              Case results are being compiled — please{' '}
              <Link href="/contact" className="text-gold-400 hover:underline">
                contact us
              </Link>{' '}
              to learn more about our track record.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Results */}
          {featured.length > 0 && (
            <section className="section-padding bg-navy-900">
              <div className="container-site">
                <div className="section-label">Landmark Outcomes</div>
                <h2 className="heading-serif text-4xl mb-10">
                  Featured{' '}
                  <span className="font-light italic">Results</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700">
                  {featured.map((result) => (
                    <div
                      key={result._id}
                      className="bg-navy-800 p-10 flex flex-col gap-4 group hover:bg-navy-700 transition-colors"
                    >
                      <span className="font-display text-5xl font-light text-gold-400">
                        {result.outcome}
                      </span>
                      <div className="w-8 h-px bg-gold-600" />
                      <h3 className="font-display text-xl font-medium text-cream-200">
                        {result.title}
                      </h3>
                      <p className="text-warm-500 text-sm leading-relaxed flex-1">
                        {result.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-navy-600 mt-auto">
                        {result.practiceArea && (
                          <Link
                            href={`/practice-areas/${result.practiceArea.slug.current}`}
                            className="text-gold-rule hover:text-gold-400 transition-colors"
                          >
                            {result.practiceArea.title}
                          </Link>
                        )}
                        {result.year && (
                          <span className="text-warm-600 text-xs">{result.year}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Additional Results */}
          {others.length > 0 && (
            <section className="section-padding bg-navy-950">
              <div className="container-site">
                {featured.length > 0 && (
                  <h2 className="heading-serif text-4xl mb-10">
                    Additional{' '}
                    <span className="font-light italic">Outcomes</span>
                  </h2>
                )}

                {/* Table-style layout for additional results */}
                <div className="divide-y divide-navy-700 border-t border-navy-700">
                  {others.map((result) => (
                    <div
                      key={result._id}
                      className="grid grid-cols-1 md:grid-cols-[200px_1fr_180px] gap-4 py-8 group"
                    >
                      {/* Outcome badge */}
                      <div>
                        <span className="font-display text-2xl font-light text-gold-400">
                          {result.outcome}
                        </span>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="font-display text-lg font-medium text-cream-200 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-warm-500 text-sm leading-relaxed">
                          {result.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-col gap-1 md:items-end">
                        {result.practiceArea && (
                          <Link
                            href={`/practice-areas/${result.practiceArea.slug.current}`}
                            className="text-gold-rule hover:text-gold-400 transition-colors text-[10px]"
                          >
                            {result.practiceArea.title}
                          </Link>
                        )}
                        {result.year && (
                          <span className="text-warm-600 text-xs">{result.year}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Practice area filter suggestion */}
      {practiceAreas.length > 0 && (
        <section className="py-16 bg-navy-800 border-t border-navy-700">
          <div className="container-site">
            <p className="text-warm-500 text-sm mb-6 uppercase tracking-widest">
              Browse Results by Practice Area
            </p>
            <div className="flex flex-wrap gap-3">
              {practiceAreas.map((area) => (
                <Link
                  key={area._id}
                  href={`/practice-areas/${area.slug.current}`}
                  className="border border-navy-500 text-warm-400 hover:border-gold-500 hover:text-gold-400
                             text-xs uppercase tracking-widest px-4 py-2 transition-colors"
                >
                  {area.icon} {area.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-navy-700 text-center">
        <div className="container-site">
          <h2 className="heading-display text-4xl mb-4">
            Let&rsquo;s Build Your Result Together
          </h2>
          <p className="text-warm-400 max-w-md mx-auto mb-8 leading-relaxed">
            Every result on this page started with a single consultation. Yours can too.
          </p>
          <Link href="/contact" className="btn-primary">
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
