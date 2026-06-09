import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

/**
 * Read client — useCdn: false so Next.js's own fetch() layer handles caching.
 * next-sanity patches the underlying fetch, meaning we can pass
 * { next: { revalidate, tags } } directly to client.fetch() and Next.js
 * ISR + on-demand revalidation work correctly.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,      // MUST be false for Next.js fetch caching to work
  perspective: 'published',
  stega: false,       // disable stega encoding — not needed outside of live preview
  token: process.env.SANITY_API_READ_TOKEN, // add this

})

/**
 * Write client — server-only, used for contact form submissions.
 * Never import in client components.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})