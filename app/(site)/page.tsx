import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getSiteSettings,
  getPracticeAreasSummary,
  getAttorneysSummary,
  getCaseResults,
  getFeaturedPosts,
} from '@/sanity/lib/queries'
import { PracticeAreaCard } from '@/components/Cards'
import { AttorneyCard } from '@/components/Cards'
import { PostCard } from '@/components/Cards'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function HomePage() {
  // console.log('HOME PAGE RENDERING...')
  const [settings, practiceAreas, attorneys, caseResults, posts] = await Promise.all([
    getSiteSettings(),
    getPracticeAreasSummary(),
    getAttorneysSummary(),
    getCaseResults(),
    getFeaturedPosts(),
  ])
  // console.log('SETTINGS:', settings)
  // console.log('PRACTICE AREAS:', practiceAreas)
  // console.log('ATTORNEYS:', attorneys)
  // console.log('CASE RESULTS:', caseResults)
  // console.log('POSTS:', posts)

  const featuredResults = caseResults.filter((r) => r.featured).slice(0, 3)
  const featuredAttorneys = attorneys.slice(0, 3)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="noise-overlay relative min-h-screen flex items-center bg-navy-950 overflow-hidden">
        {/* Background geometric accent */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at 80% 50%, #C9A55A 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-px h-1/2 bg-gradient-to-t from-transparent via-gold-500/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container-site pt-32 pb-24 relative z-10">
          <div className="max-w-4xl">
            {/* Label */}
            <div className="section-label">
              {settings?.firmName ?? 'Legal Excellence'}
            </div>

            {/* Headline */}
            <h1 className="heading-display text-6xl md:text-7xl lg:text-8xl mb-8 leading-[1.02]">
              {settings?.tagline ?? 'Relentless Advocacy.\u00A0Measured Counsel.'}
            </h1>

            <div className="gold-line" />

            <p className="text-warm-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
              {settings?.description ??
                'We combine decades of courtroom experience with a precise, client-first approach to deliver outcomes that matter.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                Book a Free Consultation
              </Link>
              <Link href="/practice-areas" className="btn-outline">
                Our Practice Areas
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          {settings?.heroStats && settings.heroStats.length > 0 && (
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-navy-700">
              {settings.heroStats .map(
                (stat: { value: string; label: string }, i: number) => (
                  <div
                    key={i}
                    className="bg-navy-900 px-8 py-6 flex flex-col gap-1"
                  >
                    <span className="font-display text-4xl font-light text-gold-400">
                      {stat.value}
                    </span>
                    <span className="text-warm-500 text-xs uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-warm-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-warm-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Practice Areas ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-navy-900">
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="section-label">What We Do</div>
              <h2 className="heading-serif text-5xl">
                Practice{' '}
                <span className="font-light italic">Areas</span>
              </h2>
            </div>
            <Link href="/practice-areas" className="btn-ghost shrink-0">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {practiceAreas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-700">
              {practiceAreas.slice(0, 6).map((area) => (
                <PracticeAreaCard key={area._id} area={area} />
              ))}
            </div>
          ) : (
            <p className="text-warm-500 text-center py-20">
              Practice areas coming soon — check back shortly.
            </p>
          )}
        </div>
      </section>

      {/* ── Featured Case Results ────────────────────────────────────────────── */}
      {featuredResults.length > 0 && (
        <section className="section-padding bg-navy-950">
          <div className="container-site">
            <div className="section-label">Proven Track Record</div>
            <h2 className="heading-serif text-5xl mb-12">
              Notable{' '}
              <span className="font-light italic">Results</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700">
              {featuredResults.map((result) => (
                <div key={result._id} className="bg-navy-900 p-10 flex flex-col gap-4">
                  <span className="font-display text-4xl font-light text-gold-400">
                    {result.outcome}
                  </span>
                  <div className="w-8 h-px bg-gold-600" />
                  <h3 className="font-display text-xl font-medium text-cream-200">
                    {result.title}
                  </h3>
                  <p className="text-warm-500 text-sm leading-relaxed flex-1">
                    {result.description}
                  </p>
                  {result.practiceArea && (
                    <span className="text-gold-rule text-[10px]">
                      {result.practiceArea.title}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/results" className="btn-outline">
                View All Results
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Our Team ─────────────────────────────────────────────────────────── */}
      {featuredAttorneys.length > 0 && (
        <section className="section-padding bg-navy-800">
          <div className="container-site">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="section-label">Who We Are</div>
                <h2 className="heading-serif text-5xl">
                  Meet the{' '}
                  <span className="font-light italic">Team</span>
                </h2>
              </div>
              <Link href="/team" className="btn-ghost shrink-0">
                Full Team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAttorneys.map((attorney) => (
                <AttorneyCard key={attorney._id} attorney={attorney} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Insights ──────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="section-padding bg-navy-900">
          <div className="container-site">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="section-label">Stay Informed</div>
                <h2 className="heading-serif text-5xl">
                  Legal{' '}
                  <span className="font-light italic">Insights</span>
                </h2>
              </div>
              <Link href="/insights" className="btn-ghost shrink-0">
                All Articles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 60px, #C9A55A 60px, #C9A55A 61px)',
          }}
          aria-hidden="true"
        />
        <div className="container-site text-center relative z-10">
          <div className="section-label justify-center">Get in Touch</div>
          <h2 className="heading-display text-5xl md:text-6xl mb-6">
            Let&rsquo;s Discuss Your Case
          </h2>
          <p className="text-warm-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Every matter starts with a conversation. Consultations are confidential and carry no obligation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Schedule a Consultation
            </Link>
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="btn-outline">
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
