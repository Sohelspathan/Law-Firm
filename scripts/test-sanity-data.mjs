/**
 * Sanity Data Validator — Full Schema Coverage
 * Run with: node --env-file=.env.local scripts/test-sanity-data.mjs
 *
 * Covers every field an editor can touch across all schemas.
 * Catches crashes before they hit the UI.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_TOKEN ?? process.env.SANITY_TOKEN,
})

// ─── Counters ─────────────────────────────────────────────────────────────────

let passCount = 0
let failCount = 0
let warnCount = 0
const failures = []
const warnings = []

function pass(label) {
  passCount++
  console.log(`  ✅  ${label}`)
}

function fail(label, detail) {
  failCount++
  failures.push({ label, detail })
  console.log(`  ❌  ${label}`)
  console.log(`       → ${detail}`)
}

function warn(label, detail) {
  warnCount++
  warnings.push({ label, detail })
  console.log(`  ⚠️   ${label}`)
  console.log(`       → ${detail}`)
}

function section(title) {
  const line = '─'.repeat(Math.max(0, 50 - title.length))
  console.log(`\n── ${title} ${line}`)
}

// ─── Field Checkers ───────────────────────────────────────────────────────────

/**
 * Image check: if the image field exists at all, it MUST have asset._ref.
 * An editor can fill in alt text without uploading an image — this crashes sanityImage().
 */
function checkImage(image, context, required = false) {
  if (!image) {
    if (required) {
      fail(`${context} — image is required but missing`, 'Field is empty. Will crash if component tries to render it.')
      return false
    }
    pass(`${context} — absent (optional, OK)`)
    return true
  }

  if (!image.asset?._ref) {
    fail(
      `${context} — image has no asset`,
      `Has { _type: "image"${image.alt ? `, alt: "${image.alt}"` : ''} } but no file uploaded. Will crash sanityImage().`
    )
    return false
  }

  if (!image.alt || image.alt.trim() === '') {
    warn(
      `${context} — image missing alt text`,
      'Image uploaded but no alt text. Bad for accessibility and SEO.'
    )
  } else {
    pass(`${context} — valid (has asset + alt)`)
  }

  return true
}

/**
 * Inline images inside PortableText body blocks can also crash.
 * Editors can insert an image block without uploading a file.
 */
function checkBodyImages(body, context) {
  if (!body || !Array.isArray(body)) return

  body.forEach((block, i) => {
    if (block._type === 'image') {
      if (!block.asset?._ref) {
        fail(
          `${context} — body block [${i}] is an image with no asset`,
          'Editor inserted an image block in the body without uploading a file. Will crash sanityImage().'
        )
      }
    }
  })
}

function checkSlug(slug, context) {
  if (!slug?.current) {
    fail(
      `${context} — missing slug.current`,
      `Got ${JSON.stringify(slug)}. Will crash href generation and dynamic routes.`
    )
    return false
  }
  pass(`${context} — slug: "${slug.current}"`)
  return true
}

function checkRequired(value, fieldName, context) {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    fail(
      `${context} — missing required field: "${fieldName}"`,
      `Value is ${JSON.stringify(value)}`
    )
    return false
  }
  pass(`${context} — ${fieldName} present`)
  return true
}

function checkArray(value, fieldName, context, required = false) {
  if (!Array.isArray(value)) {
    if (required) {
      fail(
        `${context} — "${fieldName}" is not an array`,
        `Got ${JSON.stringify(value)}. Will crash .map(), .some(), .slice() in components.`
      )
    } else {
      warn(
        `${context} — "${fieldName}" is null/undefined instead of []`,
        'Not required but components should use ?? [] defensively.'
      )
    }
    return false
  }
  pass(`${context} — ${fieldName} is array (${value.length} items)`)
  return true
}

function checkReference(ref, fieldName, context, required = false) {
  if (!ref) {
    if (required) {
      fail(`${context} — required reference "${fieldName}" is missing`, 'Reference field is empty.')
    }
    return
  }
  if (!ref._id) {
    fail(
      `${context} — reference "${fieldName}" did not resolve`,
      'The referenced document may have been deleted. Will render as null/undefined.'
    )
    return
  }
  pass(`${context} — ${fieldName} resolved: "${ref.name ?? ref.title ?? ref._id}"`)
}

function checkUrl(value, fieldName, context) {
  if (!value) return // optional
  try {
    new URL(value)
    pass(`${context} — ${fieldName} is valid URL`)
  } catch {
    fail(
      `${context} — ${fieldName} is not a valid URL`,
      `Got "${value}". Will break any <a href> that uses this.`
    )
  }
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchAll() {
  const [settings, areas, attorneys, results, posts, submissions] = await Promise.all([
    client.fetch(`*[_type == "siteSettings"][0]`),
    client.fetch(`*[_type == "practiceArea"]`),
    client.fetch(`*[_type == "attorney"]`),
    client.fetch(`*[_type == "caseResult"]{ ..., "practiceArea": practiceArea->{ _id, title, slug } }`),
    client.fetch(`*[_type == "post"]{ ..., "author": author->{ _id, name, slug, role, photo } }`),
    client.fetch(`*[_type == "contactSubmission"] | order(submittedAt desc)[0...5]`),
  ])
  return { settings, areas, attorneys, results, posts, submissions }
}

// ─── Validators ───────────────────────────────────────────────────────────────

function validateSiteSettings(settings) {
  section('Site Settings (singleton)')

  if (!settings) {
    fail('siteSettings', 'Document does not exist. Entire site will render with null data.')
    return
  }

  const ctx = 'siteSettings'
  checkRequired(settings.firmName, 'firmName', ctx)
  checkRequired(settings.tagline, 'tagline', ctx)
  checkRequired(settings.description, 'description', ctx)
  checkRequired(settings.address, 'address', ctx)
  checkRequired(settings.city, 'city', ctx)
  checkRequired(settings.phone, 'phone', ctx)
  checkRequired(settings.email, 'email', ctx)
  checkRequired(settings.foundedYear, 'foundedYear', ctx)

  if (settings.linkedIn) checkUrl(settings.linkedIn, 'linkedIn', ctx)

  // heroStats: array of { value, label }
  if (settings.heroStats) {
    if (!Array.isArray(settings.heroStats)) {
      fail(`${ctx} — heroStats is not an array`, `Got ${JSON.stringify(settings.heroStats)}`)
    } else {
      settings.heroStats.forEach((stat, i) => {
        if (!stat.value || !stat.label) {
          warn(
            `${ctx} — heroStats[${i}] incomplete`,
            `Has value="${stat.value}" label="${stat.label}". Incomplete stats will render as blank on homepage.`
          )
        }
      })
      pass(`${ctx} — heroStats: ${settings.heroStats.length} items`)
    }
  }
}

function validatePracticeAreas(areas) {
  section(`Practice Areas (${areas.length} documents)`)

  if (areas.length === 0) {
    fail('practiceAreas', 'No documents found. Practice areas section will be empty.')
    return
  }

  for (const area of areas) {
    const ctx = `practiceArea "${area.title ?? area._id}"`

    checkRequired(area.title, 'title', ctx)
    checkSlug(area.slug, ctx)
    checkRequired(area.description, 'description', ctx)
    checkRequired(area.icon, 'icon', ctx)

    // heroImage: optional but if provided must have asset
    checkImage(area.heroImage, `${ctx} heroImage`, false)

    // body: optional PortableText — but check for orphan image blocks
    if (area.body) {
      if (!Array.isArray(area.body)) {
        fail(`${ctx} — body is not an array`, 'PortableText will crash.')
      } else {
        checkBodyImages(area.body, ctx)
        pass(`${ctx} — body: ${area.body.length} blocks`)
      }
    }
  }
}

function validateAttorneys(attorneys) {
  section(`Attorneys (${attorneys.length} documents)`)

  if (attorneys.length === 0) {
    fail('attorneys', 'No documents found. Team page will be empty.')
    return
  }

  for (const attorney of attorneys) {
    const ctx = `attorney "${attorney.name ?? attorney._id}"`

    checkRequired(attorney.name, 'name', ctx)
    checkSlug(attorney.slug, ctx)
    checkRequired(attorney.role, 'role', ctx)
    checkRequired(attorney.email, 'email', ctx)

    // photo: optional but must have asset if the field is not empty
    checkImage(attorney.photo, `${ctx} photo`, false)

    // specializations: not required but must be array if present — null crashes .some()/.slice()
    if (attorney.specializations === null || attorney.specializations === undefined) {
      warn(
        `${ctx} — specializations is null`,
        'Not required but will crash .some() and .slice() unless components use ?? []'
      )
    } else {
      checkArray(attorney.specializations, 'specializations', ctx)
    }

    // barAdmissions: optional array
    if (attorney.barAdmissions !== undefined && attorney.barAdmissions !== null) {
      checkArray(attorney.barAdmissions, 'barAdmissions', ctx)
    }

    // education: optional array of objects
    if (attorney.education) {
      if (!Array.isArray(attorney.education)) {
        fail(`${ctx} — education is not an array`, 'Will crash any .map() on education.')
      } else {
        attorney.education.forEach((edu, i) => {
          if (!edu.degree || !edu.institution) {
            warn(
              `${ctx} — education[${i}] incomplete`,
              `degree="${edu.degree}" institution="${edu.institution}"`
            )
          }
        })
      }
    }

    // linkedIn URL
    if (attorney.linkedIn) checkUrl(attorney.linkedIn, 'linkedIn', ctx)

    // bio: optional PortableText
    if (attorney.bio) {
      if (!Array.isArray(attorney.bio)) {
        fail(`${ctx} — bio is not an array`, 'PortableText will crash.')
      } else {
        pass(`${ctx} — bio: ${attorney.bio.length} blocks`)
      }
    }
  }
}

function validateCaseResults(results) {
  section(`Case Results (${results.length} documents)`)

  if (results.length === 0) {
    fail('caseResults', 'No documents found. Results page will be empty.')
    return
  }

  const featuredCount = results.filter(r => r.featured === true).length

  for (const result of results) {
    const ctx = `caseResult "${result.title ?? result._id}"`

    checkRequired(result.title, 'title', ctx)
    checkRequired(result.outcome, 'outcome', ctx)
    checkRequired(result.description, 'description', ctx)

    if (typeof result.featured !== 'boolean') {
      warn(`${ctx} — featured`, `Expected boolean, got ${JSON.stringify(result.featured)}. Defaults to false.`)
    }

    // practiceArea: optional reference — check it resolved if present
    checkReference(result.practiceArea, 'practiceArea', ctx, false)
  }

  if (featuredCount === 0) {
    warn('caseResults — no featured results', 'Homepage results section may be empty. Set featured: true on at least one.')
  } else {
    pass(`caseResults — ${featuredCount} featured for homepage`)
  }
}

function validatePosts(posts) {
  section(`Posts / Insights (${posts.length} documents)`)

  if (posts.length === 0) {
    warn('posts', 'No posts found. Insights page will be empty but will not crash.')
    return
  }

  for (const post of posts) {
    const ctx = `post "${post.title ?? post._id}"`

    checkRequired(post.title, 'title', ctx)
    checkSlug(post.slug, ctx)
    checkRequired(post.excerpt, 'excerpt', ctx)
    checkRequired(post.publishedAt, 'publishedAt', ctx)

    // mainImage: optional — but if the field exists it must have asset._ref
    checkImage(post.mainImage, `${ctx} mainImage`, false)

    // author: optional reference
    checkReference(post.author, 'author', ctx, false)

    // categories: optional array
    if (post.categories !== undefined && post.categories !== null) {
      checkArray(post.categories, 'categories', ctx)
    }

    // body: optional PortableText — check for orphan image blocks inside
    if (post.body) {
      if (!Array.isArray(post.body)) {
        fail(`${ctx} — body is not an array`, 'PortableText will crash.')
      } else {
        checkBodyImages(post.body, ctx)
        pass(`${ctx} — body: ${post.body.length} blocks`)
      }
    }
  }
}

function validateContactSubmissions(submissions) {
  section(`Contact Submissions (last 5, read-only check)`)

  if (submissions.length === 0) {
    pass('contactSubmissions — none yet (OK)')
    return
  }

  // These are read-only in Studio — just check they have the expected shape
  for (const sub of submissions) {
    const ctx = `submission from "${sub.name ?? sub.email ?? sub._id}"`
    if (!sub.submittedAt) {
      warn(`${ctx} — missing submittedAt`, 'Submission may have been written without a timestamp.')
    } else {
      pass(`${ctx} — submittedAt: ${new Date(sub.submittedAt).toLocaleString()}`)
    }
  }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🔍 Sanity Data Validator — Full Schema Coverage')
  console.log(`   Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'}`)
  console.log('   Checking all documents for editor-caused runtime crashes...')

  let data
  try {
    data = await fetchAll()
  } catch (err) {
    console.error('\n❌ Failed to connect to Sanity:', err.message)
    console.error('   Check env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN')
    process.exit(1)
  }

  validateSiteSettings(data.settings)
  validatePracticeAreas(data.areas)
  validateAttorneys(data.attorneys)
  validateCaseResults(data.results)
  validatePosts(data.posts)
  validateContactSubmissions(data.submissions)

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(52))
  console.log(`\n  ✅  Passed  : ${passCount}`)
  console.log(`  ❌  Failed  : ${failCount}`)
  console.log(`  ⚠️   Warnings: ${warnCount}\n`)

  if (warnings.length > 0) {
    console.log('  WARNINGS (will not crash, but worth fixing):')
    warnings.forEach(({ label, detail }) => {
      console.log(`\n  ⚠️  ${label}`)
      console.log(`     ${detail}`)
    })
  }

  if (failures.length > 0) {
    console.log('\n  FAILURES (will crash the site):')
    failures.forEach(({ label, detail }) => {
      console.log(`\n  ❌ ${label}`)
      console.log(`     ${detail}`)
    })
    console.log('\n  Fix all failures in Sanity Studio before deploying.\n')
    process.exit(1)
  } else {
    console.log('\n  All crash checks passed. Safe to deploy.\n')
    process.exit(0)
  }
}

run()
