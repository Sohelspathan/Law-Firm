import type { PortableTextBlock } from '@portabletext/react'

// ─── Shared ────────────────────────────────────────────────────────────────────

export interface SanitySlug {
  current: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// ─── Practice Area ─────────────────────────────────────────────────────────────

export interface PracticeArea {
  _id: string
  _type: 'practiceArea'
  title: string
  slug: SanitySlug
  description: string
  icon: string
  heroImage?: SanityImage
  body?: PortableTextBlock[]
  orderRank?: number
}

export type PracticeAreaSummary = Pick<
  PracticeArea,
  '_id' | 'title' | 'slug' | 'description' | 'icon'
>

// ─── Attorney ──────────────────────────────────────────────────────────────────

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface Attorney {
  _id: string
  _type: 'attorney'
  name: string
  slug: SanitySlug
  role: string
  photo?: SanityImage
  bio?: PortableTextBlock[]
  specializations: string[]
  email: string
  phone?: string
  barAdmissions?: string[]
  education?: Education[]
  linkedIn?: string
  orderRank?: number
}

export type AttorneySummary = Pick<
  Attorney,
  '_id' | 'name' | 'slug' | 'role' | 'photo' | 'specializations' | 'email' | 'phone'
>

// ─── Case Result ───────────────────────────────────────────────────────────────

export interface CaseResult {
  _id: string
  _type: 'caseResult'
  title: string
  outcome: string
  description: string
  featured: boolean
  year?: string
  practiceArea?: PracticeAreaSummary
}

// ─── Post (Insights) ───────────────────────────────────────────────────────────

export interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: SanitySlug
  excerpt: string
  mainImage?: SanityImage
  body?: PortableTextBlock[]
  publishedAt: string
  author?: AttorneySummary
  categories?: string[]
}

export type PostSummary = Pick<
  Post,
  '_id' | 'title' | 'slug' | 'excerpt' | 'mainImage' | 'publishedAt' | 'author'
>

// ─── Site Settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  firmName: string
  tagline: string
  description: string
  address: string
  city: string
  phone: string
  email: string
  linkedIn?: string
  foundedYear: number
   heroStats?: {
    value: string;
    label: string;
  }[];
}

// ─── Contact Submission ────────────────────────────────────────────────────────

export interface ContactSubmission {
  _type: 'contactSubmission'
  name: string
  email: string
  phone?: string
  practiceArea?: string
  message: string
  preferredContact: 'email' | 'phone'
  preferredTime?: string
  submittedAt: string
}

// ─── Form State ────────────────────────────────────────────────────────────────

export type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }
