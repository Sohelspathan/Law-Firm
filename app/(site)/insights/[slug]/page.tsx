import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import {
  getPostBySlug,
  getPostSlugs,
  getPostsSummary,
} from '@/sanity/lib/queries'
import { sanityImage } from '@/sanity/lib/image'
import {PortableText} from '@/components/PortableText'
import { PostCard } from '@/components/Cards'

interface Props {
  params: Promise<{ slug: string }>
}

// ─── generateStaticParams ──────────────────────────────────────────────────────
// Every published post gets its own pre-rendered HTML page at build time.
// Google indexes fast-loading static HTML → superior SEO signal.
export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [{ url: sanityImage(post.mainImage, { width: 1200, height: 630 }) }]
        : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function InsightPage({ params }: Props) {
  const { slug } = await params

  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getPostsSummary(),
  ])

  if (!post) notFound()

  const relatedPosts = allPosts
    .filter((p) => p.slug.current !== slug)
    .slice(0, 3)

  const date = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : null

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-0 bg-navy-950 noise-overlay overflow-hidden">
        {post.mainImage && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={sanityImage(post.mainImage, { width: 1600, height: 600 })}
                alt={post.mainImage.alt ?? post.title}
                fill
                className="object-cover opacity-20"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 to-navy-950 z-[1]" />
          </>
        )}

        <div className="container-site relative z-10 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-warm-500 mb-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/insights" className="hover:text-gold-400 transition-colors">Insights</Link>
            <span>›</span>
            <span className="text-gold-400 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs border border-gold-600 text-gold-500 px-2 py-1 uppercase tracking-widest"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-4xl mb-6">
            {post.title}
          </h1>

          <p className="text-warm-400 text-xl max-w-2xl leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author + Date */}
          <div className="flex items-center gap-4 pt-6 border-t border-navy-700">
            {post.author?.photo ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-navy-600">
                <Image
                  src={sanityImage(post.author.photo, { width: 96, height: 96 })}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-warm-500 flex-shrink-0">
                {post.author?.name.charAt(0) ?? '?'}
              </div>
            )}
            <div>
              {post.author && (
                <p className="text-cream-200 font-medium text-sm">{post.author.name}</p>
              )}
              {post.author?.role && (
                <p className="text-warm-500 text-xs">{post.author.role}</p>
              )}
            </div>
            {date && (
              <>
                <div className="w-px h-8 bg-navy-600 ml-2" />
                <time
                  className="text-warm-500 text-sm"
                  dateTime={post.publishedAt}
                >
                  {date}
                </time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section-padding bg-navy-900">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
            {/* Content */}
            <article>
              {post.body && post.body.length > 0 ? (
                <PortableText value={post.body} />
              ) : (
                <p className="text-warm-500 italic">Article content coming soon.</p>
              )}

              {/* Share / back */}
              <div className="mt-16 pt-8 border-t border-navy-700 flex items-center justify-between">
                <Link href="/insights" className="btn-ghost">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Insights
                </Link>
                <Link href="/contact" className="btn-primary">
                  Discuss This With Us
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-28 self-start">
              {/* Author bio card */}
              {post.author && (
                <div className="card-dark p-6">
                  <p className="text-gold-rule mb-4">Written by</p>
                  {post.author.photo && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 border border-navy-600">
                      <Image
                        src={sanityImage(post.author.photo, { width: 128, height: 128 })}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-medium text-cream-200">
                    {post.author.name}
                  </h3>
                  <p className="text-warm-500 text-sm mb-4">{post.author.role}</p>
                  {post.author.email && (
                    <a
                      href={`mailto:${post.author.email}`}
                      className="text-gold-400 hover:text-gold-300 text-sm transition-colors"
                    >
                      Email {post.author.name.split(' ')[0]}
                    </a>
                  )}
                </div>
              )}

              {/* CTA card */}
              <div className="bg-navy-700 border border-gold-600/30 p-6">
                <h3 className="font-display text-lg font-medium text-cream-200 mb-2">
                  Have Questions?
                </h3>
                <p className="text-warm-500 text-sm leading-relaxed mb-4">
                  Our attorneys are available to discuss how this applies to your specific situation.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center text-xs">
                  Free Consultation
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-navy-950 border-t border-navy-800">
          <div className="container-site">
            <div className="section-label">Keep Reading</div>
            <h2 className="heading-serif text-4xl mb-10">
              More{' '}
              <span className="font-light italic">Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
