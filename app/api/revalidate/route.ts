import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/revalidate
 *
 * Called by a Sanity webhook on document publish/unpublish.
 * Maps Sanity document _type → ISR cache tag → purges it instantly.
 *
 * Setup: Sanity Manage → API → Webhooks
 *   URL:     https://your-domain.com/api/revalidate
 *   Method:  POST
 *   Trigger: Create, Update, Delete
 *   Filter:  _type in ["practiceArea","attorney","post","caseResult","siteSettings"]
 *   Headers: { "x-revalidate-secret": "<REVALIDATION_SECRET>" }
 *   Body:    { "_type": "{_type}" }
 */

const TYPE_TO_TAG: Record<string, string> = {
  practiceArea: 'practice-areas',
  attorney: 'attorneys',
  post: 'posts',
  caseResult: 'case-results',
  siteSettings: 'site-settings',
}

export async function POST(req: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { _type } = body
  if (!_type) {
    return NextResponse.json({ error: 'Missing _type field' }, { status: 400 })
  }

  const tag = TYPE_TO_TAG[_type]
  if (!tag) {
    return NextResponse.json({ error: `Unknown type: ${_type}` }, { status: 400 })
  }

  revalidateTag(tag)
  console.log(`[Revalidate] Purged cache tag: ${tag} (from _type: ${_type})`)

  return NextResponse.json({ revalidated: true, tag, _type }, { status: 200 })
}
