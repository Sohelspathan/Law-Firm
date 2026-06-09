import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { sanityImage } from '@/sanity/lib/image'
import type { PracticeAreaSummary, AttorneySummary, PostSummary } from '@/types'

// ─── Practice Area Card ────────────────────────────────────────────────────────

export function PracticeAreaCard({ area }: { area: PracticeAreaSummary }) {
  return (
    <Link
      href={`/practice-areas/${area.slug.current}`}
      className="card-dark p-8 flex flex-col gap-4 group"
    >
      <span className="text-3xl" aria-hidden="true">
        {area.icon}
      </span>
      <div>
        <h3 className="font-display text-xl font-medium text-cream-200 mb-2 group-hover:text-gold-400 transition-colors">
          {area.title}
        </h3>
        <p className="text-warm-500 text-sm leading-relaxed line-clamp-3">
          {area.description}
        </p>
      </div>
      <span className="btn-ghost mt-auto text-xs">
        Learn More
        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

// ─── Attorney Card ─────────────────────────────────────────────────────────────

export function AttorneyCard({ attorney }: { attorney: AttorneySummary }) {
  return (
    <div className="card-dark overflow-hidden group">
      {/* Photo */}
      <div className="relative h-72 bg-navy-700 overflow-hidden">
        {attorney.photo ? (
          <Image
            src={sanityImage(attorney.photo, { width: 600, height: 750 })}
            alt={`Photo of ${attorney.name}`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl text-navy-600">👤</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-6">
        <p className="text-gold-rule mb-1">{attorney.role}</p>
        <h3 className="font-display text-2xl font-medium text-cream-200 mb-3">
          {attorney.name}
        </h3>

        {/* Specializations */}
        {/* {attorney.specializations.length > 0 && ( */}
        {attorney.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {attorney.specializations?.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="text-xs text-warm-500 border border-navy-500 px-2 py-1 rounded-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="flex gap-4 text-sm pt-4 border-t border-navy-700">
          {attorney.email && (
            <a
              href={`mailto:${attorney.email}`}
              className="text-gold-500 hover:text-gold-400 transition-colors"
              aria-label={`Email ${attorney.name}`}
            >
              Email
            </a>
          )}
          {attorney.phone && (
            <a
              href={`tel:${attorney.phone}`}
              className="text-gold-500 hover:text-gold-400 transition-colors"
              aria-label={`Call ${attorney.name}`}
            >
              {attorney.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Post Card ─────────────────────────────────────────────────────────────────

export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  const date = post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : null

  return (
    <Link
      // href={`/insights/${post.slug.current}`}
      href={`/insights/${post?.slug?.current ?? ''}`}
      className={`card-dark overflow-hidden group flex ${featured ? 'flex-row' : 'flex-col'}`}
    >
      {/* Image */}
      {post.mainImage && (
        <div className={`relative bg-navy-700 overflow-hidden flex-shrink-0 ${
          featured ? 'w-2/5 min-h-[220px]' : 'h-52'
        }`}>
          <Image
            src={sanityImage(post.mainImage, { width: 800, height: 500 })}
            alt={post.mainImage.alt ?? post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {date && (
          <time className="text-gold-rule text-[10px]" dateTime={post.publishedAt}>
            {date}
          </time>
        )}
        <h3
          className={`font-display font-medium text-cream-200 group-hover:text-gold-400 transition-colors leading-tight ${
            featured ? 'text-2xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h3>
        <p className="text-warm-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {post.author && (
          <div className="flex items-center gap-3 pt-4 border-t border-navy-700 mt-auto">
            {post.author.photo ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={sanityImage(post.author.photo, { width: 64, height: 64 })}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center text-xs text-warm-500">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-cream-300 text-xs font-medium">{post.author.name}</p>
              <p className="text-warm-600 text-xs">{post.author.role}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
