import { client } from './client'
import type {
  PracticeArea,
  PracticeAreaSummary,
  Attorney,
  AttorneySummary,
  CaseResult,
  Post,
  PostSummary,
  SiteSettings,
} from '@/types'

// ─── Cache options ──────────────────────────────────────────────────────────
// Passed as the third argument to client.fetch().
// next-sanity patches the underlying fetch() so Next.js App Router
// ISR and on-demand revalidation (via revalidateTag) work correctly.
// This replaces unstable_cache, which was unreliable in dev mode.

const SITE     = { next: { revalidate: 3600, tags: ['site-settings'] as string[]  } } as const
const AREAS    = { next: { revalidate: 3600, tags: ['practice-areas'] as string[] } } as const
const ATTORNEYS = { next: { revalidate: 3600, tags: ['attorneys']    as string[] } } as const
const RESULTS  = { next: { revalidate: 3600, tags: ['case-results'] as string[]  } } as const
const POSTS    = { next: { revalidate: 3600, tags: ['posts']       as string[]   } } as const

// ─── GROQ Queries ───────────────────────────────────────────────────────────

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    _id, firmName, tagline, description,
    address, city, phone, email,
    foundedYear, linkedIn, heroStats
  }
`

const PRACTICE_AREAS_SUMMARY_QUERY = `
  *[_type == "practiceArea"] | order(orderRank asc, title asc){
    _id, title, slug, description, icon
  }
`

const PRACTICE_AREA_SLUGS_QUERY = `
  *[_type == "practiceArea"]{ "slug": slug.current }
`

const PRACTICE_AREA_BY_SLUG_QUERY = `
  *[_type == "practiceArea" && slug.current == $slug][0]{
    _id, title, slug, description, icon, heroImage, body, orderRank
  }
`

const ATTORNEYS_SUMMARY_QUERY = `
  *[_type == "attorney"] | order(orderRank asc, name asc){
    _id, name, slug, role, photo,
    specializations, email, phone
  }
`

const ATTORNEY_BY_SLUG_QUERY = `
  *[_type == "attorney" && slug.current == $slug][0]{
    _id, name, slug, role, photo,
    bio, specializations, email, phone,
    linkedIn, barAdmissions, education, orderRank
  }
`

const CASE_RESULTS_QUERY = `
  *[_type == "caseResult"] | order(featured desc, _createdAt desc){
    _id, title, outcome, description, featured, year,
    "practiceArea": practiceArea->{ _id, title, slug }
  }
`

const POSTS_SUMMARY_QUERY = `
  *[_type == "post"] | order(publishedAt desc){
    _id, title, slug, excerpt, mainImage, publishedAt,
    "author": author->{ _id, name, role, photo }
  }
`

const POST_SLUGS_QUERY = `
  *[_type == "post"]{ "slug": slug.current }
`

const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    _id, title, slug, excerpt, mainImage, publishedAt,
    body, categories,
    "author": author->{ _id, name, slug, role, photo, email }
  }
`
// const FEATURED_POSTS_QUERY = `
//   *[_type != null][0...10]
// `

const FEATURED_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc)[0..2]{
    _id, title, slug, excerpt, mainImage, publishedAt,
    "author": author->{ _id, name, role, photo }
  }
`

// ─── Fetchers ────────────────────────────────────────────────────────────────
// Each is a plain async function — no wrapper, no complexity.
// Next.js deduplicates identical fetch() calls within the same request
// automatically (Request Memoization), so calling getSiteSettings() in
// both layout.tsx and page.tsx in the same render does NOT make two
// network requests.

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, SITE)
}

export async function getPracticeAreasSummary(): Promise<PracticeAreaSummary[]> {
  return client.fetch<PracticeAreaSummary[]>(PRACTICE_AREAS_SUMMARY_QUERY, {}, AREAS)
}

export async function getPracticeAreaSlugs(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(PRACTICE_AREA_SLUGS_QUERY, {}, AREAS)
}

export async function getPracticeAreaBySlug(slug: string): Promise<PracticeArea | null> {
  return client.fetch<PracticeArea>(PRACTICE_AREA_BY_SLUG_QUERY, { slug }, AREAS)
}

export async function getAttorneysSummary(): Promise<AttorneySummary[]> {
  return client.fetch<AttorneySummary[]>(ATTORNEYS_SUMMARY_QUERY, {}, ATTORNEYS)
}

export async function getAttorneyBySlug(slug: string): Promise<Attorney | null> {
  return client.fetch<Attorney>(ATTORNEY_BY_SLUG_QUERY, { slug }, ATTORNEYS)
}

export async function getCaseResults(): Promise<CaseResult[]> {
  return client.fetch<CaseResult[]>(CASE_RESULTS_QUERY, {}, RESULTS)
}

export async function getPostsSummary(): Promise<PostSummary[]> {
  return client.fetch<PostSummary[]>(POSTS_SUMMARY_QUERY, {}, POSTS)
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY, {}, POSTS)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post>(POST_BY_SLUG_QUERY, { slug }, POSTS)
}

export async function getFeaturedPosts(): Promise<PostSummary[]> {
  return client.fetch<PostSummary[]>(FEATURED_POSTS_QUERY, {}, POSTS)
}
