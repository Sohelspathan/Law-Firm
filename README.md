# ⚖️ Law Firm Website — Next.js 15 + Sanity CMS

A production-ready, fully typed law firm website built with **Next.js 15**, **TypeScript**, **Sanity CMS**, and **GROQ**. Designed for law firms where clients need to **contact** attorneys — not transact online. Built as both a client deliverable and a portfolio/resume showcase.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| CMS | Sanity v3 |
| Query Language | GROQ |
| Styling | Tailwind CSS v3 |
| Fonts | Cormorant Garamond + DM Sans (via `next/font`) |
| Image Optimisation | `next/image` + `@sanity/image-url` |
| Rich Text | `@portabletext/react` |
| Form Handling | Next.js Server Actions + `useActionState` |
| Caching | `unstable_cache` with ISR tags (1-hour TTL) |
| On-demand Revalidation | Sanity webhook → `/api/revalidate` |
| Deployment | Vercel (recommended) |

---

## 📁 Project Structure

```
lawfirm-site/
├── app/
│   ├── (site)/                    # Public site (Navbar + Footer)
│   │   ├── layout.tsx
│   │   ├── loading.tsx            # Skeleton loading state
│   │   ├── page.tsx               # Home — hero, stats, practice areas, team, insights
│   │   ├── practice-areas/
│   │   │   ├── page.tsx           # All practice areas grid
│   │   │   └── [slug]/page.tsx    # Dynamic — generateStaticParams
│   │   ├── team/page.tsx          # All attorneys, grouped by seniority
│   │   ├── results/page.tsx       # Case results (featured + all)
│   │   ├── insights/
│   │   │   ├── page.tsx           # Blog listing with featured post
│   │   │   └── [slug]/page.tsx    # Dynamic post — generateStaticParams
│   │   └── contact/page.tsx       # Form + office info + map
│   ├── studio/[[...tool]]/page.tsx # Embedded Sanity Studio at /studio
│   ├── api/revalidate/route.ts    # Webhook endpoint for on-demand ISR purge
│   ├── not-found.tsx              # Custom 404
│   ├── global-error.tsx           # Error boundary
│   ├── layout.tsx                 # Root layout (fonts, metadata)
│   └── globals.css                # Tailwind + design system
│
├── sanity/
│   ├── schemas/                   # All document type schemas
│   │   ├── practiceArea.ts
│   │   ├── attorney.ts
│   │   ├── caseResult.ts
│   │   ├── post.ts
│   │   ├── contactSubmission.ts
│   │   ├── siteSettings.ts
│   │   └── index.ts
│   └── lib/
│       ├── client.ts              # Read + write Sanity clients
│       ├── queries.ts             # ALL GROQ queries + unstable_cache wrappers
│       └── image.ts               # Image URL builder helpers
│
├── components/
│   ├── Navbar.tsx                 # Transparent-on-hero, solid-on-scroll
│   ├── Footer.tsx                 # Full footer with CTA strip
│   ├── Cards.tsx                  # PracticeAreaCard, AttorneyCard, PostCard
│   ├── ContactForm.tsx            # useActionState form (client component)
│   └── PortableText.tsx           # Styled rich text renderer
│
├── actions/
│   └── contact.ts                 # Server action — validates + writes to Sanity
│
├── types/
│   └── index.ts                   # ALL TypeScript interfaces for Sanity documents
│
├── sanity.config.ts               # Studio configuration with custom structure
├── tailwind.config.ts
├── next.config.ts
└── .env.local.example
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ 
- A [Sanity account](https://sanity.io) (free tier works)
- npm or pnpm

### 1 — Clone and install

```bash
git clone <your-repo-url>
cd lawfirm-site
npm install
```

### 2 — Create a Sanity project

```bash
npx sanity@latest init --bare
# Follow the prompts — note your Project ID and Dataset name
```

Or create one at [sanity.io/manage](https://sanity.io/manage).

### 3 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="abc123xyz"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
SANITY_API_WRITE_TOKEN="sk..."       # From Sanity Manage → API → Tokens (Editor role)
REVALIDATION_SECRET="random-string"  # openssl rand -base64 32
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4 — Seed content in Sanity Studio

```bash
npm run dev
# Navigate to http://localhost:3000/studio
```

Create content in this order:
1. **Site Settings** (singleton) — firm name, tagline, phone, address
2. **Practice Areas** — add 4–6 areas with icons and descriptions
3. **Attorneys** — add attorney profiles
4. **Case Results** — add notable outcomes (check "Feature on Homepage" for top 3)
5. **Insights** — write your first article

### 5 — Run the development server

```bash
npm run dev
# http://localhost:3000
```

---

## 📝 Resume Bullet Points — How They Manifest in This Codebase

| Resume Claim | Where It Lives |
|---|---|
| "6-page content site with Sanity CMS integration" | `app/(site)/` — 6 distinct route groups, all data from Sanity |
| "Non-technical clients publish independently" | `/studio` — embedded Sanity Studio with guided structure |
| "Typed GROQ query layer" | `sanity/lib/queries.ts` — every query has TypeScript return types |
| "ISR cache tags + 1-hour revalidation" | `unstable_cache(..., { revalidate: 3600, tags: [...] })` in queries.ts |
| "generateStaticParams for all posts" | `app/(site)/practice-areas/[slug]/page.tsx` + `insights/[slug]/page.tsx` |
| "100% type safety across data layer" | `types/index.ts` — interfaces for every document type, zero `any` |

---

## 🌐 Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Add the same environment variables in Vercel's dashboard under **Project → Settings → Environment Variables**.

### Setting up the Sanity Webhook (On-Demand Revalidation)

1. Go to [sanity.io/manage](https://sanity.io/manage) → Your Project → **API** → **Webhooks**
2. Create a new webhook:
   - **URL:** `https://your-domain.vercel.app/api/revalidate`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["practiceArea","attorney","post","caseResult","siteSettings"]`
   - **HTTP method:** POST
   - **Headers:** `x-revalidate-secret: <your REVALIDATION_SECRET>`
   - **Body:** `{ "_type": "{_type}" }`

When the client publishes a blog post in Sanity, the webhook fires, Next.js purges only the `posts` cache tag, and the site updates in seconds — not after the next hourly revalidation.

---

## 🔐 Production Checklist

- [ ] Studio protected — confirm only authorised Sanity users can access `/studio`
- [ ] `SANITY_API_WRITE_TOKEN` uses **Editor** role (not Admin)
- [ ] `REVALIDATION_SECRET` is a long random string (≥32 chars)
- [ ] `NEXT_PUBLIC_SITE_URL` points to production domain
- [ ] Google Maps iframe embedded in `contact/page.tsx` (replace placeholder)
- [ ] Attorney disclaimer text updated for your jurisdiction
- [ ] Privacy Policy page created at `/privacy`
- [ ] Disclaimer page created at `/disclaimer`
- [ ] Custom domain configured in Vercel
- [ ] `robots.txt` and `sitemap.xml` verified

---

## 💳 Adding Payments Later (Payment Integration Roadmap)

When the client is ready to accept online payments (retainer deposits, filing fees):

| Feature | Recommended Stack |
|---|---|
| One-time payments | Stripe Checkout |
| Subscription retainers | Stripe Billing |
| Payment UI | `@stripe/react-stripe-js` |
| Webhook handler | `app/api/stripe-webhook/route.ts` |
| Sanity tracking | New `payment` document type |

The contact form in `actions/contact.ts` is the right insertion point — after submission, redirect to a Stripe Checkout session if a deposit is required.

---

## 🧑‍💻 Author

Built as a portfolio project demonstrating full-stack Next.js 15 + Sanity CMS integration.

> **Stack:** Next.js 15 · TypeScript · Sanity v3 · GROQ · Tailwind CSS · Vercel
