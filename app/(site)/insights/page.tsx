import type { Metadata } from 'next'
import { getPostsSummary } from '@/sanity/lib/queries'
import { PostCard } from '@/components/Cards'

export const metadata: Metadata = {
  title: 'Legal Insights',
  description:
    'Practical legal commentary from our attorneys — covering changes in the law, case analysis, and guidance for businesses and individuals.',
}

export default async function InsightsPage() {
  const posts = await getPostsSummary()

  const [featured, ...rest] = posts

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 bg-navy-950 noise-overlay">
        <div className="container-site">
          <div className="section-label">From Our Attorneys</div>
          <h1 className="heading-display text-6xl md:text-7xl max-w-2xl">
            Legal Insights
          </h1>
          <div className="gold-line" />
          <p className="text-warm-400 text-lg max-w-xl leading-relaxed">
            Commentary, analysis, and practical guidance from our attorneys — helping clients
            stay ahead of legal developments that affect them.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section-padding bg-navy-900 text-center">
          <div className="container-site">
            <p className="text-warm-500 py-20">
              Our attorneys are preparing their first articles — check back soon.
            </p>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-navy-900">
          <div className="container-site space-y-16">
            {/* Featured post — wide card */}
            {featured && (
              <div>
                <div className="section-label">Latest</div>
                <PostCard post={featured} featured />
              </div>
            )}

            {/* Remaining posts grid */}
            {rest.length > 0 && (
              <div>
                <div className="section-label">More Articles</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
