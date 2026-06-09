import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getPracticeAreaBySlug,
  getPracticeAreaSlugs,
  getAttorneysSummary,
  getCaseResults,
} from '@/sanity/lib/queries'
import { sanityImage } from '@/sanity/lib/image'
import { PortableText } from '@/components/PortableText'
import { AttorneyCard } from '@/components/Cards'

interface Props {
  params: Promise<{ slug: string }>
}

// ─── generateStaticParams ──────────────────────────────────────────────────────
// Pre-renders every practice area page at build time.
// Crawlers get fully rendered HTML → better SEO + faster TTFB.
export async function generateStaticParams() {
  const slugs = await getPracticeAreaSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await getPracticeAreaBySlug(slug)
  if (!area) return { title: 'Not Found' }
  return {
    title: area.title,
    description: area.description,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params
  const [area, allAttorneys, allResults] = await Promise.all([
    getPracticeAreaBySlug(slug),
    getAttorneysSummary(),
    getCaseResults(),
  ])

  if (!area) notFound()

  // Filter related data
  const relatedAttorneys = allAttorneys.filter((a) =>
    a.specializations?.some((s) =>
      s.toLowerCase().includes(area.title.toLowerCase().split(' ')[0])
    )
  )
  const relatedResults = allResults.filter(
    (r) => r.practiceArea?.title === area.title
  )

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 noise-overlay overflow-hidden">
        {area.heroImage && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={sanityImage(area.heroImage, { width: 1600, height: 600 })}
                alt={area.heroImage.alt ?? area.title}
                fill
                className="object-cover opacity-15"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/50 z-[1]" />
          </>
        )}
        <div className="container-site relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-warm-500 mb-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/practice-areas" className="hover:text-gold-400 transition-colors">
              Practice Areas
            </Link>
            <span>›</span>
            <span className="text-gold-400">{area.title}</span>
          </nav>

          <span className="text-4xl mb-4 block" aria-hidden="true">
            {area.icon}
          </span>
          <h1 className="heading-display text-6xl md:text-7xl mb-4">{area.title}</h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-xl max-w-xl leading-relaxed">
            {area.description}
          </p>

          <div className="mt-10">
            <Link href="/contact" className="btn-primary">
              Consult an Attorney
            </Link>
          </div>
        </div>
      </section>

      {/* Body Content */}
      {area.body && area.body.length > 0 && (
        <section className="section-padding bg-navy-900">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <PortableText value={area.body} />
            </div>
          </div>
        </section>
      )}

      {/* Related Case Results */}
      {relatedResults.length > 0 && (
        <section className="section-padding bg-navy-950">
          <div className="container-site">
            <div className="section-label">Our Track Record</div>
            <h2 className="heading-serif text-4xl mb-10">
              {area.title}{' '}
              <span className="font-light italic">Results</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-700">
              {relatedResults.map((result) => (
                <div key={result._id} className="bg-navy-900 p-8">
                  <span className="font-display text-3xl font-light text-gold-400 block mb-3">
                    {result.outcome}
                  </span>
                  <div className="w-6 h-px bg-gold-600 mb-4" />
                  <h3 className="font-display text-lg font-medium text-cream-200 mb-2">
                    {result.title}
                  </h3>
                  <p className="text-warm-500 text-sm leading-relaxed">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Attorneys */}
      {relatedAttorneys.length > 0 && (
        <section className="section-padding bg-navy-800">
          <div className="container-site">
            <div className="section-label">Who Handles This</div>
            <h2 className="heading-serif text-4xl mb-10">
              {area.title}{' '}
              <span className="font-light italic">Attorneys</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedAttorneys.slice(0, 3).map((attorney) => (
                <AttorneyCard key={attorney._id} attorney={attorney} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-navy-700 text-center">
        <div className="container-site">
          <h2 className="heading-display text-4xl mb-4">
            Need Help with {area.title}?
          </h2>
          <p className="text-warm-400 max-w-md mx-auto mb-8 leading-relaxed">
            Speak with an attorney who specialises in {area.title.toLowerCase()}. Initial consultations are free and confidential.
          </p>
          <Link href="/contact" className="btn-primary">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
